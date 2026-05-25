import { turndownParser } from "./turndown.js";

const PARSERS = {
  turndown: turndownParser,
};

/**
 * Returns the parser by name, or null if not registered.
 * A parser exposes: { toMarkdown(html, { title }) => string }
 */
export function getParser(name) {
  return PARSERS[name] ?? null;
}

export { PARSERS };
