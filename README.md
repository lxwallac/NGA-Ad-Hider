<div align="center">

<h1>🛡️ NGA 论坛广告隐藏</h1>

<p><em>NGA Ad Hider · 让论坛浏览更清爽</em></p>

<p>
  <a href="https://github.com/lxwallac/NGA-Ad-Hider-v1.0.0/stargazers"><img alt="GitHub Stars" src="https://img.shields.io/github/stars/lxwallac/NGA-Ad-Hider-v1.0.0?style=social"></a>
  <a href="https://github.com/lxwallac/NGA-Ad-Hider-v1.0.0/blob/main/CHANGELOG.md"><img alt="Version" src="https://img.shields.io/badge/version-v1.0.0-007ec6"></a>
  <a href="https://raw.githubusercontent.com/lxwallac/NGA-Ad-Hider-v1.0.0/main/nga-ad-hider.user.js"><img alt="Install with Tampermonkey" src="https://img.shields.io/badge/Tampermonkey-Install-00a651?logo=tampermonkey&logoColor=white"></a>
  <a href="https://github.com/lxwallac/NGA-Ad-Hider-v1.0.0/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/lxwallac/NGA-Ad-Hider-v1.0.0?label=License&color=brightgreen"></a>
  <a href="https://github.com/lxwallac/NGA-Ad-Hider-v1.0.0/blob/main/nga-ad-hider.user.js"><img alt="Code size" src="https://img.shields.io/github/languages/code-size/lxwallac/NGA-Ad-Hider-v1.0.0?label=code%20size&color=007ec6"></a>
</p>

<p>自动隐藏 NGA 右侧广告、横向通栏广告，支持手动点选与规则保存。</p>

