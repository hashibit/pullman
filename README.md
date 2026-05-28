# pullman

A CLI tool that fetches web articles and archives them as structured Markdown. Platform detection is automatic — add the URL, get back clean files organized by platform, author, and date. Supports WeChat Official Accounts and Reddit posts with comments.

## Requirements

- Node.js 20+
- Google Chrome (used by Puppeteer; Chromium is not supported)

```bash
pnpm install
pnpm build
```

## Usage

```bash
pnpm pullman getcontent [urls...]          # one or more URLs
pnpm pullman getcontent -f <file>          # file with one URL per line
pnpm pullman getcontent -f <file> [urls…]  # both at once
```

**Options**

| Flag | Default | Description |
|------|---------|-------------|
| `-f, --file <path>` | — | File containing URLs, one per line (`#` lines are comments) |
| `-p, --parser <name>` | `turndown` | Markdown parser to use |
| `--no-headless` | — | Show the browser window (debug anti-bot issues) |

## Example

### Single URL

```bash
pnpm pullman getcontent "https://mp.weixin.qq.com/s/6vRyARziPz3iceYa3CP9iA"
```

### URL list file

`tests/sample-input-url.txt`:

```
# WeChat articles
https://mp.weixin.qq.com/s/6vRyARziPz3iceYa3CP9iA
```

```bash
pnpm pullman getcontent -f tests/sample-input-url.txt
```

Console output:

```
[1/1] https://mp.weixin.qq.com/s/6vRyARziPz3iceYa3CP9iA
  Platform: wechat  Parser: turndown
Launching browser...
Navigating to https://mp.weixin.qq.com/s/6vRyARziPz3iceYa3CP9iA
Browser closed.
  Saved: pullman-data/wechat/大锤沉思录/2026-05-22/罗马军团式的公司过期了，YC-提出了一种全新的公司形态
```

When processing multiple URLs, a summary is printed at the end:

```
Done. 3 succeeded, 1 failed.
```

Sample output: [tests/sample-output-wechat.md](tests/sample-output-wechat.md)

### Reddit

```bash
pnpm pullman getcontent "https://www.reddit.com/r/ClaudeAI/comments/1tq9qrr/opus_48_max_told_me_to_drive_to_the_car_wash/"
```

Sample output: [tests/sample-output-reddit.md](tests/sample-output-reddit.md)

## Output structure

```
pullman-data/
└── wechat/
    ├── index.json                  ← per-platform metadata index
    └── 大锤沉思录/
        └── 2026-05-22/
            └── 罗马军团式的公司过期了，YC-提出了一种全新的公司形态/
                ├── raw.html        ← full page HTML from CDP
                ├── body.html       ← article body only (#js_content)
                └── *.md            ← converted Markdown
```

`index.json` schema:

```json
{
  "platform": "wechat",
  "articles": [
    {
      "url": "https://mp.weixin.qq.com/s/6vRyARziPz3iceYa3CP9iA",
      "title": "罗马军团式的公司过期了，YC 提出了一种全新的公司形态",
      "author": "大锤沉思录",
      "date": "2026-05-22",
      "fetchedAt": "2026-05-24T23:32:32.741Z",
      "files": {
        "rawHtml": "pullman-data/wechat/大锤沉思录/2026-05-22/.../raw.html",
        "bodyHtml": "pullman-data/wechat/大锤沉思录/2026-05-22/.../body.html",
        "markdown": "pullman-data/wechat/大锤沉思录/2026-05-22/.../*.md"
      }
    }
  ]
}
```

Re-fetching the same URL updates the existing entry rather than creating a duplicate.

## Supported platforms

| Platform | Match pattern | Notes |
|----------|--------------|-------|
| WeChat Official Accounts | `mp.weixin.qq.com` | CDP read + instant browser close to avoid tracking |
| Reddit | `reddit.com/r/*/comments/*` | Fetches post body + threaded comments with depth-aware blockquote indentation; bypasses bot detection via real Chrome channel |

## Supported parsers

| Name | Package | Notes |
|------|---------|-------|
| `turndown` | [turndown](https://github.com/mixmark-io/turndown) | Default. Platform-specific rules are injected via `turndownRules` on each platform handler. |

## Extending

**Add a platform** — create `src/platforms/yourplatform.ts`:

```ts
import type { Platform } from "./index.js";

export const yourPlatform: Platform = {
  name: "yourplatform",
  match(url) { return url.includes("example.com"); },
  async fetch(url, opts) { /* return { title, author, date, rawHtml, bodyHtml, url } */ },
  extract(rawHtml, url) { /* pure cheerio/regex extraction */ },
};
```

Register it in `src/platforms/index.ts`.

**Add a parser** — create `src/parsers/yourparser.ts`:

```ts
export const yourParser = {
  name: "yourparser",
  toMarkdown(html: string, { title = "" } = {}): string { /* return markdown string */ },
};
```

Register it in `src/parsers/index.ts`, then use `--parser yourparser`.
