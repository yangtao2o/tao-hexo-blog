---
title: 使用flex设置可横向滑动方法
date: 2021-02-25 23:41:43
tags:
  - CSS
  - flex
categories:
  - CSS
---

> 主要用到了 flex 属性，在需要滑动的盒子上，设置为 flex 弹性布局，并设置 flex-wrap 属性为不换行 nowrap（默认属性），顺便可以设置 align-items 属性定义项目在交叉轴上如何对齐。

<!--more-->

## 布局

```html
<div class="box">
  <div class="box-item">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
    <div class="item">6</div>
    <div class="item">7</div>
    <div class="item">8</div>
    <div class="item">9</div>
    <div class="item">10</div>
  </div>
</div>
```

```css
.box .box-item {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 50px;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  background-color: #f60;
}

.box .box-item .item {
  // 如果需要item自身的大小，则 flex: none;
  flex: 0 0 100px;
  text-align: center;
  box-sizing: border-box;
  border-right: 1px solid #ccc;
}

// 删除滚动条
::-webkit-scrollbar {
  display: none;
}
```

## flex 使用规则

主要用到了 flex 属性，在需要滑动的盒子上，设置为 flex 弹性布局，并设置 flex-wrap 属性为不换行 nowrap（默认属性），顺便可以设置 align-items 属性定义项目在交叉轴上如何对齐。

然后设置 overflow 以及 white-space（段落中的文本不进行换行） 等常规属性。

截止目前，子类 item 会被挤在一行，如何让他们拿到自己宽度呢，那 flex 三件套来了，语法：

```css
.item {
  flex: none | [ < 'flex-grow' > < 'flex-shrink' >? || < 'flex-basis' > ];
}
```

### flex-grow 放大比例

flex-grow 属性定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大。flex-grow 属性都为 1，则它们将等分剩余空间（如果有的话）。

### flex-shrink 缩小比例

flex-shrink 属性定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。flex-shrink 属性为 0，则不缩小。

### flex-basis

flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 auto，即项目的本来大小。

### flex

flex 属性是 flex-grow, flex-shrink 和 flex-basis 的简写，默认值为`0 1 auto`，后两个属性可选。

该属性有两个快捷值：`auto (1 1 auto)`（自适应）和 `none (0 0 auto)`（不放大也不缩小）

## 参考资料

- [横向超出滚动，隐藏滚动条，可滑动](https://blog.csdn.net/weixin_34355559/article/details/88900607)
- [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
