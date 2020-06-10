---
title: 在 react 项目的基础上增加一些配置（typescript支持，webpack别名等）
subtitle: create-react-app-complex
categories:
  - React
tags:
  - React
  - TypeScript
keywords: React
copyright: true
top: false
password: sanks_lock
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
date: 2019-03-12 09:47:05
---
### 引言
{% blockquote %}
react脚手架并不能直接运用到项目中去，需要改造，自己进行了进一步探索，总结创建项目的心酸历程
{% endblockquote %}
### 创建项目的流程
{% blockquote %}
- npx create-react-app jelly3
   备注：你的环境没有全局安装npx，放心，它会自动安装上并执行创建项目的命令
- cd jelly3 切换到自己创建项目根目录下
- yarn eject
- yarn start 启动项目
{% endblockquote %}
<!--more-->
### 接下来就是思考自己的项目结构了
{% blockquote @歌特式灵魂摆渡人 https://www.jianshu.com/p/eb7d518b05b8 %}
如果你刚开始一个项目，不要花超过五分钟在选择一个文件结构上。从以上方法（或者你自己想到的）中任意挑一个然后开始编程吧！在写完一些真实的代码之后，你可能会想重新考虑它。
{% endblockquote %}
### 引入路径别名
{% blockquote %}
发现更改目录结构后，相对路径的名字写起来很麻烦，想跟以前VUE项目一样，src 路径 以 别名 "@" 代替
我们可以通过使用 webpack 中的 resolve.alias 配置别名，将某些文件目录配置成固定的引入。
例如： 我们可以将 ../../src 这样的相对路径的目录，设置成一个 @ 别名， 以后就可以用 @ 代替这个目录引入就行了，而不需要写一坨 ../../../
{% endblockquote %}

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

### 给React项目添加TypeScript支持
{% blockquote %}
请参阅[给React项目添加TypeScript支持](https://www.jianshu.com/p/3c939aa8ba78), 多少跟实际项目有些出入，需要灵活变通，与官网的配置结合看最佳。熟悉webpack配置和总览生成项目的配置后，我发现已经对TypeScript部分支持（未对.ts和.tsx进行webpack解析）
注：TypeScript 官网 有 [React & Webpack](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html) 这篇教程，但是有需要改进的地方, 比如 ts-loader 比 awesome-typescript-loader 打包速度更快， 构建项目大多数用 ts-loader, 详见[Speed of Awesome-typescript-loader vs ts-loader](https://github.com/s-panferov/awesome-typescript-loader/issues/497) 
{% endblockquote %}

### 加入代码语法格式检查工具
{% blockquote %}
eslint + tslint 并不能满足自己的代码洁癖，后又引入了prettier [vscode + prettier 专治代码洁癖](https://blog.csdn.net/anxin_wang/article/details/81234214)，经过艰苦的VSCode插件和配置文件的调试过程，代码检查机制总算配置好了。
{% endblockquote %}

### 解决相关的问题
{% blockquote %}
1. .tsx 文件中引入的 webpack 别名，TS语法检查报错的问题
详见[一次解决React+TypeScript+Webpack 别名（alias）找不到问题的过程](https://yq.aliyun.com/articles/623179)

2. 同时，当天发现react项目存在的问题就是 package.json 文件中，没有开发环境依赖和生产环境依赖的区分，把所有的依赖全部写入到了<span style="color: #fe2c23">生产依赖</span>中，如下

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
    "node-sass": "^4.12.0",
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
最新的 package.json 相关配置，请参考我的 github - [jelly3](https://github.com/SKSSSX/jelly3/blob/master/package.json)

3. typescript里面引入图片时，TS语法检查报错，项目没办法正常启动
参阅了(https://stackoverflow.com/questions/43638454/webpack-typescript-image-import?rq=1)，解决了这个问题。
{% endblockquote %}

### 为项目引入react-router(v4) 、antd-mobile
{% blockquote %}
yarn add react-router-dom
antd-mobile 请参照官网进行配置和引入，最好是按需加载
遇到的问题：
如果babel-plugin-import按需加载的js不符合tslint规范，怎么办？
修改 tslint 的语法检查配置
tsconfig.json 中添加   "allowSyntheticDefaultImports": true, // 允许模块没有默认导出
{% endblockquote %}
### 浏览器兼容问题---babel-polyfill
### 代码分割，路由动态加载（react-loadable）
{% blockquote %}
(react-loadable)[https://github.com/jamiebuilds/react-loadable]
{% endblockquote %}
### 高阶组件：路由守卫
{% blockquote %}
模拟VUE的路由守卫机制
{% endblockquote %}
### react按需引入(lodash)[https://www.cnblogs.com/savokiss/p/8514868.html]
### 定制antd-mobile主题
### vsCode安装函数注释插件（KoroFileHeader ）和git源代码管理插件（GitLens）、Import Cost、REST Client、vscode-icons
### 添加webpack对less和sass的解析配置