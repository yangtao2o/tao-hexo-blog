---
title: 初识JavaScript的对象属性类型
date: 2016-09-14 23:22:22
tags: JavaScript
categories: JavaScript
---

> 整理入坑学习记录

<!--more-->

## 何为对象

简单点说，对象包含属性或方法，而对象的每个属性或方法都有一个名字，这个名字又都映射到一个值。

所以，对象就是一组名值对（键值对），其中值可以是数据或函数。

每个对象都是基于一个引用类型创建的，这个引用类型可以是原生类型，也可以是自定义类型。

## 创建自定义对象

创建一个 Object 的实例：

```js
varperson = new Object();
person.name = "Bob";
person.age = 24;
person.job = "Teacher";

person.sayName = function() {
  alert(this.name);
};
```

用对象字面量重新创建对象：

```js
var person = {
  name: "Bob",
  age: 24,
  job: "Teacher",

  sayName: function() {
    alert(this.name);
  }
};
```

> 用两种方式创建的 person 对象都有相同的属性和方法。

## 属性类型

属性类型分为数据属性和访问器属性。

数据属性有 4 个特性：

- `[[Configurable]]`
- `[[Enumerable]]`
- `[[Writable]]`
- `[[Value]]`

访问器属性也有 4 个特性，不包含数据值，包含一对儿 `getter` 和 `setter` 函数：

- `[[Configurable]]`

- `[[Enumerable]]`

- `[[Get]]`

- `[[Set]]`

修改属性默认的特性`Object.defineProperty()`方法，接受三个参数：

1. 属性所在的对象；
2. 属性的名字；
3. 一个描述符对象；

数据属性例子：

```js
var person = {}；
Object.defineProperty(person, "name", {
    writeable: false,
    configurable: false,
    value: "Bob"
});

alert(person.name);           //"Bob"
person.name = "Mike";
alert(person.name);            //"Bob"
```

例子中创建了一个名为 name 的属性，由于 writable 设置为 false,name 的值是“只读”的，不可修改；

把 configurable 设置为 false，表示不能从对象中删除（delete）属性，而且，一旦把属性定义为不可配置的，再次调用 `Object.defineProperty()`方法修改 writable 之外的特性，会导致错误。

在调用`Object.defineProperty()`方法时，如果不指定，`configurable、 enumerable、 writable`特性的默认值都是`false`;

如果不调用`Object.defineProperty()`方法时，即直接在对象上定义的属性，他们的`configurable enumerable writable`特性的默认值都是`true`，`value`特性为指定的值（默认值为`undefined`）；

getter setter 方法：

```js
var person = {
  name: "Bob",
  job: "Teacher",

  get age() {
    return new Date().getFullYear() - 1992;
  },
  set age(val) {
    alert("Age can't be set to " + val);
  }
};

alert(person.age); //24
person.age = 100; //Age can't be set to 100
alert(person.age); //still 24
```

以上代码创建了一个 person 对象，并定义了两个默认的属性：name 和 job,而且包含有一个 getter 函数和一个 setter 函数。

- getter 函数返回 age 的值；
- setter 函数返回设置 age 的值 val；

定义多个属性：`Object.defineProperties()`方法，接受两个对象参数：

1. 第一个对象是要添加和修改其属性的对象；
2. 第二个对象的属性与第一个对象中药添加或修改的属性一一对应。

```js
var book = {};
Object.defineProperties(book, {
  _year: {
    writable: true,
    value: 2016
  },

  edition: {
    writable: true,
    value: 1
  },

  year: {
    get: function() {
      return this._year;
    },
    set: function(val) {
      if (val > 2016) {
        this._year = val;
        this.edition += val - 2016;
      }
    }
  }
});
console.log(book.year); //2016
console.log(book.edition); //1
book.year = 2018;
console.log(book.edition); //3
```

以上代码在 book 对象上定义了两个数据属性（`_year` 和 `edition`）和一个访问器属性（year）。

读取属性的特性`Object.getOwnPropertyDescriptor()`方法，接受两个参数：

1. 属性所在的对象；
2. 要读取其描述符的属性名称。

返回值是一个对象：

- 数据属性，对象的属性有`configurable 、enumerable、 writable、value`；
- 访问器属性，对象的属性有`configurable 、enumerable、 get、set`。

```js
var book = {};
Object.defineProperties(book, {
  _year: {
    value: 2016
  },

  edition: {
    value: 1
  },

  year: {
    get: function() {
      return this._year;
    },
    set: function(val) {
      if (val > 2016) {
        this._year = val;
        this.edition += val - 2016;
      }
    }
  }
});

var descriptor = Object.getOwnPropertyDescriptor(book, "_year");
console.log(descriptor.value); //2016
console.log(descriptor.configurable); //false
console.log(typeof descriptor.get); //undefined

var descriptor = Object.getOwnPropertyDescriptor(book, "year");
console.log(descriptor.value); //undefined
console.log(descriptor.enumerable); //false
console.log(typeof descriptor.get); //function
```

- `数据属性_year`，value 等于最初的值，configurable 是 false，而 get 等于 undefined；
- `访问器属性 year`，value 等于 undefined，enumerable 是 false，而 get 是一个指向 getter 函数的指针。
