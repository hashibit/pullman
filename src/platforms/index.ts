import { wechatPlatform } from "./wechat.js";

export interface Article {
  title: string;
  author: string;
  date: string; // YYYY-MM-DD
  url: string;
  rawHtml: string;
  bodyHtml: string;
}

export interface TurndownRule {
  name: string;
  filter: (node: HTMLElement) => boolean;
  replacement: (content: string) => string;
}

export interface Platform {
  name: string;
  match(url: string): boolean;
  fetch(url: string, options?: { headless?: boolean }): Promise<Article>;
  extract(rawHtml: string, url?: string): Article;
  turndownRules?: TurndownRule[];
}

// Registry: ordered list; first match wins.
const PLATFORMS: Platform[] = [wechatPlatform];

export function detectPlatform(url: string): Platform | null {
  for (const platform of PLATFORMS) {
    if (platform.match(url)) return platform;
  }
  return null;
}

export { PLATFORMS };
