import { detectPlatform } from "../platforms/index.js";
import { getParser } from "../parsers/index.js";
import { saveArticle } from "../storage.js";

export function registerGetcontent(program) {
  program
    .command("getcontent <url>")
    .description("Fetch a web article and save it as structured Markdown")
    .option(
      "-p, --parser <name>",
      "Markdown parser to use (turndown)",
      "turndown",
    )
    .option("--no-headless", "Show browser window (useful for debugging)")
    .action(async (url, opts) => {
      const platform = detectPlatform(url);
      if (!platform) {
        console.error(`No platform handler found for URL: ${url}`);
        process.exit(1);
      }

      const parser = getParser(opts.parser);
      if (!parser) {
        console.error(`Unknown parser: ${opts.parser}`);
        process.exit(1);
      }

      console.log(`Platform: ${platform.name}`);
      console.log(`Parser:   ${opts.parser}`);

      const article = await platform.fetch(url, { headless: opts.headless });
      const markdown = parser.toMarkdown(article.bodyHtml, {
        title: article.title,
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

      console.log(`\nSaved to: ${saved.dir}`);
      console.log(`  raw.html     ${saved.rawHtml}`);
      console.log(`  body.html    ${saved.bodyHtml}`);
      console.log(`  ${saved.markdownFile}`);
    });
}