**[🚀 点击安装油猴脚本](https://raw.githubusercontent.com/lxwallac/NGA-Ad-Hider-v1.0.0/main/nga-ad-hider.user.js)** · **[📖 查看安装教程](#-安装教程第一次使用请看这里)** · **[🐛 问题反馈](https://github.com/lxwallac/NGA-Ad-Hider-v1.0.0/issues)**

</div>

---

## 📖 项目介绍

在 NGA 浏览帖子时，右侧游戏广告、横向通栏广告可能会占据阅读空间。

**NGA Ad Hider** 专注于解决这件小事：隐藏部分常见广告位，并提供手动点选功能，让你按自己的习惯决定哪些区域需要显示。

- ✅ **独立运行**：只需要 Tampermonkey，无需安装 NGA-BBS-Script 主脚本。
- ✅ **无额外 JS 依赖**：不使用 jQuery、远程 `@require` 或第三方 CDN。
- ✅ **设置持久化**：开关与手动规则保存在油猴中，刷新后继续生效。
- ✅ **自由控制**：所有功能都可以从油猴菜单中单独开启或关闭。

> **说明：** 本脚本通过 CSS 和 DOM 操作隐藏页面元素，不是网络层广告拦截器，因此不会阻止广告资源本身的下载，也不能保证覆盖 NGA 的所有广告样式。

## ✨ 功能列表

| 功能 | 默认状态 | 说明 |
| --- | :---: | --- |
| 🛡️ 广告隐藏总开关 | ✅ 开启 | 一键启用或关闭全部隐藏规则 |
| 📌 自动隐藏右侧广告 | ✅ 开启 | 识别常见右侧竖幅广告容器 |
| 🖼️ 自动隐藏横向通栏广告 | ✅ 开启 | 识别部分宽幅游戏广告与深色广告栏 |
| 🧹 隐藏传统广告位 | ✅ 开启 | 应用部分历史 NGA 广告位规则 |
| 🎯 点选未隐藏的广告 | 手动操作 | 点击指定广告，保存对应的 CSS 规则 |
| 🗑️ 清空手动规则 | 手动操作 | 移除所有手动添加的隐藏规则 |
| ⚠️ 加强模式 | ⬜ 关闭 | 扩展隐藏范围，可能误隐藏正常内容 |

> 广告结构会随 NGA 更新而变化。自动规则未必覆盖所有页面；遇到漏网广告时，可以尝试「🎯 点选未隐藏的广告」。

---

## 🚀 安装教程（第一次使用请看这里）

**推荐环境：Chrome 或 Microsoft Edge + Tampermonkey（油猴）。**

### 第一步：安装油猴 Tampermonkey

1. 打开 [Tampermonkey 官网](https://www.tampermonkey.net/)。
2. 选择你正在使用的浏览器（Chrome / Edge）。
3. 按页面引导安装 Tampermonkey 浏览器扩展。
4. 安装完成后，建议将 Tampermonkey 固定到浏览器右上角工具栏，方便之后打开菜单。

### 第二步：检查浏览器的用户脚本权限

部分新版 Chrome / Edge 需要额外允许油猴执行用户脚本。如果脚本安装成功却完全不运行，请检查：

- **Chrome**：打开 `chrome://extensions`，进入 Tampermonkey 的「详情」，寻找并开启「允许用户脚本」。
- **Edge**：打开 `edge://extensions`，进入 Tampermonkey 的「详情」，检查是否提供「允许用户脚本」选项。
- **如果找不到该选项**：可按 [Tampermonkey 官方说明](https://www.tampermonkey.net/faq.php?locale=zh&q=Q209) 检查是否需要开启扩展管理页面的「开发者模式」。

> 不同浏览器和版本的设置入口可能不同，以 Tampermonkey 官方文档为准。

### 第三步：安装 NGA Ad Hider

点击下方链接：

### 👉 [**点击安装 NGA Ad Hider v1.0.0**](https://raw.githubusercontent.com/lxwallac/NGA-Ad-Hider-v1.0.0/main/nga-ad-hider.user.js)

通常会打开 Tampermonkey 的脚本安装页面，确认脚本名称为 **「NGA 广告隐藏」**，然后点击「安装」。

**如果链接只显示 JavaScript 源代码，没有弹出安装页面：**

1. 打开 [脚本文件](https://github.com/lxwallac/NGA-Ad-Hider-v1.0.0/blob/main/nga-ad-hider.user.js)，复制完整代码。
2. 点击浏览器右上角的 Tampermonkey 图标，进入「管理面板」。
3. 点击 `+` 新建脚本，删除编辑器默认内容。
4. 粘贴刚才复制的代码，按 `Ctrl + S` 保存。
5. 确认脚本在管理面板中处于「已启用」状态。

### 第四步：打开 NGA，检查是否生效

1. 打开 [NGA 论坛](https://bbs.nga.cn/) 或任意帖子页面。
2. 按 `Ctrl + R` 刷新网页。
3. 点击油猴图标，确认「NGA 广告隐藏」已在当前站点运行。
4. 观察右侧广告和横向通栏广告是否被隐藏。

🎉 **安装完成！** 不需要额外安装 NGA-BBS-Script，也无需手动配置任何外部依赖。

---

## ⚙️ 如何使用

在 NGA 页面点击 **Tampermonkey 图标 → NGA 广告隐藏**，即可看到相关菜单：

| 菜单 | 用途 |
| --- | --- |
| `✅ / ⬜ 广告隐藏总开关` | 总体开启或关闭 |
| `✅ / ⬜ 自动隐藏右侧广告` | 控制右侧广告 |
| `✅ / ⬜ 自动隐藏横向通栏广告` | 控制页面横幅广告 |
| `✅ / ⬜ 隐藏传统广告位` | 控制传统广告选择器 |
| `✅ / ⬜ 加强模式` | 可选的扩展规则 |
| `🎯 点选未隐藏的广告` | 手动选中并隐藏广告 |
| `🧹 清空手动规则` | 删除手动保存的隐藏规则 |

**点击开关后，设置会自动保存并刷新当前页面**，不需要再点击其他「保存」按钮。

### 🎯 漏网广告？手动点选隐藏

如果自动识别没有覆盖某个广告：

1. 在油猴菜单中选择 **「🎯 点选未隐藏的广告」**。
2. 移动鼠标到广告上，查看橙色高亮框。
3. **确认高亮范围只覆盖广告**，再点击鼠标。
4. 该区域会被隐藏，对应规则会保存到油猴存储中。

按 `Esc` 可以随时取消点选。

> 手动规则依赖网页结构。如果 NGA 改版，之前保存的规则可能需要重新设置。

### 🧹 恢复误隐藏的内容

如果正常内容被隐藏，可以先关闭「加强模式」，或者通过菜单中的「🧹 清空手动规则」删除所有手动规则。

需要彻底排查时，可以关闭「广告隐藏总开关」，刷新后查看页面是否恢复正常。

---

## ❓ 常见问题

<details>
<summary><strong>Q1：脚本安装了，但 NGA 页面没有任何变化？</strong></summary>

先检查 Tampermonkey 是否启用，以及浏览器是否允许用户脚本运行。然后确认访问的是支持的 NGA 域名，并刷新页面。如果仍然没有效果，可以打开 F12 控制台查看是否有与 NGA Ad Hider 相关的报错。

</details>

<details>
<summary><strong>Q2：为什么还有广告没有隐藏？</strong></summary>

广告可能使用了新的 HTML 结构，或者加载到了不同的容器中。可以使用「🎯 点选未隐藏的广告」，并在 GitHub Issues 提供截图与页面地址，帮助完善自动规则。

</details>

<details>
<summary><strong>Q3：为什么有时会先看到广告，再突然消失？</strong></summary>

部分广告由 NGA 页面动态加载。脚本虽然会尽早启动，并监听页面变化，但在实际加载顺序下仍可能短暂显示广告。

</details>

<details>
<summary><strong>Q4：能和 NGA-BBS-Script 一起使用吗？</strong></summary>

可以将两者作为独立脚本安装。不过，如果还安装了旧的「NGA 广告隐藏」测试版或其他同功能去广告插件，建议禁用重复的去广告脚本，以免规则冲突。

</details>

<details>
<summary><strong>Q5：关闭或重新打开浏览器后，设置会丢失吗？</strong></summary>

正常情况下不会。设置通过 Tampermonkey 的存储接口保存；但删除脚本数据、清空扩展存储或更换浏览器环境可能导致配置丢失。

</details>

<details>
<summary><strong>Q6：怎样获取新版本？</strong></summary>

可关注本仓库的 [更新日志](./CHANGELOG.md)，在发布新版本后重新打开脚本文件进行更新。当前 v1.0.0 脚本尚未配置 GitHub 的 `@updateURL` / `@downloadURL` 元数据，因此不承诺自动更新。

</details>

---

## 🌐 支持的 NGA 网址

- `bbs.nga.cn`
- `ngabbs.com`
- `www.ngabbs.com`
- `nga.178.com`
- `g.nga.cn`

> 脚本匹配上述网址的 HTTP/HTTPS 页面，主要面向桌面端 Chrome / Edge 及 Tampermonkey 环境。

## 🧪 开发与测试

本项目不需要安装 npm 依赖。安装 Node.js 20+ 后，可以在项目根目录运行：

```bash
node --check nga-ad-hider.user.js
node tests/ad-hider.test.js
```

测试覆盖右侧广告、横向广告、开关保存、手动规则及部分正常内容保护场景。**模拟测试不能代替真实浏览器中的回归测试。**

## 📋 更新日志

### v1.0.0

- 初版独立油猴脚本。
- 支持右侧竖幅广告、横向通栏广告及传统广告位隐藏。
- 支持点选屏蔽和自定义规则持久化。
- 支持独立功能开关，无需 NGA-BBS-Script 主脚本。

完整记录见 [CHANGELOG.md](./CHANGELOG.md)。

## 🐛 问题反馈与建议

遇到漏网广告、误隐藏或浏览器兼容问题，欢迎 [提交 Issue](https://github.com/lxwallac/NGA-Ad-Hider-v1.0.0/issues)。

反馈时建议附上浏览器与油猴版本、NGA 页面地址、截图及必要的控制台错误。请勿公开 Cookie、Token 或其他登录凭证。

## 🙏 致谢

- [NGA-BBS-Script](https://github.com/kisshang1993/NGA-BBS-Script)：NGA 社区脚本项目，传统广告位的部分规则参考了其社区 [PR #75](https://github.com/kisshang1993/NGA-BBS-Script/pull/75)。
- [Tampermonkey](https://www.tampermonkey.net/)：用户脚本运行环境。

## 📄 开源协议

本项目采用 [MIT License](./LICENSE)。

本项目是非官方社区作品，与 NGA 论坛及上述第三方项目不存在官方关联。

---

**如果这个脚本对你有帮助，欢迎点个 ⭐ Star！**

[返回仓库首页](https://github.com/lxwallac/NGA-Ad-Hider-v1.0.0) · [安装脚本](https://raw.githubusercontent.com/lxwallac/NGA-Ad-Hider-v1.0.0/main/nga-ad-hider.user.js) · [提交反馈](https://github.com/lxwallac/NGA-Ad-Hider-v1.0.0/issues)
