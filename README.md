# NGA 广告隐藏

一个**独立运行的 Tampermonkey（油猴）用户脚本**，用于隐藏 NGA 论坛常见的右侧游戏广告、横向通栏广告和部分传统广告位。

无需安装或启用 NGA-BBS-Script 主脚本，也不依赖 jQuery、第三方 CDN 或 `@require` 资源。

> 这是非官方社区脚本，与 NGA 论坛及 NGA-BBS-Script 作者无官方关联。脚本仅隐藏页面上的广告元素，不拦截其网络请求。

## 功能

| 功能 | 默认 | 说明 |
| --- | --- | --- |
| 广告隐藏总开关 | 开启 | 可随时关闭，刷新后设置仍会保留 |
| 自动隐藏右侧广告 | 开启 | 通过广告标记与页面位置识别右侧竖幅广告 |
| 自动隐藏横向通栏广告 | 开启 | 根据宽幅广告创意、深色通栏背景或广告标记识别 |
| 隐藏传统广告位 | 开启 | 部分历史 NGA 广告容器的 CSS 规则 |
| 加强模式 | 关闭 | 额外处理 `td.null`，**可能误隐藏正常内容** |
| 点选屏蔽 | 手动操作 | 点击广告保存 CSS 规则，刷新后继续生效 |
| 清空手动规则 | 手动操作 | 清除点选的全部规则，保留自动识别设置 |

脚本使用 `document-start` 注入 CSS，并通过 `MutationObserver` 处理后续插入的广告。实际效果取决于论坛 DOM 结构、广告加载方式与油猴注入时间，无法保证所有广告都能被识别或完全不闪现。

## 安装

### 方法一：从 GitHub 安装（发布仓库后推荐）

1. 安装浏览器扩展 [Tampermonkey](https://www.tampermonkey.net/)。
2. 在此仓库打开 [`nga-ad-hider.user.js`](./nga-ad-hider.user.js)。
3. 点击 **Raw（原始文件）**，按 Tampermonkey 的提示安装。
4. 如果浏览器只显示源代码，请在 Tampermonkey 中新建脚本，把源码复制进去，保存并启用。
5. 打开 [NGA 论坛](https://bbs.nga.cn/)，刷新页面。

### 方法二：本地安装

下载 `nga-ad-hider.user.js`，在 Tampermonkey 的实用工具中导入文件；若当前版本不提供文件导入功能，也可以创建新脚本并粘贴完整源码。

> **如果你之前安装了「NGA 广告隐藏 v0.2」或「NGA优化摸鱼体验插件-广告隐藏」，先将旧版去广告脚本禁用。** 本脚本独立保存配置，旧插件的手动点选规则不会自动迁移。原来的 NGA-BBS-Script 其他非广告功能可以继续使用。

## 使用

打开 NGA 网页，点击浏览器右上角的 Tampermonkey 图标。菜单中提供以下功能：

- `✅/⬜ 广告隐藏总开关`
- `✅/⬜ 自动隐藏右侧广告`
- `✅/⬜ 自动隐藏横向通栏广告`
- `✅/⬜ 隐藏传统广告位`
- `✅/⬜ 加强模式（可能误隐藏内容）`
- `🎯 点选未隐藏的广告`
- `🧹 清空手动规则`

点击开关会**立即写入油猴存储并刷新当前页面**，不需要额外点击保存按钮。

### 手动点选广告

如果有广告没被自动处理：

1. 打开油猴菜单，点击 `🎯 点选未隐藏的广告`。
2. 移动鼠标到广告位置，查看橙色高亮框。
3. **确认高亮框只覆盖要隐藏的广告**，然后点击。
4. 规则会自动保存。之后刷新页面也会尝试隐藏该区域。

如果高亮框选中了正常内容，按 `Esc` 取消。点选规则通常依赖网页结构，NGA 改版后可能需要重新点选。

### 误隐藏了内容怎么办？

优先关闭「加强模式」。如果是手动点选造成的，点击 `🧹 清空手动规则`。也可以通过油猴菜单关闭总开关进行排查。

## 兼容网址

- `https://bbs.nga.cn/`
- `https://ngabbs.com/`
- `https://www.ngabbs.com/`
- `https://nga.178.com/`
- `https://g.nga.cn/`

`@match` 同时允许对应站点的 HTTP 页面。基于 Chromium 浏览器（Chrome、Edge 等）和现代 CSS/DOM API 开发。

## 给仓库维护者：如何发布与更新

建议仓库名：**`nga-ad-hider`**。把本项目的文件放到仓库根目录即可。

创建仓库并上传后，安装地址一般是：

```text
https://raw.githubusercontent.com/YOUR_USERNAME/nga-ad-hider/main/nga-ad-hider.user.js
```

把 `YOUR_USERNAME` 替换为真实 GitHub 用户名。

**开启自动更新（可选）**：等仓库创建后，在 `nga-ad-hider.user.js` 的 `// ==UserScript==` 区域，增加并填入实际有效的地址：

```javascript
// @updateURL    https://raw.githubusercontent.com/YOUR_USERNAME/nga-ad-hider/main/nga-ad-hider.user.js
// @downloadURL  https://raw.githubusercontent.com/YOUR_USERNAME/nga-ad-hider/main/nga-ad-hider.user.js
```

确保将 `YOUR_USERNAME` 替换为你自己的用户名。以后每次发布新版本，需要同步提高 `@version`，并更新 `CHANGELOG.md`。**不要直接发布带有占位符的更新链接。**

## 本地测试

项目无需安装 npm 依赖，使用 Node.js 20+：

```bash
node --check nga-ad-hider.user.js
node tests/ad-hider.test.js
```

提供的是模拟 DOM 的单元/回归测试，覆盖右侧广告、横向广告、正常帖子图片保护、开关保存和手动规则。测试通过不等于已在 NGA 线上页面完整验证。

## 问题反馈

请在 GitHub Issues 中提供：NGA 页面网址（可去除敏感参数）、浏览器及 Tampermonkey 版本、广告所在位置的截图、相关控制台错误。如有条件，可以提供广告容器的简化 HTML。不要提交 Cookie、登录凭证或其他敏感信息。

## 许可证

[MIT](./LICENSE)。少量传统广告位 CSS 选择器参考了 NGA-BBS-Script 社区的[相关 PR #75](https://github.com/kisshang1993/NGA-BBS-Script/pull/75)。
