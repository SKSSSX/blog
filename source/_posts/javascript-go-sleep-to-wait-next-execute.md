---
title: 如何使js进入休眠或等待
subtitle: javascript go sleep to wait next execute
categories:
  - JavaScript
  - ES6
tags:
  - JavaScript
  - ES6
keywords: 
  - JavaScript
  - sleep
  - wait
copyright: true
top: false
date: 2020-08-22 09:32:38
---

## 引言

{% blockquote %}
在做react的转场动画时，偶然想得一个解决方案中，需要拦截 React-router4 中 Prompt 的操作时，想让进程休眠，来执行转场动画，遗憾的是没有成功，但是意外获得了新技能 - javascript的休眠方法
{% endblockquote %}

## 如何编写sleep函数

{% blockquote %}
不卖关子了，直接上代码，不过需要你自己去验证，<span class="sanks-keywords">正所谓授之以鱼不如授之以渔</span>
{% endblockquote %}
<!-- more -->
### 方法一
{% codeblock %}
function sleep(numberMillis: number) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime) return;
    }
}

function test() {
    console.log(new Date());
    console.time('sleep_times');
    sleep(1000);
    console.timeEnd('sleep_times');
    console.log(new Date());
}
test();
{% endcodeblock %}

{% blockquote %}
实际上，该例子不是使js脚本进入休眠，而是因为js是单线程，while(true){} 死循环调度执行,  使得 whlie(true){} 后面的程序被阻塞，从而实现休眠的假象。
{% endblockquote %}

### 方法二

{% blockquote %}
通过Promises，async 和 await 的功能，你可以编写一个 sleep2() 函数，该函数将按预期运行。

但是，你只能从 async 函数中调用此自定义 sleep2() 函数，并且需要将其与 await 关键字一起使用。
{% endblockquote %}

{% codeblock %}
function sleep2(time: number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time || 1000);
    });
}
async function test() {
    console.log(new Date());
    console.time('use_times');
    await sleep2(1000);
    console.timeEnd('use_times');
    console.log(new Date());
}
test();
{% endcodeblock %}

{% blockquote %}
此JavaScript sleep2() 函数的功能与预期的完全一样，因为 await 导致代码的同步执行暂停，直到Promise被resolve()为止。
{% endblockquote %}

{% blockquote %}
总结：以上两个方法请自行执行脚本，来看看执行的时间误差上有什么区别，哪个好就用哪个（最后还是卖了个关子）。
{% endblockquote %}