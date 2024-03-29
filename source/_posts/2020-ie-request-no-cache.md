---
title: IE11 浏览器请求缓存解决方案
date: 2020-12-15 23:16:09
tags:
  - http
  - 浏览器
categories:
  - Web
---

> `Cache-Control: no-cache`：在发布缓存副本之前，强制要求缓存把请求提交给原始服务器进行验证(协商缓存验证)

<!--more-->

## 问题

一般情况下，浏览器第一次向服务器发起该请求后拿到请求结果，会根据响应报文中 HTTP 头的缓存标识，决定是否缓存结果，是则将请求结果和缓存标识存入浏览器缓存中。

第一次请求成功，返回 Status Code 为 200，之后就会出现，有时 200，有时 304

但是在基于 IE 的浏览器，get 请求成功之后，Status Code 始终返回 304，这时候由于各个浏览器缓存机制的不同，会导致数据不同步的情况。

## 项目背景

- 基于 Next 构建的项目，部分内容使用自带路由
- 服务端已做跨域处理
- 主要出现在列表与列表详情操作之后返回，IE 下它们之间数据不同步的情况

## 解决方案

基于服务端已做跨域处理，我们可以添加请求头，将缓存策略设置一致。我们在全局拦截器（如 umi-request）里设置如下：

```js
const request = extend({
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache' // 兼容 IE11
  }
  // ... other configs
})
```

`Cache-Control: no-cache`：在发布缓存副本之前，强制要求缓存把请求提交给原始服务器进行验证(协商缓存验证)

谷歌浏览器这样设置本身没什么问题，但是 IE 还需要添加一项`Pragma: no-cache`，与 `Cache-Control: no-cache` 效果一致。强制要求缓存服务器在返回缓存的版本之前将请求提交到源头服务器进行验证。

查阅[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Pragma)可知，`Pragma` 是一个在 `HTTP/1.0` 中规定的通用首部，这个首部的效果依赖于不同的实现，所以在“请求-响应”链中可能会有不同的效果。它用来向后兼容只支持 `HTTP/1.0` 协议的缓存服务器，那时候 `HTTP/1.1` 协议中的 `Cache-Control` 还没有出来。

## 验证

目前 IE11 已保持一致。

## 参考资料

- [IE 浏览器中 Get 请求方式有缓存的问题](https://blog.csdn.net/qq_26941173/article/details/84935421)
- [彻底理解浏览器的缓存机制（http 缓存机制）](https://www.cnblogs.com/chengxs/p/10396066.html)
