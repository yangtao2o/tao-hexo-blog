---
title: React 生命周期概览
date: 2020-04-17 16:58:44
tags:
	- react
	- 面试
categories:
	- 前端框架
---

> [生命周期图谱](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)速查表。

<!--more-->

## 前言

React 16 的生命周期，总的来说 React 组件的生命周期分为三（四）个部分:

- 装载期间(Mounting)
- 更新期间(Updating)
- 卸载期间(Unmounting)
- 捕捉错误（React16）componentDidCatch()

## 装载期间

组件被实例化并挂载在到 DOM 树这一过程称为装载，在装载期调用的生命周期函数依次为

- constructor() - 初始化这个组件的一些状态和操作
- getDerivedStateFromProps() - 会在 render 函数被调用之前调用
- render() - 根据状态 state 和属性 props 渲染一个 React 组件
- componentDidMount() - 在 render 方法之后立即被调用，只会被调用一次

示例 contructor 实现如下：

```js
constructor(props) {
  super(props);
  this.state = {
    color: '#fff'
  };

  this.handleClick = this.handleClick.bind(this);
}
```

getDerivedStateFromProps 配合 componentDidUpdate 的写法如下:

```js
class ExampleComponent extends React.Component {
  state = {
    isScrollingDown: false,
    lastRow: null
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    // 不再提供 prevProps 的获取方式
    if (nextProps.currentRow !== prevState.lastRow) {
      return {
        isScrollingDown: nextProps.currentRow > prevState.lastRow,
        lastRow: nextProps.currentRow
      };
    }

    // 默认不改动 state
    return null;
  }

  componentDidUpdate() {
    // 仅在更新触发后请求数据
    this.loadAsyncData();
  }

  loadAsyncData() {
    /* ... */
  }
}
```

如何在 componentDidMount 加载数据并设置状态:

```js
componentDidMount() {
  fetch("https://api.github.com/search/repositories?q=language:java&sort=stars")
    .then(res => res.json())
    .then((result) => {
        this.setState({ // 触发render
          items: result.items
        });
      })
    .catch((error) => { console.log(error)});
  // this.setState({color: xxx}) // 不要这样做
}
```

## 更新期间

当组件的状态或属性变化时会触发更新，更新过程中会依次调用以下方法:

- getDerivedStateFromProps()
- shouldComponentUpdate(nextProps, nextState) - 是否要进行下一次 render()，默认这个函数放回 true
- render()
- getSnapshotBeforeUpdate() - 触发时间为 update 发生的时候，在 render 之后 dom 渲染之前返回一个值，作为 componentDidUpdate 的第三个参数
- componentDidUpdate() - 在更新完成后被立即调用，可以进行 DOM 操作，或者做一些异步调用

## 卸载期间

卸载期间是指组件被从 DOM 树中移除时，调用的相关方法为:

- componentWillUnmount()

该方法会在组件被卸载之前被调用，你可以在这个函数中进行相关清理工作，比如删除定时器。

```js
componentWillUnmount() {
  // 清除timer
  clearInterval(this.timerID1);
  clearTimeout(this.timerID2);

  // 关闭socket
  this.myWebsocket.close();

  // 取消消息订阅...
}
```

## 错误捕获

React16 中新增了一个生命周期函数:

- componentDidCatch(error, info)

## React16 中的生命周期函数变化

React 16 之后有三个生命周期被废弃(但并未删除)

- componentWillMount
- componentWillReceiveProps
- componentWillUpdate

官方计划在 17 版本完全删除这三个函数，只保留 UNSAVE\_前缀的三个函数，目的是为了向下兼容，但是对于开发者而言应该尽量避免使用他们，而是使用新增的生命周期函数替代它们。

## 父子组件生命周期变化

初次装载期间：

```log
Parent constructor {}
Parent getDerivedStateFromProps {} {name: "tao"}
Parent render
Child constructor  {}
Child getDerivedStateFromProps {} {value: 0}
Child render
Child componentDidMount 
Parent componentDidMount
```

更新子组件：

```log
Child getDerivedStateFromProps {} {value: 1}
Child shouldComponentUpdate(nextProps, nextState) {} {value: 1}
Child render
Child getSnapshotBeforeUpdate {} {value: 1}
Child componentDidUpdate {} {value: 1} null
```

## 总结

### 挂载阶段

- constructor: 构造函数，最先被执行,我们通常在构造函数里初始化 state 对象或者给自定义方法绑定 this

- getDerivedStateFromProps: `static getDerivedStateFromProps(nextProps, prevState)`,这是个静态方法,当我们接收到新的属性想去修改我们 state，可以使用 getDerivedStateFromProps

- render: render 函数是纯函数，只返回需要渲染的东西，不应该包含其它的业务逻辑,可以返回原生的 DOM、React 组件、Fragment、Portals、字符串和数字、Boolean 和 null 等内容

- componentDidMount: 组件装载之后调用，此时我们可以获取到 DOM 节点并操作，比如对 canvas，svg 的操作，服务器请求，订阅都可以写在这个里面，但是记得在 componentWillUnmount 中取消订阅

### 更新阶段

- getDerivedStateFromProps: 此方法在更新个挂载阶段都可能会调用`shouldComponentUpdate`

- `shouldComponentUpdate(nextProps, nextState)`,有两个参数 nextProps 和 nextState，表示新的属性和变化之后的 state，返回一个布尔值，true 表示会触发重新渲染，false 表示不会触发重新渲染，默认返回 true,我们通常利用此生命周期来优化 React 程序性能

- render: 更新阶段也会触发此生命周期

- getSnapshotBeforeUpdate: `getSnapshotBeforeUpdate(prevProps, prevState)`,这个方法在 render 之后，componentDidUpdate 之前调用，有两个参数 prevProps 和 prevState，表示之前的属性和之前的 state，这个函数有一个返回值，会作为第三个参数传给 componentDidUpdate，如果你不想要返回值，可以返回 null，此生命周期必须与 componentDidUpdate 搭配使用

- componentDidUpdate: `componentDidUpdate(prevProps, prevState, snapshot)`,该方法在 getSnapshotBeforeUpdate 方法之后被调用，有三个参数 prevProps，prevState，snapshot，表示之前的 props，之前的 state，和 snapshot。第三个参数是 getSnapshotBeforeUpdate 返回的,如果触发某些回调函数时需要用到 DOM 元素的状态，则将对比或计算的过程迁移至 getSnapshotBeforeUpdate，然后在 componentDidUpdate 中统一触发回调或更新状态。

### 卸载阶段

- componentWillUnmount: 当我们的组件被卸载或者销毁了就会调用，我们可以在这个函数里去清除一些定时器，取消网络请求，清理无效的 DOM 元素等垃圾清理工作

## 学习资料

- [React 的生命周期](https://www.yuque.com/ant-design/course/lifemethods) - 语雀
- [2019 年 17 道高频 React 面试题及详解](https://juejin.im/post/5d5f44dae51d4561df7805b4)
