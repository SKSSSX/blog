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
date: 2019-05-18 18:26:14
---
{% blockquote %}
写这篇文章的目的就是告诉前端的同学们，ES6 已经是前端程序员必不可少的技能之一，后期再追加 Typescript 的新语法
{% endblockquote %}

### 关键字 async/await 的应用
{% blockquote %}
1. async function 是 Promise 的语法糖封装
2. 异步编程的终极方案 - 以同步的方式写异步
  - await 关键字可以 “暂停” async function 的执行
  - await 关键字可以以同步的写法获取 Promise 的执行结果
  - try-catch 可以获取 await 所得到的错误
3. 一个穿越事件循环存在的 function
{% endblockquote %}

<!-- more -->
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

{% blockquote %}
<span style="color: #fe2c23">重点：vue 中 this.$nextTick() 也会返回一个promise，也可用 async/await，这在工作中很有用，解决一些组件不刷新数据的问题。例如：</span>
{% endblockquote %}

{% codeblock %}
async publishFn(name) {
    this.isShowDiseaseTagsMessage = false;
    await this.$nextTick(() => {
      this.isShowDiseaseTagsMessage = (this.queryModel.diseaseTags && this.queryModel.diseaseTags.length === 0)
    })
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

### ES5和ES6中分别是怎么判断变量为数组的

{% blockquote %}
JS的弱类型机制导致判断变量类型，类型检查很重要，为编码的首要检索入口
{% endblockquote %}

#### 在ES5中判断变量是否为数组

{% codeblock %}
var a = []; 
// 1.基于instanceof 
a instanceof Array; 
// 2.基于constructor 
a.constructor === Array; 
// 3.基于Object.prototype.isPrototypeOf 
Array.prototype.isPrototypeOf(a); 
// 4.基于getPrototypeOf 
Object.getPrototypeOf(a) === Array.prototype; 
// 5.基于Object.prototype.toString 
Object.prototype.toString.apply(a) === '[object Array]';
{% endcodeblock %}

{% blockquote %}

以上，除了Object.prototype.toString外，其它方法都不能正确判断变量的类型。

要知道，代码的运行环境十分复杂，一个变量可能使用浑身解数去迷惑它的创造者。且看：

{% endblockquote %}

{% codeblock %}
var a = {
    __proto__: Array.prototype
}; 
// 分别在控制台试运行以下代码 
// 1.基于instanceof 
a instanceof Array; // => true 
// 2.基于constructor 
a.constructor === Array; // => true 
// 3.基于Object.prototype.isPrototypeOf 
Array.prototype.isPrototypeOf(a); // => true 
// 4.基于getPrototypeOf 
Object.getPrototypeOf(a) === Array.prototype; // => true
{% endcodeblock %}

{% blockquote %}
以上，4种方法将全部返回true，为什么呢？我们只是手动指定了某个对象的__proto__属性为Array.prototype，便导致了该对象继承了Array对象，这种毫不负责任的继承方式，使得基于继承的判断方案瞬间土崩瓦解。

不仅如此，我们还知道，Array是堆数据，变量指向的只是它的引用地址，因此每个页面的Array对象引用的地址都是不一样的。iframe中声明的数组，它的构造函数是iframe中的Array对象。如果在iframe声明了一个数组x，将其赋值给父页面的变量y，那么在父页面使用y instanceof Array ，结果一定是false的。�而最后一种返回的是字符串，不会存在引用问题。实际上，多页面或系统之间的交互只有字符串能够畅行无阻。
{% endblockquote %}

{% blockquote %}
当检测Array实例时, Array.isArray 优于 instanceof,因为Array.isArray能检测iframes.
{% endblockquote %}

{% codeblock %}
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
xArray = window.frames[window.frames.length-1].Array;
var arr = new xArray(1,2,3); // [1,2,3]

// Correctly checking for Array
Array.isArray(arr);  // true
// Considered harmful, because doesn't work though iframes
arr instanceof Array; // false
{% endcodeblock %}

#### 在ES6中判断变量是否为数组

{% blockquote %}
鉴于数组的常用性，在ES6中新增了Array.isArray方法，使用此方法判断变量是否为数组，则非常简单，如下
{% endblockquote %}

{% codeblock %}
Array.isArray([]); // => true 
Array.isArray({0: 'a', length: 1}); // => false
{% endcodeblock %}

{% blockquote %}
实际上，通过Object.prototype.toString去判断一个值的类型，也是各大主流库的标准。因此Array.isArray的polyfill通常长这样：假如不存在 Array.isArray()，则在其他代码之前运行下面的代码将创建该方法。
{% endblockquote %}

{% codeblock %}
if (!Array.isArray){ 
  Array.isArray = function(arg){ 
    return Object.prototype.toString.call(arg) === '[object Array]'; 
  };
}
{% endcodeblock %}