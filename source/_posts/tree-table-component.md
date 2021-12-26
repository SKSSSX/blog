---
title: 树形表格组件
subtitle: tree-table-component
categories:
  - Vue
tags:
  - Vue
keywords:
  - tree table
  - 树形表格组件
  - Vue
  - vue-table
  - tree-grid
  - vue-component
  - vue-jsx
copyright: true
top: false
date: 2021-12-15 23:25:41
updated: 2021-12-16 00:23:45
---

{% note info %}
## 引言
{% endnote %}

{% blockquote %}
距离上一篇博客有一月有余了吧，对于写博客的目的而言，我其实就是为了抒发自己无处宣泄的技术主张，在编写组件的过程中，很多同事嘲笑我“沉迷于组件”，也有的人让我“拿来主义”，并逼迫产品修改设计的重要显示和功能，但是我认为一个合格的程序员真的不应该是当这样的程序员，我何尝不知道工期紧，任务重，虽说我是修改别人的组件实现的最终效果吧，但是我这起码是当躲不开“造轮子”环节的时候，依然迎难而上。
{% endblockquote %}
<!-- more -->
{% blockquote %}
说点题外话，没有谁是天生的技术大拿，只要你对技术这一行有兴趣，有不懈的动力，你一定会先人一步到达终点，好多人在这条路上半路放弃，或者对自己从事的工作出现疲态、厌倦的态度。
对于我自己，自己给自己的压力远胜于比人给的，不逼自己一把就不会有进步，任何人都可以对我失去信心或者加以否定，唯独自己不可以，否定自己那就永远不可能有进步了，就废了。
{% endblockquote %}

{% blockquote %}
回到正题，写这个博客的目的很简单，“轮子”我造完了，但是自己觉得还有优化的空间，先简要介绍下这个组件，后期把组件放到我自己的github上，而且我还要通知原作者，我要发表了；如果你看到这篇博客，恰巧这是你想要的效果，可以给我发邮件，我看到会及时的回复你，组件虽说有缺陷，但是我一定会优化好给大家用的，在后期大家提的 issues 中慢慢加强组件的健壮性。
{% endblockquote %}

{% note warning %}
## 参照的组件 - vue-table-with-tree-grid
{% endnote %}

{% blockquote %}
npm 资源库地址：https://www.npmjs.com/package/vue-table-with-tree-grid
github 地址：https://github.com/MisterTaki/vue-table-with-tree-grid
{% endblockquote %}

{% blockquote %}
我选择这个组件的原因有以下两点：
1. 这个组件可以源码下载，自己可以做出调整和修改
2. 这个组件是从iView 组件库中分离的，与 element-ui 组件库样式极为贴近
{% endblockquote %}

{% blockquote %}
这个组件缺少我想要的功能点：
1. 树形结构层级线展示（这正是我们公司产品迫切要求的）
2. 异步加载扩展行数据的功能，作者提供了很好的插槽，当然也可以自己监听这个展开事件进行异步获取数据并渲染，这也不是什么难事
3. 没有点击选中树节点的事件，并抛出（emit）给父组件；
4. 没有类似于 element-UI 中 Tree 组件的 “节点过滤” 功能；
{% endblockquote %}

{% blockquote %}
基于以上的业务需求点，目前组件唯独缺少的是第 4 点功能，我决定在最近的业余时间给加上
{% endblockquote %}

{% note success %}
## 你可能会想到的大组件 vxe-table
{% endnote %}

{% blockquote %}
组件演示地址：https://xuliangzhan_admin.gitee.io/vxe-table/#/table/base/basic
我不建议你们用这个大组件，因为里面的好多功能，并不是业务想得那个样子，
<span class="sanks-keywords">最主要的（敲黑板）是：</span> 截止本博客发表，它对我来说存在重大缺陷 - “线是断的” ，在 “扩展行” 这一级别，没有画它组件中说到的 “连接线”，而且样式不太美观吧，至于到现在（你看到这篇博客）有没有修补这个问题，请自行检验。
{% endblockquote %}


{% note primary %}
## 组件功能示意图
{% endnote %}
![演示示意图](example.gif "演示示意图")

{% note success %}
## 造好的轮子给你用
{% endnote %}

{% blockquote %}
github 地址：https://github.com/SKSSSX/vue-tree-table-with-line
npm 包地址：https://www.npmjs.com/package/vue-tree-table-with-line
{% endblockquote %}

{% note danger %} 
## 后续工作
{% endnote %}

{% blockquote %}
后期我要做到尽善尽美，没用的属性删掉，像 selected-node 这个属性，代码尽量做到清晰可读，供使用者进行很好的扩展。
{% endblockquote %}