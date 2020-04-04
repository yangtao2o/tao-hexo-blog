---
title: 关于 Array 方法的用法及 Polyfill
date: 2020-04-01 17:49:51
tags:
  - JavaScript
  - 手写系列
categories:
  - JavaScript
---

> 主要有：isArray reduce flat forEach some every filter map 等 Array 方法。

<!--more-->

## map, filter, reduce 各自有什么作用

**map** 的作用是生成一个新数组，遍历原数组，将每个元素拿出来做一些变换然后放入到新的数组中。

```js
[1, 2, 3].map(v => v + 1) // -> [2, 3, 4]
```

另外 map 的回调函数接受三个参数，分别是**当前索引元素，索引，原数组**

```js
['1','2','3'].map(parseInt)
```

- 第一轮遍历 `parseInt('1', 0) -> 1`
- 第二轮遍历 `parseInt('2', 1) -> NaN`
- 第三轮遍历 `parseInt('3', 2) -> NaN`

**filter** 的作用也是生成一个新数组，在遍历数组的时候将返回值为 true 的元素放入新数组，我们可以利用这个函数删除一些不需要的元素

```js
let array = [1, 2, 4, 6]
let newArray = array.filter(item => item !== 6)
console.log(newArray) // [1, 2, 4]
```

和 map 一样，filter 的回调函数也接受三个参数，用处也相同。

**reduce** 可以将数组中的元素通过回调函数最终转换为一个值。

对于 reduce 来说，它接受两个参数，分别是回调函数和初始值。

**回调函数**接受四个参数，分别为**累计值、当前元素、当前索引、原数组**。

接下来我们就通过 reduce 来实现 map 函数：

```js
const arr = [1, 2, 3]
const mapArray = arr.map(value => value * 2)
const reduceArray = arr.reduce((acc, current) => {
  acc.push(current * 2)
  return acc
}, [])
console.log(mapArray, reduceArray) // [2, 4, 6]
```

## Array.isArray 实现

可以通过 **toString()** 来获取每个对象的类型。为了每个对象都能通过 `Object.prototype.toString()` 来检测，需要以 `Function.prototype.call()` 或者 `Function.prototype.apply()` 的形式来调用，传递要检查的对象作为第一个参数。

```js
Array.myIsArray = function(o) {
  return Object.prototype.toString.call(o) === "[object Array]";
};
console.log(Array.myIsArray([])); // true
```

## Array.prototype.reduce 实现

