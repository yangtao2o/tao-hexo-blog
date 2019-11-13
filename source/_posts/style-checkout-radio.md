---
title: 自定义单选框、复选框样式
date: 2018-12-07 23:36:33
tags:
- JavaScript
categories:
- 工具库
---
开发过程中，为了兼容IE低版本浏览器，我们重写单选框、复选框等的样式，就需要借助 js 来实现。
<!--more-->
Javascript

```javascript
// 重写多选框,单选框样式
;(function ($) {
  $.fn.hcheckbox = function (options) {
    $(':checkbox+label', this).each(function () {
      $(this).addClass('disabled');
      if ($(this).prev().is(':disabled') == false) {
        if ($(this).prev().is(':checked'))
          $(this).addClass("checked");
      } else {
        $(this).addClass('disabled');
        return false;
      }

    }).click(function (event) {
      var ischeckbox = $(this).prev().is(':checked');
      if (!ischeckbox) {
        $(this).addClass("checked");
        $(this).prev().checked = true;
      } else {
        $(this).removeClass('checked');
        $(this).prev().checked = false;
      }
      event.stopPropagation();
    }).prev().hide();
  }
  $.fn.hradio = function (options) {
    var self = this;
    return $(':radio+label', this).each(function () {
      $(this).addClass('hRadio');
      if ($(this).prev().is("checked"))
        $(this).addClass('hRadio-Checked');

    }).click(function (event) {
      $(this).parent().siblings().find(':radio+label').removeClass("hRadio-Checked");
      if (!$(this).prev().is(':checked')) {
        $(this).addClass("hRadio-Checked");
        $(this).prev()[0].checked = true;
      }
      event.stopPropagation();
    }).prev().hide();
  }
})(jQuery)

$(function() {
  $('.checkbox').hcheckbox();
  $('.radio-wper').hradio();
});
```

Style
```css
.checkbox input,
.radio-wper input {
  display: none;
}
.checkbox label,
.radio-wper label {
  padding-left: 22px;
  position: relative;
}
.checkbox .disabled:before,
.checkbox .checked:before,
.radio-wper .hRadio:before,
.radio-wper .hRadio-Checked:before {
  content: "";
  display: inline-block;
  width: 14px;
  height: 14px;
  position: absolute;
  top: 3px;
  left: 0;
  background-position:  0 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.checkbox .disabled:before {
  background-image: url('../../images/activities/adi2018/check-01.png');
}
.checkbox .checked:before {
  background-image: url('../../images/activities/adi2018/check-02.png');
}
.radio-wper .hRadio:before {
  background-image: url('../../images/activities/adi2018/radio-01.png');
}
.radio-wper .hRadio-Checked:before {
  background-image: url('../../images/activities/adi2018/radio-02.png');
}
```
