---
title: NodeJS Middleware
subtitle: NodeJS Middleware
categories:
  - Nodejs
tags:
  - Nodejs
keywords: Nodejs
copyright: true
top: false
date: 2020-02-03 14:59:38
---

## Nodejs 作为中间层能做的事
{% blockquote %}
nodejs中间层能减少开发过程中的一些实际问题，比如跨域，也能分担后台开发人员的工作，比如文件上传服务器，也能做简单的即时消息聊天功能，都是基于nodejs的特性。
{% endblockquote %}

### 反向代理和跨域
{% blockquote %}
同源策略（SOP）是为了防止CSRF（跨域请求伪造）的攻击，浏览器引入的策略。
![同源策略](sop.png "同源策略")
{% endblockquote %}

<!-- more -->
{% blockquote %}
跨域的解决方案有很多，比如 JSONP  Nodejs做反向代理  CORS"跨域资源共享"（Cross-origin resource sharing），现在使用最多的是后两种，nodejs做反向代理，改变HTTP协议中header的属性，是前端开发最常用的方式。
![跨域](cross-domain.png "跨域")
{% endblockquote %}

### 文件上传服务器
{% blockquote %}
项目中避免不了需要上传图片，Excel文件等上传文件的功能，需要上传进度，存储文件，压缩等操作
用nodejs来实现文件上传，并且可异步上传多个文件，是再好不过的了
{% endblockquote %}

### SSR
{% blockquote %}
服务器端渲染的好处有好多，提高首屏加载速度，提高搜索引擎对网页的抓取
现基于 koa 做了服务器端渲染的操作
{% endblockquote %}

### socket.io
{% blockquote %}
Socket.io是一个WebSocket库，包括了客户端的js和服务器端的nodejs
{% endblockquote %}

### Express vs Koa
{% blockquote %}
- express 门槛更低，koa 更强大更优雅。
- express 封装更多的东西，开发速度快速，koa 可定制性更高
{% endblockquote %}

### 整体的项目架构图
![架构图](framework.png "架构图")