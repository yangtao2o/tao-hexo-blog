---
title: 九宫格抽奖
date: 2018-11-27 23:11:54
tags:
  - jQuery
categories:
  - 工具库
---

九宫格抽奖记录：

<!--more-->

```JavaScript
  // 九宫格抽奖
  var click=false;
  var luck={

    index: 0,	//当前转动到哪个位置，起点位置
    count: 0,	//总共有多少个位置
    timer: 0,	//setTimeout的ID，用clearTimeout清除
    speed: 30,	//初始转动速度
    times: 0,	//转动次数
    cycle: 70,	//转动基本次数：即至少需要转动多少次再进入抽奖环节
    prize: -1,	//中奖位置

    init:function(id){
      if ($("#"+id).find(".luck-unit").length>0) {
        $luck = $("#"+id);
        $units = $luck.find(".luck-unit");
        this.obj = $luck;
        this.count = $units.length;
        // $luck.find(".luck-unit-"+this.index).addClass("active");
      };
    },
    roll:function(){
      var index = this.index;
      var count = this.count;
      var luck = this.obj;
      $(luck).find(".luck-unit-"+index).removeClass("active");
      index += 1;
      if (index>count-1) {
        index = 0;
      };
      $(luck).find(".luck-unit-"+index).addClass("active");
      this.index=index;
      return false;
    },
    stop:function(index){
      this.prize=index;
      return false;
    }
  };

  function roll(which){
    luck.times += 1;
    luck.roll();

    if (luck.times > luck.cycle+10 && luck.prize==luck.index) {
      var title = '';
      var content = '';
      var desc = '';
      var prize = '';
      // 最终停下来的位置
      // 初始化
      clearTimeout(luck.timer);
      luck.prize=-1;
      luck.times=0;
      click=false;

      switch(which) {
        case 0:
          prize = '小米鼠标';
          break;
        case 1:
          prize = '固态硬盘';
          break;
        case 2:
          prize = '乐扣保温杯';
          break;
        case 3:
          prize = '京东券';
          break;
        case 4:
          prize = '谢谢参与';
          break;
        case 5:
          prize = '万用表';
          break;
        case 6:
          prize = '摩尔吧课程折扣券';
          break;
        case 7:
          prize = '小米耳机';
          break;
      }

      if(which == 4) {
        title = '谢谢参与';
        content = '再接再厉'
        desc = '请查看活动详情，获取更多抽奖资格';
      } else {
        title = '恭喜您';
        content = '获得 <span class="blue">'+ prize +'</span>';
        if(which == 6) {
          desc = '请至您的”个人中心“查收';
        } else {
          desc = '奖品将于活动结束后统一发送';
        }
      }
      // 展示中奖状态
      setTimeout(function() {
        modalShow(title,content,desc);
      }, 800);
    } else {
      if (luck.times<luck.cycle) {
        luck.speed -= 10;
      } else if (luck.times==luck.cycle) {
        // 最终中奖位置的索引
        luck.prize = which;
      } else {
        if (luck.times > luck.cycle+10 && ((luck.prize==0 && luck.index==7) || luck.prize==luck.index+1)) {
          luck.speed += 110;
        } else {
          luck.speed += 20;
        }
      }

      if (luck.speed<40) {
        luck.speed=40;
      }

      luck.timer = setTimeout(function() {
        roll(which);
      },luck.speed);
    }
    return false;
  }

  $(function() {

    // Lottery init
    luck.init('luckArea');

    $("#startBtn").click(function(){
      if(click) {
        return false;
      }else{
        click=true;
        luck.speed=100;
        $.get("http://www.moore8.com/campaign/lotteryAct", function (data) {
          var data = $.parseJSON(data);
          console.log('data:', data);
          if(data.code == 1) {
            var which = data.type;
            // 调取抽奖并传值
            roll(which);
          } else {
            if(data.msg == '请先登录！') {
              loginFunc('course_gift');
            } else {
              var desc = '请查看活动详情，获取更多抽奖资格';
              modalShow('对不起', data.msg, desc);
            }
            click = false;
          }
        });
        return false;
      }
    });
  })

  function modalShow(title, body, desc) {
    var title = title || '温馨提示';
    var body = body || '';
    var desc = desc || '';
    $('#mTitle').html(title);
    $('#mBody').html(body);
    $('#mDesc').html(desc);
    $('#myModal').modal('show');
  }

  function loginFunc(id) {
    var href = window.location.href;
    var id = id ? "%23" + id : '';
    window.location.href = "/login/?referer=" + href + id;
  }
```
