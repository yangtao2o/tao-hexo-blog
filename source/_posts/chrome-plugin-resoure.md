---
title: macOS 如何查看 chrome 插件源码
date: 2020-07-01 22:43:28
tags:
---

> 主要通过 `chrome://extensions/`、`chrome://versions`

<!--more-->

## 第一步

- 页面输入：`chrome://extensions/`

- 找到【开发者模式】，并打开

- 找到需要查询的插件，这时候就可以看到 ID 了，比如：

```
ID：kfjggehkabeloleficlmkkcpeogoiagb
```

## 第二步

- 页面输入：`chrome://versions`
- 找到个【人资料路径】，比如我的路径： `/Users/apple/Library/Application Support/Google/Chrome/Default`

## 第三步

- 在我的路径下找到 Extensions 并进入，比如我的完整路径：`/Users/apple/Library/Application Support/Google/Chrome/Default/Extensions`
- 然后这里才是插件包的归属地，根据开发模式下的插件 ID，可以找到对应插件包源码

## 参考资料

- [手把手教你如何查看 chrome 插件源码(手把手教你系列一)](https://blog.csdn.net/CatTail2012/article/details/8168025?utm_medium=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase)
