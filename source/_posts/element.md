---
title: element-ui table展开行，设置type="expand"，如何添加表头？如何去掉展开按钮并设置成文字？
categories:
  - Element-UI
tags:
  - element-ui
keywords:
  - Element-UI
copyright: true
abbrlink: 44407
date: 2018-09-27 23:08:37

---

## 解决方案

{% blockquote %}
从项目的可维护和可扩展性考虑，还是改 element-ui 的源码，是最好的解决方案。
添加了了一个属性 look, 更改了展开行中的图标 ＞，如下图
{% endblockquote %}

![element-ui 表格展开行默认效果](element_table_expand.png "element-ui 表格展开行默认效果")

{% blockquote %}
表头 label 属性，源码本身就支持，用就可以了
用的时候这样用,如下:
改变了之后，变为文字，如下图
{% endblockquote %}

![element-ui 表格展开行修改后的效果](elment_table_expand_edit.jpg "element-ui 表格展开行修改后的效果")

## 用法

{% codeblock lang:html %}
<el-table-column label="操作" type="expand" look="查看">
</el-table-column>
{% endcodeblock %}

### 源代码文件夹替换替换

{% blockquote %}
将修改后的 lib 文件夹 替换掉你的 element-ui 中的 lib 文件夹, 路径：node-modules/element-ui
[点击下载](download/element-ui.zip)
{% endblockquote %}
