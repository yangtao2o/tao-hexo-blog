---
title: jQuery工具函数操作DOM
date: 2017-05-21 20:57:24
tags:
  - jQuery
categories:
  - 工具库
---

> jQuery 实战》（第三版）第九章学习总结

<!--more-->

## 过滤数组

**`$.grep(array,callback[,invert])`**

- invert 为 true,则回调函数的值是 false，导致值被收集；
- invert 为 false,则回调函数的值是 true，导致值数据收集；
- 初始元素不变；

```js
var originalArray = [0, 34, 32, 1, 1, 23, 3214, 342, 1, 43, 56, 5, 8, 9, 0, 75];

var bigNum1 = $.grep(
  originalArray,
  function(value) {
    return value > 10;
  },
  false
);

var bigNum2 = $.grep(
  originalArray,
  function(value) {
    return value > 10;
  },
  true
);

console.log("bigNum1", bigNum1);
console.log("bigNum2", bigNum2);
console.log("originalArray", originalArray);
```

![console][1]

## 转换数组

**`$.map(collection, callback)`**

- `collection[Array | Object]`
- `callback(Function)` 接受两个参数：当前值和初始数组值的索引；如果传递的是对象，则第二个参数是属性的当前值；

```js
var oneBased = $.map([1, 2, 3, 0, 4], function(value) {
  return value + 1;
});
console.log("oneBased", oneBased);

//将收集到的保存字符串的数组提取里面的数值，如若是，则提取，如若不是，则忽略；
var strings = ["1", "2", "3", "a", "b", "4"];

var values1 = $.map(strings, function(value) {
  var result = new Number(value);
  return isNaN(result) ? null : result;
});

var values2 = $.map(strings, function(value) {
  return isNaN(value) ? null : value;
});

console.log("values1", values1);
console.log("values2", values2);

//处理从转换函数里返回的数组，并存入结果数组中
var characters = $.map(["hello", "world"], function(value) {
  return value.split("");
});
console.log("characters", characters);
```

![console2][2]

**`$.inArray`**

- `$.inArray(value, array[, fromIndex])`确定一个数组是否包含某个特定的值，或者位置
- `fromIndex(Number)` 数组中开始查询的位置；默认 0
- 返回数组中第一个出现值得位置索引，没有返回-1

```js
var index1 = $.inArray(2, [1, 2, 3, 4]);
var index2 = $.inArray(3, [1, 2, 3, 4], 3);

console.log("index1", index1); //index 1
console.log("index2", index2); //index -1(未找到)
```

**`$.makeArray(object)`** -- 把类数组对象转换为 JavaScript 数组

**`$.merge(array1, array2)`** -- 合并两个数组，并将第一个数组被修改后作为结果返回

## 扩展对象

**`$.extend([deep,] target, [source1, source2,...,sourceN])`**

- 通过传递的对象属性来扩展 target 对象；扩展后的对象可作为返回值
- `deep(Boolean)` 忽略或者为 false，使用浅拷贝扩展；true，则使用深拷贝扩展
- `target(Object)` 使用源元素属性来扩展目标对象
- `source1...(Object)` 一个或者多个对象,属性会添加到 target 目标对象中

```js
//$.extend()函数合并了多个源对象的属性不包含重复值，而且按照顺序排序
var target = { a: 1, b: 2, c: 3 };
var source1 = { c: 4, d: 5, e: 6 };
var source2 = { c: 8, e: 10, f: 9 };

$.extend(target, source1, source2);

console.log("target(after)", target);

//传递空对象作为目标
var newObject = $.extend({}, source1, source2);
console.log("newObject", newObject);

//深拷贝
var target1 = { a: 1, b: 2 };
var source11 = { b: { foo: "bar" }, c: 3 };
var source22 = { b: { oof: "rab" }, d: 4 };

$.extend(true, target1, source11, source22);

console.log("target1", target1);
```

![console][3]

## 序列化参数

**`$.param(params[, traditional])`**

- 序列化为适当的字符串传递信息，便于为查询字符串提交请求
- `params(Array|jQuery|Object)`
- `traditional(Boolean)` 是否执行传统的影子序列化

```html
<form action="">
  <lable for="name">Name:</lable>
  <input id="name" name="name" value="YangTao" />
  <lable for="surname">Surname:</lable>
  <input id="surname" name="surname" value="Bluth" />
  <lable for="address">Address:</lable>
  <input id="address" name="address" value="Fake street 1, Beijing, China" />
</form>
```

```js
var formResult = $.param($("input"));
console.log("formResult", formResult);
```

![console][4]

## 测试对象

- **`$.isArray(param)`** param 是 JavaScript 数组，返回 true,否则返回 false
- **`$.isFunction(param)`** param 是函数，返回 true，否则返回 false
- **`$.isNumeric(param)`** param 是数值，返回 true，否则返回 false
- **`$.isWindow(param)`** param 表示 window 对象，返回 true，否则返回 false
- **`$.isEmptyObject(param)`** param 是 JavaScript 对象，不包含属性，返回 true，否则返回 false
- **`$.isPlainObject(param)`** param 表示用 `via{}` 或者 `new Object()`创建的 JavaScript 对象，返回 true，否则返回 false
- **`$.isXMLDoc(param)`** param 表示 XML 文档或 XML 节点，返回 true，否则返回 false

## 查看值的类型

- **`$.type(param)`**

## 解析函数

- **`$.paramJSON(json)`**
- **`$.paramXML(xml)`**
- **`$.paramHTML(html[,context][,keepScripts])`**

## 测试包含

- **`$.contains(container, contained)`** 测试元素是否包含在 DOM 层的另一个元素中

[1]: http://img1.sycdn.imooc.com/5920f0b40001e7ed06950175.png
[2]: http://img1.sycdn.imooc.com/5920f7710001ee9706960181.png
[3]: http://img1.sycdn.imooc.com/59217be70001859607000553.png
[4]: http://img1.sycdn.imooc.com/592180f500018e7007010100.png
