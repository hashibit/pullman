/**
 * Platform handler: Reddit (reddit.com)
 *
 * Uses Puppeteer with a real Chrome channel and a desktop User-Agent to bypass
 * Reddit's bot detection. Targets the new Reddit ("shreddit") web-component DOM.
 *
 * Post body:  shreddit-post > #t3_{id}-post-rtjson-content
 * Comments:   shreddit-comment[depth] > #t1_{thingid}-comment-rtjson-content
 *             The `depth` attribute is used directly for indentation — no
 *             recursive tree traversal needed.
 */

import puppeteer, { type Page } from "puppeteer";
import * as cheerio from "cheerio";
import type { Article, Platform } from "./index.js";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36";

export const redditPlatform: Platform = {
  name: "reddit",

  match(url) {
    return /reddit\.com\/r\/[^/]+\/comments\//.test(url);
  },

  async fetch(url, { headless = true } = {}) {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({
      headless,
      channel: "chrome",
      args: [
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox",
        "--disable-infobars",
        "--window-size=1440,900",
      ],
    });

    let rawHtml: string;
    try {
      const page = await browser.newPage();

      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "webdriver", { get: () => undefined });
        (window as Window & { chrome?: object }).chrome = { runtime: {} };
      });

      await page.setUserAgent(USER_AGENT);
      await page.setViewport({ width: 1440, height: 900 });
      console.log(`Navigating to ${url}`);

      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
      await page.waitForSelector("shreddit-post", { timeout: 15000 });

      await loadAllComments(page);

      const client = await page.target().createCDPSession();
      await client.send("DOM.enable");
      const { root } = await client.send("DOM.getDocument", {
        depth: -1,
        pierce: true,
      });
      const { outerHTML } = await client.send("DOM.getOuterHTML", {
        nodeId: root.nodeId,
      });
      rawHtml = outerHTML;
    } finally {
      await browser.close();
      console.log("Browser closed.");
    }

    return redditPlatform.extract(rawHtml, url);
  },

  extract(rawHtml, url = ""): Article {
    const $ = cheerio.load(rawHtml);

    // ----- Post metadata -----
    const postEl = $("shreddit-post").first();

    const title =
      $("h1").first().text().trim() ||
      postEl.attr("post-title") ||
      "Untitled";

    const author = postEl.attr("author") || "unknown";
    const authorHref = postEl.find(`a[href*="/user/${author}"]`).first().attr("href") || "";
    const authorUrl = toAbsoluteUrl(authorHref);

    const createdTimestamp = postEl.attr("created-timestamp") || "";
    const date = createdTimestamp ? createdTimestamp.slice(0, 10) : todayIso();
    const postAge = createdTimestamp ? formatDate(createdTimestamp) : "";

    const commentCount = postEl.attr("comment-count") || "";

    // ----- Post body -----
    // Selector: #t3_{id}-post-rtjson-content where id = thingid without "t3_" prefix
    const postId = postEl.attr("id") || ""; // e.g. "t3_1juoye3"
    const postBodyId = `${postId}-post-rtjson-content`;
    const postBodyHtml = $(`#${postBodyId}`).html()?.trim() || "";

    // ----- Comments -----
    // Each shreddit-comment carries depth, author, score, thingid attributes
    const commentParts: string[] = [];

    $("shreddit-comment").each((_i, el) => {
      const c = $(el);
      const thingId = c.attr("thingid") || ""; // e.g. "t1_mm3xb0x"
      const depth = parseInt(c.attr("depth") || "0", 10);
      const commentAuthor = c.attr("author") || "[deleted]";
      const score = c.attr("score") || "?";

      const commentAuthorHref = c.find(`a[href*="/user/${commentAuthor}"]`).first().attr("href") || "";
      const commentAuthorUrl = toAbsoluteUrl(commentAuthorHref);

      const commentDatetime = c.find("time[datetime]").first().attr("datetime") || "";
      const commentAge = commentDatetime ? formatDate(commentDatetime) : "";

      // Body is in #t1_{id}-comment-rtjson-content
      const bodyId = `${thingId}-comment-rtjson-content`;
      const bodyHtml = $(`#${bodyId}`).html()?.trim();
      if (!bodyHtml) return; // collapsed or removed

      const scoreStr = score !== "?" ? ` · ${score} pts` : "";
      const ageStr = commentAge ? ` · ${commentAge}` : "";
      const replyMark = depth > 0 ? "↳ " : "";
      const authorDisplay = commentAuthorUrl
        ? `<a href="${commentAuthorUrl}">${replyMark}${commentAuthor}</a>`
        : `${replyMark}${commentAuthor}`;
      const meta = `<strong>${authorDisplay}</strong>${ageStr}${scoreStr}`;

      // Wrap in <blockquote> once per depth level so turndown emits ">" prefixes
      const inner =
        `<p class="comment-meta">${meta}</p>` +
        `<div class="comment-body">${bodyHtml}</div>`;

      const wrapped = wrapBlockquotes(inner, depth);
      commentParts.push(wrapped);
    });

    const commentsHtml = commentParts.join("\n");

    const authorDisplay = authorUrl
      ? `<a href="${authorUrl}">${author}</a>`
      : author;
    const postMeta = `<p><strong>${authorDisplay}</strong>${postAge ? ` · ${postAge}` : ""}</p>`;

    const bodyHtml = [
      postMeta,
      postBodyHtml,
      commentsHtml
        ? `<hr/><h2>Comments${commentCount ? ` (${commentCount})` : ""}</h2>${commentsHtml}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    if (!bodyHtml) {
      throw new Error("Could not extract Reddit post content from page.");
    }

    return { title, author, date, url, rawHtml, bodyHtml };
  },
};

/**
 * Scroll down in steps and click all "more replies" buttons until the comment
 * count stabilises. Uses page.click() / ElementHandle.click() to generate real
 * browser mouse events rather than bare JS .click() calls.
 */
async function loadAllComments(page: Page): Promise<void> {
  const MAX_ROUNDS = 25;
  let prevCount = 0;

  for (let round = 0; round < MAX_ROUNDS; round++) {
    await scrollToBottom(page);
    await sleep(800);

    // Click "查看更多评论" (load more top-level comments, action-triggered pagination)
    const morePaged = await clickLoadMore(page);
    if (morePaged > 0) {
      await sleep(1200);
      await scrollToBottom(page);
      await sleep(600);
    }

    // Click "更多回复" / "另外 N 条回复" (expand nested reply threads)
    const expanded = await expandReplies(page);
    if (expanded > 0) {
      await sleep(600);
      await scrollToBottom(page);
      await sleep(600);
    }

    const count: number = await page.evaluate(
      () => document.querySelectorAll("shreddit-comment").length
    );
    console.log(`  [reddit] round ${round + 1}: ${count} comments loaded`);

    if (count === prevCount && morePaged === 0 && expanded === 0) break;
    prevCount = count;
  }
}

/** Scroll to the bottom of the page in 600 px steps, waiting for lazy content. */
async function scrollToBottom(page: Page): Promise<void> {
  let prevHeight = 0;
  while (true) {
    const height: number = await page.evaluate(() => {
      window.scrollBy(0, 600);
      return document.body.scrollHeight;
    });
    await sleep(350);
    if (height === prevHeight) break;
    prevHeight = height;
  }
}

/**
 * Click the "查看更多评论" button that paginates top-level comments.
 * Uses faceplate-partial[loading="action"][src*="more-comments"] — this button
 * is NOT triggered by scrolling (IntersectionObserver), it requires an explicit click.
 */
async function clickLoadMore(page: Page): Promise<number> {
  const selector =
    'faceplate-partial[loading="action"][src*="more-comments"] button';
  const buttons = await page.$$(selector);
  let clicked = 0;
  for (const btn of buttons) {
    try {
      await btn.evaluate((el) =>
        (el as HTMLElement).scrollIntoView({ block: "center" })
      );
      await sleep(150);
      await btn.click();
      clicked++;
      await sleep(300);
    } catch {
      // button detached after click
    }
  }
  return clicked;
}

/**
 * Click every visible "more replies" button.
 * Selector targets the faceplate-partial lazy-load wrappers for child comments.
 * aria-hidden buttons are duplicates used for layout — skip them.
 */
async function expandReplies(page: Page): Promise<number> {
  const selector =
    'faceplate-partial[slot^="children-"] button:not([aria-hidden="true"])';
  const buttons = await page.$$(selector);
  let clicked = 0;
  for (const btn of buttons) {
    try {
      await btn.evaluate((el) =>
        (el as HTMLElement).scrollIntoView({ block: "center" })
      );
      await sleep(120);
      await btn.click();
      clicked++;
      await sleep(250);
    } catch {
      // button detached from DOM after a previous expansion — safe to ignore
    }
  }
  return clicked;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Convert a relative /path or already-absolute URL to a full reddit.com URL. */
function toAbsoluteUrl(href: string): string {
  if (!href) return "";
  if (href.startsWith("http")) return href.replace(/\/$/, "");
  return `https://www.reddit.com${href.replace(/\/$/, "")}`;
}

/** Format an ISO timestamp as "YYYY-MM-DD HH:mm UTC". */
function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}

/** Wrap HTML in `depth` levels of <blockquote> so turndown emits > prefixes. */
function wrapBlockquotes(html: string, depth: number): string {
  let result = html;
  for (let i = 0; i < depth; i++) {
    result = `<blockquote>${result}</blockquote>`;
  }
  return result;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
