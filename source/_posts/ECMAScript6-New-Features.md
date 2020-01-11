---
title: ES6 的新特性
subtitle: ES6 在项目中的切实应用
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
date: 2019-05-18 18:26:14
---
{% blockquote %}
写这篇文章的目的就是告诉前端的同学们，ES6 已经是前端程序员必不可少的技能之一，后期再追加 Typescript 的新语法
{% endblockquote %}

### 关键字 async 与 await 的应用
{% blockquote %}
用 async/await 来处理异步请求, 从服务端获取数据，代码更简洁，其已被标准化，
用的最多的就是，当你后面的数据过滤整理操作，需要依赖于前面接口返回的数据时，此语法方便解决了此需求，
<span style="color: #fe2c23">注意：await 后面的函数必须返回一个promise</span>
想获取到async 函数的执行结果，就要调用promise的then 或catch 来给它注册回调函数（类同promise），代码如下：
{% endblockquote %}

{% codeblock %}
getTree() {
  return getRegionTree()
    .then(res => {
      this.interfaceData = res.data;
      this.interfaceData.name = "选择区域";
    })
    .catch(err => {
      console.log(err);
    });
},
async init(originArea, readonly) {
    await this.getTree();
    if (originArea) {
      originArea.name = "选择区域";
      let oldArray = this.handleEmptyTree([this.interfaceData], readonly);
      originArea = this.handleNotEmptyTree([originArea], readonly);
      this.handleLeafTree(originArea, oldArray);
    } else {
      this.region = this.handleEmptyTree([this.interfaceData]);
    }
  }
{% endcodeblock %}
### es6判断数组已存在某个对象。
{% blockquote %}
find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。否则返回-1。
{% endblockquote %}

{% codeblock %}
var objArr = [{id:1, name:'jiankian'}, {id:23, name:'anan'}, {id:188, name:'superme'}, {id:233, name:'jobs'}, {id:288, name:'bill', age:89}, {id:333}] ;
var ret2 = objArr.find((v) => {
    return v.id == 233;
});
console.log(ret2);
// return {id:233, name:'jobs'}
// 当返回undefined时，则说明objArr中没有，可以添加
{% endcodeblock %}

{% codeblock %}
var objArr = [{id:1, name:'jiankian'}, {id:23, name:'anan'}, {id:188, name:'superme'}, {id:233, name:'jobs'}, {id:288, name:'bill', age:89}, {id:333}] ;
var ret2 = objArr.findIndex((v) => {
    return v.id == 233;
});
console.log(ret2);
// return 3
// 当返回-1时，则说明objArr中没有，可以添加了
{% endcodeblock %}