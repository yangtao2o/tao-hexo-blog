---
title: 活动之整点秒杀功能优化
date: 2018-11-27 23:00:44
tags: js功能
categories: 工具库
---
整点秒杀功能总结：
<!--more-->
```javascript
var starttime1 = "2018/11/14 14:00",
  endtime1 = "2018/11/15 14:00",

  starttime7 = "2018/11/19 14:00",
  endtime7 = "2018/11/20 14:00",
  // 中 5~8 组（省略）

  // 下 9~12 组（省略）	

  starttime22 = "2018/11/29 14:00",
  endtime22 = "2018/11/30 14:00",

  starttime23 = "2018/12/14 14:00",
  endtime23 = "2018/12/15 14:00";
/**
 * 获取 整点秒杀状态
 */
var getShopStatus = function () {
  var statuShop = [];
  $.ajax({
    url: '//www.eeboard.com/wp-content/themes/eeboard/api/eeboardsix.php?act=shop_detail',
    dataType: 'json',
    cache: false,
    async: false,
    type: "GET",
    success: function (data) {
      var arr8 = data.data.eight;
      // 整点秒杀状态
      if (!arr8) {
        arr8 = [false, false, false, false, false, false, false, false, false, false, false, false]
      }
      var d1over = arr8[0],
        d2over = arr8[1],
        d3over = arr8[2],
        d4over = arr8[3],
        d5over = arr8[4],
        d6over = arr8[5],
        d7over = arr8[6],
        d8over = arr8[7],
        d9over = arr8[8],
        d10over = arr8[9],
        d11over = arr8[10],
        d12over = arr8[11];

      statuShop = [
        d1over, d1over, d2over, d2over, d3over, d3over, d4over,
        d5over, d5over, d6over, d6over, d7over, d7over, d8over, d8over,
        d9over, d9over, d10over, d10over, d11over, d11over, d12over, d12over
      ];

      return statuShop;
    },
    error: function (error) {
      // console.log('商城接口报错---');
      // console.log(error);
    }
  });
  return statuShop;
}
var shopStatusArr = getShopStatus();
/**
 * 时间状态函数  
 */
function timeStatus(start, end) {
  var status = 'load',
    nowTime = parseFloat(new Date().getTime()),
    startTime = parseFloat((new Date(start)).getTime()),
    endTime = parseFloat((new Date(end)).getTime()),
    lastStartTime = parseFloat(startTime - nowTime),
    lastEndTime = parseFloat(endTime - nowTime);

  // 未开始
  if (lastStartTime > 0) {
    return status = 'load';
  } else if (lastStartTime <= 0 && lastEndTime > 0) {
    // 进行中
    return status = 'start';
  } else if (lastEndTime <= 0) {
    // 已结束
    return status = 'end';
  }

}
/**
 * 各个时间段状态切换函数
 */
function isTimeStartEvent() {
  var timer;
  var timersArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  // 判断时间状态
  $.each(timersArr, function (i, item) {
    var start = eval('starttime' + item);
    var end = eval('endtime' + item);
    var status = timeStatus(start, end);
   
    switchCaseEvent(item, status);

  });
}

/* 
 *	秒杀时间监控：判断时间段函数
 */
function intervalStartEvent(start, end) {
  var bigTimer;
  var isClear = false;
  var status = timeStatus(start, end);
  // 时间截止，清除定时器
  if (status === 'end') {
    isClear = true;
  }
  if (isClear) {
    clearTimeout(bigTimer);
  } else {
    bigTimer = setTimeout('intervalStartEvent(starttime1, endtime23);', 1000);
  }
  // 监控时间段函数
  isTimeStartEvent();
}

/**
 * 提示及button状态切换函数
 */
function switchCaseEvent(item, type) {
  item = item || 1;
  type = type || 'end';

  switch (item) {
    case 1:
    case 2:
      startAndEndEvent($('#qiangbtn1'), item, type);
      break;
    case 3:
    case 4:
      startAndEndEvent($('#qiangbtn2'), item, type);
      break;
    case 5:
    case 6:
      startAndEndEvent($('#qiangbtn3'), item, type);
      break;
    case 7:
      startAndEndEvent($('#qiangbtn4'), item, type);
      break;
    case 8:
    case 9:
      startAndEndEvent($('#qiangbtn5'), item, type);
      break;
    case 10:
    case 11:
      startAndEndEvent($('#qiangbtn6'), item, type);
      break;
    case 12:
    case 13:
      startAndEndEvent($('#qiangbtn7'), item, type);
      break;
    case 14:
    case 15:
      startAndEndEvent($('#qiangbtn8'), item, type);
      break;
    case 16:
    case 17:
      startAndEndEvent($('#qiangbtn9'), item, type);
      break;
    case 18:
    case 19:
      startAndEndEvent($('#qiangbtn10'), item, type);
      break;
    case 20:
    case 21:
      startAndEndEvent($('#qiangbtn11'), item, type);
      break;
    case 22:
    case 23:
      startAndEndEvent($('#qiangbtn12'), item, type);
      break;
    default:
      break;
  }
}
/**
 * 文字状态切换函数
 */
function startAndEndEvent(obj, item, type) {
  if (!obj) return;
  if (type === 'start') {
    var status = shopStatusArr[item - 1];
    if (status) {
      $('#qiang-time0' + item).text('开始秒杀');
      obj.removeClass('unclick').text('开始秒杀');
    } else {
      $('#qiang-time0' + item).text('已抢光').css('color', '#9b9b9b');
      obj.addClass('unclick unclick-over').text('已抢光');
    }
    return false;
  } else if (type === 'end') {
    $('#qiang-time0' + item).text('已抢光').css('color', '#9b9b9b');
    obj.addClass('unclick unclick-time').text('已抢光');
  } else {
    $('#qiang-time0' + item).text('即将开始');
    // 两对时间段对应同一个按钮，判断本段时间是否截止，再开启另一段时间的状态
    if (obj.hasClass('unclick-time')) {
      obj.removeClass('unclick').text('即将开始');
    }
  }
}
```