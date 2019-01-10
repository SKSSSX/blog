---
title: 你真的会检查自己系统安装的VUE版本吗？
date: 2018-12-17 13:55:52
categories:
- Vue
tags:
- vue
---
## 引语
{% blockquote %}
或许你觉得我这篇文章写的很傻，和无聊，但是我跟你说，即使你从事VUE开发一段时间，也不见得求在一些小问题上所求甚解。
{% endblockquote %}

## 有些人认为的VUE版本检查命令是：
{% codeblock %}
vue -V
{% endcodeblock %}

### 或者
{% codeblock %}
vue --version
{% endcodeblock %}

### 如下图
{% blockquote %}
{% asset_img vue-cli.png %}
{% endblockquote %}

## 其实你们大错特错
{% blockquote %}
这哪里是检查VUE版本的，那是vue-cli的版本，vue-cli是搭vue框架的脚手架，是vue的生态环境之一
{% asset_img VUE-Ecosystem.png %}
{% endblockquote %}

## 检查自己项目的VUE版本
{% blockquote %}
请看package.json
{% asset_img package.json.png %}
{% endblockquote %}

## 总结
现在就目前而言，vue-cli已经进入3.0时代，与2.0的脚手架使用差别有些大了，项目构建初期的选择性更灵活了，比如 PWA ，目前VUE版本还在2.0时代，据说VUE3.0就快出来了，很期待。