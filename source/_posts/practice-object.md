---
title: 初识JavaScript的面向对象
date: 2016-08-21 17:23:22
tags: JavaScript
categories: JavaScript
---

> 整理入坑学习记录

<!--more-->

## 首先，面向对象是什么

> 浅显地说，**面向对象**就是只关注对象提供的功能，不在乎其内部的具体细节；
>
> 比如，电视机，我们知道怎么打开、关闭、调台，但一般我们是不知道它到底是如何打开、关闭、调台的。
>
> 再比如，黑匣子；
>
> **面向对象是一种通用思想**，并非只有编程中才使用，任何事情都可以找到它的影子。

## OOP 的特点

> 面向对象编程的三大特点：
>
> **1. 抽象**---抓住核心问题；
>
> **2. 封装**---只考虑功能使用，不考虑内部实现；
>
> **3. 继承**---从已有的对象上，继承出新的对象；

## 原型

> 定义就不粘贴了，通俗滴说，prototype 类似于我们 css 中的 class；
>
> 比如，我们给多个 div 添加相同的属性时，就会使用 class；同样的，使用 prototype 就是需要添加多个方法：

```js
CreatePerson.prototype.showName = function() {
  console.log("我是" + this.name);
};
CreatePerson.prototype.showQQ = function() {
  console.log("我的qq号是：" + this.qq);
};
```

> 代码中，一个人的名字和 QQ 号，可以使用一般的函数来解决，若两个，十个的就麻烦了，因此使用原型**prototype**可以很好地解决**函数重复**导致的**资源浪费**。

## 类和对象的关系

> **对象**，由方法和属性组成；
>
> **类**，比如数组 Array；

```js
var arr = new Array(1, 2, 3, 4);
```

> 其中 arr 是**对象**，Array 是**类**；
>
> 我们可以把**类**看做是制作产品的**磨具**，而**对象**就是由模具制作出来的**产品**。

- **类** --- 模具；
- **对象** --- 产品；

## 代码：面向过程

```js
function createPerson(name, qq) {
  // 加new之后，系统偷偷给加了var this=new Object();
  // var person1 = new Object();
  this.name = name;
  this.qq = qq;
  this.showName = function() {
    console.log("我是" + this.name);
  };
  this.showQQ = function() {
    console.log("我的QQ号是" + this.qq);
  };
  // 加new后这里又偷偷地执行return this;
  // return person1;
}
var person1 = new createPerson("杨子龙", "33441524");
var person2 = new createPerson("王德彪", "66111314");

person1.showName();
person1.showQQ();

person2.showName();
person2.showQQ();
console.log(person1.showName == person2.showName);
```

> 以上代码是由**工厂方式**创建;
>
> 用构造函数`function createPerson(name, qq) {}`创建一个类；
>
> 调用函数使用关键字 new：`var person1 = new createPerson()`;这时系统就是替你创建了一个空白对象`var this=new Object();`并且还替你返回了这个对象`return this;`
>
> **工厂方式**的问题：函数重复使用导致资源浪费；

```js
console.log(person1.showName == person2.showName); //false
```

## 代码：面向对象

```js
function CreatePerson(name, qq) {
  this.name = name;
  this.qq = qq;
}
CreatePerson.prototype.showName = function() {
  console.log("我是" + this.name);
}
CreatePerson.prototype.showQQ = function() {
  console.log("我的qq号是：" + this.qq);
}
var person1 =new CreatePerson("王德彪", 330441338);
var person2 =new CreatePerson("杨子龙", 369898363);

person1.showName();
person1.showQQ();

person2.showName();
person2.showQQ();

console.log(person1.showName == person2.showName)；
```

## 面向对象

> 1. 使用**构造函数加属性**；
> 2. 使用**原型加方法**；
>    这时`console.log(person1.showName == person2.showName)；`，会是`true`，因为 person1 和 person2 都来自同个原型:`CreatePerson.prototype.showName()`。
