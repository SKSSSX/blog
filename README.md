# sanks 的博客

基于 **Hexo 8** + **NexT 8** 的静态博客源码仓库。

线上站点：https://www.sanks-blog.com

发布仓库：https://github.com/SKSSSX/SKSSSX.github.io

## 环境

- Node.js >= 20.19，推荐 Node 24
- 使用 npm 管理依赖

```bash
npm install
```

## 分支

- `develop`：日常写文章、改配置、调整主题
- `master`：发布前从 `develop` 合并过来的主分支

常规流程：

```bash
git switch develop
# 写文章或改配置
git add .
git commit -m "docs: 更新博客内容"

git switch master
git merge develop
git push origin master
```

## 常用命令

```bash
# 本地预览，默认端口 3111
npm run dev

# 清理生成产物
npm run clean

# 生成静态文件
npm run build

# 清理并重新生成
npm run rebuild

# 部署到 GitHub Pages
npm run deploy

# 清理、生成并部署
npm run publish
```

## 发布流程

部署目标在 `_config.yml` 中维护：

```yaml
deploy:
  - type: git
    repository: https://github.com/SKSSSX/SKSSSX.github.io.git
    branch: master
```

发布命令：

```bash
npm run publish
```

该命令会生成静态文件并推送到 `SKSSSX/SKSSSX.github.io` 的 `master` 分支。

## 功能说明

- 主题使用 npm 包 `hexo-theme-next`
- NexT 站点配置在 `_config.next.yml`
- 本地搜索使用 `hexo-generator-searchdb` 生成 `search.xml`
- 站点地图使用 `hexo-generator-sitemap` 和 `hexo-generator-baidu-sitemap`
- 已移除百度主动推送插件，发布时不会再向百度提交链接

## 文章加密

在 `_config.yml` 中保持：

```yaml
encrypt:
  enable: true
```

需要加密的文章在 front matter 中添加：

```yaml
password: your_password
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
```
