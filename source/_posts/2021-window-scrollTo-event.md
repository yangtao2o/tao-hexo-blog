---
title: 使用 window.scrollTo 实现页面滑动
date: 2021-02-25 23:49:10
tags:
  - JavaScript
categories:
  - Web
---

> `window.scrollTo(x-coord, y-coord)` 滚动到文档中的某个坐标。

<!--more-->

## 语法

三个属性：

- `clientHeight`：元素客户区的大小，指的是元素内容及其边框所占据的空间大小（经过实践取出来的大多是视口大小）
- `scrollHeight`: 滚动大小，指的是包含滚动内容的元素大小（元素内容的总高度）
- `offsetHeight`: 偏移量，包含元素在屏幕上所用的所有可见空间（包括所有的内边距滚动条和边框大小，不包括外边距

`window.scrollTo(x-coord, y-coord)` 滚动到文档中的某个坐标。该函数实际上和 window.scroll 是一样的。

```js
// 设置滚动行为改为平滑的滚动
window.scrollTo({
  top: 1000,
  behavior: 'smooth'
})
```

## 使用

### 滚动到页面底部

```js
let timer = null
const scrollBottom = () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    const scrollHeight = document.body.scrollHeight
    window.scrollTo({ top: scrollHeight, left: 0, behavior: 'smooth' })
  }, 100)
}
```

### 计算对应元素点击滑动

```js
let timer = null
const scrollBottom = () => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    const target = document.getElementById('communityWrap')
    const header = document.querySelector('.header-wrap')
    const scrollHeight = target.offsetTop - header.clientHeight - 20
    window.scrollTo({ top: scrollHeight, left: 0, behavior: 'smooth' })
  }, 100)
}
```

## 附：兼容

```js
/*视口的大小，部分移动设备浏览器对innerWidth的兼容性不好，需要
 *document.documentElement.clientWidth或者document.body.clientWidth
 *来兼容（混杂模式下对document.documentElement.clientWidth不支持）。
 *使用方法 ： getViewPort().width;
 */
function getViewPort() {
  if (document.compatMode == 'BackCompat') {
    //浏览器嗅探，混杂模式
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    }
  } else {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    }
  }
}
```

```js
//获得文档的大小（区别与视口）,与上面获取视口大小的方法如出一辙
function getDocumentPort() {
  if (document.compatMode == 'BackCompat') {
    return {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight
    }
  } else {
    return {
      width: Math.max(
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth
      ),
      height: Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.clientHeight
      )
    }
  }
}
```
