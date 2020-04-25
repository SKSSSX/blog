# sanks的博客
## 基于hexo做的博客
## 启用加密机制
  ### 1.首先在 _config.yml 中启用该插件：

encrypt:
    enable: true

  ### 2.在你的文章的头部添加上对应的字段，如 password, abstract, message

---
title: hello world
date: 2016-03-30 21:18:02
tags:
    - fdsafsdaf
password: Mike
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
---

## 生成项目命令

# 清理public文件

hexo clean

# 重新生成public里面的静态资源

hexo generate

# 生成搜索索引

hexo clean && hexo algolia

# 重新部署

hexo deploy

# 流程化部署

hexo clean && hexo algolia && hexo generate && hexo deploy

# 注意
偶尔会出现 环境中缺少 HEXO_ALGOLIA_INDEXING_KEY 的情况（windows），执行命令（在docs中，而非git Bash）
export(windows 为 set) HEXO_ALGOLIA_INDEXING_KEY=Search-Only API key
自己的博客，需在此项目中（访问的静态网站SKSSSX.github.io）单独设置ssh-key,并添加信任列表；与此同时，博客需要全局设定 git 的账号和邮箱，来保证推送代码的顺利进行