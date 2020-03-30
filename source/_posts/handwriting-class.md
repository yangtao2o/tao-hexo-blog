---
title: 手写系列之 new、instanceof、class、typeAPI
date: 2020-03-30 18:20:19
tags:
  - JavaScript
  - 手写系列
categories:
  - JavaScript
---

> 主要有：new、Object.create()、Object.setPrototypeOf()、instanceof、class、type API、原型链继承等。
<!--more-->

## new 实现

我们看下 new 做了什么：

1. 创建一个新对象；
1. 将构造函数的作用域赋给新对象（因此 this 就指向了这个新对象）
1. 执行构造函数中的代码（为这个新对象添加属性）
1. 返回新对象。

```js
function objectFactory() {
  // 1. 新建一个对象 obj
  const obj = new Object();

  // 2. 取出第一个参数，就是我们要传入的构造函数 Constructor。
  // 此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
  const Constructor = [].shift.call(arguments);

  // 3. 将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
  obj.__proto__ = Constructor.prototype;

  // 4. 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
  // 如果构造函数返回值是对象则返回这个对象，如果不是对象则返回新的实例对象
  const ret = Constructor.apply(obj, arguments);

  // 5. 返回 obj
  return typeof ret === "object" ? ret : obj;
}
```

ES6：

```js
function createNew(Con, ...args) {
  this.obj = {};

  this.obj = Object.create(Con.prototype);
  // Object.setPrototypeOf(this.obj, Con.prototype);

  const ret = Con.apply(this.obj, args);
  return ret instanceof Object ? ret : this.obj;
}
```

## Object.create 实现

[Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`。

### 使用 Object.create

```js
var o;
// 创建原型为 null 的空对象
o = Object.create(null);

o = {};
// 以字面量方式创建的空对象就相当于：
o = Object.create(Object.prototype);

function Constructor() {}
o = new Constructor();
// 上面的一句就相当于:
o = Object.create(Constructor.prototype);
// 所以:
console.log(o.__proto__ === Constructor.prototype); // true

o = Object.create(Object.prototype, {
  // foo会成为所创建对象的数据属性
  foo: {
    writable: true,
    configurable: true,
    value: "hello"
  },
  // bar会成为所创建对象的访问器属性
  bar: {
    configurable: false,
    get: function() {
      return 10;
    },
    set: function(value) {
      console.log("Setting `o.bar` to", value);
    }
  }
});
```

### 模拟 Object.create 实现原理

采用了**原型式继承**：将传入的对象作为创建的对象的原型。

```js
Object.mycreate = function(proto) {
  function F() {}
  F.prototype = proto;
  return new F();
};
```

详细 Polyfill，见 MDN：[Object.create()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)，其实就多了参数的判断等信息。

## Object.setPrototypeOf 实现

**Object.setPrototypeOf()** 方法设置一个指定的对象的原型 ( 即, 内部`[[Prototype]]`属性）到另一个对象或 `null`。

**注意**：由于性能问题，你应该使用 **Object.create()** 来创建带有你想要的`[[Prototype]]`的新对象。详情见：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)。

使用较旧的 `Object.prototype.__proto__` 属性，我们可以很容易地定义 `setPrototypeOf`：

```js
// 仅适用于Chrome和FireFox，在IE中不工作：
Object.setPrototypeOf =
  Object.setPrototypeOf ||
  function(obj, proto) {
    obj.__proto__ = proto;
    return obj;
  };
```

## instanceof 实现

**用法**：`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

**原理**：其实就是沿着原型链一直询问，直到`__proto__`为 `null`为止。

**注意**：`Object.prototype.isPrototypeOf()`用于测试一个对象是否存在于另一个对象的原型链上。`isPrototypeOf()` 与 `instanceof` 运算符不同。在表达式 "`object instanceof AFunction`"中，object 的原型链是针对 `AFunction.prototype` 进行检查的，而不是针对 `AFunction` 本身。

如果你有段代码只在需要操作继承自一个特定的原型链的对象的情况下执行，同 `instanceof` 操作符一样 `isPrototypeOf()` 方法就会派上用场:

```js
function Car() {}
var mycar = new Car();

var a = mycar instanceof Car; // 返回 true
var b = mycar instanceof Object; // 返回 true

var aa = Car.prototype.isPrototypeOf(mycar); // true
var bb = Object.prototype.isPrototypeOf(mycar); // true
```

要检测对象不是某个构造函数的实例时，你可以这样做:

```js
if (!(mycar instanceof Car)) {
  // Do something
}
if (!Car.prototype.isPrototypeOf(mycar)) {
  // Do something
}
```

**instanceof 模拟实现**：主要是沿着`__proto__`判断：`L.__proto__`是否等于`R.prototype`：

```js
function myinstanceof(L, R) {
  const O = R.prototype;
  L = L.__proto__;
  while (true) {
    if (L === null) return false;
    if (O === L) return true;
    L = L.__proto__;
  }
}

var a = myinstanceof(mycar, Car); // 返回 true
var b = myinstanceof(mycar, Object); // 返回 true
```

## 原型链继承实现

### 用法

```js
function Parent(name) {
  this.name = name;
}

Parent.prototype.getName = function() {
  return this.name;
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

Child.prototype.getMsg = function() {
  return `My name is ${this.name}, ${this.age} years old.`;
};
```

ES6:

```js
class Parent {
  constructor(name) {
    this.name = name;
  }
  getName() {
    return this.name;
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name);
    this.age = age;
  }
  getMsg() {
    return `My name is ${this.name}, ${this.age} years old.`;
  }
}
```

### 封装继承方法

第一版：

```js
function prototype(child, parent) {
  const F = function() {};
  F.prototype = parent.prototype;
  child.prototype = new F();
  child.prototype.constructor = child;
  child.super = parent.prototype;
}
```

第二版：

```js
function create(o) {
  const F = function() {};
  F.prototype = o;
  return new F();
}

function prototype(child, parent) {
  const prototype = create(parent.prototype);
  child.prototype = prototype;
  child.prototype.constructor = child;
  child.super = parent.prototype;
}
```

第三版：

```js
function myExtend(child, parent) {
  const prototype = Object.create(parent.prototype);
  child.prototype = prototype;
  child.prototype.constructor = child;
  child.super = parent.prototype;
}
```

### 使用到的几种继承方式

**组合式继承**：融合原型链继承和构造函数的优点，是 JavaScript 中最常用的继承模式。组合继承最大的缺点是会调用两次父构造函数。

**原型式继承**：`Object.create` 的模拟实现，将传入的对象作为创建的对象的原型。

**寄生组合式继承**：只调用了一次 Parent 构造函数，并且因此避免了在 Parent.prototype 上面创建不必要的、多余的属性。

PS：其他几种继承方式见这里[JavaScript 深入之继承的多种方式和优缺点
](https://github.com/mqyqingfeng/Blog/issues/16)。

引用《JavaScript 高级程序设计》中对**寄生组合式继承**的夸赞就是：

这种方式的高效率体现它只调用了一次 `Parent` 构造函数，并且因此避免了在 `Parent.prototype` 上面创建不必要的、多余的属性。与此同时，原型链还能保持不变；因此，还能够正常使用 `instanceof` 和 `isPrototypeOf`。开发人员普遍认为寄生组合式继承是**引用类型**最理想的继承范式。

## class 实现

主要是模拟使用`extends`，并模拟`super`可以给其父构造函数传值，如 Parent 中的 opt：

```js
class Parent {
  constructor(opt) {
    this.name = opt.name;
  }
  getName() {
    return this.name;
  }
}

class Child extends Parent {
  constructor(opt) {
    super(opt);
    this.age = opt.age;
  }
  getAge() {
    return this.age + " years old.";
  };
}

const me = new Child({ name: "Yang", age: 28 });
```

开始模拟实现：

```js
function _extends(child, parent) {
  const prototype = Object.create(parent.prototype);
  child.prototype = prototype;
  child.prototype.constructor = child;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

var Parent = (function() {
  function Parent(opt) {
    _classCallCheck(this, Parent);

    this.name = opt.name;
  }

  Parent.prototype.getName = function getName() {
    return this.name;
  };

  return Parent;
})();

var Child = (function(_Parent) {
  _extends(Child, _Parent);

  function Child(opt) {
    _classCallCheck(this, Child);
    // Constrctor => _Parent.call(this, opt)
    var _this = (_Parent != null && _Parent.call(this, opt)) || this;
    _this.age = opt.age;

    return _this;
  }

  Child.prototype.getAge = function getAge() {
    return this.age + " years old.";
  };

  return Child;
})(Parent);

const myself = new Child({ name: "YyY", age: 18 });
```

**PS**：使用 Babel 编译器编译如上代码，完整版在[这里](https://babel.docschina.org/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=MYGwhgzhAEAKYCcCmA7ALtA3gKGtYA9ihGggK7BoEIAUBADmgJRa57RoAWAlhAHQowAWyTQAvNAZoBwpAG42AXzYBzJGgBysmixztoyNGQQoOPfoJEK8y5dlCQYAYR4gAJtCQAPNKjcx4ZHRWPEJiUgoqWildNjwIMnokaMYma3YuXj4wNXFJRmy1dOU8NTQAQTUdEPZDY1NM_hzRAGpoACJoAE8kRBgCdz524oU7MJJoETyUJAB3aBdudxpMaEskAC4OgE0wFBV2gBpoZq2AJgAOaEU0oA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=es2015%2Ces2016%2Ces2017%2Cstage-0%2Cstage-1%2Cstage-2%2Cstage-3%2Ces2015-loose&prettier=true&targets=&version=6.26.0&envVersion=)。

## Array.isArray 实现

可以通过 **toString()** 来获取每个对象的类型。为了每个对象都能通过 `Object.prototype.toString()` 来检测，需要以 `Function.prototype.call()` 或者 `Function.prototype.apply()` 的形式来调用，传递要检查的对象作为第一个参数。

```js
Array.myIsArray = function(o) {
  return Object.prototype.toString.call(o) === "[object Array]";
};
console.log(Array.myIsArray([])); // true
```

## type API 实现

写一个 type 函数能检测各种类型的值，如果是基本类型，就使用 `typeof`，引用类型就使用 `toString`。

此外鉴于 `typeof` 的结果是小写，我也希望所有的结果都是小写。

```js
var class2type = {}; // 如：[object Array]: "array"

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

function isFunction(obj) {
  return type(obj) === "function";
}

var isArray =
  Array.isArray ||
  function(obj) {
    return type(obj) === "array";
  };
```

参考资料：[JavaScript 专题之类型判断(上)](https://github.com/mqyqingfeng/Blog/issues/28)

## 参考资料

- [各种手写源码实现](https://mp.weixin.qq.com/s?__biz=Mzg5ODA5NTM1Mw==&mid=2247485202&idx=1&sn=1a668530cdce1eaf53c2ec6d796fdd7b&chksm=c0668684f7110f922045c7a4539f78c51458ccafd5204ba7d89ad461ed360a1c14ed07778068&mpshare=1&scene=23&srcid=0329UG1H5LSPIxcKsQwUWXlo&sharer_sharetime=1585447184050&sharer_shareid=73865875704bcba3caa8b09c62f6bd7a%23rd)
- [JavaScript 中各种源码实现（前端面试笔试必备）](https://maimai.cn/article/detail?fid=1414317645&efid=GX16EiGB-SbwDA5N9-zXBQ&use_rn=1&from=timeline&isappinstalled=0)
- [JavaScript 深入之 new 的模拟实现](https://github.com/mqyqingfeng/Blog/issues/13)
- [JavaScript 深入之类数组对象与 arguments](https://github.com/mqyqingfeng/Blog/issues/14)
