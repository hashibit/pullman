import { turndownParser } from "./turndown.js";

type Parser = typeof turndownParser;

const PARSERS: Record<string, Parser> = {
  turndown: turndownParser,
};

export function getParser(name: string): Parser | null {
  return PARSERS[name] ?? null;
}

export { PARSERS };
