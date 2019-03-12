---
title: react的基础之上进行引入webpack、eslint、babel的框架搭建
subtitle: create-react-app-simple
categories:
  - React
tags:
  - React
keywords: React
copyright: true
top: false
date: 2019-03-04 15:13:00
photos:
  - /create-react-app-simple/logo.svg
---
### 引言
{% blockquote %}
开始深入研究reactjs，弥补之前的浅尝辄止；一开始自己用官方的项目生成器生成了一个简单的架构，自己从这个简化版逐步加入babel, webpack, eslint 等相关的配置，有兴趣的朋友可以移步 [react的基础之上进行引入webpack、eslint、babel的框架搭建](https://github.com/SKSSSX/jelly2), 但是你仔细阅读react项目下的 <span style="color: #fe2c23">READEME.md</span>, 你就会发现我绕了远路，其实react提供了 yarn eject 来注入webpack, eslint, label 等相关依赖和配置，可能这就是react给大家提供的 <span style="color: #fe2c23">脚手架</span> 吧

{% note danger %} 
需要注意的是：这个命令只能执行一次，而且不可逆转。
{% endnote %}

虽说自己饶了远路，但是还是学到些东西的，也温习了一些 webpack，babel 的配置和原理等，想亲自动手，亲自实践的朋友按照如下步骤进行就行，我已经为你们绕过了一些坑
比如：babel 升级 6.x 到 7.x, 请参阅 [babel 7.x 和 webpack 4.x 配置vue项目](https://www.jianshu.com/p/e21d19875fbb), 如果以下步骤有什么不妥之处，欢迎大家给我评论，我会及时修正并回复大家的问题。
{% endblockquote %}
<!-- more -->
### 创建项目的流程
1. npx create-react-app jelly
   备注：你的环境没有全局安装npx，放心，它会自动安装上并执行创建项目的命令
2. cd jelly 切换到自己创建项目根目录下
3. 导入 react-dom 、react-router-dom 、 redux 、 react-redux 、lodash 依赖包
   yarn add react-dom react-router-dom redux react-redux lodash
4. 安装 Webpack, 现在最流行的模块打包工具
   yarn add webpack webpack-cli webpack-dev-server webpack-merge --dev
5. 安装一些必要的 Webpack 打包插件 和 eslint
   yarn add html-webpack-plugin copy-webpack-plugin css-loader file-loader eslint babel-eslint --dev
6. 安装Babel, 可以把ES6转换为ES5，注意Babel最新的V6版本分为babel-cli和babel-core两个模块，这里只需要用babel-core即可
   yarn add @babel/core --dev
7. 安装其他的babel依赖
   yarn add @babel/polyfill @babel/runtime @babel/plugin-transform-runtime @babel/preset-env @babel/preset-react --dev
8. 安装 cross-env ， cross-env能跨平台地设置及使用环境变量
   yarn add cross-env --dev
9. 打开 package.json , 添加或者修改下面的命令脚本
    {% codeblock package.json %}
        "scripts": {
            "start": "cross-env NODE_ENV=development webpack-dev-server --cache --colors --profile --progress -d",
            "build": "cross-env NODE_ENV=production webpack --cache --colors --profile --progress --hide-modules"
        }
    {% endcodeblock %}
10. 命令行输入 yarn start 将要启动 webpack dev server.
   命令行输入 yarn build 将会进行生产环境打包.
11. 要想成功用webpack打包，还需要 webpack.config.js 和 webpack.ini.js , .babelrc