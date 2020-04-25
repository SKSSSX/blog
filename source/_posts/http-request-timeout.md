---
title: http request timeout
subtitle: http request timeout
categories:
  - axios
tags:
  - request
keywords: axios
copyright: true
top: false
date: 2020-04-13 09:24:58
password: 4
abstract: (2 << 1) & (8 >> 1)
message: (2 << 1) & (8 >> 1)
---

## 引语
{% blockquote %}
鉴于之前axios版本升级，去掉了baseUrl配置的问题，前端对于axios库的升级未做版本固定，导致项目启动报错；除了写成固定版本，还可以自己写一套请求响应机制。
{% endblockquote %}

<!-- more -->
## 方法一：Promise.race(timeout, request)
{% blockquote %}
顾名思义，Promse.race就是赛跑的意思，意思就是说，Promise.race([p1, p2, p3])里面哪个结果获得的快，就返回那个结果，不管结果本身是成功状态还是失败状态。
{% endblockquote %}
### 流程图
![Promise.race](Promise.race.png "Promise.race")

### 具体代码如下：
{% codeblock %}
timeoutPromise(timeout) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(new Response("timeout", {status: 504, statusText: "timeout "}));
      // reject(new Error('请求超时'))
      controller.abort();

      // 判断网络是否连接
      // TODO...
    }, timeout)
  });
}
{% endcodeblock %}

{% codeblock %}
wrapperRequest(request) {
  return Promise.race([this.timeoutPromise(10000), request])
    .then(resp => {
        return Promise.resolve(resp);
    })
    .catch(error => {
        return Promise.reject(error);
    });
}
{% endcodeblock %}

{% codeblock %}
get(url, querystring = {}, options = {}) {
  const getOptions = Object.assign(
    {
      method: HTTP_METHOD.GET,
      qs: querystring,
    },
    options
  );
  return this.wrapperRequest(this.sendRequest(url, getOptions));
}
{% endcodeblock %}

## 方法二：clearTimeout()

### 流程图
![timer](timer.png "timer")

### 具体代码如下：
{% codeblock %}
// Handle request timeout
if (options.timeout && !this.timer) {
  this.timer = setTimeout(function handleRequestTimeout() {
    // reject(new Error('请求超时'))
    controller.abort();
    reject(new Response("timeout", {status: 504, statusText: "timeout "}));

    // 判断网络是否连接
    // TODO...
  }, options.timeout);
}
{% endcodeblock %}

{% codeblock %}
return fetch(url, apiOptions).then(response => {
    // Response has been received so kill timer that handles request timeout
    clearTimeout(this.timer);
    this.timer = null;
})
{% endcodeblock %}

## 总结
{% blockquote %}
axios固然好用，但是我的宗旨是：自己动手，丰衣足食；自己写了网络请求响应模块，如果还需要其他功能，自己拓展，自己维护这个模块。
方法一是网上给出的解决方案，思路固然好，但是对于正常平添了一个请求（一定会执行timeout的逻辑），而且无法满足我后续监听网络是否断开的操作（这个模块已经实现），有兴趣的朋友可以给我发邮件，后续我会新增这个模块的博客。
方法二是借鉴axios的源码，对请求超时响应的处理
{% endblockquote %}