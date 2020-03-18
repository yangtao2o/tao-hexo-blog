---
title: 实践|JS匀速运动和缓冲运动
date: 2016-08-09 15:24:22
tags:
  - Html
categories:
  - Html
---

> 整理入坑学习记录：有代码有总结的 JS 匀速运动和缓冲运动学习报告

<!--more-->

## JS 匀速运动的学习总结

### 匀速运动要点

1. 点击“开始”，物体向右匀速运动 600 个像素；点击“返回”，物体匀速回到初始位置；
2. css 样式表中，设置绝对定位；
3. JS 代码中：
   - 初始化定时器：timer=null;
   - 开始运动时，关闭已有的定时器:clearInterval(timer);；否则你连续点击按钮时，物体会因为定时器的每次开启但没有清除每次的开启，会导致一卡一卡的运动；
   - 设置 speed，根据目标值和 offsetLeft 之差来判断正负；
   - 使用 if()判断，把运动和停止隔开；

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>匀速运动</title>
    <style type="text/css">
      #div1 {
        width: 300px;
        height: 100px;
        border: 5px inset #890;
        background-color: #588;
        text-align: center;
        position: absolute; /*设置绝对定位*/
        left: 0;
        box-shadow: 10px 9px 12px #599;
      }
      #div1 p {
        font-family: "新宋体";
        font-size: 30px;
        color: white;
        margin-top: 14px;
      }
    </style>
    <script type="text/javascript">
      window.onload = function() {
        var oBtn1 = document.getElementById("btn1");
        var oBtn2 = document.getElementById("btn2");
        var oDiv = document.getElementById("div1");
        var oPar = document.getElementById("par1");
        oBtn1.onclick = function() {
          startMove(600);
          oPar.innerHTML = "点击返回，我会回到起点";
        };
        oBtn2.onclick = function() {
          startMove(0);
          oPar.innerHTML = "点击开始,我将匀速运动";
        };
      };
      var timer = null;
      function startMove(iTarget) {
        var oDiv = document.getElementById("div1");
        //开始运动前，清除定时器
        clearInterval(timer);
        timer = setInterval(function() {
          //设置speed的初始值为0,并且根据目标值判断正负
          var speed = 0;
          if (oDiv.offsetLeft > iTarget) {
            speed = -10;
          } else {
            speed = 10;
          }
          //用if和else隔开运动和停止
          if (oDiv.offsetLeft == iTarget) {
            //满足条件时，清除定时器
            clearInterval(timer);
          } else {
            oDiv.style.left = oDiv.offsetLeft + speed + "px";
          }
        }, 30);
      }
    </script>
  </head>
  <body>
    <input id="btn1" type="button" value="开始" />
    <input id="btn2" type="button" value="返回" /><br />
    <div id="div1">
      <p id="par1">点击开始,我将匀速运动</p>
    </div>
  </body>