[reduce()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 方法对数组中的每个元素执行一个由您提供的`reducer`函数(升序执行)，将其结果汇总为单个返回值。由 reduce 返回的值将是最后一次回调返回值。语法：

```js
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```

- callback
  - accumulator 累计器
  - currentValue 当前值
  - currentIndex 当前索引，可选
  - array 数组，可选
- initialValue 可选，作为第一次调用 callback 函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。

### 栗子

求数组之和：

```js
const array1 = [1, 2, 3, 4];
let result = array1.reduce((prev, curr) => prev + curr); //10
```

数组去重：

```js
let arr = [1, 2, 1, 2, 3, 5, 4, 5, 3, 4, 4, 4, 4];
let result = arr.sort().reduce((init, current) => {
  if (init.length === 0 || init[init.length - 1] !== current) {
    init.push(current);
  }
  return init;
}, []);
console.log(result); //[1,2,3,4,5]
```

按顺序运行 Promise：

```js
function runPromiseInSequence(arr, input) {
  return arr.reduce(
    (promiseChain, currentFunction) => promiseChain.then(currentFunction),
    Promise.resolve(input)
  );
}
// p1, p2, f3, p4 is promise function or normal function
function p1(a) {
  return new Promise((resolve, reject) => {
    resolve(a * 5);
  });
}

const promiseArr = [p1, p2, f3, p4];
runPromiseInSequence(promiseArr, 10).then(console.log);
```

功能型函数管道：

```js
// Building-blocks to use for composition
const double = x => x + x;
const triple = x => 3 * x;

// Function composition enabling pipe functionality
const pipe = (...functions) => input =>
  functions.reduce((acc, fn) => fn(acc), input);

// 这里其实就是
const pipe = function(...functions) {
  return function(input) {
    return functions.reduce(function(acc, fn) {
      return fn(acc);
    }, input);
  };
};

// Composed functions for multiplication of specific values
const multiply6 = pipe(double, triple);

// Usage
multiply6(6); // 36
```

### 模拟实现

第一版：

```js
Array.prototype.myreduce = function(callback, initialValue) {
  // 判断第一次调用 callback 函数时的第一个参数的值。
  // 如果没有提供初始值，则将使用数组中的第一个元素。
  const _this = this;
  let accumulator = initialValue ? initialValue : this[0];

  for (let i = initialValue ? 0 : 1; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, _this);
  }
  return accumulator;
};
```

第二版：

```js
Array.prototype.myreduce = function reduce(callbackfn) {
  const O = this; // 保存原数组
  const len = O.length >>> 0; // typeof ('1' >>> 0) -> number
  let k = 0, // 下标值初始化
    accumulator = undefined, // 累加器初始化
    kPresent = false, // k下标对应的值是否存在
    initialValue = arguments.length > 1 ? arguments[1] : undefined; // 初始值

  if (typeof callbackfn !== "function") {
    thrownewTypeError(callbackfn + " is not a function");
  }

  // 数组为空，并且有初始值，报错
  if (len === 0 && arguments.length < 2) {
    thrownewTypeError("Reduce of empty array with no initial value");
  }

  // 如果初始值存在，累加器为初始值，否则使用数组中的第一个元素
  if (arguments.length > 1) {
    accumulator = initialValue;
  } else {
    accumulator = O[k++];
  }

  while (k < len) {
    // 判断是否为 empty [,,,]
    kPresent = O.hasOwnProperty(k);

    if (kPresent) {
      const kValue = O[k]; // 当前值
      // 调用 callbackfn
      accumulator = callbackfn(accumulator, kValue, k, O);
    }
    k++;
  }

  return accumulator;
};
```

## Array.prototype.flat 实现

[flat()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

```js
var newArray = arr.flat([depth]);
// depth 可选
// 指定要提取嵌套数组的结构深度，默认值为 1

// 返回值
// 一个包含将数组与子数组中所有元素的新数组。
```

例子：

```js
var arr = [1, 2, [3, 4]];

// 展开一层数组
arr.flat();
// 等效于
arr.reduce((acc, val) => acc.concat(val), []);
// [1, 2, 3, 4]

// 使用扩展运算符 ...
const flattened = arr => [].concat(...arr);

// 展开两层数组
arr.flat(2);

// 使用 Infinity，可展开任意深度的嵌套数组
arr.flat(Infinity);
```

使用 **reduce**、**concat** 和**递归**展开无限多层嵌套的数组：

```js
function flatDeep(arr, d = 1) {
  return d > 0
    ? arr.reduce(
        (acc, val) =>
          acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val),
        []
      )
    : arr.slice();
}
```

**forEach**：

```js
// forEach 遍历数组会自动跳过空元素
const eachFlat = (arr = [], depth = 1) => {
  const result = []; // 缓存递归结果
  // 开始递归
  (function flat(arr, depth) {
    // forEach 会自动去除数组空位
    arr.forEach(item => {
      // 控制递归深度
      if (Array.isArray(item) && depth > 0) {
        // 递归数组
        flat(item, depth - 1);
      } else {
        // 缓存元素
        result.push(item);
      }
    });
  })(arr, depth);
  // 返回递归结果
  return result;
};

eachFlat([1, 2, [3, [4, [5]]]], Infinity); //[1, 2, 3, 4, 5]
```

**for...of**：

```js
// for of 循环不能去除数组空位，需要手动去除
const forFlat = (arr = [], depth = 1) => {
  const result = [];
  (function flat(arr, depth) {
    for (let item of arr) {
      if (Array.isArray(item) && depth > 0) {
        flat(item, depth - 1);
      } else {
        // 去除空元素，添加非undefined元素
        item !== void 0 && result.push(item);
      }
    }
  })(arr, depth);
  return result;
};
```

其他方法见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)。

## Array.prototype.forEach 实现

[forEach()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) 方法对数组的每个元素执行一次给定的函数。语法：

```js
arr.forEach(callback(currentValue [, index [, array]])[, thisArg])
```

`forEach()` 为每个数组元素执行一次 callback 函数；与 `map()` 或者 `reduce()` 不同的是，它总是返回 undefined 值，并且不可链式调用。

例子：对象复制器函数

```js
function copy(obj) {
  const copy = Object.create(Object.getPrototypeOf(obj));
  // propNames is ["a", "b"]
  const propNames = Object.getOwnPropertyNames(obj);

  propNames.forEach(function(name) {
    // desc is {value: 1, writable: true, enumerable: true, configurable: true}
    const desc = Object.getOwnPropertyDescriptor(obj, name);
    Object.defineProperty(copy, name, desc);
  });

  return copy;
}

const obj1 = { a: 1, b: 2 };
const obj2 = copy(obj1); // 现在 obj2 看起来和 obj1 一模一样了
```

模拟实现：

```js
Array.prototype.myforEach = function(callback, thisArg) {
  var k, T;
  if (this == null) {
    throw new TypeError(" this is null or not defined");
  }
  var O = Object(this);
  var len = O.length >>> 0;

  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  if (arguments.length > 1) {
    T = thisArg;
  }

  k = 0;

  while (k < len) {
    var kValue;
    // 已删除或者未初始化的项将被跳过
    if (k in O) {
      kValue = O[k];
      callback.call(T, kValue, k, O);
    }
    k++;
  }
};
```

## Array.prototype.every 实现

[every()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/every) 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。

```js
if (!Array.prototype.every) {
  Array.prototype.every = function(callbackfn, thisArg) {
    "use strict";
    var T, k;
    if (this == null) {
      throw new TypeError("this is null or not defined");
    }

    var O = Object(this);
    var len = O.length >>> 0;

    if (typeof callbackfn !== "function") {
      throw new TypeError();
    }
    if (arguments.length > 1) {
      T = thisArg;
    }
    k = 0;

    while (k < len) {
      var kValue;
      if (k in O) {
        kValue = O[k];
        var testResult = callbackfn.call(T, kValue, k, O);

        if (!testResult) {
          return false;
        }
      }
      k++;
    }
    return true;
  };
}
```

## Array.prototype.some 实现

[some()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some) 方法测试数组中是不是至少有 1 个元素通过了被提供的函数测试。它返回的是一个 Boolean 类型的值。

```js
if (!Array.prototype.some) {
  Array.prototype.some = function(fun /*, thisArg*/) {
    "use strict";

    if (this == null) {
      throw new TypeError("Array.prototype.some called on null or undefined");
    }

    if (typeof fun !== "function") {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t && fun.call(thisArg, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}
```

## Array.prototype.map 实现

[map()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。

map 方法会给原数组中的每个元素都按顺序调用一次 callback 函数。callback 每次执行后的返回值（包括 undefined）组合起来形成一个新数组。

用法：

```js
["1", "2", "3"].map(parseInt); // [1, NaN, NaN]
// parseInt(string, radix) -> map(parseInt(value, index))

["1", "2", "3"].map(str => parseInt(str)); // [1, 2, 3]
```

Plyfill:

```js
if (!Array.prototype.map) {
  Array.prototype.map = function(callback /*, thisArg*/) {
    var T, A, k;

    if (this == null) {
      throw new TypeError("this is null or not defined");
    }

    var O = Object(this);
    var len = O.length >>> 0;

    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }

    if (arguments.length > 1) {
      T = arguments[1];
    }

    A = new Array(len);
    k = 0;

    while (k < len) {
      var kValue, mappedValue;
      if (k in O) {
        kValue = O[k];
        mappedValue = callback.call(T, kValue, k, O);
        A[k] = mappedValue;
      }
      k++;
    }
    return A;
  };
}
```

## Array.prototype.filter 实现

[filter()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。

filter 为数组中的每个元素调用一次 callback 函数，并利用所有使得 callback 返回 true 或等价于 true 的值的元素创建一个新数组。

用法：

```js
const fruits = ["apple", "banana", "grapes", "mango", "orange"];

const filterItems = query => {
  return fruits.filter(
    el => el.toLowerCase().indexOf(query.toLowerCase()) > -1
  );
};

console.log(filterItems("ap")); // ['apple', 'grapes']
console.log(filterItems("an")); // ['banana', 'mango', 'orange']
```

Polyfill:

```js
if (!Array.prototype.filter) {
  Array.prototype.filter = function(func /*, thisArg*/) {
    "use strict";
    if (!((typeof func === "Function" || typeof func === "function") && this))
      throw new TypeError();

    var len = this.length >>> 0,
      res = new Array(len), // preallocate array
      t = this,
      c = 0,
      i = -1,
      T;

    if (arguments.length > 1) {
      T = arguments[1];
    }

    while (++i !== len) {
      if (i in this) {
        if (func.call(T, t[i], i, t)) {
          res[c++] = t[i];
        }
      }
    }

    res.length = c; // shrink down array to proper size
    return res;
  };
}
```

## Array 迭代方法

1. `Array.prototype.forEach()`
   为数组中的每个元素执行一次回调函数。

1. `Array.prototype.entries()`
   返回一个数组迭代器对象，该迭代器会包含所有数组元素的键值对。

1. `Array.prototype.every()`
   如果数组中的每个元素都满足测试函数，则返回 true，否则返回 false。

1. `Array.prototype.some()`
   如果数组中至少有一个元素满足测试函数，则返回 true，否则返回 false。

1. `Array.prototype.filter()`
   将所有在过滤函数中返回 true 的数组元素放进一个新数组中并返回。

1. `Array.prototype.find()`
   找到第一个满足测试函数的元素并返回那个元素的值，如果找不到，则返回 undefined。

1. `Array.prototype.findIndex()`
   找到第一个满足测试函数的元素并返回那个元素的索引，如果找不到，则返回 -1。

1. `Array.prototype.keys()`
   返回一个数组迭代器对象，该迭代器会包含所有数组元素的键。

1. `Array.prototype.map()`
   返回一个由回调函数的返回值组成的新数组。

1. `Array.prototype.reduce()`
   从左到右为每个数组元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中传给下次回调函数，并返回最后一次回调函数的返回值。

1. `Array.prototype.reduceRight()`
   从右到左为每个数组元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中传给下次回调函数，并返回最后一次回调函数的返回值。

1. `Array.prototype.values()`
   返回一个数组迭代器对象，该迭代器会包含所有数组元素的值。

1. `Array.prototype[@@iterator]()`
   和上面的 values() 方法是同一个函数。
