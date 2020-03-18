---
title: embed嵌入多个优酷视频并自动播放
date: 2017-01-22 13:41:48
tags:
  - Html
categories:
  - Html
---

> 整理入坑学习记录

<!--more-->

## 关于 embed 标签

特点：

- 多个视频选择；
- 弹出模态框，不能上下滑动；
- 视频自带可全屏；
- 视频自动播放；
- 兼容 IE，IE 会有播放残留，所以让其刷新页面；
- 其他浏览器：火狐，谷歌，edge，safari 等；

首先，先看一下嵌入网页中优酷视频的完整代码（直接从优酷分享得到的 HTML 代码）：

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>embed</title>
</head>
<body>
<embed src='http://player.youku.com/player.php/sid/XMjQ4MDg2MTc2MA==/v.swf' allowFullScreen='true' quality='high' width='480' height='400' align='middle' allowScriptAccess='always' type='application/x-shockwave-flash'></embed>
</body>
</html>
```

代码中，`<embed>`的相关属性：

- `src` --- 指向资源；
- `quality='high'` --- 视频的默认清晰度，一般为 high;
- `width,height` --- 视频的宽、高度；
- `align='middle'` --- 视频的位置；
- `allowFullScreen='true'` --- 是否运行全屏观看，默认 true;
- `type='application/x-shockwave-flash'` --- 各个浏览器支持情况；
- `allowScriptAccess='always'` --- 特殊属性，用于确保 Flash 影片可能特定于某个版本的 Flash；

常用的基本属性就这些了，不过，这个嵌入的视频，默认是不自动播放，下面来看看自动播放的设置代码：

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>embed</title>
</head>
<body>
<embed src='http://player.youku.com/player.php/sid/XMjQ4MDg2MTc2MA==/v.swf?VideoIDS=XMjQ4MDg2MTc2MA==&isAutoPlay=true&isShowRelatedVideo=false&showAd=0' allowFullScreen='true' quality='high' width='480' height='400' align='middle' allowScriptAccess='always' type='application/x-shockwave-flash'></embed>

</body>
</html>
```

这些属性一看就明白：

- `isAutoPlay=true` --- 是否自动播放；
- `isShowRelatedVideo=false` --- 是否展示相关视频；

好了，embed 的常用属性介绍完毕，接下来咱们一起看看如何跟换视频的链接：

### 第一步

由于是多个视频展示，所以复制多个 data-item 值：

```html
<ul id="videoList">
  <li data-item="1">
    <button type="button" name="video01">视频01</button>
    <p>视频简介</p>
    <p>视频描述视频描述视频描述</p>
  </li>
  <li data-item="2">
    <button type="button" name="video02">视频02</button>
    <p>视频简介</p>
    <p>视频描述视频描述视频描述</p>
  </li>
  <li data-item="3">
    <button type="button" name="video03">视频03</button>
    <p>视频简介</p>
    <p>视频描述视频描述视频描述</p>
  </li>
  <li data-item="4">
    <button type="button" name="video04">视频04</button>
    <p>视频简介</p>
    <p>视频描述视频描述视频描述</p>
  </li>
</ul>
```

### 第二步

模态框设置，并且设置视频关闭按钮，（这里没有直接将 embed 的内容写入在页面上，防止有些浏览器直接跳过 js 代码）

```html
<!--遮罩层-->
<div id="mask"></div>
<!--视频区-->
<div id="videoModal">
  <div id="closeBtn"><a>x</a></div>
</div>
```

### 第三步

使用 jquery 获取到点击事件，并判断是否是需要点击的对象：

```js
var embedEle;
var videoID = "";
var videoSrc;
var videoModal = $("#videoModal");
var $targetEle = $("#videoList").find("li");
//点击视频，判断是否是button，排除其他内容
$targetEle.click(function(e) {
  var dataItem = $(this).attr("data-item");
  var $para1 = $(this).find("p")[0];
  var $para2 = $(this).find("p")[1];
  if (e.target == $para1 || e.target == $para2) {
    return;
  } else {
    videoID = isWhichSrc(dataItem);
    videoFunc(videoID);
    return false;
  }
});
```

根据`data-item`的值，获取点击的`data-item`，并执行`isWhichSrc(num)`函数,并将获取到的视频链接赋值给`videoID = isWhichSrc(dataItem);`：

```js
//根据得到的data-item值判断相对应的视频ID
var isWhichSrc = function(num) {
  if (num == 1) {
    videoID = "XMjQ4MDg2MTc2MA";
  }
  if (num == 2) {
    videoID = "XMTY0OTYzNTU0NA";
  }
  if (num == 3) {
    videoID = "XMTQyMDExNjA4NA";
  }
  if (num == 4) {
    videoID = "XMTc2MDAxOTIwOA";
  }
  return videoID;
};
```

然后将此值传入给`videoFunc(videoid)`；该函数中，创建`embed`并添加到页面上：

```js
//根据视频ID赋值视频链接
function videoFunc(videoid) {
  videoSrc =
    "http://player.youku.com/player.php/sid/" +
    videoid +
    "==/v.swf?VideoIDS=" +
    videoid +
    "==&isAutoPlay=true&isShowRelatedVideo=false&showAd=0";

  embedEle =
    "<embed src='" +
    videoSrc +
    "' allowFullScreen='true' quality='high' width='610' height='460' align='middle' allowScriptAccess='always' type='application/x-shockwave-flash'></embed>";
  //将获得的embed标签添加进去
  videoModal.append(embedEle);
  $("#videoModal").slideDown(600);
  showMask();
}
```

