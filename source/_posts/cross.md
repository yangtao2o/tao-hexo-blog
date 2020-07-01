---
title: 解决跨域问题的几种方案
date: 2020-05-19 10:28:36
tags:
  - http
categories:
  - 网络知识
---

> JSONP 请求本质上是利用了 “Ajax 请求会受到同源策略限制，而 script 标签请求不会” 这一点来绕过同源策略。
> 跨域资源共享(CORS) 是一种机制，它使用额外的 HTTP 头来告诉浏览器 让运行在一个 origin (domain) 上的 Web 应用被准许访问来自不同源服务器上的指定的资源。 --- MDN

<!--more-->

## 跨域的解决方案

- **jsonp**：只支持 GET，不支持 POST 请求，不安全 XSS
- **cors**：需要后台配合进行相关的设置
- **postMessage**：配合使用 iframe，需要兼容 IE6、7、8、9
- **document.domain**：仅限于同一域名下的子域
- **websocket**：需要后台配合修改协议，不兼容，需要使用 socket.io
- **proxy**：使用代理去避开跨域请求，需要修改 nginx、apache 等的配置

## 同源策略

什么是同源策略，其作用是什么？

同源策略指的是：协议+域名+端口三者皆相同，可以视为在同一个域，否则为不同域。同源策略限制了从同一个源加载的文档或脚本如何与来自另一个源的资源进行交互。

作用是一个用于隔离潜在恶意文件的重要安全机制。

所限制的跨域交互包括：

- Cookie、LocalStorage、IndexdDB 等存储内容；
- DOM 节点；
- Ajax 请求。

## Ajax 为什么不能跨域

Ajax 其实就是向服务器发送一个 GET 或 POST 请求，然后取得服务器响应结果，返回客户端。Ajax 跨域请求，在服务器端不会有任何问题，只是服务端响应数据返回给浏览器的时候，浏览器根据响应头的`Access-Control-Allow-Origin`字段的值来判断是否有权限获取数据。

因此，服务端如果没有设置跨域字段设置，跨域是没有权限访问，数据被浏览器给拦截了。

所以，要解决的问题是：**如何从客户端拿到返回的数据**？

其实，在同源策略的基础上，选择性地为同源策略开放了一些后门。例如 img、script、style 等标签，都允许跨域引用资源。

所以， JSONP 来了。

## JSONP 实现

`JSONP`(JSON with Padding（填充）)是 JSON 的一种“使用模式”，本质不是 Ajax 请求，是 script 标签请求。

`JSONP` 请求本质上是利用了 “Ajax 请求会受到同源策略限制，而 script 标签请求不会” 这一点来绕过同源策略。

简单 JSONP 实现：

```js
class Jsonp {
  constructor(req) {
    this.url = req.url;
    this.callbackName = req.callbackName;
  }
  create() {
    const script = document.createElement("script");
    const url = `${this.url}?callback=${this.callbackName}`;
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  }
}

new Jsonp({
  url: "http://127.0.0.1:8000/",
  callbackName: "getMsg"
}).create();

function getMsg(data) {
  data = JSON.parse(data);
  console.log(`My name is ${data.name}, and ${data.age} years old.`);
}
```

服务端（Node）:

```js
const http = require("http");
const querystring = require("querystring");

const server = http.createServer((req, res) => {
  const url = req.url;
  const query = querystring.parse(url.split("?")[1]);
  const { callback } = query;
  const data = {
    name: "Yang Min",
    age: "8"
  };
  res.end(`${callback}('${JSON.stringify(data)}')`);
});

server.listen(8000);
```

前端利用 `http-server -p 8001 .`，开启一个服务，然后 Node 也开启一个端口为 8000 的服务，运行：

```text
My name is Yang Min, and 8 years old.
```

### 一个 JSONP 的步骤实质

客户端发送 script 请求，参数中带着处理返回数据的回调函数的名字 (通常是 callback)，如请求 script 的 url 是：

```url
http://127.0.0.1:8000/?callback=getMsg
```

服务端收到请求，以回调函数名和返回数据组成立即执行函数的字符串，比如：其中 callback 的值是客户端发来的回调函数的名字，假设回调函数的名字是 getMsg，返回脚本的内容就是：

```js
getMsg("{name: 'Yang Min', age: '8'}");
```

客户端收到 JavaScript 脚本内容后，立即执行脚本，这样就实现了获取跨域服务器数据的目的。

很明显，由于 JSONP 技术本质上利用了 script 脚本请求，所以只能实现 GET 跨域请求，这也是 JSONP 跨域的最大限制。

由于 server 产生的响应为 json 数据的包装（故称之为 jsonp，即 json padding），形如：`getMsg("{name: 'Yang Min', age: '8'}")`

## JSONP 封装

客户端：

