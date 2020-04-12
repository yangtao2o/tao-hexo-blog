---
title: Vue 生命周期概览
date: 2020-04-10 13:38:19
tags:
  - vue
categories:
  - 前端框架
---

> 每个 Vue 实例在被创建时都要经过一系列的初始化过程——例如，需要设置数据监听、编译模板、将实例挂载到 DOM 并在数据变化时更新 DOM 等。同时在这个过程中也会运行一些叫做生命周期钩子的函数，这给了用户在不同阶段添加自己的代码的机会。 - 官网

<!--more-->

## Vue2 中的生命周期

Vue 实例有一个完整的生命周期：

1. 开始创建
1. 初始化数据
1. 编译模版
1. 挂载 Dom -> 渲染
1. 更新 -> 渲染
1. 卸载

这一系列过程，我们称这是 Vue 的生命周期。

![Vue Lifecycle](https://cn.vuejs.org/images/lifecycle.png)

### beforeCreate

new Vue()之后触发的第一个钩子，在当前阶段 data、methods、computed 以及 watch 上的数据和方法都不能被访问。

### created

在实例创建完成后发生，当前阶段已经完成了数据观测，也就是可以使用数据，更改数据，在这里更改数据不会触发 updated 函数。可以做一些初始数据的获取，在当前阶段无法与 Dom 进行交互，如果非要想，可以通过 `vm.$nextTick` 来访问 Dom。

### beforeMounted

发生在挂载之前，在这之前 template 模板已导入渲染函数编译。而当前阶段虚拟 Dom 已经创建完成，即将开始渲染。在此时也可以对数据进行更改，不会触发 updated。

### mounted

在挂载完成后发生，在当前阶段，真实的 Dom 挂载完毕，数据完成双向绑定，可以访问到 Dom 节点，使用 `$ref` 属性对 Dom 进行操作。

### beforeUpdate

发生在更新之前，也就是响应式数据发生更新，虚拟 dom 重新渲染之前被触发，你可以在当前阶段进行更改数据，不会造成重渲染。

### updated

发生在更新完成之后，当前阶段组件 Dom 已完成更新。要注意的是避免在此期间更改数据，因为这可能会导致无限循环的更新。

### beforeDestroy

发生在实例销毁之前，在当前阶段实例完全可以被使用，我们可以在这时进行善后收尾工作，比如清除计时器。

### destroyed

发生在实例销毁之后，这个时候只剩下了 dom 空壳。组件已被拆解，数据绑定被卸除，监听被移出，子实例也统统被销毁。

### activated

keep-alive 组件激活时调用，该钩子在服务器端渲染期间不被调用。

### deactivated

keep-alive 组件停用时调用，该钩子在服务器端渲染期间不被调用。

### errorCaptured

当捕获一个来自子孙组件的错误时被调用。此钩子会收到三个参数：错误对象、发生错误的组件实例以及一个包含错误来源信息的字符串。此钩子可以返回 false 以阻止该错误继续向上传播。

你可以在此钩子中修改组件的状态。因此在模板或渲染函数中设置其它内容的短路条件非常重要，它可以防止当一个错误被捕获时该组件进入一个无限的渲染循环。

### 注意点

在使用生命周期时有几点注意事项需要我们牢记。

1. 除了 beforeCreate 和 created 钩子之外，其他钩子均在服务器端渲染期间不被调用，所以接口请求一般放在 mounted 中，但是服务端渲染需要放到 created 中。
2. 上文曾提到过，在 updated 的时候千万不要去修改 data 里面赋值的数据，否则会导致死循环。
3. Vue 的所有生命周期函数都是自动绑定到 this 的上下文上。所以，你这里使用箭头函数的话，就会出现 this 指向的父级作用域，就会报错。

## Vue 组件生命周期调用顺序

- 组件的调用顺序都是 **先父后子**，渲染完成的顺序是 **先子后父**。
- 组件的销毁操作是 **先父后子**，销毁完成的顺序是 **先子后父**。

### 加载渲染过程

1. 父 beforeCreate
1. 父 created
1. 父 beforeMount
1. 子 beforeCreate
1. 子 created
1. 子 beforeMount
1. 子 mounted
1. 父 mounted

### 子组件更新过程

1. 父 beforeUpdate
1. 子 beforeUpdate
1. 子 updated
1. 父 updated

### 父组件更新过程

1. 父 beforeUpdate
1. 父 updated

### 销毁过程

1. 父 beforeDestroy
1. 子 beforeDestroy
1. 子 destroyed
1. 父 destroyed

## 在哪个生命周期内调用异步请求

可以在钩子函数 **created、beforeMount、mounted** 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。

但推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

- 能更快获取到服务端数据，减少页面  loading 时间；
- **ssr  不支持 beforeMount 、mounted 钩子函数**，所以放在 created 中有助于一致性；

## 在什么阶段才能访问操作 DOM

在**钩子函数 mounted** 被调用前，Vue 已经将编译好的模板挂载到页面上。

所以在 mounted 中可以访问操作 DOM。

## 父组件可以监听到子组件的生命周期吗

比如有父组件 Parent 和子组件 Child，如果父组件监听到子组件挂载 mounted 就做一些逻辑处理，可以通过以下写法实现：

```js
// Parent.vue
<Child @mounted="doSomething"/>

// Child.vue
mounted() {
  this.$emit("mounted");
}
```

以上需要手动通过 \$emit 触发父组件的事件，更简单的方式可以在父组件引用子组件时通过 @hook 来监听即可，如下所示：

```js
//  Parent.vue
<Child @hook:mounted="doSomething" ></Child>

doSomething() {
   console.log('父组件监听到 mounted 钩子函数 ...');
},

//  Child.vue
mounted(){
   console.log('子组件触发 mounted 钩子函数 ...');
},

// 以上输出顺序为：
// 子组件触发 mounted 钩子函数 ...
// 父组件监听到 mounted 钩子函数 ...
```

## Vue3 中的生命周期

生命周期是 Vue2 中的生命周期，而在即将到来的 Vue3 中，Vue 的生命周期发生了些许的变化，其对应关系如下：

- beforeCreate -> use setup()
- created -> use setup()
- beforeMount -> onBeforeMount
- mounted -> onMounted
- beforeUpdate -> onBeforeUpdate
- updated -> onUpdated
- beforeDestroy -> onBeforeUnmount
- destroyed -> onUnmounted
- errorCaptured -> onErrorCaptured

而且，在 Vue3 中，生命周期的使用方法也发生了变化：

```js
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  onActivated,
  onDeactivated,
  onErrorCaptured
} from "vue";

export default {
  setup() {
    onBeforeMount(() => {
      // ...
    });
    onMounted(() => {
      // ...
    });
    onBeforeUpdate(() => {
      // ...
    });
    onUpdated(() => {
      // ...
    });
    onBeforeUnmount(() => {
      // ...
    });
    onUnmounted(() => {
      // ...
    });
    onActivated(() => {
      // ...
    });
    onDeactivated(() => {
      // ...
    });
    onErrorCaptured(() => {
      // ...
    });
  }
};
```

显而易见这种使用方法与 Vue2 中很不一样，其实这种差别是 Vue3 与 Vue2 的一个很有代表性的差别。

## 附：组件生命周期顺序示例打印过程

```sh
# 初始化：
<---PARETN--->
beforeCreate: init(事件)
$el:  undefined
data:  undefined
<---PARETN--->
created:
$el:  undefined
data:  有值
<---PARETN--->
beforeMount:
$el:  <div id=​"app">​…​</div>​
data:  有值
<---CHILD--->
beforeCreate: init(事件)
$el:  undefined
data:  undefined
<---CHILD--->
created:
$el:  undefined
data:  有值
<---CHILD--->
beforeMount:
$el:  undefined
data:  有值
<---CHILD--->
mounted:
$el:  <div>​…​</div>​
data:  有值
<---PARETN--->
mounted:
$el:  <div id=​"app">​…​</div>​
data:  有值

# 更新
接收子组件的数据 1
<---PARETN--->
beforeUpdate:
$el:  <div id=​"app">​…​</div>​
data:  有值
<---CHILD--->
beforeUpdate:
$el:  <div>​…​</div>​
data:  有值
<---CHILD--->
updated:
$el:  <div>​…​</div>​
data:  有值
<---PARETN--->
updated:
$el:  <div id=​"app">​…​</div>​
data:  有值
```

## 学习资料

- [从源码解读 Vue 生命周期，让面试官对你刮目相看](https://juejin.im/post/5d1b464a51882579d824af5b)
- [「面试题」20+Vue 面试题整理 🔥(持续更新)](https://juejin.im/post/5e649e3e5188252c06113021)
- [30 道 Vue 面试题，内含详细讲解（涵盖入门到精通，自测 Vue 掌握程度）](https://juejin.im/post/5d59f2a451882549be53b170)
