---
title: vue指令中寻找元素parentNode为null的问题（指令中钩子函数的运用）
date: 2019-01-23 12:20:59
categories:
- Vue
tags:
- Vue 指令
copyright:
---
## 引语
{% blockquote %}
在VUE中运用 VUE 指令，发现之前的写法存在问题，刷新页面后报错，先贴代码， 再看报错
{% endblockquote %}

{% codeblock lang:javascript %}
// 权限指令
Vue.directive('has', {
    bind: function (el, binding) {
        if (el.parentNode && !Vue.prototype.$_has(binding.value)) {
            el.parentNode.removeChild(el)
        }
    }
})
{% endcodeblock %}

{% blockquote %}
只要刷新页面会出现如下问题：
![刷新页面报错展示](null-error.png "刷新页面报错")
{% endblockquote %}
<!-- more --> 
## 猜测并寻找出现报错的原因

{% blockquote %}
看到这样的报错就顺藤摸瓜到这个VUE指令中，初步猜想是 函数中 el 元素未找到，但实际则是 el 元素的父节点 el.parentNode 未找到，值为 null，于是写如下代码验证自己的猜测
{% endblockquote %}

{% codeblock lang:javascript %}
// 权限指令
Vue.directive('has', {
    bind: function (el, binding) {
        console.log(el.parentNode)
        if (el.parentNode && !Vue.prototype.$_has(binding.value)) {
            el.parentNode.removeChild(el)
        }
        setTimeout(() => {
            console.log(el.parentNode)
        }, 2000)
    }
})
{% endcodeblock %}

{% blockquote %}
结果是这样的：
![测试结果展示](test.png "测试结果")

进而验证了我的猜测
{% endblockquote %}

## 寻找解决方案
{% blockquote %}
经过百度查阅资料，终于恍然大悟，这篇文章说到点上了
[vue指令与$nextTick 操作DOM的不同之处](https://segmentfault.com/a/1190000015860475)
或许这篇文章跟我要解决的不是一个问题，但是已经写的很明了，把关键的地方摘抄到这：
{% endblockquote %}

### vue指令
{% blockquote %}
钩子函数

一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。

inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。

update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。

componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。

unbind：只调用一次，指令与元素解绑时调用。

{% endblockquote %}

### 最为关键的一句，解决问题的关键
{% blockquote %}
inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
{% endblockquote %}

## 更改后的代码为
{% codeblock lang:javascript %}
// 权限指令
Vue.directive('has', {
    inserted: function (el, binding) {
        if (el.parentNode && !Vue.prototype.$_has(binding.value)) {
            el.parentNode.removeChild(el)
        }
    }
})
{% endcodeblock %}

{% blockquote %}
总结：如果当前节点刚刚被建立,还没有被插入到DOM树中,则该节点的parentNode属性会返回null.

此时，完美解决问题。所以在用任何东西之前都熟读文档是很有必要的，免得出现问题像我这样绕一大圈
{% endblockquote %}