---
title: Hexo 插入图片
tags:
  - hexo
categories:
  - Hexo
keywords:
  - Hexo
abbrlink: 4746
password: sanks
abstract: Welcome to my blog, enter password to read.
message: Welcome to my blog, enter password to read.
date: 2019-02-09 14:13:18

---
### 引言
{% blockquote %}
图片资源放在本地 source/ 文件夹后，本地服务器浏览时图片正常显示，但部署到 github 上会找不到图片。
{% endblockquote %}

{% blockquote %}
究其原因，是图片路径出现问题。开始时自己在 source/ 文件夹下建了 assets 文件夹，专门用于存放文章相关的图片：
{% endblockquote %}

{% codeblock %}
source
    |- _posts
    |- assets
        |- images
            |- image-1.png
{% endcodeblock %}

{% blockquote %}
使用 markdown 引用图片的方式为
{% endblockquote %}

{% codeblock %}
![hexo image](../../assets/images/image-1.png)
{% endcodeblock %}

{% blockquote %}
查看结构，发现部署以后，图片会自动添加日期相关的文件结构目录：
{% endblockquote %}

{% blockquote %}
![This is an example image](hexo-1.png "This is an example image")
{% endblockquote %}

{% blockquote %}
而实际存放的目录是 http://www.shengkesi.cn/assets/images/image-1.png ，导致图片资源访问不到。
{% endblockquote %}

{% blockquote %}
为了解决这个问题查了很多资料，才知道原来除了本地存放图片，还可以使用图床。
{% endblockquote %}
<!-- more -->

### 图床
{% blockquote %}
所谓图床，就是储存图片的服务器，支持创建图片的对外链接地址便于引用。使用时只要引入图片的绝对地址就可以，方便简单。
{% endblockquote %}

{% blockquote %}
图床分为免费和收费的。无论是国内还是国外的免费图床都存在隐患，毕竟小本买卖，一旦停止服务，图片自然也就变成了小红叉。收费图床稳定一些，不管从服务还是稳定性上，都更推荐收费图床。
{% endblockquote %}

{% blockquote %}
目前大家推荐比较多的国内图床：

- 七牛云储存
新注册用户可免费使用 10G 存储空间。

- 极简图床
其实也是依赖七牛云储存账号的。
{% endblockquote %}

### 本地图片
{% blockquote %}
在本地存放图片的方法经过修改以后也可以完美使用。重点在于 _config.yml 文件中设置 <code>post_asset_folder: true</code>，开启资源文件夹功能，该功能支持用户通过相对路径标签引用资源。
{% endblockquote %}

{% blockquote %}
下面我们来看会发生什么。执行 <code>hexo new [layout] [title]</code>创建一篇新的文章，会发现 source/_posts 下自动生成了一个和 md 文件同名的目录（也可以自己手动创建），这就是用于存放与文章有关的图片文件夹。
{% endblockquote %}

{% blockquote %}
例如，我们想写一篇名为 hexo.md 的文章，执行 <code>hexo new "hexo"</code>，那么 _post 文件夹下的结构将是：
{% endblockquote %}

{% codeblock %}
_posts
    |- hexo.md
    |_ hexo
{% endcodeblock %}

{% blockquote %}
将相关的图片放入 hexo 文件夹
{% endblockquote %}

{% codeblock %}
_posts
    |- hexo.md
    |_ hexo
        |_ image-2.png
{% endcodeblock %}

{% blockquote %}
需要注意的是，使用该种方式在 markdown 文件中引用图片将<strong>不再</strong>使用 markdown 语法，而是使用标签插件引用相对路径，否则可能造成图片和其他资源显示不正确。引用语法如下：
{% endblockquote %}

```
{% asset_path slug %}
{% asset_img slug [title] %}
{% asset_link slug [title] %}
```


{% blockquote %}
在上述语法下，插入图片的方法：
{% endblockquote %}

```
{% asset_img image-2.png This is an example image %}
```

{% blockquote %}
查看页面，发现图片已经可以正常显示了，图片的路径和实际存放目录是一致的。
{% endblockquote %}

{% blockquote %}
![This is an example image](hexo-2.png "This is an example image")
{% endblockquote %}

{% blockquote %}
如果想使用 markdown 语法插入相对路径的图片，可以利用插件。设置 <code>post_asset_folder:true</code> 后，在根目录下执行：
{% endblockquote %}

{% codeblock %}
npm install https://github.com/CodeFalling/hexo-asset-image --save
{% endcodeblock %}

{% blockquote %}
确保在 source/_posts 下创建和 markdown 文件同名的目录，里面存放需要的图片，然后在 markdown 中插入图片：
{% endblockquote %}

{% codeblock %}
! [hexo image] (hexo/image-1.png)
{% endcodeblock %}

{% blockquote %}
生成的页面中图片引用路径
{% endblockquote %}

{% codeblock %}
<img src="/2019/02/10/hexo/image-1.png" alt="hexo image">
{% endcodeblock %}

{% blockquote %}
至此，用 markdown 完美实现本地图片插入。
{% endblockquote %}

{% blockquote %}
参考文档：
https://hexo.io/zh-cn/docs/asset-folders.html
{% endblockquote %}