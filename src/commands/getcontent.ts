import { readFileSync } from "node:fs";
import type { Command } from "commander";
import { detectPlatform } from "../platforms/index.js";
import { getParser } from "../parsers/index.js";
import { saveArticle } from "../storage.js";

export function registerGetcontent(program: Command): void {
  program
    .command("getcontent [urls...]")
    .description(
      "Fetch web articles and save them as structured Markdown.\n" +
        "Accepts one or more URLs as arguments, or a file of URLs via -f.",
    )
    .option("-f, --file <path>", "File containing URLs, one per line")
    .option("-p, --parser <name>", "Markdown parser to use (turndown)", "turndown")
    .option("--no-headless", "Show browser window (useful for debugging)")
    .action(async (urls: string[], opts: { file?: string; parser: string; headless: boolean }) => {
      const allUrls = resolveUrls(urls, opts.file);
      if (allUrls.length === 0) {
        console.error("No URLs provided. Pass URLs as arguments or use -f <file>.");
        process.exit(1);
      }

      const parser = getParser(opts.parser);
      if (!parser) {
        console.error(`Unknown parser: ${opts.parser}`);
        process.exit(1);
      }

      let ok = 0;
      let fail = 0;

      for (const url of allUrls) {
        console.log(`\n[${ok + fail + 1}/${allUrls.length}] ${url}`);
        try {
          const platform = detectPlatform(url);
          if (!platform) {
            console.error(`  No platform handler for this URL, skipping.`);
            fail++;
            continue;
          }

          console.log(`  Platform: ${platform.name}  Parser: ${opts.parser}`);

          const article = await platform.fetch(url, { headless: opts.headless });
          const markdown = parser.toMarkdown(article.bodyHtml, {
            title: article.title,
            extraRules: platform.turndownRules ?? [],
          });
          const saved = await saveArticle({
            platform: platform.name,
            url,
            title: article.title,
            author: article.author,
            date: article.date,
            rawHtml: article.rawHtml,
            bodyHtml: article.bodyHtml,
            markdown,
          });

          console.log(`  Saved: ${saved.dir}`);
          ok++;
        } catch (err) {
          console.error(`  Error: ${(err as Error).message}`);
          fail++;
        }
      }

      if (allUrls.length > 1) {
        console.log(`\nDone. ${ok} succeeded, ${fail} failed.`);
      }
    });
}

function resolveUrls(argUrls: string[], filePath?: string): string[] {
  const urls = new Set<string>();

  for (const u of argUrls) {
    const trimmed = u.trim();
    if (trimmed) urls.add(trimmed);
  }

  if (filePath) {
    const lines = readFileSync(filePath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#")) urls.add(trimmed);
    }
  }

  return [...urls];
}