```js
const jsonp = ({ url, params, callbackName }) => {
  const generateURL = () => {
    let dataStr = "";
    for (let key in params) {
      dataStr += `${key}=${params[key]}&`;
    }
    dataStr += `callback=${callbackName}`;
    return `${url}?${dataStr}`;
  };
  return new Promise((resolve, reject) => {
    // 初始化回调函数名称
    callbackName =
      callbackName ||
      "cb" +
        Math.random()
          .toString()
          .replace(".", "");
    let scriptEle = document.createElement("script");
    scriptEle.src = generateURL();
    document.body.appendChild(scriptEle);

    // 绑定到 window 上，为了后面调用
    window[callbackName] = data => {
      resolve(data);
      // script 执行完了，成为无用元素，需要清除
      document.body.removeChild(scriptEle);
    };
  });
};

jsonp({
  url: "http://127.0.0.1:8000/",
  params: {
    name: "Yang Min",
    age: "8"
  },
  callbackName: "getData"
})
  .then(data => JSON.parse(data))
  .then(data => {
    console.log(data); // {name: "Yang Min", age: "8"}
  });
```

Node 端：

```js
const http = require("http");
const querystring = require("querystring");

const server = http.createServer((req, res) => {
  const url = req.url;
  const query = querystring.parse(url.split("?")[1]);
  const { name, age, callback } = query;
  const data = {
    name,
    age
  }
  res.end(`${callback}('${JSON.stringify(data)}')`);
});

server.listen(8000);
```

## jQuery 中的 JSONP

Node 部分不变，使用 jQuery(3.4.1) 如下：

```js
function getAjaxData() {
  $.ajax({
    type: "get",
    async: false,
    url: "http://127.0.0.1:8000/",
    dataType: "jsonp", //由 JSON 改为 JSONP
    jsonp: "callback", //传递给请求处理程序或页面的，标识jsonp回调函数名(一般为:callback)
    jsonpCallback: "getData", //callback的function名称，成功就会直接走 success 方法
    success: function(data) {
      data = JSON.parse(data);
      console.log(`My name is ${data.name}, and ${data.age} years old.`);
    },
    error: function() {
      console.log("Error");
    }
  });
}
getAjaxData();
```

使用延迟对象重新写下：

```js
function getAjaxData() {
  const def = $.ajax({
    type: "get",
    async: false,
    url: "http://127.0.0.1:8000/",
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "getData"
  });

  def
    .done(data => {
      data = JSON.parse(data);
      console.log(`My name is ${data.name}, and ${data.age} years old.`);
    })
    .fail(err => {
      console.log(err);
    });
}
```

## JSONP 缺点

- 只支持 GET 请求
- 只支持跨域 HTTP 请求这种情况，不能解决不同域的两个页面之间如何进行 JavaScript 调用的问题
- 调用失败的时候不会返回各种 HTTP 状态码。
- 安全性，万一假如提供 JSONP 的服务存在页面注入漏洞，即它返回的 javascript 的内容被人控制的。

## 跨域资源共享 CORS

> 跨域资源共享(CORS) 是一种机制，它使用额外的 HTTP 头来告诉浏览器 让运行在一个 origin (domain) 上的 Web 应用被准许访问来自不同源服务器上的指定的资源。 --- MDN

允许在下列场景中使用跨域 HTTP 请求：

- 由 `XMLHttpRequest` 或 `Fetch` 发起的跨域 HTTP 请求
- Web 字体 (CSS 中通过 `@font-face` 使用跨域字体资源)
- `WebGL` 贴图
- 使用 drawImage 将 Images/video 画面绘制到 `canvas`

## 简单请求、非简单请求

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
  method: "PUT", // 改成 PUT
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

## Nginx Proxy

Nginx 是一种高性能的反向代理服务器，可以用来轻松解决跨域问题。

反向代理拿到客户端的请求，将请求转发给其他的服务器，主要的场景是维持服务器集群的负载均衡，换句话说，反向代理帮其它的服务器拿到请求，然后选择一个合适的服务器，将请求转交给它。

```conf
server {
  listen  80;
  server_name  client.com;
  location /api {
    proxy_pass server.com;
  }
}
```

Nginx 相当于起了一个跳板机，这个跳板机的域名也是`client.com`，让客户端首先访问 `client.com/api`，这当然没有跨域，然后 Nginx 服务器作为反向代理，将请求转发给`server.com`，当响应返回时又将响应给到客户端，这就完成整个跨域请求的过程。

## websocket

