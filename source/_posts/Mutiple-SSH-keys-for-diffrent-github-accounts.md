---
title: Mutiple SSH keys for diffrent github accounts
subtitle: Mutiple SSH keys for diffrent github accounts
categories:
  - JavaScript
tags:
  - JavaScript
keywords: JavaScript
copyright: true
top: false
date: 2020-01-05 20:01:31
---
## create different public key
{% blockquote %}
create different ssh key according to your need
Note: blog's SSH-KEY is global, others is in your project
{% endblockquote %}

{% codeblock %}
$ ssh-keygen -t rsa -f ~/.ssh/id_rsa_activehacker -C "your_email@youremail.com"
$ ssh-keygen -t rsa -f ~/.ssh/id_rsa_jexchan -C "email@example.com"
{% endcodeblock %}

{% blockquote %}
运行上面那条命令后会让输入一个文件名，用于保存刚才生成的 SSH key 代码，如：
{% endblockquote %}

{% codeblock %}
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/azhen/.ssh/id_rsa): /Users/azhen/.ssh/id_rsa_user2
{% endcodeblock %}

{% blockquote %}
你可以不输入文件名，使用默认文件名，那么就会生成 id_rsa 和 id_rsa.pub 两个全局默认的秘钥文件，前者为私钥，后者为公钥。
当然我们有两个代码仓库，所以最好写上文件名，如id_rsa(公司)或id_rsa_user2(个人). 这样ssh目录下会生成id_rsa.pub和id_rsa_user2.pub两个文件
{% endblockquote %}

{% blockquote %}
接着又会提示你输入两次密码（该密码是你push文件的时候要输入的密码，而不是github管理者的密码）。也可以直接按回车键，那么push的时候就不需要输入密码，直接提交到github上了，如：
{% endblockquote %}

{% codeblock %}
Enter passphrase (empty for no passphrase): 
# Enter same passphrase again:
{% endcodeblock %}

{% blockquote %}
当你看到下面这段代码的时候，那就说明，SSH key 已经创建成功，只需要添加到github的SSH key上就可以了。
{% endblockquote %}

{% codeblock %}
Your identification has been saved in /c/Users/you/.ssh/id_rsa.
# Your public key has been saved in /c/Users/you/.ssh/id_rsa.pub.
# The key fingerprint is:
# 70:e2:e5:25:06:6c:0b:1a:b1:73:69:18:3a:b4:f4:a2 your_email@example.com
{% endcodeblock %}

{% blockquote %}
2 keys created at:
{% endblockquote %}

{% codeblock %}
~/.ssh/id_rsa_activehacker
~/.ssh/id_rsa_jexchan
{% endcodeblock %}

{% blockquote %}
then, add these two keys as following(添加到 ssh-agent 信任列表)
{% endblockquote %}

{% codeblock %}
$ ssh-add ~/.ssh/id_rsa_activehacker
$ ssh-add ~/.ssh/id_rsa_jexchan
{% endcodeblock %}

{% blockquote %}
请注意：此处有坑，你可能会遇到这样的问题
{% endblockquote %}

{% codeblock %}
Could not open a connection to your authentication agent.
{% endcodeblock %}

{% blockquote %}
解决方案：（也可以是其他的，参考资料里边stackoverflow里边的答案你都可以试试）
{% endblockquote %}

{% codeblock %}
$ ssh-agent bash
{% endcodeblock %}

{% blockquote %}
这之后，再添加。看到如下所示的情况，就证明添加成功了
{% endblockquote %}

{% codeblock %}
$ ssh-add ~/.ssh/id_rsa_activehacker
Identity added: /c/Users/dong/.ssh/id_rsa_activehacker (/c/Users/dong/.ssh/id_rsa_activehacker)
{% endcodeblock %}

## 添加ssh-key到github
{% blockquote %}
在 Github 的后台，可以看到一个叫做 SSH and GPG keys 的选项：
![SSH and GPG keys](github-setting.png "SSH and GPG keys")
这里面列出了当前账号绑定的 SSH Key。 每一个 key 对应一台独立的设备。
{% endblockquote %}

{% blockquote %}
设置好两个ssh key之后就要配置下它们的使用场景
登录你的github账号，从右上角的设置（ Settings ）进入，然后点击菜单栏的 SSH key 进入页面添加 SSH key。
点击 Add SSH key 按钮添加一个 SSH key 。把你复制的 SSH key 代码粘贴到 key 所对应的输入框中，记得 SSH key 代码的前后不要留有空格或者回车。当然，上面的 Title 所对应的输入框你也可以输入一个该 SSH key 显示在 github 上的一个别名。
{% endblockquote %}

## Modify the ssh config
{% codeblock %}
$ cd ~/.ssh/
$ touch config
$ subl -a config
{% endcodeblock %}

{% blockquote %}
Then added
{% endblockquote %}

{% codeblock %}
#activehacker account
Host github.com-activehacker
	HostName github.com
	User git
	IdentityFile ~/.ssh/id_rsa_activehacker

#jexchan account
Host github.com-jexchan
	HostName github.com
	User git
	IdentityFile ~/.ssh/id_rsa_jexchan
{% endcodeblock %}

{% blockquote %}
这里的Host名称一定不能起github.com 或者 gitlab.com 不然如果对于hexo博客来说，设置的全局git账户就会到这个文件去找对应的SSH-key，然后就会报无权限推送代码的问题
{% endblockquote %}

## Clone you repo and modify your Git config

{% blockquote %}
clone your repo
比如我们图中的 git@github.com:azhen1/lerna-demo.git。 我们需要对它稍作加工，把域名部分替换成我们在 config 中配置的 Host： git@github.azhen1:azhen1/lerna-demo.git。
{% endblockquote %}

{% codeblock %}
	$ git clone git@github.com-activehacker:activehacker/gfs.git gfs_jexchan
{% endcodeblock %}

{% blockquote %}
这样本地仓库就和对应的密钥建立起了联系。 以后的操作中，都会自动使用这个 SSH key 来访问 Github 远程仓库了。 如果想同时在另外一个本地仓库使用其他 Github 账户，只需要在 ~/.ssh/config文件中配置好相应的 SSH key 和对应的 Host，就可以了。
{% endblockquote %}

{% blockquote %}
cd gfs_jexchan and modify git config
{% endblockquote %}

{% codeblock %}
	$ git config user.name "jexchan"
	$ git config user.email "jexchan@gmail.com" 
 
	$ git config user.name "activehacker"
	$ git config user.email "jexlab@gmail.com" 
{% endcodeblock %}

{% blockquote %}
then use normal flow to push your code
{% endblockquote %}

{% codeblock %}
	$ git add .
	$ git commit -m "your comments"
	$ git push
{% endcodeblock %}


