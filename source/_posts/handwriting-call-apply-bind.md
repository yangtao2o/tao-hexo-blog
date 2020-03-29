---
title: 手写系列之 bind、call、apply
date: 2020-03-29 15:50:44
tags:
  - JavaScript
  - 手写系列
categories:
  - JavaScript
---

> bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。(来自于 MDN )

<!--more-->

## bind 实现

我们可以首先得出 bind 函数的两个特点：

- 返回一个函数
- 可以传入参数

如：

```js
var foo = {
  value: 1
};

function bar(name, age) {
  console.log(this.value);
  console.log(name);
  console.log(age);
}

var bindFoo = bar.bind(foo, "yyy");
bindFoo("28");
```

**第一步**：返回一个函数

```js
Function.prototype.mybind1 = function(context) {
  const self = this;
  return function() {
    return self.apply(context);
  };
};
```

**第二步**：可以传参，并且可以这样：函数需要传 name 和 age 两个参数，可以在 bind 的时候，只传一个 name，在执行返回的函数的时候，再传另一个参数 age!

```js
Function.prototype.mybind2 = function(context) {
  const self = this;
  // 截取参数，如：
  // context = [].shift.call(arguments)
  // args = [].slice.call(arguments)
  const args = Array.prototype.slice.call(arguments, 1);
  return function() {
    const bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(context, args.concat(bindArgs));
  };
};
```

**第三步**：当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效。

```js
Function.prototype.mybind3 = function(context) {
  const self = this;
  const args = Array.prototype.slice.call(arguments, 1);

  // 通过一个空函数来进行中转
  const fNOP = function() {};

  const fBound = function() {
    const bindArgs = Array.prototype.slice.call(arguments);
    // this 指向 实例，说明是构造函数，需要将绑定函数的 this 指向该实例，
    // 可以让实例获得来自绑定函数的值
    // this 指向 window，说明使普通函数调用，将绑定函数的 this 指向 context
    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs)
    );
  };

  fNOP.prototype = this.prototype;
  // 让实例继承绑定函数的原型(this.prototype)中的值
  fBound.prototype = new fNOP();

  return fBound;
};
```

**最终版**：

```js
Function.prototype.mybind = function(context) {
  if (typeof this !== "function") {
    throw new Error(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );
  }
  const self = this;
  const args = Array.prototype.slice.call(arguments, 1);
  const fNOP = function() {};

  const fBound = function() {
    const bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(bindArgs)
    );
  };

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  return fBound;
};
```

## call 实现

我们模拟的步骤可以分为：

1. 将函数设为对象的属性
2. 执行该函数
3. 删除该函数

```js
Function.prototype.myCall = function(context) {
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function.`);
  }
  if (typeof context != "object") {
    throw new Error("Arguments error");
  }

  var args = [];
  var result;
  context = context || window;
  // 如果本身存在 fn 属性，先保存，使用完毕，后恢复
  if ("fn" in context && context.hasOwnProperty("fn")) {
    var fn = context.fn;
    var fnFlag = true;
  }

  // 1. 将函数设为对象的属性
  context.fn = this;

  for (var i = 1, l = arguments.length; i < l; i++) {
    // args = ["arguments[1]", "arguments[2]"]
    args.push("arguments[" + i + "]");
  }
  // 2. 执行该函数
  result = eval("context.fn(" + args + ")");

  if (fnFlag) {
    // 恢复
    context.fn = fn;
  } else {
    // 3. 删除该函数
    delete context.fn;
  }

  return result;
};
```

ES6:

```js
Function.prototype.myCall = function(context) {
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function.`);
  }
  const args = [...arguments].slice(1);
  context = context || window;
  // 1. 将函数设为对象的属性
  context.fn = this;
  // 2. 执行该函数
  const result = context.fn(...args);
  // 3. 删除该函数
  delete context.fn;
  return result;
};
```

## apply 实现

```js
Function.prototype.myapply = function(context, arr) {
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function.`);
  }
  context = context || window;
  context.fn = this;

  let result;
  if (!arr) {
    result = context.fn();
  } else {
    let args = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      args.push("arr[" + i + "]");
    }
    result = eval("context.fn(" + args + ")");
  }
  delete context.fn;
  return result;
};
```

ES6:

```js
Function.prototype.myapply = function(context) {
  if (typeof this !== "function") {
    throw new Error(`${this} is not a function.`);
  }
  context = context || window;
  context.fn = this;

  const args = arguments[1];
  let result;

  if (!args) {
    result = context.fn();
  } else {
    result = context.fn(...args);
  }

  delete context.fn;
  return result;
};
```

## 参考资料

- [各种手写源码实现](https://mp.weixin.qq.com/s?__biz=Mzg5ODA5NTM1Mw==&mid=2247485202&idx=1&sn=1a668530cdce1eaf53c2ec6d796fdd7b&chksm=c0668684f7110f922045c7a4539f78c51458ccafd5204ba7d89ad461ed360a1c14ed07778068&mpshare=1&scene=23&srcid=0329UG1H5LSPIxcKsQwUWXlo&sharer_sharetime=1585447184050&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
- [JavaScript 中各种源码实现（前端面试笔试必备）](https://maimai.cn/article/detail?fid=1414317645&efid=GX16EiGB-SbwDA5N9-zXBQ&use_rn=1&from=timeline&isappinstalled=0)
- [JavaScript 深入之 call 和 apply 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/11)
- [JavaScript 深入之 bind 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/12)
