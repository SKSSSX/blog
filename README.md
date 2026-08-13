# sanks的博客

基于 **Hexo 8** + **NexT 8** 的静态博客。

## 环境

- Node.js >= 20.19（推荐本机 Node 24）
- 仅使用 **npm**（已移除 yarn.lock）

```bash
npm install
```

## 常用命令

```bash
# 本地预览（默认端口 3111）
npm run dev

# 清理
npm run clean

# 生成静态文件（同时生成本地搜索 search.xml）
npm run build

# 部署到 GitHub Pages
npm run deploy

# 一键：清理 → 生成 → 部署 → 本地预览
npm start
```

## 文章加密

在 `_config.yml` 中保持：

```yaml
encrypt:
  enable: true
```

在文章 frontmatter 中添加：

```yaml
password: your_password
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
```

## 主题配置

主题使用 npm 包 `hexo-theme-next`，站点侧配置在仓库根目录 `_config.next.yml`。

## 发布流程

```bash
hexo clean && hexo generate && hexo deploy
```

搜索使用 NexT 本地搜索（`hexo-generator-searchdb`），无需 Algolia。

部署目标：`git@github.com:SKSSSX/SKSSSX.github.io.git`（`master`）。
