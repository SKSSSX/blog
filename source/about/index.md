---
layout: about
title: 盛克思简介
date: 2018-09-17 08:46:50
comments: false
---
<!--<div style="color: red" align="center">盛克思简介</div>-->

## About me
{% blockquote %}
13年3月从事前端开发至今
{% endblockquote %}

## 现研究方向
{% blockquote %}
现研究mock.js(模拟接口请求)，eslint + prettier(语法检查和格式化工具)，来辅助vue-cli3项目的开发
项目还在努力维护中，为保证功能完善，给大家铺路。
{% endblockquote %}

## 2019
自己决定重新调整自己在前端领域的发展方向，这些年总是跟着新技术往前看（这个宗旨是没什么问题），但是前端最基础的知识点，时间过去很久，已经记忆模糊了，才发觉自己这些年是有些舍本逐末了，决定抽出一定的时间温习一下前端最基础的知识和研究一下各类框架的源码。

### 2019-03-05
1. 接下来就是思考自己的项目结构了
{% blockquote @歌特式灵魂摆渡人 https://www.jianshu.com/p/eb7d518b05b8 %}
如果你刚开始一个项目，不要花超过五分钟在选择一个文件结构上。从以上方法（或者你自己想到的）中任意挑一个然后开始编程吧！在写完一些真实的代码之后，你可能会想重新考虑它。
{% endblockquote %}

2. 发现更改目录结构后，相对路径的名字写起来很麻烦，想跟以前VUE项目一样，src 路径 以 别名 "@" 代替
我们可以通过使用 webpack 中的 resolve.alias 配置别名，将某些文件目录配置成固定的引入。
例如： 我们可以将 ../../src 这样的相对路径的目录，设置成一个 @ 别名， 以后就可以用 @ 代替这个目录引入就行了，而不需要写一坨 ../../../
{% codeblock %}
const path = require('path');

module.exports = {
    ...
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    },
    ...
};
{% endcodeblock %}
3. 给React项目添加TypeScript支持, 请参阅[给React项目添加TypeScript支持](https://www.jianshu.com/p/3c939aa8ba78), 多少跟实际项目有些出入，需要灵活变通，与官网的配置结合看最佳。熟悉webpack配置和总览生成项目的配置后，我发现已经对TypeScript支持
注：TypeScript 官网 有 [React & Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html) 这篇教程，但是有需要改进的地方, 比如 ts-loader 比 awesome-typescript-loader 打包速度更快， 构建项目大多数用 ts-loader, 详见[Speed of Awesome-typescript-loader vs ts-loader](https://github.com/s-panferov/awesome-typescript-loader/issues/497) 
同时，当天发现react项目存在的问题就是 package.json 文件中，没有开发环境依赖和生产环境依赖的区分，把所有的依赖全部写入到了<span style="color: #fe2c23">生产依赖</span>中，如下
{% codeblock package.json %}
{
  "name": "jelly3",
  "version": "0.2.0",
  "private": true,
  "dependencies": {
    "@babel/core": "7.2.2",
    "@svgr/webpack": "4.1.0",
    "babel-core": "7.0.0-bridge.0",
    "babel-eslint": "9.0.0",
    "babel-jest": "23.6.0",
    "babel-loader": "8.0.5",
    "babel-plugin-named-asset-import": "^0.3.1",
    "babel-preset-react-app": "^7.0.1",
    "bfj": "6.1.1",
    "case-sensitive-paths-webpack-plugin": "2.2.0",
    "css-loader": "1.0.0",
    "dotenv": "6.0.0",
    "dotenv-expand": "4.2.0",
    "eslint": "5.12.0",
    "eslint-config-react-app": "^3.0.7",
    "eslint-loader": "2.1.1",
    "eslint-plugin-flowtype": "2.50.1",
    "eslint-plugin-import": "2.14.0",
    "eslint-plugin-jsx-a11y": "6.1.2",
    "eslint-plugin-react": "7.12.4",
    "file-loader": "2.0.0",
    "fork-ts-checker-webpack-plugin-alt": "0.4.14",
    "fs-extra": "7.0.1",
    "html-webpack-plugin": "4.0.0-alpha.2",
    "identity-obj-proxy": "3.0.0",
    "jest": "23.6.0",
    "jest-pnp-resolver": "1.0.2",
    "jest-resolve": "23.6.0",
    "jest-watch-typeahead": "^0.2.1",
    "mini-css-extract-plugin": "0.5.0",
    "optimize-css-assets-webpack-plugin": "5.0.1",
    "pnp-webpack-plugin": "1.2.1",
    "postcss-flexbugs-fixes": "4.1.0",
    "postcss-loader": "3.0.0",
    "postcss-preset-env": "6.5.0",
    "postcss-safe-parser": "4.0.1",
    "react": "^16.8.3",
    "react-app-polyfill": "^0.2.1",
    "react-dev-utils": "^7.0.3",
    "react-dom": "^16.8.3",
    "resolve": "1.10.0",
    "sass-loader": "7.1.0",
    "style-loader": "0.23.1",
    "terser-webpack-plugin": "1.2.2",
    "url-loader": "1.1.2",
    "webpack": "4.28.3",
    "webpack-dev-server": "3.1.14",
    "webpack-manifest-plugin": "2.0.4",
    "workbox-webpack-plugin": "3.6.3"
  },
  "scripts": {
    "start": "node scripts/start.js",
    "build": "node scripts/build.js",
    "test": "node scripts/test.js"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ],
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts"
    ],
    "resolver": "jest-pnp-resolver",
    "setupFiles": [
      "react-app-polyfill/jsdom"
    ],
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}"
    ],
    "testEnvironment": "jsdom",
    "testURL": "http://localhost",
    "transform": {
      "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
      "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
      "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
    },
    "transformIgnorePatterns": [
      "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
      "^.+\\.module\\.(css|sass|scss)$"
    ],
    "moduleNameMapper": {
      "^react-native$": "react-native-web",
      "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy"
    },
    "moduleFileExtensions": [
      "web.js",
      "js",
      "web.ts",
      "ts",
      "web.tsx",
      "tsx",
      "json",
      "web.jsx",
      "jsx",
      "node"
    ],
    "watchPlugins": [
      "E:\\Study\\jelly3\\node_modules\\jest-watch-typeahead\\filename.js",
      "E:\\Study\\jelly3\\node_modules\\jest-watch-typeahead\\testname.js"
    ]
  },
  "babel": {
    "presets": [
      "react-app"
    ]
  }
}
{% endcodeblock %}
根据我以往的经验，把这些依赖进行了拆解，分成开发依赖（devDependencies，其中大部分是开发依赖）和 生产依赖 （dependencies）
最新的 package.json 相关配置，请参考我的 github [jelly3](https://github.com/SKSSSX/jelly3/blob/master/package.json)
4. .tsx 文件中引入的 webpack 别名，TS语法检查报错的问题，详见[一次解决React+TypeScript+Webpack 别名（alias）找不到问题的过程](https://yq.aliyun.com/articles/623179)
### 2019-03-04
开始深入研究reactjs，弥补之前的浅尝辄止；一开始自己用官方的项目生成器生成了一个简单的架构，自己从这个简化版逐步加入babel, webpack, eslint 等相关的配置，有兴趣的朋友可以移步 [react的基础之上进行引入webpack、eslint、babel的框架搭建](https://github.com/SKSSSX/jelly2), 但是你仔细阅读react项目下的 <span style="color: #fe2c23">READEME.md</span>, 你就会发现我绕了远路，其实react提供了 npm run reject 来注入webpack, eslint, label 等相关依赖和配置，可能这就是react给大家提供的 <span style="color: #fe2c23">脚手架</span> 吧，<span style="color: #fe2c23">需要注意的是：这个命令只能执行一次，而且不可逆转。</span>
### 2019-02-25 
为博客每篇文章（包括首页）也显示字数统计和阅读时长， Nginx 优化配置 - Gzip 压缩, 博文分享换成addthis。
### 2019-02-22
为博客加入了百度统计功能，实际的去观察网站访问情况
### 2019-02-15
为自己的博客网站进行了SEO，包括百度搜索和谷歌搜索，并加入了相关的站点地图，在hexo中添加百度主动推送功能, 每次部署主动推送一次
### 2019-02-09
把自己的博客成功迁移到自己服务器上，配置了git远程资源库，配置nginx ：能够用https协议访问博客地址，强制http转https协议访问博客，http://shengkesi.cn -> https://shengkesi.cn    http://www.shengkesi.cn -> https://www.shengkesi.cn
### 2019-01-27
服务器部署gitlab失败后，自己在家测试了一下ping自己的博客的github地址，和ping自己的服务器对比了一下，发现github的延迟132ms,而且丢包；自己的服务器74ms，毅然决定把自己的博客网站迁移到自己的服务器上，一开始弄了FTP，但是有些舍近求远了；发现其实自己在服务器端搭建跟本地一样的开发环境即可，只是多了ngnix的安装和配置。
### 2019-01-25
趁着工作午休时间，把自己博客的评论功能加上了，并填了首页插入的图片不显示的问题的坑。
### 2019-01-24
经过折腾了linux安装docker, 并且在docker内装了jenkins后，感觉缺点什么，想弄个GitLab，在服务器存储自己的代码。
踩坑开始，经过层层扒坑埋坑的过程，总算把GitLab建立起来了，但是访问是502页面。
最后找到原因：由于服务配置太低（CPU 1核，内存2GB），无法满足Gitlab的（CPU 2核，内存4GB）的要求，页面报502，踩坑结束。
## 2018
{% blockquote %}
研究vue2.0 VUEX状态管理机制 webpack 等
{% endblockquote %}