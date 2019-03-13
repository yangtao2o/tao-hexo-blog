---
title: 关于使用Hexo主题Yilia中碰到的问题一二
date: 2018-04-08 22:11:24
tags: 
- Hexo
categories:
- 博客
---

* 关于使用主题 [Yilia](https://github.com/litten/hexo-theme-yilia)的一些问题的集合地：[Issues](https://github.com/litten/hexo-theme-yilia/issues)

> 首推：[从零开始制作 Hexo 主题 ](http://www.ahonn.me/2016/12/15/create-a-hexo-theme-from-scratch/)

<!-- more -->
> Q1：主页如何截取文本长度？

* 在需要截断的位置使用 `<!-- More -->` 即可

> Q2：如何设置多个标签？

* `tags: [Hexo,Theme]`，参考[此处](https://www.zhihu.com/question/48934747/answer/113403121)

> Q3：更换主题的时候报错

* 一般是由于主题配置文件中的 `key: value`前后出现了空格，或者之间没有空格导致的 

> Q4：如何创建about等页面？如何创建自定义页面？

* `hexo new page "about"`
* 参考
	* [hexo的Next创建tags ](https://blog.csdn.net/lcyaiym/article/details/76762105?locationNum=5&fps=1)
	* [Hexo自定义页面的方法 ](https://refined-x.com/2017/07/10/Hexo%E8%87%AA%E5%AE%9A%E4%B9%89%E9%A1%B5%E9%9D%A2%E7%9A%84%E6%96%B9%E6%B3%95/)



> 其他

* 选择favicon：[easyicon](http://www.easyicon.net/language.zh-cn/)

![banner](/img/about-bg.jpg)