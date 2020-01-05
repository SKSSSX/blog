---
layout: about
title: sanks简介
date: 2018-09-17 08:46:50
comments: false
---
<!--<div style="color: red" align="center">sanks简介</div>-->

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
自己决定重新调整自己在前端领域的发展方向，努力拓展自己未涉及的领域。
### 2019-05-04
利用周六日的闲暇时间，填了搭建react + typescript 的一些坑，框架已经成型，项目中想到的，需要的配置都有了；好的前端框架搭建是做一个可维护，可拓展项目的基础，不会给以后接手的程序员带来麻烦。
### 2019-03-10
几天的努力之下，自己的react项目总算成型，决定新建一个“发布”分支，以供以后开发用。
### 2019-03-04
开始深入研究reactjs，弥补之前的浅尝辄止；一开始自己用官方的项目生成器生成了一个简单的架构，自己从这个简化版逐步加入babel, webpack, eslint 等相关的配置，有兴趣的朋友可以移步 [react的基础之上进行引入webpack、eslint、babel的框架搭建](https://github.com/SKSSSX/jelly2), 但是你仔细阅读react项目下的 <span style="color: #fe2c23">READEME.md</span>, 你就会发现我绕了远路，其实react提供了 npm run eject 来注入webpack, eslint, label 等相关依赖和配置，可能这就是react给大家提供的 <span style="color: #fe2c23">脚手架</span> 吧，<span style="color: #fe2c23">需要注意的是：这个命令只能执行一次，而且不可逆转。</span>
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