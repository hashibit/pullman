# getweb

A CLI tool that fetches web articles and archives them as structured Markdown. Platform detection is automatic — add the URL, get back clean files organized by platform, author, and date.

## Requirements

- Node.js 20+
- Google Chrome (used by Puppeteer; Chromium is not supported)

```bash
pnpm install
```

## Usage

```bash
node src/cli.js getcontent <url>
```

**Options**

| Flag | Default | Description |
|------|---------|-------------|
| `-p, --parser <name>` | `turndown` | Markdown parser to use |
| `--no-headless` | — | Show the browser window (debug anti-bot issues) |

## Example

Input (`tests/sample-input-url.txt`):

```
https://mp.weixin.qq.com/s/6vRyARziPz3iceYa3CP9iA
```

Command:

```bash
node src/cli.js getcontent "https://mp.weixin.qq.com/s/6vRyARziPz3iceYa3CP9iA"
```

Console output:

```
Platform: wechat
Parser:   turndown
Launching browser...
Navigating to https://mp.weixin.qq.com/s/6vRyARziPz3iceYa3CP9iA
Browser closed.

Saved to: getweb-data/wechat/大锤沉思录/2026-05-22/罗马军团式的公司过期了，YC-提出了一种全新的公司形态
  raw.html     getweb-data/wechat/大锤沉思录/2026-05-22/.../raw.html
  body.html    getweb-data/wechat/大锤沉思录/2026-05-22/.../body.html
  getweb-data/wechat/大锤沉思录/2026-05-22/.../罗马军团式的公司过期了，YC-提出了一种全新的公司形态.md
```

Markdown output (`tests/sample-output.md`, excerpt):

```markdown
# 罗马军团式的公司过期了，YC 提出了一种全新的公司形态

YC 现在的内部系统会在夜里偷偷给自己改代码。流程是这样，第一天有 YC 员工向内部 agent
发了一条 query，跑失败了。一个监督 agent (monitoring agent) 会读到这次失败，反推为什么
，再决定要不要补一个新的确定性工具...

### **罗马军团已经过期了**

罗马军团的设计是嵌套层级，每一层有稳定的管辖宽度...
```

## Output structure

```
getweb-data/
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
        "rawHtml": "getweb-data/wechat/大锤沉思录/2026-05-22/.../raw.html",
        "bodyHtml": "getweb-data/wechat/大锤沉思录/2026-05-22/.../body.html",
        "markdown": "getweb-data/wechat/大锤沉思录/2026-05-22/.../*.md"
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

## Supported parsers

| Name | Package | Notes |
|------|---------|-------|
| `turndown` | [turndown](https://github.com/mixmark-io/turndown) | Default. Handles WeChat inline-style bold and empty spans. |

## Extending

**Add a platform** — create `src/platforms/yourplatform.js`:

```js
export const yourPlatform = {
  name: "yourplatform",
  match(url) { return url.includes("example.com"); },
  async fetch(url, opts) { /* return { title, author, date, rawHtml, bodyHtml } */ },
  extract(rawHtml, url) { /* pure cheerio/regex extraction */ },
};
```

Register it in `src/platforms/index.js`.

**Add a parser** — create `src/parsers/yourparser.js`:

```js
export const yourParser = {
  name: "yourparser",
  toMarkdown(html, { title }) { /* return markdown string */ },
};
```

Register it in `src/parsers/index.js`, then use `--parser yourparser`.
