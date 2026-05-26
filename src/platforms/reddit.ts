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

import puppeteer from "puppeteer";
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

    const rawDate = postEl.attr("created-timestamp") || "";
    const date = rawDate ? rawDate.slice(0, 10) : todayIso();

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

      // Body is in #t1_{id}-comment-rtjson-content
      const bodyId = `${thingId}-comment-rtjson-content`;
      const bodyHtml = $(`#${bodyId}`).html()?.trim();
      if (!bodyHtml) return; // collapsed or removed

      const indent = depth > 0 ? ` style="margin-left:${depth * 24}px"` : "";
      const scoreStr = score !== "?" ? ` · ${score} points` : "";
      const meta = `<strong>${commentAuthor}</strong>${scoreStr}`;

      commentParts.push(
        `<div class="comment"${indent}>` +
          `<p class="comment-meta">${meta}</p>` +
          `<div class="comment-body">${bodyHtml}</div>` +
          `</div>`
      );
    });

    const commentsHtml = commentParts.join("\n");

    const bodyHtml = [
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

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
