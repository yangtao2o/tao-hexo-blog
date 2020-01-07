---
title: AJAX 请求
date: 2020-01-07 15:06:16
tags:
  - JavaScript
  - 面试
  - Ajax
categories:
  - JavaScript
---

> 关于 http 请求的几种方式

<!--more-->

## AJAX

具体来说，AJAX 包括以下几个步骤：

- 创建 XMLHttpRequest 实例
- 发出 HTTP 请求
- 接收服务器传回的数据
- 更新网页数据

## 起步

```js
const MYTHOD = "GET";
const URL =
  "https://api.github.com/search/repositories?q=javascript&sort=stars";
let xhr = null;

//处理低版本IE不兼容问题
if (window.XMLHttpRequest) {
  xhr = new XMLHttpRequest();
} else {
  xhr = new ActiveXObject("Microsoft.XMLHTTP");
}

// 指定回调函数，监听通信状态（readyState属性）的变化
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};

// 捕获错误
xhr.onerror = err => console.error("Error: ", xhr.statusText);

// 发出 HTTP 请求
xhr.open(MYTHOD, URL, true);

xhr.send(null);
```

## 设置头信息

该方法必须在 open()之后、send()之前调用。如果该方法多次调用，设定同一个字段，则每一次调用的值会被合并成一个单一的值发送。

```js
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("Content-Length", JSON.stringify(data).length);
xhr.send(JSON.stringify(data));
```

## Ajax+Promise

```js
let ajax = ({ method = "GET", path, body, headers }) => {
  //进行Promise封装
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();

    request.open(method, path, true); //配置

    if (method == "GET") {
      request.send(null);
    } else {
      for (const key in headers) {
        //遍历header,设置响应头
        let value = headers[key];
        request.setRequestHeader(key, value);
      }
      request.send(body);
    }

    request.onreadystatechange = () => {
      if (request.readyState === 4) {
        if (request.status >= 200 && request.status < 400) {
          resolve.call(undefined, request.responseText);
        } else if (request.status >= 400) {
          reject.call(undefined, request);
        }
      }
    };
  });
};

//使用ajax
ajax({
  method: "get",
  path: "https://api.github.com/search/repositories?q=javascript&sort=stars",
  headers: {
    "content-type": "application/json"
  }
}).then(
  responseText => {
    console.log(responseText);
  },
  request => {
    console.log(request);
  }
);
```

## jQuery 使用

get 方法，返回一个 deferred 对象：

```js
const URL =
  "https://api.github.com/search/repositories?q=javascript&sort=stars";
let request = $.get(URL);
request
  .done(function(data) {
    console.log(data);
  })
  .fail(function(err) {
    console.log(err);
  });

// 或者
let request = $.ajax({
  url: URL,
  type: "GET"
});
request.done(data => console.log(data)).fail(err => console.log(err));
```

使用 promise：

```js
function getData() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "https://api.github.com/search/repositories?q=javascript&sort=stars",
      type: "GET",
      success: function(data) {
        resolve(data);
      },
      error: function(err) {
        resolve(err);
      }
    });
  });
}

getData()
  .then(function(data) {
    console.log(data);
  })
  .catch(function(err) {
    console.log(err);
  });
```

## Fetch 函数

Fetch 提供了 Request 和 Response 对象（以及与网络请求有关的其他内容）的一般定义。

Fetch API 提供了 fetch() 方法，它被定义在 BOM 的 window 对象中，你可以用它来发起对远程资源的请求。

fetch() 方法返回的是一个 Promise 对象，让你能够对请求的返回结果进行检索。

fetch 的配置：

- `Promise fetch(String url [, Object options])`;
- `Promise fetch(Request req [, Object options])`;

```js
const URL = 'https://api.github.com/search/repositories?q=javascript&sort=stars';
let req = new Request(URL, { method: "GET", cache: "reload" });
fetch(req)
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    console.log(json);
  }).catch(function(err) {
    console.log(err);
  }
```

fetch 和 ajax 的主要区别：

- fetch()返回的 promise 将不会拒绝 http 的错误状态，即使响应是一个 HTTP 404 或者 500
- 在默认情况下 fetch 不会接受或者发送 cookies

## Axios

基本使用：

```js
const URL =
  "https://api.github.com/search/repositories?q=javascript&sort=stars";
axios
  .get(URL)
  .then(response => console.log(response))
  .catch(err => console.log(err));
```

或者使用 `async/await`：

```js
async function getData() {
  try {
    return await axios.get(URL);
  } catch (error) {
    console.error(error);
  }
}
getData().then(data => console.log(data));
```

## 资料

- [AJAX -- JavaScript 标准参考教程(alpha)](http://javascript.ruanyifeng.com/bom/ajax.html)
- [原生 javaScript 实现 Ajax 和 jQuery 实现 Ajax](https://segmentfault.com/a/1190000018935873?utm_source=tag-newest)
- [回调、使用 Promise 封装 ajax()、Promise 入门](https://segmentfault.com/a/1190000015938472)
- [Fetch](https://www.jianshu.com/p/7762515f8d1a)
- [axios-易用、简洁且高效的 http 库](http://www.axios-js.com/)
