---
title: JavaScript 防抖、节流
date: 2020-04-03 10:19:34
tags:
  - JavaScript
  - 面试
categories:
  - JavaScript
---

> 性能优化中对于频繁触发事件，常用的两种解决方式：debounce 和 throttle。

<!--more-->

在前端开发中会遇到一些频繁的事件触发，比如：

- window 的 resize、scroll
- mousedown、mousemove
- keyup、keydown

## 防抖

防抖的原理就是：

你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行。

总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行!

### 起步

```js
function debounce(func, wait) {
  var timer;
  return function() {
    clearTimeout(timer);
    timer = setTimeout(func, wait);
  };
}
```

### this、arguments、返回值

```js
function debounce(func, wait) {
  var timer;
  return function() {
    var _this = this;
    var args = arguments;

    clearTimeout(timer);
    timer = setTimeout(function() {
      var result = func.apply(_this, args);
    }, wait);

    return result;
  };
}
```

### 立刻执行

这个需求就是：

我不希望非要等到事件停止触发后才执行，我希望立刻执行函数，然后等到停止触发 n 秒后，才可以重新触发执行。

```js
function debounce(func, wait, immediate) {
  var timerId, result;

  return function() {
    var _this = this;
    var _args = arguments;

    if (timerId) clearTimeout(timerId);
    if (immediate) {
      // 触发 func 从队尾提到队前。记住：func同步执行，timer异步执行
      // 1. callNow 初始值是 true, 同步立即执行；随后 timer 才开始执行
      // 2. wait 期间，timer 是一个 ID 数字，所以 callNow 为 false，func 在此期间永远不会执行
      // 3. wait 之后，timer 赋值 null，callNow 为 true，func 又开始立即执行。
      // 依次循环
      var callNow = !timerId;
      timerId = setTimeout(function() {
        timerId = null;
      }, wait);

      if (callNow) {
        result = func.apply(_this, _args);
      }
    } else {
      timerId = setTimeout(function() {
        result = func.apply(_this, _args);
      }, wait);
    }
    return result;
  };
}
```

需要理解：

- `timeId` 是闭包变量，初始化时是 `undefined`
- `setTimeout` 返回的是定时器的 id ，一个 > 0 的数字
- `clearTimeout` 不会改变 `timeId` 的值
- 若 `timeId` 经历过赋值，即执行过 `setTimeout` ，则 `!timeId` 为假

### 取消防抖

比如说我 debounce 的时间间隔是 10 秒钟，immediate 为 true，这样的话，我只有等 10 秒后才能重新触发事件，现在我希望有一个按钮，点击后，取消防抖，这样我再去触发，就可以又立刻执行啦。

```js
function debounce(func, wait, immediate) {
  var timerId, result;

  var debounced = function() {
    var _this = this;
    var _args = arguments;
    if (timerId) clearTimeout(timerId);
    if (immediate) {
      var callNow = !timerId;
      timerId = setTimeout(function() {
        timerId = null;
      }, wait);
      if (callNow) {
        result = func.apply(_this, _args);
      }
    } else {
      timerId = setTimeout(function() {
        result = func.apply(_this, _args);
      }, wait);
    }
    return result;
  };

  debounced.cancel = function() {
    clearTimeout(timerId);
    timerId = null;
  };

  return debounced;
}
```

用法：

```js
var setUseAction = debounce(getUserAction, 10000, true);
container.onmousemove = setUseAction;
button.addEventListener("click", function() {
  setUseAction.cancel();
});
```

## 节流

节流的原理很简单：如果你持续触发事件，每隔一段时间，只执行一次事件。

根据首次是否执行以及结束后是否执行，效果有所不同，实现的方式也有所不同。
我们用 leading 代表首次是否执行，trailing 代表结束后是否再执行一次。

关于节流的实现，有两种主流的实现方式，一种是使用**时间戳**，一种是设置**定时器**。

### 时间戳

当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳(最一开始值设为 0 )，如果大于设置的时间周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于，就不执行。

```js
function throttle(func, wait) {
  var context, args;
  var previous = 0;
  return function() {
    var now = +new Date();
    context = this;
    args = arguments;
    if (now - previous > wait) {
      func.apply(context, args);
      previous = now;
    }
  };
}
```

### 定时器

当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器。

```js
function throttle(func, wait) {
  var context, args, timeout;
  return function() {
    context = this;
    args = arguments;
    if (!timeout) {
      timeout = setTimeout(function() {
        timeout = null;
        func.apply(context, args);
      }, wait);
    }
  };
}
```

所以比较两个方法：

- 第一种事件会立刻执行，第二种事件会在 n 秒后第一次执行
- 第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件

### 双剑合璧

鼠标移入能立刻执行，停止触发的时候还能再执行一次！

```js
function throttle(func, wait) {
  var context, args, timeout, result;
  var previous = 0;

  var later = function() {
    previous = +new Date();
    timeout = null;
    result = func.apply(context, args);
  };

  var throttled = function() {
    var now = +new Date();
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      result = func.apply(context, args);
      previous = now;
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  return throttled;
}
```

### 优化

设置个 options 作为第三个参数，然后根据传的值判断到底哪种效果，我们约定:

- `leading：false` 表示禁用第一次执行
- `trailing: false` 表示禁用停止触发的回调

```js
function throttle(func, wait, options) {
  var context, args, timeout, result;
  var previous = 0;

  if (!options) {
    options = {};
  }

  var later = function() {
    previous = options.leading ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
  };

  var throttled = function() {
    var now = new Date().getTime();
    if (!previous && options.leading === false) {
      previous = now;
    }
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      result = func.apply(context, args);
      previous = now;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  // 取消
  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = null;
  };

  return throttled;
}
```

注意：就是 `leading：false` 和 `trailing: false` 不能同时设置。

## 学习资料

- [JavaScript 专题之跟着 underscore 学防抖](https://github.com/mqyqingfeng/Blog/issues/22)
- [JavaScript 专题之跟着 underscore 学节流](https://github.com/mqyqingfeng/Blog/issues/26)