最后就是关于遮罩层的函数：

```js
function showMask() {
  $("body").css("overflow", "hidden");
  $("#mask")
    .css({ height: $(document).height(), width: $(document).width() })
    .slideDown(600);
}

function hideMask() {
  $("#mask").slideUp(600);
  bodyShow();
}
function bodyShow() {
  $("body").css("overflow", "auto");
}
```

## 完整栗子

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>youku-video-embed</title>
  </head>
  <script
    type="text/javascript"
    src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"
  ></script>
  <style type="text/css">
    * {
      margin: 0;
      padding: 0;
    }
    /*遮罩层*/
    #mask {
      position: fixed;
      top: 0;
      left: 0;
      opacity: 0.8;
      filter: alpha(opacity=80);
      background-color: #000;
      z-index: 99;
    }
    /*视频*/
    #closeBtn {
      float: right;
      padding-right: 5px;
      width: 14px;
      height: 20px;
      line-height: 20px;
    }
    #closeBtn a {
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      color: #666;
    }
    #closeBtn a:hover {
      color: #fff;
      text-decoration: none;
    }
    #videoModal {
      display: none;
      position: fixed;
      top: 10%;
      left: 50%;
      margin-left: -305px;
      width: 610px;
      height: 480px;
      background-color: #000;
      z-index: 100;
    }
    /*按钮*/
    .wrapper {
      margin: 0 auto;
      width: 100%;
      max-width: 1140px;
      text-align: center;
    }
    h3 {
      margin-top: 20px;
      color: #b403b7;
    }
    ul {
      overflow: hidden;
    }
    ul li {
      float: left;
      list-style-type: none;
      margin: 10px 20px;
    }
    p {
      font-size: 14px;
      font-family: "微软雅黑";
      color: #999;
    }
    .wrapper button {
      margin-top: 50px;
      width: 200px;
      height: 200px;
      cursor: pointer;
      border-radius: 8px;
      color: #666;
    }
    .wrapper button:hover {
      opacity: 0.8;
      filter: alpha(opacity=80);
    }
  </style>
  <body>
    <!--遮罩层-->
    <div id="mask"></div>
    <!--视频区-->
    <div id="videoModal">
      <div id="closeBtn"><a>x</a></div>
    </div>

    <!--按钮-->
    <div class="wrapper">
      <h3>embed链接优酷视频自动播放</h3>
      <ul id="videoList">
        <li data-item="1">
          <button type="button" name="video01">视频01</button>
          <p>视频简介</p>
          <p>视频描述视频描述视频描述</p>
        </li>
        <li data-item="2">
          <button type="button" name="video02">视频02</button>
          <p>视频简介</p>
          <p>视频描述视频描述视频描述</p>
        </li>
        <li data-item="3">
          <button type="button" name="video03">视频03</button>
          <p>视频简介</p>
          <p>视频描述视频描述视频描述</p>
        </li>
        <li data-item="4">
          <button type="button" name="video04">视频04</button>
          <p>视频简介</p>
          <p>视频描述视频描述视频描述</p>
        </li>
      </ul>
    </div>

    <!--js-->
    <script>
      var embedEle;
      var videoID = "";
      var videoSrc;
      var videoModal = $("#videoModal");
      var $targetEle = $("#videoList").find("li");
      //点击视频，判断是否是button，排除其他内容
      $targetEle.click(function(e) {
        var dataItem = $(this).attr("data-item");
        var $para1 = $(this).find("p")[0];
        var $para2 = $(this).find("p")[1];
        if (e.target == $para1 || e.target == $para2) {
          return;
        } else {
          videoID = isWhichSrc(dataItem);
          videoFunc(videoID);
          return false;
        }
      });
      //关闭
      $("#closeBtn").click(function() {
        videoModal
          .slideUp(600)
          .find("embed")
          .remove();
        //兼容IE，让其刷新页面，对其他浏览器无效
        document.execCommand("Refresh");
        hideMask();
        return false;
      });
      //根据得到的data-item值判断相对应的视频ID
      var isWhichSrc = function(num) {
        if (num == 1) {
          videoID = "XMjQ4MDg2MTc2MA";
        }
        if (num == 2) {
          videoID = "XMTY0OTYzNTU0NA";
        }
        if (num == 3) {
          videoID = "XMTQyMDExNjA4NA";
        }
        if (num == 4) {
          videoID = "XMTc2MDAxOTIwOA";
        }
        return videoID;
      };

      //根据视频ID赋值视频链接
      function videoFunc(videoid) {
        videoSrc =
          "http://player.youku.com/player.php/sid/" +
          videoid +
          "==/v.swf?VideoIDS=" +
          videoid +
          "==&isAutoPlay=true&isShowRelatedVideo=false&showAd=0";

        embedEle =
          "<embed src='" +
          videoSrc +
          "' allowFullScreen='true' quality='high' width='610' height='460' align='middle' allowScriptAccess='always' type='application/x-shockwave-flash'></embed>";
        //将获得的embed标签添加进去
        videoModal.append(embedEle);
        $("#videoModal").slideDown(600);
        showMask();
      }

      //遮罩层部分
      function showMask() {
        $("body").css("overflow", "hidden");
        $("#mask")
          .css({ height: $(document).height(), width: $(document).width() })
          .slideDown(600);
      }

      function hideMask() {
        $("#mask").slideUp(600);
        bodyShow();
      }
      function bodyShow() {
        $("body").css("overflow", "auto");
      }
    </script>
  </body>
</html>
```
