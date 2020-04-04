---
title: JavaScript 深浅拷贝
date: 2020-04-03 11:04:25
tags:
  - JavaScript
  - 面试
categories:
  - JavaScript
---

> 浅拷贝技巧：数组`concat slice`，对象`Object.assign()`等；
> 深拷贝技巧：`JSON.parse(JSON.stringify(arr1))`。

<!--more-->

## 数组的浅拷贝

如果数组元素是基本类型，就会拷贝一份，互不影响，而如果是对象或者数组，就会只拷贝对象和数组的引用，这样我们无论在新旧数组进行了修改，两者都会发生变化。

我们把这种复制引用的拷贝方法称之为浅拷贝，与之对应的就是深拷贝，深拷贝就是指完全的拷贝一个对象，即使嵌套了对象，两者也相互分离，修改一个对象的属性，也不会影响另一个。

比如，数组的一些方法：`concat、slice`：

```js
var arr = ["old", 1, true, null, undefined];

var newArr = arr.concat();
newArr.shift();
console.log(arr); // [ 'old', 1, true, null, undefined ]
console.log(newArr); // [ 1, true, null, undefined ]

var newArr2 = arr.slice();
console.log(newArr2); // [ 'old', 1, true, null, undefined ]
```

但是如果数组嵌套了对象或者数组的话，就会都受影响，比如：

```js
var arrObj = [{ a: 1 }, { b: 2 }];

var newArrObj = arrObj.concat();
newArrObj[0].a = "aaa";
console.log(newArrObj); // [ { a: 'aaa' }, { b: 2 } ]
console.log(arrObj); // [ { a: 'aaa' }, { b: 2 } ]
```

## 数组的深拷贝

使用 `JSON.stringify()`和`JSON.parse()`，不管是数组还是对象，都可以实现深拷贝，但是不能拷贝函数，会返回一个 null：

```js
var arr1 = ["old", 1, true, ["old1", "old2"], { old: 1 }, function() {}];
var newArr1 = JSON.parse(JSON.stringify(arr1));
newArr1.shift();
console.log(arr1); // [ 'old', 1, true, [ 'old1', 'old2' ], { old: 1 }, [Function] ]
console.log(newArr1); // [ 1, true, [ 'old1', 'old2' ], { old: 1 }, null ]
```

## Object.assign

[Object.assign()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。

```js
// target 目标对象，sources 源对象
Object.assign(target, ...sources);
```

`Object.assign` 方法只会拷贝源对象自身的并且可枚举的属性到目标对象。该方法使用源对象的`[[Get]]`和目标对象的`[[Set]]`，所以它会调用相关 getter 和 setter。

String 类型和 Symbol 类型的属性都会被拷贝。

```js
// 赋值一个对象
const obj = { a: 1 };
const copy = Object.assign({}, obj);
console.log(copy); // { a: 1 }
```

针对深拷贝，需要使用其他办法，如借助 JSON，因为 `Object.assign()`拷贝的是属性值。假如源对象的属性值是一个对象的引用，那么它也只指向那个引用。

```js
obj1 = { a: 0, b: { c: 0 } };
let obj3 = JSON.parse(JSON.stringify(obj1));
obj1.a = 4;
obj1.b.c = 4;
console.log(JSON.stringify(obj3));  // {"a":0,"b":{"c":0}}
```

## 浅拷贝的实现

技巧型的拷贝，如上边使用的 `concat、slice、JSON.stringify`等，如果要实现一个对象或者数组的浅拷贝，该怎么实现呢？

思路：既然是浅拷贝，那就只需要遍历，把对应的属性及属性值添加到新的对象，并返回。

代码实现：

```js
var shallowCopy = function(obj) {
  if (typeof obj !== "object") return;

  // 判断新建的是数组还是对象
  var newObj = obj instanceof Array ? [] : {};
  // 遍历obj，并且判断是obj的属性才拷贝
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
};

var arr20 = ["old", 1, true, ["old1", "old2"], { old: 1 }, function() {}];
var newArr20 = shallowCopy(arr20);

console.log({ newArr20 });
// [ 'old', 1, true, [ 'old1', 'old2' ], { old: 1 }, [Function] ]
```

## 深拷贝的实现

思路：如果是对象，通过递归调用拷贝函数

代码实现：

```js
var deepCopy = function(obj) {
  if (typeof obj !== "object") return;
  var newObj = obj instanceof Array ? [] : {};

  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] =
        typeof obj[key] !== "object" ? obj[key] : deepCopy(obj[key]);
    }
  }

  return newObj;
};

var obj = {
  a: function() {},
  b: {
    name: "Tony",
    age: 10
  },
  c: [1, 2, 3]
};

var newObj = deepCopy(obj);
console.log(newObj);
// { a: [Function: a],
// b: { name: 'Tony', age: 10 },
// c: [ 1, 2, 3 ] }
```

## 模拟 jQuery 的 extend

**extend** 的用法：合并两个或者更多的对象的内容到第一个对象中。

```js
jQuery.extend( [deep], target, object1 [, objectN ] )
```

- **deep**，布尔值，如果为 true，进行深拷贝；false 做浅拷贝，target 就往后移动到第二个参数
- **target**，表示要拓展的目标，我们就称它为目标对象吧。
- 后面的参数，都传入对象，内容都会复制到目标对象中，我们就称它们为待复制对象吧。

```js
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;

function isPlainObject(obj) {
  var proto, Ctor;
  if (!obj || toString.call(obj) !== "[object Object]") {
    return false;
  }
  proto = Object.getPrototypeOf(obj);
  if (!proto) {
    return true;
  }
  Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
  return (
    typeof Ctor === "function" &&
    hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object)
  );
}

function extend() {
  // 默认不进行深拷贝
  var deep = false;
  var name, options, src, copy, clone, copyIsArray;
  var length = arguments.length;
  // 记录要复制的对象的下标
  var i = 1;
  // 第一个参数不传布尔值的情况下，target 默认是第一个参数
  var target = arguments[0] || {};
  // 如果第一个参数是布尔值，第二个参数是 target
  if (typeof target == "boolean") {
    deep = target;
    target = arguments[i] || {};
    i++;
  }
  // 如果target不是对象，我们是无法进行复制的，所以设为 {}
  if (typeof target !== "object" && !isFunction(target)) {
    target = {};
  }

  // 循环遍历要复制的对象们
  for (; i < length; i++) {
    // 获取当前对象
    options = arguments[i];
    // 要求不能为空 避免 extend(a,,b) 这种情况
    if (options != null) {
      for (name in options) {
        // 目标属性值
        src = target[name];
        // 要复制的对象的属性值
        copy = options[name];

        // 解决循环引用
        if (target === copy) {
          continue;
        }

        // 要递归的对象必须是 plainObject 或者数组
        if (
          deep &&
          copy &&
          (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))
        ) {
          // 要复制的对象属性值类型需要与目标属性值相同
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = extend(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target;
}
```

## 学习资料

- [JavaScript 专题之深浅拷贝](https://github.com/mqyqingfeng/Blog/issues/32)
- [JavaScript 专题之从零实现 jQuery 的 extend](https://github.com/mqyqingfeng/Blog/issues/33)
