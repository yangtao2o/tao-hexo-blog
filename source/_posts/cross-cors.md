---
title: 跨域资源共享 CORS
date: 2020-03-25 14:43:47
tags:
  - http
categories:
  - 网络知识
---

> 跨域资源共享(CORS) 是一种机制，它使用额外的 HTTP 头来告诉浏览器 让运行在一个 origin (domain) 上的 Web 应用被准许访问来自不同源服务器上的指定的资源。 --- MDN

<!--more-->

## 什么情况下需要 CORS

允许在下列场景中使用跨域 HTTP 请求：

- 由 `XMLHttpRequest` 或 `Fetch` 发起的跨域 HTTP 请求
- Web 字体 (CSS 中通过 `@font-face` 使用跨域字体资源)
- `WebGL` 贴图
- 使用 drawImage 将 Images/video 画面绘制到 `canvas`

## 两种请求

浏览器将 CORS 请求分成两类：**简单请求**（simple request）和**非简单请求**（not-so-simple request）。

只要同时满足以下两大条件，就属于简单请求（不会触发 CORS 预检请求）。

- 请求方法是以下三种方法之一：`HEAD`、`GET`、`POST`

- HTTP 的头信息不超出以下几种字段：

  - Accept
  - Accept-Language
  - Content-Language
  - Last-Event-ID
  - Content-Type（只限于三个值）
    - application/x-www-form-urlencoded
    - multipart/form-data
    - text/plain

凡是不同时满足上面两个条件，就属于非简单请求。

## CORS 如何工作

首先，浏览器判断请求是简单请求还是复杂请求。

如果是复杂请求，那么在进行真正的请求之前，浏览器会先使用 OPTIONS 方法发送一个预检请求 (preflight request)，OPTIONS 是 `HTTP/1.1` 协议中定义的方法，用以从服务器获取更多信息。

该方法不会对服务器资源产生影响，预检请求中同时携带了下面两个首部字段：

- `Access-Control-Request-Method`: 这个字段表明了请求的方法；
- `Access-Control-Request-Headers`: 这个字段表明了这个请求的 Headers；
- `Origin`: 这个字段表明了请求发出的域。

服务端收到请求后，会以 `Access-Control-* response headers` 的形式对客户端进行回复：

- `Access-Control-Allow-Origin`: 能够被允许发出这个请求的域名，也可以使用`*`来表明允许所有域名；
- `Access-Control-Allow-Methods`: 用逗号分隔的被允许的请求方法的列表；
- `Access-Control-Allow-Headers`: 用逗号分隔的被允许的请求头部字段的列表；
- `Access-Control-Max-Age`: 这个 preflight 能被缓存的最长时间，在缓存时间内，同一个请求不会再次发出 preflight 请求。

这些字段都需要在服务端添加，所以从实践的角度来讲添加 CORS 支持基本上是 server 端的工作。

## 简单请求

对于简单请求，浏览器直接发出 CORS 请求。具体来说，就是在头信息之中，自动增加一个 Origin 字段。

比如下面开启一个端口为 8001 的服务，去请求端口为 8000 的数据：

```js
const url = "http://127.0.0.1:8000";
const data = { username: "example" };
const myHeaders = new Headers({
  "Content-Type": "text/plain"
});

fetch(url, {
  method: "POST",
  headers: myHeaders,
  body: JSON.stringify(data),
  mode: "cors"
})
  .then(res => res.json())
  .then(res => {
    console.log(JSON.parse(res.postData)); //{username: "example"}
  });
```

端口为 8000 的服务端设置：

```js
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Access-Control-Allow-Origin": "*"
  });
  let resData = {};
  let postData = [];
  req.on("data", chunk => {
    postData.push(chunk);
  });

  req.on("end", () => {
    resData.postData = Buffer.concat(postData).toString();
    res.end(JSON.stringify(resData));
  });
});

server.listen(8000);
```

## 非简单请求

## 参考资料

- 阮一峰 [跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)
- MDN [HTTP 访问控制（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
- [使用 Fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)