</html>
```

### 关于 speed 的 Bug

1. 一般情况下，我们设置 speed 为偶数，如上所示代码，会如期到达目标点；

2. 若 speed 为奇数呢？

3. 设 speed=7，目标点为 100，从 0 开始匀速运动，经过 14 次的递加，到达 98 处，这时，问题出现了：若再递加 7，就会超过目标点 100，若不递加，就会达不到目标点；所以，开始前后卡顿。

4. 如何解决呢？

   - 使用 `Math.abs()`;
   - speed 有可能为正，也有可能为负，我们使用绝对值，让目标和物体之间的距离`<=7`,即：`Math.abs(iTarget-ele.offsetLeft) <= 7`
   - 这时不管怎么样，都是不足 7 个，我们就可以讨巧地认为它已经 到达目标点了，所以就可以清除定时器；你再试试看，就不会晃动了，不过还没达到目标点。
   - 为了精准地达到目标点，我们就认为 left 直接到达目标点，即：`ele.style.left = iTarget + "px"`;

5. 最后：只有匀速运动才会有这个问题；缓冲运动没有，因为它的 speed 是一直随之变化，越来越小，直到到达目标点。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>匀速运动之speed</title>
    <style type="text/css">
      #div1 {
        width: 150px;
        height: 200px;
        background-color: #880;
        margin-top: 35px;
        position: absolute;
        left: 0;
      }

      #div1 p {
        font-size: 24px;
        color: #fff;
        text-align: center;
        line-height: 200px;
        margin-top: 0;
      }

      #div2,
      #div3 {
        width: 0;
        height: 300px;
        border: 1px solid #000;
        position: absolute;
        left: 300px;
      }

      #div3 {
        left: 600px;
      }
    </style>
    <script type="text/javascript">
      window.onload = function() {
        var btn_1 = document.getElementById("btn1");
        var btn_2 = document.getElementById("btn2");
        var btn_3 = document.getElementById("btn3");

        btn_1.onclick = function() {
          startMove(600);
        };
        btn_2.onclick = function() {
          startMove(300);
        };
        btn_3.onclick = function() {
          startMove(0);
        };
      };
      var timer = null;

      function startMove(iTarget) {
        var ele = document.getElementById("div1");
        clearInterval(timer);
        timer = setInterval(function() {
          var speed = 0;
          if (iTarget > ele.offsetLeft) {
            speed = 7;
          } else {
            speed = -7;
          }
          if (Math.abs(iTarget - ele.offsetLeft) <= 7) {
            clearInterval(timer);
            ele.style.left = iTarget + "px";
          } else {
            ele.style.left = ele.offsetLeft + speed + "px";
          }
        }, 30);
      }
    </script>
  </head>

  <body>
    <input type="button" id="btn1" value="600px" />
    <input type="button" id="btn2" value="300px" />
    <input type="button" id="btn3" value="0px" />
    <div id="div1">
      <p>我是匀速运动</p>
    </div>
    <div id="div2"></div>
    <div id="div3"></div>
  </body>
</html>
```

### 匀速运动之分享栏

1. 当鼠标经过“分享”时，会弹出整个分享栏；鼠标离开时，又会恢复到初始状态；
2. css 样式表中：设置绝对定位，并设置 left 之为-150px，隐藏分享栏；

```html
<!DOCTYPE html>
<body>
  <head>
    <meta charset="UTF-8" />
    <title>分享栏</title>
    <style type="text/css">
      * {
        margin: 0px;
        padding: 0px;
        background-color: #ccc;
      }
      #div1 {
        width: 150px;
        height: 300px;
        background-color: #f60;
        position: absolute;
        top: 100px;
        left: -150px;
      }
      #div1 span {
        width: 30px;
        height: 54px;
        padding-top: 6px;
        background-color: #c38;
        color: white;
        text-align: center;
        position: absolute;
        right: -30px;
        top: 120px;
      }
    </style>
    <script type="text/javascript">
      window.onload = function() {
        var oDiv = document.getElementById("div1");
        oDiv.onmouseover = function() {
          startMove(0);
        };
        oDiv.onmouseout = function() {
          startMove(-150);
        };
      };
      var timer = null;
      function startMove(iTarget) {
        var oDiv = document.getElementById("div1");
        clearInterval(timer);
        timer = setInterval(function() {
          //offsetLeft:根据定位的左边距，所以要设置div的绝对定位
          var speed = 0;
          if (oDiv.offsetLeft > iTarget) {
            speed = -10;
          } else {
            speed = 10;
          }
          if (oDiv.offsetLeft == iTarget) {
            clearInterval(timer);
          } else {
            oDiv.style.left = oDiv.offsetLeft + speed + "px";
          }
        }, 30);
      }
    </script>
  </head>
  <body>
    <div id="div1">
      <span>分享</span>
    </div>
  </body>
</body>
```

---

### 匀速运动之淡入淡出

1. 所谓淡入淡出，就是当鼠标移到目标时，目标的透明度会匀速恢复到 100%，反之，透明度会返回到初始值；
2. css 样式表中，透明度的设置考虑浏览器兼容：

   - `IE：filter: alpha(opacity:30)`;
   - 其它：`opacity: 0.3`;

3. 这里可不关 offset 什么事，那怎么办呢?

   其实，我们可以设置一个变量，并赋值给它，比如：var alpha=30；

   然后，将 speed 的值递加给它：alpha = alpha + speed;

   这样，只是将每次的 speed 值赋给变量 alpha，我们就可以通过定时器来匀速改变透明度。

