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
    - `application/x-www-form-urlencoded`
    - `multipart/form-data`
    - `text/plain`

凡是不同时满足上面两个条件，就属于非简单请求。

## CORS 如何工作

首先，浏览器判断请求是简单请求还是复杂请求（非简单请求）。

如果是复杂请求，那么在进行真正的请求之前，浏览器会先使用 OPTIONS 方法发送一个**预检请求** (preflight request)，OPTIONS 是 `HTTP/1.1` 协议中定义的方法，用以从服务器获取更多信息。

该方法不会对服务器资源产生影响，预检请求中同时携带了下面两个首部字段：

- `Access-Control-Request-Method`: 这个字段表明了请求的方法；
- `Access-Control-Request-Headers`: 这个字段表明了这个请求的 Headers；
- `Origin`: 这个字段表明了请求发出的域。

服务端收到请求后，会以 `Access-Control-* response headers` 的形式对客户端进行回复：

- `Access-Control-Allow-Origin`: 能够被允许发出这个请求的域名，也可以使用`*`来表明允许所有域名；
- `Access-Control-Allow-Methods`: 用逗号分隔的被允许的请求方法的列表；
- `Access-Control-Allow-Headers`: 用逗号分隔的被允许的请求头部字段的列表；
- `Access-Control-Max-Age`: 这个**预检请求能被缓存的最长时间**，在缓存时间内，同一个请求不会再次发出预检请求。

## 简单请求

对于简单请求，浏览器直接发出 CORS 请求。具体来说，就是在头信息之中，自动增加一个 Origin 字段，用来说明请求来自哪个源。服务器拿到请求之后，在回应时对应地添加`Access-Control-Allow-Origin`字段，如果 Origin 不在这个字段的范围中，那么浏览器就会将响应拦截。

**Access-Control-Allow-Credentials**。这个字段是一个布尔值，表示是否允许发送 Cookie，对于跨域请求，浏览器对这个字段默认值设为 false，而如果需要拿到浏览器的 Cookie，需要添加这个响应头并设为 true, 并且在前端也需要设置`withCredentials`属性：

```js
let xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

**Access-Control-Expose-Headers**。这个字段是给 `XMLHttpRequest` 对象赋能，让它不仅可以拿到基本的 6 个响应头字段（包括`Cache-Control、Content-Language、Content-Type、Expires、Last-Modified和Pragma`）, 还能拿到这个字段声明的响应头字段。比如这样设置:

```http
Access-Control-Expose-Headers: aaa
```

那么在前端可以通过 `XMLHttpRequest.getResponseHeader('aaa')` 拿到 aaa 这个字段的值。

### 举个栗子

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

非简单请求相对而言会有些不同，体现在两个方面: **预检请求**和**响应字段**。

### 预检请求

比如使用 PUT 请求方法：

```js
const url = "http://127.0.0.1:8000";
const data = { username: "example" };

const myHeaders = new Headers({
  "X-Custom-Header": "xxx"
});
fetch(url, {
  method: "PUT",   // 改成 PUT
  headers: myHeaders,
  body: JSON.stringify(data),
  mode: "cors"
})
  .then(res => res.json())
  .then(res => {
    console.log(JSON.parse(res.postData)); //{username: "example"}
  });
```

Node 部分：

```js
res.writeHead(200, {
  "Content-Type": "text/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PUT, POST, GET",
  "Access-Control-Allow-Headers": "X-Custom-Header",
  "Access-Control-Max-Age": 2000,
  "Access-Control-Allow-Credentials": true
});
```

当这段代码执行后，首先会发送**预检请求**。这个预检请求的请求行和请求体是下面这个格式:

```http
OPTIONS / HTTP/1.1
Host: 127.0.0.1:8000
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: x-custom-header
Origin: http://127.0.0.1:8001
```

预检请求的方法是`OPTIONS`，同时会加上 Origin 源地址和 Host 目标地址，这很简单。同时也会加上两个关键的字段:

- `Access-Control-Request-Method`, 列出 CORS 请求用到哪个 HTTP 方法
- `Access-Control-Request-Headers`，指定 CORS 请求将要加上什么请求头

这是预检请求。接下来是**响应字段**。

响应字段也分为两部分，一部分是对于**预检请求的响应**，一部分是对于**CORS 请求的响应**。

**预检请求的响应**：

```http
HTTP/1.1 200 OK
Content-Type: text/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: PUT, POST, GET
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Max-Age: 2000
Access-Control-Allow-Credentials: true
Date: Fri, 27 Mar 2020 08:16:58 GMT
Connection: keep-alive
Transfer-Encoding: chunked
```

在预检请求的响应返回后，如果请求不满足响应头的条件，则触发`XMLHttpRequest`的`onerror`方法，当然后面真正的 CORS 请求也不会发出去了。

**CORS 请求的响应**：现在它和简单请求的情况是一样的。浏览器自动加上 Origin 字段，服务端响应头返回 `Access-Control-Allow-Origin`。在设置的`Access-Control-Max-Age: 2000`里是不会再次发送预检请求的，除非时间过期。

## 参考资料

- [什么是跨域？浏览器如何拦截响应？如何解决](https://juejin.im/post/5e76bd516fb9a07cce750746#heading-67)
- 阮一峰 [跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)
- MDN [HTTP 访问控制（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
- [使用 Fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)
- [HTTP协议原理+实践Web开发工程师必学](https://coding.imooc.com/learn/list/225.html) - 慕课网付费课程
