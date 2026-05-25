import TurndownService from "turndown";
import type { TurndownRule } from "../platforms/index.js";

interface ToMarkdownOptions {
  title?: string;
  extraRules?: TurndownRule[];
}

export const turndownParser = {
  name: "turndown",

  toMarkdown(html: string, { title = "", extraRules = [] }: ToMarkdownOptions = {}): string {
    const svc = new TurndownService({
      headingStyle: "atx",
      hr: "---",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
    });

    for (const rule of extraRules) {
      svc.addRule(rule.name, { filter: rule.filter, replacement: rule.replacement });
    }

    const body = svc.turndown(html);
    return title ? `# ${title}\n\n${body}` : body;
  },
};