4. 由于兼容问题，我们分开处理：
   - `oDiv.style.filter = "alpha(opacity:' + alpha + ')"`;
   - `oDiv.style.opacity = alpha/100;`(因为初始值是 30)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>淡入淡出</title>
    <style type="text/css">
      #div1 {
        width: 300px;
        height: 150px;
        background-color: #880;
        filter: alpha(opacity: 30);
        opacity: 0.3;
      }
    </style>
    <script type="text/javascript">
      window.onload = function() {
        var oDiv = document.getElementById("div1");
        oDiv.onmouseover = function() {
          getChange(100);
        };
        oDiv.onmouseout = function() {
          getChange(30);
        };
      };

      var alpha = 30;
      var timer = null;

      function getChange(iTarget) {
        var oDiv = document.getElementById("div1");

        clearInterval(timer);

        timer = setInterval(function() {
          var speed = 0;
          if (alpha < iTarget) {
            speed = 10;
          } else {
            speed = -10;
          }
          if (alpha == iTarget) {
            clearInterval(timer);
          } else {
            alpha += speed;
            oDiv.style.filter = "alpha(opacity:' + alpha + ')";
            oDiv.style.opacity = alpha / 100;
          }
        }, 30);
      }
    </script>
  </head>
  <body>
    <div id="div1"></div>
  </body>
</html>
```

## JS 缓冲运动的学习总结

### 缓冲运动的要点

1. 顾名思义，所谓缓冲，就是说速度不同；在一定条件下，距离越大，速度越大；距离越小，速度也就越小。
2. 所以，我们只要改变 speed，就基本上 OK。
3. 首先，通过得到位移量，再除以一个数值，就可以改变速度：`var speed = (iTarget - ele.offsetLeft)/10;`
4. 然后，因为是变速，所以有可能出现小数，不足以达到目标值；这时，通过 Math 对象，可以使 speed 取整，解决不足 1 个像素的问题：

   - 当 `speed>0` 时，物体从左往右运动，离目标值还差不足 1px，所以我们将 speed 向上取整，`Math.ceil(speed)`;
   - 当 `speed<0` 时，反之，离目标值还差不足-1px,由于是负数，我们向下取整，比如-0.9，通过 `Math.floor(-0.9)`，得出-1；

5. 所以，我们用一个三元运算符来进行判断，并赋值给 speed：`speed = speed>0 ? Math.ceil(speed) : Math.floor(speed);`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>缓冲运动</title>
    <style type="text/css">
      #div1 {
        width: 150px;
        height: 200px;
        background-color: #880;
        margin-top: 35px;
        position: absolute;
        left: 0;
      }
      #div1 p {
        font-size: 24px;
        color: #fff;
        text-align: center;
        line-height: 200px;
        margin-top: 0;
      }
      #div2,
      #div3 {
        width: 0;
        height: 300px;
        border: 1px solid #000;
        position: absolute;
        left: 300px;
      }
      #div3 {
        left: 600px;
      }
    </style>
    <script type="text/javascript">
      window.onload = function() {
        var btn_1 = document.getElementById("btn1");
        var btn_2 = document.getElementById("btn2");
        var btn_3 = document.getElementById("btn3");

        btn_1.onclick = function() {
          startMove(600);
        };
        btn_2.onclick = function() {
          startMove(300);
        };
        btn_3.onclick = function() {
          startMove(0);
        };
      };
      var timer = null;
      function startMove(iTarget) {
        var ele = document.getElementById("div1");
        clearInterval(timer);
        timer = setInterval(function() {
          //通过位移量除以10，使speed变速，以致实现减速、停止。
          var speed = (iTarget - ele.offsetLeft) / 10;
          //取整，解决最后不足1px的位移量被忽略的问题。
          speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
          if (ele.offsetLeft == iTarget) {
            clearInterval(timer);
          } else {
            ele.style.left = ele.offsetLeft + speed + "px";
          }
        }, 30);
      }
    </script>
  </head>
  <body>
    <input type="button" id="btn1" value="600px" />
    <input type="button" id="btn2" value="300px" />
    <input type="button" id="btn3" value="0px" />
    <div id="div1">
      <p>我是缓冲运动</p>
    </div>
    <div id="div2"></div>
    <div id="div3"></div>
  </body>
</html>
```
