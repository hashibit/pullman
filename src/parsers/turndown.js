import TurndownService from "turndown";

export const turndownParser = {
  name: "turndown",

  toMarkdown(html, { title = "", extraRules = [] } = {}) {
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
