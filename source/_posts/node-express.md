---
title: Express、Koa 初始化
date: 2019-02-17 00:36:20
tags:
- Nodejs
categories:
- Nodejs
---

> 对比一下 express 和 koa 的入口文件

<!--more-->

## express 初始化

```js
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// 加载路由控制
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

// 创建实例
var app = express();

// 创建 ejs 模板引擎即模板文件位置
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// 定义日志和输出级别
app.use(logger("dev"));
// JSON 解析中间件
app.use(express.json());
// application/x-www-form-urlencode请求解析中间件
app.use(express.urlencoded({ extended: false }));
// 定义cookie解析器
app.use(cookieParser());
// HTTP 伪造中间件
app.use(express.methodOverride());
// 定义静态文件目录
app.use(express.static(path.join(__dirname, "public")));

// 匹配路径和路由
app.use("/", indexRouter);

// 404 错误处理
app.use(function(req, res, next) {
  next(createError(404));
});

// 500 错误处理及错误堆栈跟踪
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
```

## Koa 初始化

```js
const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");

const index = require("./routes/index");
const users = require("./routes/users");

const ENV = app.env;

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"]
  })
);
app.use(json());

app.use(logger("dev"));

app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug"
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
// app.use(users.routes(), users.allowedMethods())
app.use(user.routes(), index.allowedMethods());
app.use(blog.routes(), index.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
```

## 实例目录

* [网站初始化，实现 GET 和 POST 的 Ajax 请求](https://github.com/yangtao2o/node-express-mongodb/blob/master/doc/doc-01-init.md)
* [登录模块](https://github.com/yangtao2o/node-express-mongodb/blob/master/doc/doc-02-login.md)
* [上传图片模块](https://github.com/yangtao2o/node-express-mongodb/blob/master/doc/doc-02-login.md)

> 原文地址：[Node.js+Express+MongoDB 建站实例](https://github.com/jiaoyanlin/myNodeProject)
