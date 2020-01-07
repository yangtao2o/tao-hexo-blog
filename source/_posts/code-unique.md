---
title: JavaScript 数组去重的几种方式
date: 2020-01-07 13:14:42
tags:
  - JavaScript
  - 面试
categories:
  - JavaScript
---

> 数组去重，老生常谈，把学习到的多种方式进行归纳总结

<!--more-->

## 双层循环

第一种：

```js
function unique(arr) {
  var result = [];
  for (var i = 0, arrLen = arr.length; i < arrLen; i++) {
    for (var j = 0, resLen = result.length; j < resLen; j++) {
      if (arr[i] === result[j]) {
        break;
      }
    }
    if (j === result.length) {
      result.push(arr[i]);
    }
  }
  return result;
}
```

第二种：

```js
function unique(arr) {
  let arrary = [].concat(arr); // 避免修改原数组，存个副本
  for (let i = 0, len = arrary.length; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (arrary[i] === arrary[j]) {
        arrary.splice(j, 1); // splice() 修改原数组，所以需要手动修改长度
        len--;
        j--;
      }
    }
  }
  return arrary;
}
```

## indexOf 方法

```js
function unique(arr) {
  const result = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    const current = arr[i];
    if (result.indexOf(current) === -1) {
      result.push(current);
    }
  }
  return result;
}
```

## filter + indexOf 方法

```js
function unique(arr) {
  let result = arr.filter(function(item, index, arr) {
    return arr.indexOf(item) === index;
  });
  return result;
}

// ES6
let unique = arr =>
  arr.filter((item, index, arr) => arr.indexOf(item) === index);
```

如果我们对一个已经排好序的数组去重，这种方法效率肯定高于使用 indexOf：

```js
let unique = arr =>
  arr
    .concat()
    .sort()
    .filter((item, index, arr) => !index || item !== arr[index - 1]);
```

不过对于下面这种就会失效：

```js
const arr = [2, 1, 1, 3, "1", 1, "1"];
//输出 [ 1, '1', 1, '1', 2, 3 ]
```

## Object 键值对

利用一个空的 Object 对象，我们把数组的值存成 Object 的 key 值，比如 `Object[value1] = true`，在判断另一个值的时候，如果 `Object[value2]`存在的话，就说明该值是重复的。

```js
let unique = arr => {
  const obj = {};
  return arr.filter(item =>
    obj.hasOwnProperty(typeof item + JSON.stringify(item))
      ? false
      : (obj[typeof item + JSON.stringify(item)] = true)
  );
};
```

注意：

1. `typeof item + item` 是为了区分 1 还是 '1'
2. `typeof item + JSON.stringify(item)` 是为了区分 `{value: 1}, {value: 1}`

如：

```js
const arr = [1, "1", { value: 1 }, { value: 1 }];

let getObjType = arr => arr.map(item => typeof item + JSON.stringify(item));

getObjType(arr);

// ["number1", "string"1"", "object{"value":1}", "object{"value":1}"]
```

## Set 集合 和 Map 集合

ES6 去重方式已经是非常的精简：

```js
// Set
let unique = arr => Array.from(new Set(arr))

let unique = arr => [...new Set(arr)]

// Map
let unique = arr => {
  const seen = new Map();
  return arr.filter(item => !seen.has(item) && seen.set(item, true));
};
```

## 学习资料

- [JavaScript 专题之数组去重](https://github.com/mqyqingfeng/Blog/issues/27)
