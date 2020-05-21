---
title: 通过例子解释防抖动和节流
subtitle: debounce and throttle
categories:
  - JavaScript
tags:
  - JavaScript
keywords: 
  - Animation
  - Debounce
  - Events
  - Throttle
  - JavaScript
copyright: true
top: false
password: sanks
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
date: 2020-05-20 23:40:45
---

## 译文说明
{% blockquote %}
作者：David Corbacho
原文链接：https://css-tricks.com/debouncing-throttling-explained-examples/
{% endblockquote %}

## 引言

{% blockquote %}
<span style="font-style: italic">以下是伦敦前端工程师 [David Corbacho](https://twitter.com/dcorbacho) 的客座文章。我们已经[之前讨论过这个主题](https://css-tricks.com/the-difference-between-throttling-and-debouncing/)，但是这次，David将通过交互式演示来讲解这些概念，使事情变得非常清楚。</span>
{% endblockquote %}

{% blockquote %}
<span style="font-weight: bolder">Debounce</span> 和 <span style="font-weight: bolder">throttle</span> 是两种类似(但不同的!)的技术，用于控制我们允许一个函数在一段时间内执行多少次。
{% endblockquote %}

{% blockquote %}
在将函数附加到DOM事件时，具有函数的防抖动或节流的版本尤其有用。为什么呢?因为我们在事件和函数的执行之间给了自己一个控制层。请记住，我们不控制这些DOM事件的发出频率。它可以变化。
{% endblockquote %}

{% blockquote %}
例如，让我们讨论一下滚动事件。看这个例子：
{% endblockquote %}

<p class="codepen" data-height="257" data-theme-id="dark" data-default-tab="result" data-user="dcorb" data-slug-hash="PZOZgB" style="height: 257px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Scroll events counter">
  <span>See the Pen <a href="https://codepen.io/dcorb/pen/PZOZgB">
  Scroll events counter</a> by Corbacho (<a href="https://codepen.io/dcorb">@dcorb</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

{% blockquote %}
当使用触控板、滚动轮或仅仅通过拖动滚动条滚动时，每秒可以轻松触发30个事件。但在我的测试中，在智能手机上缓慢滚动(调换)可能会每秒触发多达100个事件。您的滚动处理程序是否为这种执行速度做好了准备?
{% endblockquote %}

{% blockquote %}
2011年，Twitter网站上出现了一个问题:当你向下滚动你的Twitter feed时，它变得缓慢和没有响应。John Resig发表了[一篇关于这个问题的文章](http://ejohn.org/blog/learning-from-twitter)，文中解释了将开销大的函数直接附加到<span class="sanks-keywords">滚动</span>事件是多么糟糕的想法。
{% endblockquote %}

{% blockquote %}
John提出的解决方案(五年前)是在<span class="sanks-keywords">onScroll事件</span>之外，每250ms运行一次循环。这样处理程序就不会耦合到事件。使用这个简单的技术，我们可以避免破坏用户体验。
{% endblockquote %}

{% blockquote %}
如今，处理事件的方式稍微复杂了一些。让我来介绍一下Debounce, Throttle, 和requestAnimationFrame。我们还会看到匹配用例。
{% endblockquote %}

## Debounce

{% blockquote %}
Debounce技术允许我们在一个调用中“分组”多个连续调用。
{% endblockquote %}

![Example of a debounce](debounce.png "Example of a debounce")

{% blockquote %}
想象你在电梯里。门开始关上，突然另一个人试图上电梯，电梯没有开始它的功能去换楼层，门又开了。现在这种情况再次发生在另一个人身上。电梯推迟了它的功能(移动楼层)，但优化了它的资源。
{% endblockquote %}

{% blockquote %}
你自己尝试一下。点击或移动按钮上方的鼠标:
{% endblockquote %}

<p class="codepen" data-height="391" data-theme-id="dark" data-default-tab="result" data-user="dcorb" data-slug-hash="KVxGqN" style="height: 391px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Debounce. Trailing">
  <span>See the Pen <a href="https://codepen.io/dcorb/pen/KVxGqN">
  Debounce. Trailing</a> by Corbacho (<a href="https://codepen.io/dcorb">@dcorb</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

{% blockquote %}
你可以看到连续快速的事件是如何由单个已删除的事件表示的。但如果这些事件是由巨大的差距引发的，那么 debouncing 就不会发生。
{% endblockquote %}

### Leading edge (or “immediate”)

{% blockquote %}
你可能会发现，在触发函数执行之前，debouncing 事件会一直等待，直到如此快速的事件停止执行。为什么不立即触发函数执行，让它的行为就与原始的非debouncing 处理程序完全相同?除非快速调用暂停，否则不会激发处理函数。
{% endblockquote %}

{% blockquote %}
你也可以这样做!下面是一个带着<span class="sanks-keywords">Leading</span>标志的例子:
{% endblockquote %}

![Example of a “leading” debounce](debounce-leading.png "Example of a “leading” debounce")

{% blockquote %}
在 underscore.js 里，该选项被称为 <span class="sanks-keywords">immediate</span> 而不是 <span class="sanks-keywords">leading</span>
{% endblockquote %}

{% blockquote %}
自己尝试一下吧:
{% endblockquote %}

<p class="codepen" data-height="391" data-theme-id="dark" data-default-tab="result" data-user="dcorb" data-slug-hash="GZWqNV" style="height: 391px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Debounce. Leading">
  <span>See the Pen <a href="https://codepen.io/dcorb/pen/GZWqNV">
  Debounce. Leading</a> by Corbacho (<a href="https://codepen.io/dcorb">@dcorb</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

### Debounce Implementations

{% blockquote %}
我第一次看到debounce在JavaScript中实现是在 2009年 [John Hann 的文章](http://unscriptable.com/2009/03/20/debouncing-javascript-methods/)中(他也创造了这个术语) 。
{% endblockquote %}

{% blockquote %}
不久之后，Ben Alman创建了一个[jQuery插件](http://benalman.com/projects/jquery-throttle-debounce-plugin/)(不再维护)，一年后，Jeremy Ashkenas将其[添加到underscore.js](https://github.com/jashkenas/underscore/commit/9e3e067f5025dbe5e93ed784f93b233882ca0ffe)中。后来，它被添加到Lodash中， 完全替代了underscore。
{% endblockquote %}

{% blockquote %}
3种实现在内部有点不同，但它们的接口几乎是相同的。
{% endblockquote %}

{% blockquote %}
曾经有一段时间，underscore 从Lodash中采用了debounce/throttle实现，在2013年我在<span class="sanks-keywords">_.debounce</span>函数中[发现一个错误](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)后，从那时起，这两种实现就分道扬镳了。
{% endblockquote %}

{% blockquote %}
Lodash为它的 <span class="sanks-keywords">_.debounce</span> 和 <span class="sanks-keywords">_.throttle</span> 添加了更多的功能。原来的 <span class="sanks-keywords">immediate</span> 标志被替换为<span class="sanks-keywords">leading</span> 和 <span class="sanks-keywords">trailing</span> 选项。你可以选择一个，或者两个都选。默认情况下，只启用了<span class="sanks-keywords">trailing</span> 。
{% endblockquote %}

{% blockquote %}
新的<span class="sanks-keywords">maxWait</span>选项(目前只在Lodash中)不在本文中介绍，但它非常有用。实际上，正如您在lodash源代码中看到的，使用<span class="sanks-keywords">_.debounce</span>和<span class="sanks-keywords">maxWait</span>定义了<span class="sanks-keywords">throttle</span>函数。
{% endblockquote %}

### Debounce Examples

#### Resize Example

{% blockquote %}
在调整(桌面)浏览器窗口的大小时，它们可以在拖动“调整大小”操控时，会发出许多 <span class="sanks-keywords">resize</span> 事件。
{% endblockquote %}

{% blockquote %}
在这个演示中，自己尝试一下
{% endblockquote %}

<p class="codepen" data-height="257" data-theme-id="dark" data-default-tab="result" data-user="dcorb" data-slug-hash="XXPjpd" style="height: 257px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Debounce Resize Event Example">
  <span>See the Pen <a href="https://codepen.io/dcorb/pen/XXPjpd">
  Debounce Resize Event Example</a> by Corbacho (<a href="https://codepen.io/dcorb">@dcorb</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

{% blockquote %}
如你所见，我们使用了resize事件的默认 <span class="sanks-keywords">trailing</span> 选项，因为我们只对最终值感兴趣，即用户停止调整浏览器的大小之后。
{% endblockquote %}

#### 在带有Ajax请求的自动完成表单中输入

{% blockquote %}
为什么要在用户仍在输入的情况下，每隔50毫秒向服务器发送一次Ajax请求呢? <span class="sanks-keywords">_.debounce</span>可以帮助我们避免额外的工作，并且只在用户停止输入时发送请求。
{% endblockquote %}

{% blockquote %}
在这里，把<span class="sanks-keywords">leading</span>标志位打开是没有意义的。我们要等到最后一个字母打完。
{% endblockquote %}

<p class="codepen" data-height="257" data-theme-id="dark" data-default-tab="result" data-user="dcorb" data-slug-hash="mVGVOL" style="height: 257px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Debouncing keystrokes Example">
  <span>See the Pen <a href="https://codepen.io/dcorb/pen/mVGVOL">
  Debouncing keystrokes Example</a> by Corbacho (<a href="https://codepen.io/dcorb">@dcorb</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

{% blockquote %}
类似的用例是等待用户停止输入后再验证输入。“您的密码太短”类型的消息。
{% endblockquote %}

## 如何使用 debounce 和throttle，和常见的陷阱

{% blockquote %}
创建自己的debounce/throttle函数，或者从一些随机的博客文章中复制它，这可能很诱人。<span style="font-weight: bolder">我的建议是直接使用underscore 或Lodash。</span>如果你只需要<span class="sanks-keywords"> _.debounce</span> 和 <span class="sanks-keywords">_.throttle</span>函数，您可以使用Lodash自定义生成器来输出一个自定义的2KB缩小库。用这个简单的命令构建它:
{% endblockquote %}

{% codeblock %}
npm i -g lodash-cli
lodash include = debounce, throttle
{% endcodeblock %}

{% blockquote %}
也就是说，大多数人使用模块形式“lodash/throttle”和“lodash/debounce” 或“lodash”。或者带有“webpack/browserify/rollup" 的 “lodash/throttle" 和 “lodash.debounce" 软件包。
{% endblockquote %}

{% blockquote %}
一个常见的陷阱是多次调用<span class="sanks-keywords">_.debounce</span>函数：
{% endblockquote %}

{% codeblock %}
// WRONG
$(window).on('scroll', function() {
   _.debounce(doSomething, 300); 
});

// RIGHT
$(window).on('scroll', _.debounce(doSomething, 200));
{% endcodeblock %}

{% blockquote %}
为debounce函数创建一个变量将允许我们调用私有方法<span class="sanks-keywords">debounced_version.cancel()</span>，如果你需要它的话，该方法可在lodash和underscore.js中获得。
{% endblockquote %}

{% codeblock %}
var debounced_version = _.debounce(doSomething, 200);
$(window).on('scroll', debounced_version);

// If you need it
debounced_version.cancel();
{% endcodeblock %}

## Throttle

{% blockquote %}
通过使用<span class="sanks-keywords">_.throttle</span>，我们不允许函数每X毫秒执行一次以上。
{% endblockquote %}

{% blockquote %}
这与debouncing 的主要区别是，throttle保证定期执行该函数，至少每X毫秒执行一次。
{% endblockquote %}

{% blockquote %}
和debounce一样，throttle 技术也被Ben的plugin, underscore.js和lodash所涵盖。
{% endblockquote %}

### Throttling 示例

#### 无限滚动

{% blockquote %}
一个很常见的例子。用户向下滚动无限滚动页面。您需要检查用户离底部有多远。如果用户接近底部，我们应该通过Ajax请求更多内容并将其附加到页面中。
{% endblockquote %}

{% blockquote %}
在这里，我们热衷的 <span class="sanks-keywords">_.debounce</span>是没有用的。只有当用户停止滚动时才会触发。我们需要在用户到达底部<span style="font-style: italic">之前</span>开始获取内容。
用<span class="sanks-keywords">_.throttle</span>我们可以保证我们不断地检查我们离底部有多远。
{% endblockquote %}

<p class="codepen" data-height="607" data-theme-id="dark" data-default-tab="result" data-user="dcorb" data-slug-hash="eJLMxa" style="height: 607px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Infinite scrolling throttled">
  <span>See the Pen <a href="https://codepen.io/dcorb/pen/eJLMxa">
  Infinite scrolling throttled</a> by Corbacho (<a href="https://codepen.io/dcorb">@dcorb</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>

## requestAnimationFrame (rAF)

{% blockquote %}
<span class="sanks-keywords">requestAnimationFrame</span>是另一种限速（rate-limiting）函数执行的方法。
{% endblockquote %}

{% blockquote %}
它可以被认为是一个<span class="sanks-keywords">_.throttle(dosomething, 16)</span>。但它的保真度要高得多，因为它是一个浏览器原生API，目标是更好的精确度。
{% endblockquote %}

{% blockquote %}
我们可以使用rAF API，作为throttle 功能的替代，考虑到这些利弊:
{% endblockquote %}

{% blockquote %}
利：
- 目标是60fps(16毫秒的帧)，但内部将决定如何安排渲染的最佳时间。
- 相当简单和标准的API，未来不会改变。更少的维护。
{% endblockquote %}

{% blockquote %}
弊：
-	rAFs的启动/取消是我们的责任，不像内部管理的<span class="sanks-keywords">.debounce</span>或<span class="sanks-keywords">.throttle</span>
-	如果浏览器选项卡不活动，它就不会执行。不过对于滚动、鼠标或键盘事件，这并不重要。
- 尽管所有的现代浏览器都支持rAF，但IE9、Opera Mini和老Android仍然不支持。时至今日，仍然[需要]我们增加(https://caniuse.com/#feat=requestanimationframe)[一个polyfill](https://www.paulirish.com/2011/requestanimationframe-for-smart-animating/) 。
- node.js中不支持rAF。因此，你不能在服务器上使用它来控制文件系统事件。
{% endblockquote %}

{% blockquote %}
根据经验，如果您的JavaScript函数是“绘制”或直接动画属性，我将使用<span class="sanks-keywords">requestAnimationFrame</span>，在所有涉及重新计算元素位置的情况下使用它。
{% endblockquote %}

{% blockquote %}
要发出Ajax请求，或者决定是否添加/删除一个类(这会触发CSS动画)，我将考虑<span class="sanks-keywords">_.debounce</span>或<span class="sanks-keywords">_.throttle</span>，您可以在这里设置更低的执行速率(例如，200ms，而不是16ms)
{% endblockquote %}

{% blockquote %}
如果您认为rAF可以在underscore 或lodash中实现，那么它们都拒绝了这个想法，因为它是一个专门的用例，而且很容易直接调用。
{% endblockquote %}

### Examples of rAF
{% blockquote %}
受[Paul Lewis文章](https://www.html5rocks.com/en/tutorials/speed/animations/)的启发，我将只讨论这个示例，以便在滚动中使用requestAnimation框架，在这篇文章中，他一步一步地解释了这个示例的逻辑。
{% endblockquote %}

{% blockquote %}
在16ms的情况下，我将它和 <span class="sanks-keywords">_.throttle</span>放在一起比较。提供类似的性能，但是rAF可能会在更复杂的场景中提供更好的结果。
{% endblockquote %}

<p class="codepen" data-height="331" data-theme-id="dark" data-default-tab="result" data-user="dcorb" data-slug-hash="pgOKKw" style="height: 331px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Scroll comparison requestAnimationFrame vs throttle">
  <span>See the Pen <a href="https://codepen.io/dcorb/pen/pgOKKw">
  Scroll comparison requestAnimationFrame vs throttle</a> by Corbacho (<a href="https://codepen.io/dcorb">@dcorb</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

{% blockquote %}
我在headroom.js库中看到过这种技术的更高级的例子。在这里，[逻辑被解耦](https://github.com/WickyNilliams/headroom.js/blob/3282c23bc69b14f21bfbaf66704fa37b58e3241d/src/Debouncer.js)并封装在一个对象中。
{% endblockquote %}

## 总结
{% blockquote %}
使用<span class="sanks-keywords">debounce</span>、<span class="sanks-keywords">throttle</span>和<span class="sanks-keywords">requestAnimationFrame</span>来优化事件处理程序。每种技术略有不同，但这三种技术都是有用的，并且相互补充。
{% endblockquote %}

概括的说：
- <span style="font-weight: bolder">debounce</span>： 将突然发生的一系列事件(如击键)组合成一个事件。
- <span style="font-weight: bolder">throttle</span>:  保证每X毫秒执行一次。比如每隔200毫秒检查一次滚动位置，以触发CSS动画。
- <span style="font-weight: bolder">requestAnimationFrame</span>:  一个节流的选择。当你的函数在屏幕上重新计算和渲染元素，你想要保证平滑的变化或动画。注意:不支持IE9。

***

## 个人补充：

### 防抖动（debounce）：

{% blockquote %}
所谓的抖动就是浏览器频繁布局时，由于算力不足导致的页面颤动现象。防抖动就是利用类似于节流的手段——无视短时间内重复回调，避免浏览器发生抖动现象的技术。
{% endblockquote %}

{% blockquote %}
比较常见的抖动场景是在 auto index 的搜索设计上；当我们在搜索框内输入不同索引时，页面会频繁计算索引并渲染列表，以致产生抖动。但事实上在这类场景里，有价值的请求只会发生在用户停止输入后，通俗来说就是用户输入过程中的字符串不必当真。
{% endblockquote %}

### 节流（throttle）：

{% blockquote %}
节流指的都是某个函数在一定时间间隔内只执行第一次回调。
{% endblockquote %}

### 总结：

{% blockquote %}
前端常用的节流和防抖动技术，他们是 JS 闭包和高阶函数的现实应用。
{% endblockquote %}