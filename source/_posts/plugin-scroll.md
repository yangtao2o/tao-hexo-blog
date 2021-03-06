---
title: 实现文字的无缝滚动、间歇性向上翻滚
date: 2018-11-29 20:53:31
tags: js插件
categories: 工具库
---

文字向上滚动分为：无缝滚动、间歇性滚动
<!--more-->
### 间歇性滚动
#### 使用jQuery的 `animate`
一般情况下，向上翻滚一行内容，即一个`<li></li>`，但是如果是一行有多个`li`标签，要使用常见的插件就会出现问题了...

所以自己改吧改吧：
```javascript
(function ($) {
  $.fn.myScroll = function(options) {
    var init = {
      items: 1,  //一行有几项内容
      speed: 3000,  //滚动速度
      moveHeight: 22  // 行高
    };

    var intId = [];
    var opts = $.extend({}, init, options);
    
    function moveUp(obj) {
      obj.animate({
        marginTop: '-' + opts.moveHeight + 'px'
      },
      1000,
      function() {
        var $this = $(this);
        $this.find('li').slice(0, opts.items).appendTo($this);
        $this.css('margin-top', 0);
      })
    }

    this.each(function(i) {
      var sh = opts.moveHeight,
        speed = opts.speed,
        items = opts.items,
        $this = $(this);

      intId[i] = setInterval(timerEvent, speed);

      $this.hover(function() {
        clearInterval(intId[i]);
      }, function() {
        intId[i] = setInterval(timerEvent, speed);
      });
      var len = $this.find('li').length;
      if(len > items && len <= items * 2) {
        $this.html($this.html() + $this.html());
      }
      function timerEvent() {
        var len = $this.find('li').length;
        if(len > items && len <= items * 2) {
          len /= 2;
        }
        if(len <= items) {
          clearInterval(intId[i]);
        } else {
          moveUp($this, sh);
        }
      }
    });
  }
})(jQuery);
$('#scrollLists').myScroll({
  items: 3,
  speed: 3000,
  moveHeight: 22
});
```
以下的都是单行内容翻滚，搬过来记录下：
#### 使用JavaScript
```javascript
function Scroll() {}
Scroll.prototype.upScroll = function (dom, _h, interval) {
  var dom = document.getElementById(dom);
  var timer = setTimeout(function () {
    var _field = dom.children[0];
    _field.style.marginTop = _h;
    clearTimeout(timer);
  }, 1000)
  setInterval(function () {
    var _field = dom.children[0];
    _field.style.marginTop = "0px";
    dom.appendChild(_field);
    var _field = dom.children[0]
    _field.style.marginTop = _h;
  }, interval)
}
var myScroll = new Scroll();
```
用法：
```javascript
/*
 * demo 父容器(ul)的id
 * -36px 子元素li的高度
 * 3000  滚动间隔时间
 * 每次滚动持续时间可到css文件中修改
 * （找不到原文了-.-）
 */
myScroll.upScroll("demo","-36px",3000);

```

### 无缝滚动
下载地址：[简单的jQuery无缝向上滚动效果](http://www.jq22.com/jquery-info6631)
```javascript
(function ($) {
  $.fn.myScroll = function (options) {
    //默认配置
    var defaults = {
      speed: 40, //滚动速度,值越大速度越慢
      rowHeight: 24 //每行的高度
    };

    var opts = $.extend({}, defaults, options),
      intId = [];

    function marquee(obj, step) {

      obj.find("ul").animate({
        marginTop: '-=1'
      }, 0, function () {
        var s = Math.abs(parseInt($(this).css("margin-top")));
        if (s >= step) {
          $(this).find("li").slice(0, 1).appendTo($(this));
          $(this).css("margin-top", 0);
        }
      });
    }

    this.each(function (i) {
      var sh = opts["rowHeight"],
        speed = opts["speed"],
        _this = $(this);
      intId[i] = setInterval(function () {
        if (_this.find("ul").height() <= _this.height()) {
          clearInterval(intId[i]);
        } else {
          marquee(_this, sh);
        }
      }, speed);

      _this.hover(function () {
        clearInterval(intId[i]);
      }, function () {
        intId[i] = setInterval(function () {
          if (_this.find("ul").height() <= _this.height()) {
            clearInterval(intId[i]);
          } else {
            marquee(_this, sh);
          }
        }, speed);
      });
    });
  }

})(jQuery);

$(function(){
    $('.myscroll').myScroll({
    	speed: 40, //数值越大，速度越慢
    	rowHeight: 26 //li的高度
    });
});
```