---
title: 防抖动和节流
subtitle: debounce and throttle
categories:
  - JavaScript
tags:
  - JavaScript
keywords: JavaScript
copyright: true
top: false
password: sanks
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
date: 2020-05-20 23:40:45
---

## 防抖动（debounce）：
{% blockquote %}
所谓的抖动就是浏览器频繁布局时，由于算力不足导致的页面颤动现象。防抖动就是利用类似于节流的手段——无视短时间内重复回调，避免浏览器发生抖动现象的技术。
{% endblockquote %}

{% blockquote %}
比较常见的抖动场景是在 auto index 的搜索设计上；当我们在搜索框内输入不同索引时，页面会频繁计算索引并渲染列表，以致产生抖动。但事实上在这类场景里，有价值的请求只会发生在用户停止输入后，通俗来说就是用户输入过程中的字符串不必当真。
{% endblockquote %}


<p class="codepen" data-height="391" data-theme-id="dark" data-default-tab="result" data-user="dcorb" data-slug-hash="GZWqNV" style="height: 391px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Debounce. Leading">
  <span>See the Pen <a href="https://codepen.io/dcorb/pen/GZWqNV">
  Debounce. Leading</a> by Corbacho (<a href="https://codepen.io/dcorb">@dcorb</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## 节流（throttle）：
{% blockquote %}
节流指的都是某个函数在一定时间间隔内只执行第一次回调。
{% endblockquote %}

## 总结：
{% blockquote %}
前端常用的节流和防抖动技术，他们是 JS 闭包和高阶函数的现实应用。
{% endblockquote %}