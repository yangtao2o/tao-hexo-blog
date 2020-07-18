---
title: 提升访问 Github 的访问速度及下载速度
date: 2020-07-18 20:28:55
tags:
- github 
- 开发工具
categories:
- 开发工具
---

> 主要通过 IP 来提升访问速度，通过 Gitlab 来提升下载速度

<!--more-->

## 提升访问速度

主要通过检测网址的访问速度，匹配对应的 IP 访问，实践之后，确实有明显提升。

首先进入这个网站 [http://tool.chinaz.com/dns](http://tool.chinaz.com/dns)，或者 [https://www.ipaddress.com/](https://www.ipaddress.com/)，查询以下几个地址：

```url
github.com
assets-cdn.github.com
github.global.ssl.fastly.net
```

找到 TTL 最小的那个值，记下他的 IP，并将此填入到 hosts 文件中：

```sh
sudo vim /etc/hosts
```

```sh
# Github speed
13.229.188.59 github.com
# 52.74.223.119 github.com
185.199.111.153 assets-cdn.github.com
151.101.229.194 github.global.ssl.fastly.net
```

## 提升下载速度

通过国内码云平台的转接，来完成 GitHub 上项目的下载加速。主要用于拉取比较大的项目，如果直接从 Github 克隆，那指定的是慢的难受。操作详情：[一招搞定 GitHub 下载加速！](https://zhuanlan.zhihu.com/p/112697807)

步骤：

- 点击码云上右上角新建仓库的加号+，选择【从 GitHub/GitLab 导入仓库】菜单
- 然后填写位于 GitHub 上你想 clone 的仓库地址并导入，避免 clone 时输入密码，可修改默认值（私库）为公共库
- 最后通过码云上的项目地址，将项目 clone 到本地
- 如果要提交代码，配置文件中的[remote "origin"].url 字段重新关联到原来位于 GitHub 上的 GitHub 项目地址

## 参考资料

- [提升访问 github 的访问速度](https://blog.csdn.net/qq_37598011/article/details/91385590)
- [一招搞定 GitHub 下载加速！](https://zhuanlan.zhihu.com/p/112697807)
