---
title: 实践|教你制作简易延时提示框
date: 2016-08-04 12:49:10
tags:
  - Html
categories:
  - Html
---

> 整理入坑学习记录

<!--more-->

### 动态效果图

![动态效果图](http://img1.sycdn.imooc.com/57a430ad00013c0702580240.gif)

### 第一步

分别使用点击事件 onmouseover 和 onmouseout,来设置 oDiv2 的属性，使之显示或隐藏；

```js
var oDiv1 = document.getElementById("div1");
var oDiv2 = document.getElementById("div2");
oDiv1.onmouseover = function() {
  oDiv2.style.display = "block";
};
oDiv1.onmouseout = function() {
  oDiv2.style.display = "none";
};
```

### 第二步

设置 oDiv2 延时 1 秒后再消失，并且设置一个变量 timer 把它存起来;

```js
var timer = null;
oDiv1.onmouseout = function() {
  timer = setTimeout(function() {
    oDiv2.style.display = "none";
  }, 1000);
};
```

### 第三步

当鼠标移到 oDiv2 的时候，由于延时一秒后会消失，所以这时要清除定时器；

```js
oDiv2.onmouseover = function() {
  clearTimeout(timer);
};
```

### 第四步

当鼠标离开 oDiv2 的时候，我们在 oDiv1 和 oDiv2 之间来来回回徘徊时，会有一瞬间的频闪，所以，这里也要设置当鼠标离开 oDiv2 时来个定时器；

```js
oDiv2.onmouseout = function() {
  timer = setTimeout(function() {
    oDiv2.style.display = "none";
  }, 1000);
};
```

### 第五步

当鼠标从 oDiv2 移动到 oDiv1 的时候，由于 oDiv2 的 onmouseout 定时器没有清除，所以过一秒后，oDiv2 还是会消失；这里，我们就清除定时器（当 oDiv2 移动到 oDiv1 时，使 oDiv2 上的定时器解除）：

```js
oDiv1.onmouseover = function() {
  clearTimeout(timer);
  oDiv2.style.display = "block";
};
```

### 最后

当代码相似的情况下，我们要想办法使之简化，这样就不会显得冗余；

在 JS 中，允许我们这样做：`a=b=c=1`;
所以，观察上面代码我们可以得出以下代码：

```js
oDiv1.onmouseover = oDiv2.onmouseover = function() {
  clearTimeout(timer);
  oDiv2.style.display = "block";
};
oDiv1.onmouseout = oDiv2.onmouseout = function() {
  timer = setTimeout(function() {
    oDiv2.style.display = "none";
  }, 1000);
};
```

其实，想通制作的步骤，写代码才会行云流水。

### 完整代码

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>延时提示</title>
    <style type="text/css">
      body {
        background-color: #fc9;
      }
      #div1,
      #div2 {
        margin: 10px;
        float: left;
        color: #fff;
        text-align: center;
        border: 3px solid #eee;
      }
      #div1 {
        width: 100px;
        height: 100px;
        background-color: #f60;
        font-size: 20px;
        padding-top: 10px;
      }
      #div2 {
        width: 300px;
        height: 250px;
        background-color: #599;
        font-size: large;
        line-height: 48px;
        padding-top: 10px;
        display: none;
      }
    </style>
    <script type="text/javascript">
      window.onload = function() {
        var oDiv1 = document.getElementById("div1");
        var oDiv2 = document.getElementById("div2");
        var timer = null;
        oDiv1.onmouseover = oDiv2.onmouseover = function() {
          clearTimeout(timer);
          oDiv2.style.display = "block";
        };
        oDiv1.onmouseout = oDiv2.onmouseout = function() {
          timer = setTimeout(function() {
            oDiv2.style.display = "none";
          }, 1000);
        };
      };
    </script>
  </head>
  <body>
    <div id="div1">
      登岳阳楼
      <p>杜甫</p>
    </div>
    <div id="div2">
      昔闻洞庭水，今上岳阳楼。<br />
      吴楚东南坼，乾坤日夜浮。<br />
      亲朋无一字，老病有孤舟。<br />
      戎马关山北，凭轩涕泗流。
    </div>
  </body>
</html>
```

---

**效果图**
![图片描述](http://img1.sycdn.imooc.com/57a2c92b0001665b05840395.jpg)
