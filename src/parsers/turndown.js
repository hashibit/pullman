import TurndownService from "turndown";

export const turndownParser = {
  name: "turndown",

  toMarkdown(html, { title = "" } = {}) {
    const svc = new TurndownService({
      headingStyle: "atx",
      hr: "---",
      bulletListMarker: "-",
      codeBlockStyle: "fenced",
    });

    // WeChat often marks bold via inline style instead of <strong>
    svc.addRule("wechatBold", {
      filter: (node) =>
        node.nodeName === "SPAN" &&
        (node.style?.fontWeight === "bold" ||
          node.style?.fontWeight === "700"),
      replacement: (content) => `**${content}**`,
    });

    // Strip WeChat's inline image placeholders that carry no text content
    svc.addRule("dropEmptySpans", {
      filter: (node) =>
        node.nodeName === "SPAN" && node.textContent.trim() === "",
      replacement: () => "",
    });

    const body = svc.turndown(html);
    return title ? `# ${title}\n\n${body}` : body;
  },
};
