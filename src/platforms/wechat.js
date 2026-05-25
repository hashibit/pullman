/**
 * Platform handler: WeChat Official Accounts (mp.weixin.qq.com)
 *
 * Anti-detection strategy:
 *  - Launches real Chrome (not Chromium) via `channel: "chrome"`
 *  - Removes navigator.webdriver fingerprint on new documents
 *  - Reads DOM via CDP to avoid JS-level interception on innerHTML access
 *  - Closes browser immediately after capture ("instant-close" evasion)
 */
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

export const wechatPlatform = {
  name: "wechat",

  match(url) {
    return url.includes("mp.weixin.qq.com");
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

    let rawHtml;
    try {
      const page = await browser.newPage();

      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "webdriver", { get: () => undefined });
        window.chrome = { runtime: {} };
      });

      await page.setViewport({ width: 1440, height: 900 });
      console.log(`Navigating to ${url}`);

      await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
      await page.waitForSelector("body", { timeout: 15000 });

      // Use CDP to read the full DOM — avoids JS-level read hooks on the page
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

    return wechatPlatform.extract(rawHtml, url);
  },

  /**
   * Pure extraction from raw HTML string — no browser needed.
   * Exported separately so it can be unit-tested without launching Puppeteer.
   */
  extract(rawHtml, url = "") {
    const $ = cheerio.load(rawHtml);

    const title =
      $("#activity-name").text().trim() ||
      $(".rich_media_title").text().trim() ||
      "Untitled";

    // Account name / author
    const author =
      $("#js_name").text().trim() ||
      $(".account_nickname_inner").text().trim() ||
      "unknown";

    // Publish date — WeChat renders it as "2024-01-15" in #publish_time
    const rawDate =
      $("#publish_time").text().trim() ||
      $(".rich_media_meta_list .rich_media_meta_primary").text().trim() ||
      "";
    // Normalise to YYYY-MM-DD; fall back to today if unparseable
    const date = parseWechatDate(rawDate);

    const bodyHtml = $("#js_content").html() || "";
    if (!bodyHtml) {
      throw new Error("Could not find article body (#js_content) in page.");
    }

    return { title, author, date, rawHtml, bodyHtml, url };
  },
};

function parseWechatDate(raw) {
  if (!raw) return todayIso();
  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  // "2024年01月15日"
  const m = raw.match(/(\d{4})[年-](\d{1,2})[月-](\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  return todayIso();
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}
