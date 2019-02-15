---
title: Axios 执行多个并发请求(使用Promise解决多层异步调用)
subtitle: 使用Promise解决多层异步调用
categories:
  - Promise
tags:
  - promise
  - axios
  - ES6
  - 回调地狱
copyright: true
abbrlink: 39187
date: 2018-12-18 08:21:43
keywords:
---
## 引语

{% blockquote %}
场景：工作中遇到一个数据接口同时依赖于另外两个接口的情况,
需要两个接口返回的数据才能实现进一步操作，下面介绍 3 种方法
{% endblockquote %}

## 利用js回调嵌套的方式

{% codeblock lang:javascript %}
// 异步接口1: 科室列表
function getDepartmentsList(callback){
    //模拟实现
    var onlinePerson = Math.ceil(Math.random()*1000)
    setTimeout(function(){
        callback(onlinePerson)
    },Math.random()*1000)
}

// 异步接口2: 级别列表
function getLevelList(callback){
    //模拟实现
    var RegPerson = Math.ceil(Math.random()*1000)+1000
    setTimeout(function(){
        callback(RegPerson)
    },Math.random()*1000)
}

//异步接口，列表中科室和级别码转换成对应的中文，需要前两个接口的数据
function calOnlinePercent(onlinePerson,RegPerson,callback){
    //模拟实现
    var percent = Math.ceil(onlinePerson/RegPerson*100)
    setTimeout(function(){
        callback(percent)
    },Math.random()*1000)
}
{% endcodeblock %}
<!-- more --> 
## 利用es6的promise解决回调地狱问题

### 《ES6标准入门》对Promise的描述

所谓Promise，就是一个对象，用来传递异步操作的消息。它代表了某个未来才会知道的结果的事件（通常是一个异步操作），并且这个事件提供统一的API，可供进一步处理。

### MDN对Promise的描述：

{% blockquote %}
Promise 对象是一个代理对象（代理一个值），被代理的值在Promise对象创建时可能是未知的。它允许你为异步操作的成功和失败分别绑定相应的处理方法（handlers）。 这让异步方法可以像同步方法那样返回值，但并不是立即返回最终执行结果，而是一个能代表未来出现的结果的promise对象

当时看到Promise最头疼的，就是初学者看起来匪夷所思，也是最被js程序员广为称道的特性：then函数调用链。
then函数调用链，从其本质上而言，就是对多个异步过程的依次调用，本文就从这一点着手，对Promise这一特性进行研究和学习。
Promise的相关知识，请参阅 [Promise的链式调用](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises#%E9%93%BE%E5%BC%8F%E8%B0%83%E7%94%A8)
{% endblockquote %}

{% blockquote %}
基于以上对Promise的了解，我们知道可以使用它来解决多层回调嵌套后的代码蠢笨难以维护的问题。下面请看具体代码：
{% endblockquote %}

### 每个异步接口 返回一个promise对象

{% codeblock  lang:javascript %}
// 异步接口1: 科室列表
function getDepartmentsList(){
    //模拟
    return new Promise(function(resolve,reject){
        var onlinePerson = Math.ceil(Math.random()*1000)
        setTimeout(function(){
            resolve(onlinePerson)
        },Math.random()*1000)
    })
   
}
// 异步接口2: 级别列表
function getLevelList(){
    return new Promise(function(resolve,reject){
            var RegPerson = Math.ceil(Math.random()*1000)+1000
            setTimeout(function(){
                resolve(RegPerson)
            },Math.random()*1000)
            })
  
}
// 异步接口, 列表中科室和级别码转换成对应的中文，需要前两个接口的数据
function calOnlinePercent(onlinePerson,RegPerson){
    return new Promise(function(resolve,reject){ 
        var percent = Math.ceil(onlinePerson/RegPerson*100)
        setTimeout(function(){
            resolve(percent)
        },Math.random()*1000)
    })
}
{% endcodeblock %}

### 利用promise.all方法保证接口数据成功返回再执行操作
{% codeblock lang:javascript %}
Promise.all([getDepartmentsList(),getLevelList()]).then(function([onlinePerson,RegPerson]){
    //这里写等这两个ajax都成功返回数据才执行的业务逻辑
     calOnlinePercent(onlinePerson,RegPerson).then(function(percent){
        console.log(percent)
     })
})
{% endcodeblock %}

## Axios 解决方案(VUE)

### 每个异步接口 返回一个axios对象

{% codeblock lang:javascript %}
// 异步接口1: 科室列表
getDepartmentsList () {
    return axios.get(process.env.BASE_API_WAP + 'category/2');
},
// 异步接口2: 级别列表
getLevelList () {
    return axios.get(process.env.BASE_API_WAP + 'category/3');
}
{% endcodeblock %}

### 利用axios.all方法执行多个并发请求

{% codeblock lang:javascript %}
// 过滤数据函数
filterData (targetArray) {
    targetArray.forEach(item => {
        if (typeof item.meetingTime === 'number') {
            item.meetingTime = util.timestampFilter(item.meetingTime);
        }
        for (let key in this.departmentsList) {
            if (Number(item.departments) === this.departmentsList[key].id) {
                item.departments = this.departmentsList[key].name;
            }
        }
        for (let key in this.levelList) {
            if (Number(item.level) === this.levelList[key].id) {
                item.level = this.levelList[key].name;
            }
        }
    });
}

// 初始化
init () {
    this.title = '';
    registrationList(this.current, this.pageSize, this.title).then(data => {
        this.data = data.content;
        // 过滤数据
        this.filterData(this.data);
        this.totalSize = data.total;
        this.pages = data.pages;
    }).catch(error => {
        console.log(error);
    });
}

mounted () {
    // 执行多个并发请求, 列表中科室和级别码转换成对应的中文，需要前两个接口的数据
    let _this = this;
    axios.all([this.getDepartmentsList(), this.getLevelList()])
        .then(axios.spread(function (list1, list2) {
            _this.departmentsList = list1.data;
            _this.levelList = list2.data;
            // 两个请求现在都执行完成
            _this.init();
        }));
}
{% endcodeblock %}

## 总结
---
前端解决异步的问题时常都会遇到，Promise给前端程序员带来了新的解决思路，在它基础之上的promise的工具库（如Axios），也是在此上的封装。只要明白了其中的原理，在什么开发框架下都能灵活运用。