---
title: 当复制一个对象的副本所导致的“Object大案”
date: 2019-10-05 09:30:42
tags: JavaScript
categories: JavaScript
---
> 用 forEach 来复制一个对象的副本
<!--more-->

## 用 forEach 来复制一个对象的副本

```js
// 对象复制函数
function copy(obj) {
  var copy = Object.create(Object.getPrototypeOf(obj));
  var propNames = Object.getOwnPropertyNames(obj);

  propNames.forEach(function(name) {
    var desc = Object.getOwnPropertyDescriptor(obj, name);
    Object.defineProperty(copy, name, desc);
  });

  return copy;
}

var copyObj1 = {
  a: 1,
  b: 2
};
var copyObj2 = copy(copyObj1);
console.log(copyObj2); // { a: 1, b: 2 }
console.log(copyObj2 === copyObj1); // false
```

## Object.create

> `Object.create(proto[, propertiesObject])`方法创建一个新对象，使用现有的对象来提供新创建的对象的**proto**

## Object.getPrototypeOf

## Object.getOwnPropertyNames

## Object.getOwnPropertyDescriptor

## Object.defineProperty

## 总结

```js
function copy(obj) {
  // Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的__proto__
  // Object.getPrototypeOf(object)方法返回指定对象的原型（内部[[Prototype]]属性的值
  var copy = Object.create(Object.getPrototypeOf(obj));
  // Object.getOwnPropertyNames(obj)方法返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组
  var propNames = Object.getOwnPropertyNames(obj);

  propNames.forEach(function(name) {
    // Object.getOwnPropertyDescriptor(obj, prop)方法返回指定对象上一个自有属性对应的属性描述符。
    // （自有属性指的是直接赋予该对象的属性，不需要从原型链上进行查找的属性）
    var desc = Object.getOwnPropertyDescriptor(obj, name);
    // Object.defineProperty(obj, prop, descriptor)方法会直接在一个对象上定义一个新属性，
    // 或者修改一个对象的现有属性， 并返回这个对象
    Object.defineProperty(copy, name, desc);
  });

  return copy;
}
```

## 资料

- [Array.prototype.forEach() 是如何使用 ECMAScript 5 Object.\* 元属性（meta property ）函数工作](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#%E5%AF%B9%E8%B1%A1%E5%A4%8D%E5%88%B6%E5%87%BD%E6%95%B0)
- [for...of
  ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of)
- [Array.prototype.some()
  ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
- [Array.prototype.every()
  ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
- [Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
- [Object.keys()
  ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys)
- [Object.defineProperty()
  ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)
- [Object.getOwnPropertyDescriptor()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor)
- [Object.getOwnPropertyNames()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)
- [Object.getPrototypeOf()
  ](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf)
