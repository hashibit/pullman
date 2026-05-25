import { wechatPlatform } from "./wechat.js";

// Registry: ordered list; first match wins.
const PLATFORMS = [wechatPlatform];

/**
 * Returns the platform handler whose `match(url)` returns true,
 * or null if none match.
 */
export function detectPlatform(url) {
  for (const platform of PLATFORMS) {
    if (platform.match(url)) return platform;
  }
  return null;
}

export { PLATFORMS };
