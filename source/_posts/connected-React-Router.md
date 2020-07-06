---
title: Vue Router
subtitle: connected React Router
categories:
  - Redux
tags:
  - Redux
keywords: Redux
copyright: true
abbrlink: 39187
password: sanks_lock
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
top: false
date: 2020-07-06 10:16:42
---

## 前言
{% blockquote %}
最近在使用 Connnected React  Router 发现神奇的问题，居然没办法正常控制路由，身为专业的工程师，我们发挥福尔摩斯的精神，抽丝剥茧的找出问题出在哪。
{% endblockquote %}

## 什么是 Connected React Router
{% blockquote %}
如果你使用Redux，那么在 Redux 中使用 Side Effect Handler（像是 Redux Thunk、Redux Observable 或是 Redux Saga）做「流程管理」的时候，那么你一定会有一种情境是

{% note primary %}
如果你做完某件事，把目前页面跳转到另一个页面
{% endnote %}

如果你也使用 React Router，那么 Connected React Router 就是帮你在 Redux 的流程中也可以使用 Router 的功能，（像是 push、 goBack … etc 之类的 Api 帮助你管理路由）
{% endblockquote %}

{% blockquote %}
也就是说，Connected React Router 是帮助同步「Router」与「Redux」的状态，帮助你可以使用 Redux 管理 React Router 的工具！
{% endblockquote %}
<!-- more -->
## 举例
{% blockquote %}
如果我们想要在发完对 Server 的更新资料 Api 后，跳转回「首页路由（ /home ）」，代码大概会像是底下这样：

![connected React Router](connected-React-Router.png "在redux更新token之后再跳转到 home 页")

<!-- ![store](store.png "状态管理机的入口以及中间件的一些配置") -->

[更多关于 Connected Recact Router 文件请看这里](https://github.com/supasate/connected-react-router)
{% endblockquote %}

## 发生的问题
{% blockquote %}
我的状况是，Web Application 都根据 Connected React Router 官网文件正确修改接上，Component 上的 history.push 可以正常运作，一开始进入页面 Redux 也有听到 @@router/LOCATION_CHANGE 的 Action，但是却没办法使用 push Api 来改变画面上的路由，整个前端程式也没有发生这个 Action，也没有任何错误发生。
{% endblockquote %}

{% note primary %} 
小技巧：要如何知道前端程式有听到什么 Action，可以使用 [Redux Logger](https://github.com/LogRocket/redux-logger) 这个 Middleware，但记得只在开发模式使用就好！
{% endnote %}

## 解决方法
{% blockquote %}
由上述问题来看，因为 Web Application 有听到 @@router/LOCATION_CHANGE 的 Action，对于 Connected React Router 修改应该是没有错的，而且没有错误，也能用 history.push 方法，大致上的 Code 应该都没有问题才对。

经过一番思考后，想我有一个习惯是，把 createBrowserHistory 的方法包成 history.js ，会不会是 history 本身有问题？一查果然，我在定义 <ConnectedRouter history={history}> 的 history 与 Redux Store 所使用的 history 居然是不同的档案，所以造成在画面上可以正常运作，Redux Store 的却不能正常运作
{% endblockquote %}

## 结论
{% blockquote %}
Store 跟 Router 必须使用同一个 history 物件，否则会有其中一方不能正常运作，如果以后还有遇到必须要先检查一次才行，记录一下。
{% endblockquote %}