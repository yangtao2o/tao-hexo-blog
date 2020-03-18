---
title: 初识JavaScript的解析与执行过程
date: 2016-09-16 22:56:30
tags: JavaScript
categories: JavaScript
---

> 整理入坑学习记录

<!--more-->

## 全局预处理

先扫描函数声明，再扫描变量声明：

- 函数：用声明的方式创建的函数；
- 变量：用 var 定义的变量；初始化为 undefined；

如果出现*命名冲突* 时：

- 函数声明：覆盖；
- 变量声明：忽略；

```js
f(); //fff
g(); //TypeError: g is not a function
function f() {
  console.log("fff");
}
var g = function() {
  console.log("ggg");
};
```

f()函数是声明方式创建的函数，g()是函数表达式，全局预处理时词法环境中，只能是用声明的方式创建的函数。
  
因此，全局预处理时 g()从语义上看，应该是函数，但是由于 g()是函数表达式，不会在词法环境中，所以调用时会报错。

```js
console.log(a); // undefined
console.log(b); //ReferenceError: b is not defined
var a = 1;
b = 2;
```

同理，词法环境中只有用 var 定义的变量。

```js
alert(f); //function f(){alert('567');}
var f = 1;
function f() {
  alert("123");
}
var f = 2;
function f() {
  alert("567");
}
var f = function() {
  alert("890");
};
```

命名冲突时，函数具有“优先权”，变量会直接被忽略，而函数会被覆盖。

## 全局执行过程

```js
alert(a); //undefined
alert(b); //ReferenceError: b is not defined
alert(f); //function f() {console.log('f');}
alert(g); //undefined
var a = 1;
b = 2;
alert(b); //2
function f() {
  console.log("f");
}
var g = function() {
  console.log("g");
};
alert(g); //function () {console.log('g');}
```

为了分析方便我们可以使用词法环境：

```js
LexicalEnvironment {} === window；
```

全局预处理时：

```js
window {
    //先扫描函数声明：
    f: 指向函数,
    //再扫面变量声明：
    a: undefined,
    g: undefined
}
```

全局执行时：

```js
window {
    f: 指向函数,
    a: 1,
    b: 2,
    g: 指向函数
}
```

## 函数预处理阶段

- 每调用一次，产生一个词法环境（或执行上下文`Execution Context`）；
- 先传入函数的参数，若参数值为空，初始化`undefined`；
- 然后是内部函数声明，若发生命名冲突，会覆盖；
- 接着就是内部`var`变量声明，若发生命名冲突，会忽略；

## 函数执行阶段

- 给预处理阶段的成员赋值；
- 无 var 声明的变量，会成为全局成员；

```js
function f(a, b) {
  alert(a); //1
  alert(b); //funciton b(){}
  var a = 100;
  function b() {}
}
f(1, 2);
```

`VO（Variable Object）`——> 变量对象
  
函数中的激活对象：`VO（functionContext）=== AO;`

```js
AO(f) {
    a: 1,                   //变量命名冲突，忽略
    b: 指向函数,            //函数命名冲突，覆盖
}
```

例如：

```js
function test(a, b) {
  alert(a); //10
  alert(b); //undefined
  alert(c); //undefined
  alert(d); //function d(){}
  alert(e); //undefined
  //alert(x);     //ReferenceError: x is not defined
  var c = 10;
  alert(c); //10
  function d() {}
  var e = function _e() {};
  alert(e); //function _e(){}
  (function x() {});
  b = 20;
  alert(b); //20
}
test(10);
```

函数预处理时：

```js
AO（test） {

    //参数：
    a: 10,
    b: undefined,

    //函数声明：
    d: 指向函数，

    //变量声明：
    c: undefined,
    e: undefined
}
```

函数执行时：

```js
AO（test） {
    a: 10,
    b: 20,
    d: 指向函数，
    c: 10,
    e: 指向函数
}
```
