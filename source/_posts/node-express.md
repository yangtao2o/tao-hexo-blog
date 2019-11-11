---
title: 使用Node.js+Express+MongoDB 建站实例
date: 2019-02-17 00:36:20
tags:
- Nodejs
categories:
- Nodejs
---

## 初始化一个 Express

```js
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 加载路由控制
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


// 创建实例
var app = express();

// 创建 ejs 模板引擎即模板文件位置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// 定义日志和输出级别
app.use(logger('dev'));  
// JSON 解析中间件
app.use(express.json());
// application/x-www-form-urlencode请求解析中间件
app.use(express.urlencoded({ extended: false }));
// 定义cookie解析器
app.use(cookieParser());
// HTTP 伪造中间件
app.use(express.methodOverride())
// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 匹配路径和路由
app.use('/', indexRouter);

// 404 错误处理
app.use(function(req, res, next) {
  next(createError(404));
});

// 500 错误处理及错误堆栈跟踪
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
```

## 实例目录

* [网站初始化，实现 GET 和 POST 的 Ajax 请求](https://github.com/yangtao2o/node-express-mongodb/blob/master/doc/doc-01-init.md)
* [登录模块](https://github.com/yangtao2o/node-express-mongodb/blob/master/doc/doc-02-login.md)
* [上传图片模块](https://github.com/yangtao2o/node-express-mongodb/blob/master/doc/doc-02-login.md)

> 原文地址：[Node.js+Express+MongoDB 建站实例](https://github.com/jiaoyanlin/myNodeProject)
