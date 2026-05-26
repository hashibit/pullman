import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
} from "node:fs";
import { join } from "node:path";

const DATA_ROOT = "pullman-data";

interface SaveArticleParams {
  platform: string;
  url: string;
  title: string;
  author: string;
  date: string;
  rawHtml: string;
  bodyHtml: string;
  markdown: string;
}

interface SaveArticleResult {
  dir: string;
  rawHtml: string;
  bodyHtml: string;
  markdownFile: string;
}

interface IndexEntry {
  url: string;
  title: string;
  author: string;
  date: string;
  fetchedAt: string;
  files: {
    rawHtml: string;
    bodyHtml: string;
    markdown: string;
  };
}

interface PlatformIndex {
  platform: string;
  articles: IndexEntry[];
}

/**
 * Saves all article artefacts and updates the platform index.
 *
 * Directory layout:
 *   pullman-data/{platform}/{author}/{date}/{slug}/
 *     raw.html
 *     body.html
 *     {slug}.md
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
}: SaveArticleParams): Promise<SaveArticleResult> {
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

  const entry: IndexEntry = {
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

function updateIndex(platform: string, entry: IndexEntry): void {
  const indexPath = join(DATA_ROOT, platform, "index.json");

  let index: PlatformIndex;
  if (existsSync(indexPath)) {
    index = JSON.parse(readFileSync(indexPath, "utf8")) as PlatformIndex;
  } else {
    mkdirSync(join(DATA_ROOT, platform), { recursive: true });
    index = { platform, articles: [] };
  }

  const existing = index.articles.findIndex((a) => a.url === entry.url);
  if (existing >= 0) {
    index.articles[existing] = entry;
  } else {
    index.articles.push(entry);
  }

  writeFileSync(indexPath, JSON.stringify(index, null, 2), "utf8");
}

/**
 * Converts an arbitrary string to a safe filesystem slug.
 * Keeps ASCII alphanumerics, CJK characters, and hyphens.
 * Collapses runs of separators and trims to 80 chars.
 */
function toSlug(str: string): string {
  return (
    str
      .trim()
      .replace(/[\s/\\:*?"<>|.]+/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80) || "untitled"
  );
}
