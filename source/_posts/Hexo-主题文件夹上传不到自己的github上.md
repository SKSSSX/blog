---
title: Hexo-主题文件夹上传不到自己的github上
tags:
  - hexo
categories:
  - Hexo
abbrlink: 12507
date: 2019-02-10 14:44:49
keywords:
---

### 引言
{% blockquote %}
好多人都已经用Hexo博客框架搭建了自己的博客，而且也部署到了自己的github上（或者是自己的云服务器上），再简单购买一个域名，让别人也可浏览自己的博客。
但是搭建过程中遇到了好多坑，自己的博客代码上传至自己的github上，但是发现<strong>除了主题文件夹下的文件，其他都 <code>push</code> 上去了</strong>
{% endblockquote %}

![主题文件夹是空的](github.png "主题文件夹是空的")

{% blockquote %}
而自己本地的主题文件夹是有文件的
{% endblockquote %}

![本地主题](local.png "本地主题")

### 探索
{% blockquote %}
大家可能想到是因为.gitignore里面忽略了这两个文件夹下的所有文件，但是经过自己的检查，发现并不是这儿的问题，自己的项目的.gitignore内容如下：
{% endblockquote %}

![.gitignore内容](gitignore.png ".gitignore内容")
<!-- more -->
### 真正的解决办法
{% blockquote %}
经过多番探索，终于找到了症结，先来说如何解决
- 删除<span style="color: #fe2c23">除了项目根目录以外的</span>任何位置的<strong> .git文件夹，.gitignore (或者编辑这个文件夹，删除那些你想上传但是被忽略的文件或文件夹) 和 .github 文件夹</strong>
- 操作完成之后，用SourceTree还是看不到需要上传的主题文件在“未暂存文件”一栏中，不要失望接着往下看
- 还要删除掉 SourceTree 中的 <strong>主题 子模块 </strong> ，如下图：
![SourceTree子模块](submodule.png "SourceTree子模块")
- 删除时，一定要勾选 <strong>“强制删除”</strong> ，要不然会删除不掉，而且SourceTree报错
![强制删除](force_delete.png "强制删除")
{% endblockquote %}

### 出现此问题的原因
{% blockquote %}
主要根源是每次我们下载主题时，都会用git命令clone源代码，例如像这样：
{% endblockquote %}

{% codeblock %}
$ git clone --branch v5.1.2 https://github.com/iissnan/hexo-theme-next themes/next
{% endcodeblock %}

{% blockquote %}
最终导致自己的主题文件夹下多了个.git文件夹，会被认为是另一个资源库，从属于自己的项目之下，在SourceTree中显示成“子模块”，而这些项目需要的主题文件不会被push到自己的github仓库中。
{% endblockquote %}