客户端发送信息给服务端，如果想实现客户端向客户端通信，只能通过 Client A -> Server -> Client B。关于 websocket，可以学习阮一峰老师的这篇[WebSocket 教程](http://www.ruanyifeng.com/blog/2017/05/websocket.html)。

WebSocket 最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于服务器推送技术的一种。

特点：

- 建立在 TCP 协议之上，服务器端的实现比较容易。
- 与 HTTP 协议有着良好的兼容性。默认端口也是 80 和 443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。
- 数据格式比较轻量，性能开销小，通信高效。
- 可以发送文本，也可以发送二进制数据。
- 没有同源限制，客户端可以与任意服务器通信。
- 协议标识符是 ws（如果加密，则为 wss），服务器网址就是 URL。

使用：

- MDN [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket)
- [Node ws](https://github.com/websockets/ws)
- [WebSocket-Node](https://github.com/theturtle32/WebSocket-Node)

客户端我们使用`http-server -p 8001 ./` 开启一个服务访问前端内容：

```js
const socket = new WebSocket("ws://localhost:8080");

socket.addEventListener("open", function(event) {
  console.log("Connection open ...");
  socket.send("Hello Server!");
});

socket.addEventListener("message", function(event) {
  console.log("Message from server: ", event.data);
  socket.close();
});

socket.addEventListener("close", function(event) {
  console.log("Connection closed.");
});
```

服务端使用 Node 开启一个 websocket 服务：

```js
// 服务端
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  ws.send("something");
});
```

客户端输出：

```log
Connection open ...
Message from server:  something
Connection closed.
```

服务端输出：

```log
received: Hello Server!
```

## document.domain

常用于处理 iframe 下跨域请求 DOM 资源（如提交表单等），该方式只能用于二级域名相同的情况下，比如 `a.test.com` 和 `b.test.com` 适用于该方式。

只需要给页面添加 `document.domain = 'test.com'` 表示二级域名都相同就可以实现跨域。

如下：访问`http://test.com:8001/a.html`，如果不设置 `document.domain = "test.com";`，去访问 `http://www.test.com:8001/b.html` DOM 资源，就会被阻断。

注：可添加 host：`127.0.0.1 test.com`，方便测试。

a.html:

```html
<body>
  <h1>Hi, this is A html.</h1>
  <iframe
    id="frame"
    src="http://www.test.com:8001/b.html"
    frameborder="0"
    onload="load()"
  ></iframe>
  <script>
    document.domain = "test.com"; //设置domain
    function load() {
      let frame = document.getElementById("frame");
      console.log(frame.contentWindow.data); // This is b html content.
    }
  </script>
</body>
```

b.html:

```html
<body>
  <h1>Hi, this is B html.</h1>
  <script>
    document.domain = "test.com"; //设置domain
    var data = "This is b html content.";
  </script>
</body>
```

## postMessage

这种方式通常用于获取嵌入页面中的第三方页面数据。一个页面发送消息，另一个页面判断来源并接收消息

```js
// 发送消息端
window.parent.postMessage("message", "http://test.com");
// 接收消息端
var mc = new MessageChannel();
mc.addEventListener("message", event => {
  var origin = event.origin || event.originalEvent.origin;
  if (origin === "http://test.com") {
    console.log("验证通过");
  }
});
```

举个栗子：
发送方 a.html，端口号为 8000：

```html
<body>
  <h1>Hi, this is A html.</h1>
  <iframe
    id="frame"
    src="http://127.0.0.1:8001/b.html"
    frameborder="0"
    onload="load()"
  ></iframe>
  <script>
    function load() {
      let frame = document.getElementById("frame");
      frame.contentWindow.postMessage("我很帅", "http://127.0.0.1:8001");
      window.onmessage = function(event) {
        console.log("From b.html data: ", event.data);
      };
    }
  </script>
</body>
```

接收方 b.html，端口号为 8001：

```html
<body>
  <h1>Hi, this is B html.</h1>
  <script>
    window.onmessage = function(event) {
      var origin = event.origin || event.originalEvent.origin;
      if (origin === "http://127.0.0.1:8000") {
        console.log("From a.html data: ", event.data);
        event.source.postMessage("不要脸", event.origin);
      }
    };
  </script>
</body>
```

输出：

```log
From a.html data:  我很帅      b.html
From b.html data:  不要脸      a.html
```

## 参考资料

- [什么是跨域？浏览器如何拦截响应？如何解决](https://juejin.im/post/5e76bd516fb9a07cce750746#heading-67)
- [jsonp 跨域原理分析](https://segmentfault.com/a/1190000009773724) - 分析了 Ajax 和 jsonp 之间的关系
- 阮一峰 [跨域资源共享 CORS 详解](http://www.ruanyifeng.com/blog/2016/04/cors.html)
- [前端必须懂的计算机网络知识—(跨域、代理、本地存储)](https://juejin.im/post/5bb1cc2af265da0ae5052496)
- MDN [HTTP 访问控制（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)
- [使用 Fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)
- [HTTP 协议原理+实践 Web 开发工程师必学](https://coding.imooc.com/learn/list/225.html) - 慕课网付费课程

