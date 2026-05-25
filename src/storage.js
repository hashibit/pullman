import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
} from "node:fs";
import { join } from "node:path";

const DATA_ROOT = "getweb-data";

/**
 * Saves all article artefacts and updates the platform index.
 *
 * Directory layout:
 *   getweb-data/{platform}/{author}/{date}/{slug}/
 *     raw.html
 *     body.html
 *     {slug}.md
 *
 * @returns {{ dir, rawHtml, bodyHtml, markdownFile }}  relative paths
 */
export async function saveArticle({
  platform,
  url,
  title,
  author,
  date,
  rawHtml,
  bodyHtml,
  markdown,
}) {
  const slug = toSlug(title);
  const authorSlug = toSlug(author);
  const dir = join(DATA_ROOT, platform, authorSlug, date, slug);

  mkdirSync(dir, { recursive: true });

  const rawPath = join(dir, "raw.html");
  const bodyPath = join(dir, "body.html");
  const mdFile = `${slug}.md`;
  const mdPath = join(dir, mdFile);

  writeFileSync(rawPath, rawHtml, "utf8");
  writeFileSync(bodyPath, bodyHtml, "utf8");
  writeFileSync(mdPath, markdown, "utf8");

  const entry = {
    url,
    title,
    author,
    date,
    fetchedAt: new Date().toISOString(),
    files: {
      rawHtml: rawPath,
      bodyHtml: bodyPath,
      markdown: mdPath,
    },
  };

  updateIndex(platform, entry);

  return { dir, rawHtml: rawPath, bodyHtml: bodyPath, markdownFile: mdPath };
}

// ---------------------------------------------------------------------------
// Per-platform index.json
// ---------------------------------------------------------------------------

function updateIndex(platform, entry) {
  const indexPath = join(DATA_ROOT, platform, "index.json");

  let index;
  if (existsSync(indexPath)) {
    index = JSON.parse(readFileSync(indexPath, "utf8"));
  } else {
    mkdirSync(join(DATA_ROOT, platform), { recursive: true });
    index = { platform, articles: [] };
  }

  // Deduplicate by URL — update in place if re-fetching
  const existing = index.articles.findIndex((a) => a.url === entry.url);
  if (existing >= 0) {
    index.articles[existing] = entry;
  } else {
    index.articles.push(entry);
  }

  writeFileSync(indexPath, JSON.stringify(index, null, 2), "utf8");
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts an arbitrary string to a safe filesystem slug.
 * Keeps ASCII alphanumerics, CJK characters, and hyphens.
 * Collapses runs of separators and trims to 80 chars.
 */
function toSlug(str) {
  return str
    .trim()
    .replace(/[\s/\\:*?"<>|]+/g, "-")   // unsafe chars → hyphen
    .replace(/-{2,}/g, "-")              // collapse runs
    .replace(/^-|-$/g, "")              // strip leading/trailing
    .slice(0, 80) || "untitled";
}
