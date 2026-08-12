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

# 生成静态文件
npm run build

# 更新 Algolia 索引（需配置 HEXO_ALGOLIA_INDEXING_KEY 或 algolia.adminApiKey）
npm run algolia

# 部署到 GitHub Pages
npm run deploy

# 一键：清理 → 索引 → 生成 → 部署 → 本地预览
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

NexT 配置在仓库根目录 `_config.next.yml`（不要改 `node_modules/hexo-theme-next`）。

旧主题备份在 `themes/*-legacy/`，当前主题由 npm 包 `hexo-theme-next` 提供。

## 发布流程

```bash
hexo clean && hexo algolia && hexo generate && hexo deploy
```

部署目标：`git@github.com:SKSSSX/SKSSSX.github.io.git`（`master`）。
