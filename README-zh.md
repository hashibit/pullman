# pullman

抓取网络文章，整理成结构化的 Markdown。支持微信公众号和 Reddit 帖子（含评论）。

## 环境要求

- Node.js 20+
- Google Chrome（Puppeteer 调用系统 Chrome，不支持 Chromium）

```bash
pnpm install
pnpm build
```

## 用法

```bash
pnpm pullman getcontent [urls...]           # 一个或多个 URL
pnpm pullman getcontent -f <文件>           # 包含 URL 列表的文件
pnpm pullman getcontent -f <文件> [urls…]   # 两者混用
```

**参数**

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `-f, --file <path>` | — | URL 列表文件，每行一个，`#` 开头为注释 |
| `-p, --parser <name>` | `turndown` | 使用的 Markdown 转换库 |
| `--no-headless` | — | 显示浏览器窗口（反风控调试用） |

## 示例

### 单个 URL

```bash
pnpm pullman getcontent "https://mp.weixin.qq.com/s/6vRyARziPz3iceYa3CP9iA"
```

### URL 列表文件

`tests/sample-input-url.txt`：

```
# 微信公众号文章
https://mp.weixin.qq.com/s/6vRyARziPz3iceYa3CP9iA
```

```bash
pnpm pullman getcontent -f tests/sample-input-url.txt
```

控制台输出：

```
[1/1] https://mp.weixin.qq.com/s/6vRyARziPz3iceYa3CP9iA
  Platform: wechat  Parser: turndown
Launching browser...
Navigating to https://mp.weixin.qq.com/s/6vRyARziPz3iceYa3CP9iA
Browser closed.
  Saved: pullman-data/wechat/大锤沉思录/2026-05-22/罗马军团式的公司过期了，YC-提出了一种全新的公司形态
```

处理多个 URL 时，最后会打印汇总：

```
Done. 3 succeeded, 1 failed.
```

示例输出：[tests/sample-output-wechat.md](tests/sample-output-wechat.md)

### Reddit

```bash
pnpm pullman getcontent "https://www.reddit.com/r/ClaudeAI/comments/1tq9qrr/opus_48_max_told_me_to_drive_to_the_car_wash/"
```

示例输出：[tests/sample-output-reddit.md](tests/sample-output-reddit.md)

## 存储结构

```
pullman-data/
└── wechat/
    ├── index.json                  ← 平台级元数据索引
    └── 大锤沉思录/
        └── 2026-05-22/
            └── 罗马军团式的公司过期了，YC-提出了一种全新的公司形态/
                ├── raw.html        ← CDP 获取的完整页面 HTML
                ├── body.html       ← 文章正文 HTML（#js_content）
                └── *.md            ← 转换后的 Markdown
```

`index.json` 结构：

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

同一个 URL 重复抓取时，会更新已有记录，而不是插入重复条目。

## 支持的平台

| 平台 | 匹配规则 | 说明 |
|------|----------|------|
| 微信公众号 | `mp.weixin.qq.com` | CDP 读取 DOM + 立即关闭浏览器（降低被追踪风险） |
| Reddit | `reddit.com/r/*/comments/*` | 抓取帖子正文及嵌套评论，按层级缩进输出；使用真实 Chrome 绕过反爬检测 |

## 支持的 Markdown 解析库

| 名称 | 包 | 说明 |
|------|----|------|
| `turndown` | [turndown](https://github.com/mixmark-io/turndown) | 默认。平台特定规则通过各平台 handler 的 `turndownRules` 注入。 |

## 扩展

**新增平台** — 创建 `src/platforms/yourplatform.ts`：

```ts
import type { Platform } from "./index.js";

export const yourPlatform: Platform = {
  name: "yourplatform",
  match(url) { return url.includes("example.com"); },
  async fetch(url, opts) { /* 返回 { title, author, date, rawHtml, bodyHtml, url } */ },
  extract(rawHtml, url) { /* 纯 cheerio/正则提取，无需浏览器 */ },
};
```

在 `src/platforms/index.ts` 里注册。

**新增解析库** — 创建 `src/parsers/yourparser.ts`：

```ts
export const yourParser = {
  name: "yourparser",
  toMarkdown(html: string, { title = "" } = {}): string { /* 返回 markdown 字符串 */ },
};
```

在 `src/parsers/index.ts` 里注册，然后用 `--parser yourparser` 切换。
