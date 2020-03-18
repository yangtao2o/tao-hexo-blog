---
title: 实践|学习制作一个简易日历
date: 2016-08-03 18:16:21
tags:
- Html
categories:
- Html
---

> 整理入坑学习记录

<!--more-->

## 动态效果图 GIF 图片

![示例图GIF](http://img1.sycdn.imooc.com/57a42f40000123ac01040336.gif)

## 先写 html 的 body 部分代码

```html
<div id="tabs" class="calender">
  <ul>
    <li class="active">
      <h2>1</h2>
      <p>JAN</p>
    </li>
    <li>
      <h2>2</h2>
      <p>FER</p>
    </li>
    <li>
      <h2>3</h2>
      <p>MAR</p>
    </li>
    <li>
      <h2>4</h2>
      <p>APR</p>
    </li>
    <li>
      <h2>5</h2>
      <p>MAY</p>
    </li>
    <li>
      <h2>6</h2>
      <p>JUN</p>
    </li>
    <li>
      <h2>7</h2>
      <p>JUL</p>
    </li>
    <li>
      <h2>8</h2>
      <p>AUG</p>
    </li>
    <li>
      <h2>9</h2>
      <p>SEP</p>
    </li>
    <li>
      <h2>10</h2>
      <p>OCT</p>
    </li>
    <li>
      <h2>11</h2>
      <p>NOV</p>
    </li>
    <li>
      <h2>12</h2>
      <p>DEC</p>
    </li>
  </ul>
  <div class="text">
    <h2>1月活动</h2>
    <h4>一月小寒接大寒</h4>
  </div>
</div>
```

## 设置 css 样式

```css
body {
  background-color: #890;
}
#tabs {
  border: 10px solid #ccc;
  margin: 50px auto;
  width: 340px;
  background-color: #ddd;
  text-align: center;
}
#tabs ul li {
  float: left;
  list-style-type: none;
  width: 70px;
  height: 65px;
  border: 4px solid #588;
  margin: 5px;
  background-color: #222;
  color: white;
  line-height: 8px;
}
/*
** css样式设置与.active有冲突时，
** 优先级id>class
** 细化选择符
*/
#tabs .active {
  color: #c66;
  background-color: #fff;
}
.text {
  clear: both;
  margin: 10px 40px;
  background-color: #eee;
  padding: 2px;
  line-height: 14px;
}
```

## javascript 代码

```js
window.onload = function() {
  var array = [
    "一月小寒接大寒",
    "二月立春雨水连",
    "惊蛰春分在三月",
    "清明谷雨四月天",
    "五月立夏和小满",
    "六月芒种夏至连",
    "七月大暑和小暑",
    "立秋处暑八月间",
    "九月白露接秋分",
    "寒露霜降十月全",
    "立冬小雪十一月",
    "大雪冬至迎新年"
  ];
  // 这里定义oDiv.get...是为了定义className作用对象是id为tabs下的所有div文本
  var oDiv = document.getElementById("tabs");
  var aLi = oDiv.getElementsByTagName("li");
  var oTxt = oDiv.getElementsByTagName("div")[0];
  for (var i = 0; i < aLi.length; i++) {
    // 定义一个index属性对aLi进行编号
    aLi[i].index = i;
    aLi[i].onmouseover = function() {
      // 这里是相对于未被点击的部分的样式
      for (var i = 0; i < aLi.length; i++) {
        aLi[i].className = "";
      }
      this.className = "active";
      // 通过之前的index编号绑定指定的div文本
      oTxt.innerHTML =
        "<h2>" +
        (this.index + 1) +
        "月活动</h2><h4>" +
        array[this.index] +
        "</h4>";
    };
  }
};
```

## 完整代码

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>简易日历</title>
    <style type="text/css">
      body {
        background-color: #890;
      }
      #tabs {
        border: 10px solid #ccc;
        margin: 50px auto;
        width: 340px;
        background-color: #ddd;
        text-align: center;
      }
      #tabs ul li {
        float: left;
        list-style-type: none;
        width: 70px;
        height: 65px;
        border: 4px solid #588;
        margin: 5px;
        background-color: #222;
        color: white;
        line-height: 8px;
      }

      #tabs .active {
        color: #c66;
        background-color: #fff;
      }
      .text {
        clear: both;
        margin: 10px 40px;
        background-color: #eee;
        padding: 2px;
        line-height: 14px;
      }
    </style>
    <script type="text/javascript">
      window.onload = function() {
        var array = [
          "一月小寒接大寒",
          "二月立春雨水连",
          "惊蛰春分在三月",
          "清明谷雨四月天",
          "五月立夏和小满",
          "六月芒种夏至连",
          "七月大暑和小暑",
          "立秋处暑八月间",
          "九月白露接秋分",
          "寒露霜降十月全",
          "立冬小雪十一月",
          "大雪冬至迎新年"
        ];

        var oDiv = document.getElementById("tabs");
        var aLi = oDiv.getElementsByTagName("li");
        var oTxt = oDiv.getElementsByTagName("div")[0];
        for (var i = 0; i < aLi.length; i++) {
          aLi[i].index = i;
          aLi[i].onmouseover = function() {
            for (var i = 0; i < aLi.length; i++) {
              aLi[i].className = "";
            }
            this.className = "active";
            oTxt.innerHTML =
              "<h2>" +
              (this.index + 1) +
              "月活动</h2><h4>" +
              array[this.index] +
              "</h4>";
          };
        }
      };
    </script>
  </head>
  <body>
    <div id="tabs" class="calender">
      <ul>
        <li class="active">
          <h2>1</h2>
          <p>JAN</p>
        </li>
        <li>
          <h2>2</h2>
          <p>FER</p>
        </li>
        <li>
          <h2>3</h2>
          <p>MAR</p>
        </li>
        <li>
          <h2>4</h2>
          <p>APR</p>
        </li>
        <li>
          <h2>5</h2>
          <p>MAY</p>
        </li>
        <li>
          <h2>6</h2>
          <p>JUN</p>
        </li>
        <li>
          <h2>7</h2>
          <p>JUL</p>
        </li>
        <li>
          <h2>8</h2>
          <p>AUG</p>
        </li>
        <li>
          <h2>9</h2>
          <p>SEP</p>
        </li>
        <li>
          <h2>10</h2>
          <p>OCT</p>
        </li>
        <li>
          <h2>11</h2>
          <p>NOV</p>
        </li>
        <li>
          <h2>12</h2>
          <p>DEC</p>
        </li>
      </ul>
      <div class="text">
        <h2>1月活动</h2>
        <h4>一月小寒接大寒</h4>
      </div>
    </div>
  </body>
</html>
```