---
title: 实践|制作一个简易数码时钟
date: 2016-08-04 22:51:12
tags:
  - Html
categories:
  - Html
---

> 整理入坑学习记录

<!--more-->

## 前言

正常显示时间的时分秒，当鼠标移上去的时候，切换成年月日

![Gif](http://img1.sycdn.imooc.com/57a423af0001050406990285.gif)

线上演示[【戳我】](https://yangtao2o.github.io/clock/)

## 主要特色

1. 简洁
2. 金属色彩
3. setInterval()-->定时器
4. 运用事件 onmouseover()和 onmouseout()，使时间与日期之间自如切换
5. 个人能力有限，还望大家一起修改，使之更加完善

## 一些问题

各个浏览器的显示不是很理想，我已经想尽各种办法，使之平稳展现；

1. 火狐-->进行事件切换时，浮度比较大；
2. 谷歌-->完美运行(去掉某些样式）；
3. IE-->除了最新的，其他的不敢多想；

## 时分秒

```js
window.onload = function() {
  var imgs = document.getElementsByTagName("img");
  function checkTime(x) {
    if (x < 10) return "0" + x;
    else return "" + x;
  }
  function oShowTime() {
    var oDate = new Date();
    var oHou = oDate.getHours();
    var oMin = oDate.getMinutes();
    var oSec = oDate.getSeconds();
    var str = checkTime(oHou) + checkTime(oMin) + checkTime(oSec);
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].src = "images/" + str[i] + ".JPG";
    }
  }
  setInterval(oShowTime, 1000);
  oShowTime();
};
```

## 时间与日期事件切换

```js
window.onload = function() {
  var oDiv = document.getElementById("div1");
  var imgs = document.getElementsByTagName("img");
  var timer = null;
  /*判断获取到的数字是否小于10*/
  function checkTime(x) {
    if (x < 10) return "0" + x;
    else return "" + x;
  }
  /*鼠标点击事件*/
  oDiv.onmouseover = function() {
    clearInterval(timer);
    fnDate();
  };
  oDiv.onmouseout = function() {
    clearInterval(timer);
    fnTime();
  };

  /*获取的日期函数*/
  function fnDate() {
    function oShowDate() {
      var oDate = new Date();
      var oYea = oDate.getFullYear();
      oYea = oYea.toString();
      var oMon = oDate.getMonth() + 1;
      var oDay = oDate.getDay();
      var str = oYea.substr(2, 2) + checkTime(oMon) + checkTime(oDay);
      var aPar = document.getElementsByTagName("p");
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].src = "images/" + str[i] + ".JPG";
      }

      for (var j = 0; j < aPar.length; j++) {
        aPar[j].innerHTML = "-";
      }
    }
    timer = setInterval(oShowDate, 1000);
    oShowDate();
  }

  /*获取的时间函数*/
  function fnTime() {
    function oShowTime() {
      var oDate = new Date();
      var oHou = oDate.getHours();
      var oMin = oDate.getMinutes();
      var oSec = oDate.getSeconds();
      var str = checkTime(oHou) + checkTime(oMin) + checkTime(oSec);
      var aPar = document.getElementsByTagName("p");
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].src = "images/" + str[i] + ".JPG";
      }
      for (var j = 0; j < aPar.length; j++) {
        aPar[j].innerHTML = ":";
      }
    }
    timer = setInterval(oShowTime, 1000);
    oShowTime();
  }
  fnTime();
};
```

## 样式设置

```css
body {
  background-color: #333;
  font-size: 80px;
}
#div1 {
  width: 600px;
  height: 180px;
  border: 40px solid #999;
  border-radius: 60px;
  box-shadow: 10px 14px 12px #777;
  margin: 150px auto;
  background-color: #fff;
}
.div2 {
  width: 580px;
  height: 160px;
  margin: 15px 5px;
  padding-left: 9px; /*谷歌浏览器不用设置*/
}
img {
  width: 60px;
  height: 110px;
  float: left;
  margin: 20px 10px;
}
p {
  float: left;
  color: #555;
  height: 110px;
  line-height: 110px;
  margin: 12px 5px;
}
```

## 完整代码

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>数码钟表</title>
    <style type="text/css">
      body {
        background-color: #333;
        font-size: 80px;
      }
      #div1 {
        width: 600px;
        height: 180px;
        border: 40px solid #999;
        border-radius: 60px;
        box-shadow: 10px 14px 12px #777;
        margin: 150px auto;
        background-color: #fff;
      }
      .div2 {
        width: 580px;
        height: 160px;
        margin: 15px 5px;
        padding-left: 9px; /*谷歌浏览器不用设置*/
      }
      img {
        width: 60px;
        height: 110px;
        float: left;
        margin: 20px 10px;
      }
      p {
        float: left;
        color: #555;
        height: 110px;
        line-height: 110px;
        margin: 12px 5px;
      }
    </style>
    <script type="text/javascript">
      window.onload = function() {
        var oDiv = document.getElementById("div1");
        var imgs = document.getElementsByTagName("img");
        var timer = null;
        /*判断获取到的数字是否小于10*/
        function checkTime(x) {
          if (x < 10) return "0" + x;
          else return "" + x;
        }
        /*鼠标点击事件*/
        oDiv.onmouseover = function() {
          clearInterval(timer);
          fnDate();
        };
        oDiv.onmouseout = function() {
          clearInterval(timer);
          fnTime();
        };

        /*获取的日期函数*/
        function fnDate() {
          function oShowDate() {
            var oDate = new Date();
            var oYea = oDate.getFullYear();
            oYea = oYea.toString();
            var oMon = oDate.getMonth() + 1;
            var oDay = oDate.getDay();
            var str = oYea.substr(2, 2) + checkTime(oMon) + checkTime(oDay);
            var aPar = document.getElementsByTagName("p");
            for (var i = 0; i < imgs.length; i++) {
              imgs[i].src = "images/" + str[i] + ".JPG";
            }

            for (var j = 0; j < aPar.length; j++) {
              aPar[j].innerHTML = "-";
            }
          }
          timer = setInterval(oShowDate, 1000);
          oShowDate();
        }

        /*获取的时间函数*/
        function fnTime() {
          function oShowTime() {
            var oDate = new Date();
            var oHou = oDate.getHours();
            var oMin = oDate.getMinutes();
            var oSec = oDate.getSeconds();
            var str = checkTime(oHou) + checkTime(oMin) + checkTime(oSec);
            var aPar = document.getElementsByTagName("p");
            for (var i = 0; i < imgs.length; i++) {
              imgs[i].src = "images/" + str[i] + ".JPG";
            }
            for (var j = 0; j < aPar.length; j++) {
              aPar[j].innerHTML = ":";
            }
          }
          timer = setInterval(oShowTime, 1000);
          oShowTime();
        }
        fnTime();
      };
    </script>
  </head>
  <body>
    <div id="div1">
      <div class="div2">
        <img src="images/0.JPG" />
        <img src="images/0.JPG" />
        <p>:</p>
        <img src="images/0.JPG" />
        <img src="images/0.JPG" />
        <p>:</p>
        <img src="images/0.JPG" />
        <img src="images/0.JPG" />
      </div>
    </div>
  </body>
</html>
```
