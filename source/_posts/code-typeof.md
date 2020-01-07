---
title: JavaScript 类型判断
date: 2020-01-07 14:42:25
tags:
  - JavaScript
  - 面试
categories:
  - JavaScript
---

> 学习[JavaScript 专题之类型判断(上)](https://github.com/mqyqingfeng/Blog/issues/28)的文章总结，其实就是照抄，哈哈哈哈...顺便几一句文章里的话：所有这些点，都必须脚踏实地在具体应用场景下去分析、去选择，要让场景说话。

<!--more-->

## typeof

最新的 ECMAScript 标准定义了 8 种数据类型：

7 种原始类型:

- Boolean
- Null
- Undefined
- Number
- String
- Symbol
- BigInt

和 Object

使用 typeof 检测类型如下：

```js
"Number"; // number
"String"; // string
"Boolean"; // boolean
"Undefined"; // undefined
"Null"; // object
"Symbol"; // symbol
"BigInt"; // bigint
"Object"; // object
```

所以 typeof 能检测出七种基本类型的值，但是，除此之外 Object 下还有很多细分的类型呐，如 Array、Function、Date、RegExp、Error 等。

如果用 typeof 去检测这些类型，返回的都是 object，除了 Function：

```js
var date = new Date();
var error = new Error();
var fn = function() {};
console.log(typeof date); // object
console.log(typeof error); // object
console.log(typeof fn); // function
```

## Object.prototype.toString

所有，该如何区分 object 呢？我们用`Object.prototype.toString`。

规范：当 toString 方法被调用的时候，下面的步骤会被执行：

- 如果 this 值是 undefined，就返回 `[object Undefined]`
- 如果 this 的值是 null，就返回 `[object Null]`
- 让 O 成为 `ToObject(this)` 的结果
- 让 class 成为 O 的内部属性 `[[Class]]` 的值
- 最后返回由 `"[object "` 和 `class` 和 `"]"` 三个部分组成的字符串

通过规范，我们至少知道了调用 `Object.prototype.toString` 会返回一个由 `"[object " 和 class 和 "]"` 组成的字符串，而 class 是要判断的对象的内部属性。

我们可以了解到这个 class 值就是识别对象类型的关键！

正是因为这种特性，我们可以用 `Object.prototype.toString` 方法识别出更多类型！

先看下常见的 15 种（ES6 新增：Symbol Set Map，还有 BigInt）：

```js
var number = 1; // [object Number]
var string = "123"; // [object String]
var boolean = true; // [object Boolean]
var und = undefined; // [object Undefined]
var nul = null; // [object Null]
var obj = { a: 1 }; // [object Object]
var array = [1, 2, 3]; // [object Array]
var date = new Date(); // [object Date]
var error = new Error(); // [object Error]
var reg = /a/g; // [object RegExp]
var func = function a() {}; // [object Function]
var symb = Symbol("test"); // [object Symbol]
var set = new Set(); // [object Set]
var map = new Map(); // [object Map]
var bigI = BigInt(1); // [object BigInt]

function checkType() {
  for (var i = 0, l = arguments.length; i < l; i++) {
    console.log(Object.prototype.toString.call(arguments[i]));
  }
}

checkType(
  number,
  string,
  boolean,
  und,
  nul,
  obj,
  array,
  date,
  error,
  reg,
  func,
  symb,
  set,
  map,
  bigI
);
```

除了以上 15 种，还有以下 3 种：

```js
console.log(Object.prototype.toString.call(Math)); // [object Math]
console.log(Object.prototype.toString.call(JSON)); // [object JSON]

var fn = function() {
  console.log(Object.prototype.toString.call(arguments)); // [object Arguments]
};

fn();
```

## type API

写一个 type 函数能检测各种类型的值，如果是基本类型，就使用 typeof，引用类型就使用 toString。

此外鉴于 typeof 的结果是小写，我也希望所有的结果都是小写。

```js
var class2type = {};

"Boolean Number String Function Array Date RegExp Object Error Null Undefined"
  .split(" ")
  .map(function(item) {
    class2type["[object " + item + "]"] = item.toLowerCase(); // e.g. '[object Boolean]': 'boolean'
  });

function type(obj) {
  if (obj == null) {
    return obj + ""; // IE6
  }
  return typeof obj === "object" || typeof obj === "function"
    ? class2type[Object.prototype.toString.call(obj)] || "object"
    : typeof obj;
}
```

这里`class2type[Object.prototype.toString.call(obj)] || "object"`的 object，为了 ES6 新增的 Symbol、Map、Set 等类型返回 object。

当然也可以添加进去，返回的就是对应的类型：

```js
var class2type = {};

"Boolean Number String Function Array Date RegExp Object Error Null Undefined Symbol Set Map BigInt"
  .split(" ")
  .map(function(item) {
    class2type["[object " + item + "]"] = item.toLowerCase();
  });

function type(obj) {
  if (obj == null) {
    return obj + ""; // IE6
  }
  return typeof obj === "object" || typeof obj === "function"
    ? class2type[Object.prototype.toString.call(obj)]
    : typeof obj;
}
```

## isFunction

```js
function isFunction(obj) {
  return type(obj) === "function";
}
```

## isArray

```js
var isArray =
  Array.isArray ||
  function(obj) {
    return type(obj) === "array";
  };
```

## plainObject

`plainObject` 来自于 jQuery，可以翻译成纯粹的对象，所谓"纯粹的对象"，就是该对象是通过 "{}" 或 "new Object" 创建的，该对象含有零个或者多个键值对。

之所以要判断是不是 `plainObject`，是为了跟其他的 JavaScript 对象如 null，数组，宿主对象（documents）等作区分，因为这些用 typeof 都会返回 object。

```js
// 上节中写 type 函数时，用来存放 toString 映射结果的对象
var class2type = {};

// 相当于 Object.prototype.toString
var toString = class2type.toString;

// 相当于 Object.prototype.hasOwnProperty
var hasOwn = class2type.hasOwnProperty;

function isPlainObject(obj) {
  var proto, Ctor;

  // 排除掉明显不是obj的以及一些宿主对象如Window
  if (!obj || toString.call(obj) !== "[object Object]") {
    return false;
  }

  /**
   * getPrototypeOf es5 方法，获取 obj 的原型
   * 以 new Object 创建的对象为例的话
   * obj.__proto__ === Object.prototype
   */
  proto = Object.getPrototypeOf(obj);

  // 没有原型的对象是纯粹的，Object.create(null) 就在这里返回 true
  if (!proto) {
    return true;
  }

  /**
   * 以下判断通过 new Object 方式创建的对象
   * 判断 proto 是否有 constructor 属性，如果有就让 Ctor 的值为 proto.constructor
   * 如果是 Object 函数创建的对象，Ctor 在这里就等于 Object 构造函数
   */
  Ctor = hasOwn.call(proto, "constructor") && proto.constructor;

  // 在这里判断 Ctor 构造函数是不是 Object 构造函数，用于区分自定义构造函数和 Object 构造函数
  return (
    typeof Ctor === "function" &&
    hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object)
  );
}
```

## EmptyObject

jQuery 提供了 `isEmptyObject` 方法来判断是否是空对象，代码简单：

```js
function isEmptyObject(obj) {
  var name;
  // 判断是否有属性，for 循环一旦执行，就说明有属性，有属性就会返回 false
  for (name in obj) {
    return false;
  }
  return true;
}

console.log(isEmptyObject({})); // true
console.log(isEmptyObject([])); // true
console.log(isEmptyObject(null)); // true
console.log(isEmptyObject(undefined)); // true
console.log(isEmptyObject(1)); // true
console.log(isEmptyObject("")); // true
console.log(isEmptyObject(true)); // true
```

## Window 对象

Window 对象作为客户端 JavaScript 的全局对象，它有一个 window 属性指向自身。我们可以利用这个特性判断是否是 Window 对象。

```js
function isWindow(obj) {
  return obj !== null && obj === obj.window;
}
```

## isArrayLike

如果 isArrayLike 返回 true，至少要满足三个条件之一：

- 是数组
- 长度为 0
- lengths 属性是大于 0 的数字类型，并且 `obj[length - 1]`必须存在

```js
function isArrayLike(obj) {
  // obj 必须有 length属性
  var length = !!obj && "length" in obj && obj.length;
  var typeRes = type(obj);

  // 排除掉函数和 Window 对象
  if (typeRes === "function" || isWindow(obj)) {
    return false;
  }

  return (
    typeRes === "array" ||
    length === 0 ||
    (typeof length === "number" && length > 0 && length - 1 in obj)
  );
}
```

## isElement

判断是不是 DOM 元素

```js
function isElement(obj) {
  return !!(obj && obj.nodeType === 1);
}
var div = document.createElement("div");
console.log(isElement(div)); // true
console.log(isElement("")); // false
```

## 原文地址

- [JavaScript 专题之类型判断(上)](https://github.com/mqyqingfeng/Blog/issues/28)
- [JavaScript 专题之类型判断(下)](https://github.com/mqyqingfeng/Blog/issues/30)
