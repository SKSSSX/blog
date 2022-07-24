---
title: 前端框架设计及技术预研
subtitle: front end framework
categories:
  - Framework
tags:
  - Framework
keywords: 
  - Nodejs
  - Koa
  - GraphQL
  - MongoDB
  - JWT
  - TypeScript
  - serverless
copyright: true
# password: sanks_lock
# abstract: Welcome to my blog, enter password to read.
# message: Welcome to my blog, enter password to read.
top: false
date: 2020-06-25 19:38:37
---
{% note info %}
## 权限拓展
{% endnote %}

{% blockquote %}
针对以往的权限控制职能到达页面及按钮级别，结合nodeJS中间件（路由代理），做出了延伸到接口的权限控制，概要图如下所示：

![permission structure chart](permission.jpg "权限控制结构图")
<!--more-->
权限树结构：

{% endblockquote %}

{% codeblock %}
{
    "resultCode": 200,
    "resultJson":
    {
        "code": 0,
        "msg": null,
        "data": [
        {
            "id": 1000,
            "api": [
              "/api/token/getRefreshToken",
              "/api/login/phoneValidCode",
              "/api/login/imageValidCode",
              "/api/register/saveUser"
            ],
            "parentId": -1,
            "children": [],
            "name": "登录页",
            "path": "login",
            "sort": 0
        },
        {
            "id": 2000,
            "api": ["/api/register/isExistUser"],
            "parentId": -1,
            "children": [],
            "name": "注册页",
            "path": "register",
            "sort": 1
        },
        {
            "id": 3000,
            "api": [],
            "parentId": -1,
            "children": [],
            "name": "首页",
            "path": "home",
            "sort": 2
        },
        {
            "id": 4000,
            "api": [],
            "parentId": -1,
            "children": [
            {
                "id": 4100,
                "api": [],
                "parentId": 4000,
                "children": [],
                "name": "客户列表",
                "path": "list",
                "sort": 0
            },
            {
                "id": 4200,
                "api": [],
                "parentId": 4000,
                "children": [],
                "name": "客户详情",
                "path": "detail",
                "sort": 1
            }],
            "name": "客户",
            "path": "customer",
            "sort": 3
        }]
    },
    "resultMessage": "获取权限成功"
}
{% endcodeblock %}

{% blockquote %}
接口白名单配置：
{% endblockquote %}

{% codeblock %}
module.exports = {
    //免验证路由
    FreeRoute: [
        '/api/login/signIn',
        '/api/auth/resources', // 获取前台路由权限的接口
        '/api/login/phoneValidCode', // 获取手机验证码接口
        '/api/login/imageValidCode', // 获取图像验证码的接口
        '/api/register/saveUser' // 保存单个用户
    ]
};
{% endcodeblock %}

{% note warning %}
## JWT登录机制
{% endnote %}

{% blockquote %}
JWT我放在了Nodejs中间件层，JWT的实现原理如下图所示；

![jwt](jwt.png "JWT基本原理")
{% endblockquote %}

{% note success %}
## 工作流水线
{% endnote %}

{% blockquote %}
在这里我做一下简单的描述：
{% endblockquote %}

{% blockquote %}
前端代码请求接口->中间件路由代理层接到请求(GraphQL)->控制器层（controller）做逻辑判断等->从mongoDB数据中抓取数据

这一流水线的好处是可多处拆解，可抛弃最后两层，直接与后台接口对接；如果有可通过nodejs服务来存储一些简单的数据的话，可使用整个流程。
{% endblockquote %}

{% note primary %}
## 打印日志功能
{% endnote %}

{% blockquote %}
后台的服务通常都有日志输出和存储，为了查找项目开发过程中的问题，或者是上线后存在的性能瓶颈；nodejs服务我同样加入了日志打印功能。
{% endblockquote %}

{% blockquote %}
未完待续...
{% endblockquote %}