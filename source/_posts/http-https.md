---
title: 在 Nginx 服务器上配置 HTTPS 证书
date: 2020-04-04 21:56:50
tags:
  - Ubuntu
  - Hexo
categories:
  - 服务端
---

> 安装 https 证书的一些过程

<!--more-->

## 下载证书

我使用的阿里云免费个人版，有效期一年。

```sh
~/Downloads ❯❯❯ cd 3713633_www.yangtao.site_nginx/
~/D/3713633_www.yangtao.site_nginx ❯❯❯ ls
3713633_www.yangtao.site.key 3713633_www.yangtao.site.pem
~/D/3713633_www.yangtao.site_nginx ❯❯❯
scp 3713633_www.yangtao.site.key 3713633_www.yangtao.site.pem root@47.101.33.81:/usr/local/nginx/cert/
root@47.101.33.81's password:
Permission denied, please try again.
root@47.101.33.81's password:
3713633_www.yangtao.site.key            100% 1675    88.9KB/s   00:00
3713633_www.yangtao.site.pem            100% 3675   274.2KB/s   00:00
~/D/3713633_www.yangtao.site_nginx ❯❯❯
```

```sh
root@istaotao:/usr/local/nginx/cert# ls
3713633_www.yangtao.site.key  3713633_www.yangtao.site.pem
```

## 修改配置

按照下文中注释内容修改 nginx.conf 文件：

```sh
server {
  listen 443 ssl;   #SSL协议访问端口号为443。此处如未添加ssl，可能会造成Nginx无法启动。
  server_name localhost;  #将localhost修改为您证书绑定的域名，例如：www.example.com。
  root html;
  index index.html index.htm;
  ssl_certificate cert/domain name.pem;   #将domain name.pem替换成您证书的文件名。
  ssl_certificate_key cert/domain name.key;   #将domain name.key替换成您证书的密钥文件名。
  ssl_session_timeout 5m;
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;  #使用此加密套件。
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;   #使用该协议进行配置。
  ssl_prefer_server_ciphers on;
  location / {
    root html;   #站点目录。
    index index.html index.htm;
  }
}
```

## 强制 http 跳转

使用 curl 命令：

```sh
~ ❯❯❯ curl baidu.com -v
*   Trying 220.181.38.148...
* TCP_NODELAY set
* Connected to baidu.com (220.181.38.148) port 80 (#0)
> GET / HTTP/1.1
> Host: baidu.com
> User-Agent: curl/7.64.1
> Accept: */*
>
< HTTP/1.1 200 OK
< Date: Sat, 04 Apr 2020 16:33:35 GMT
< Server: Apache
< Last-Modified: Tue, 12 Jan 2010 13:48:00 GMT
< ETag: "51-47cf7e6ee8400"
< Accept-Ranges: bytes
< Content-Length: 81
< Cache-Control: max-age=86400
< Expires: Sun, 05 Apr 2020 16:33:35 GMT
< Connection: Keep-Alive
< Content-Type: text/html
<
<html>
<meta http-equiv="refresh" content="0;url=http://www.baidu.com/">
</html>
* Connection #0 to host baidu.com left intact
* Closing connection 0
~ ❯❯❯
```

可以看到百度很巧妙的利用 meta 的刷新作用，将 baidu.com 跳转到 www.baidu.com
同理, 我们也可以用这个特性来实现 http 向 https 的跳转

```html
# index.html
<html>
  <meta http-equiv="refresh" content="0;url=https://www.yangtao.site/" />
</html>
```

```sh
server {
  listen 80;
  server_name yangtao.site;

  location / {
      root /var/www/html/refresh/;
  }
}
```

测试 [yangtao.site](https://www.yangtao.site)：

```sh
~ ❯❯❯ curl yangtao.site -v
*   Trying 47.101.33.81...
* TCP_NODELAY set
* Connected to yangtao.site (47.101.33.81) port 80 (#0)
> GET / HTTP/1.1
> Host: yangtao.site
> User-Agent: curl/7.64.1
> Accept: */*
>
< HTTP/1.1 200 OK
< Server: nginx/1.14.0 (Ubuntu)
< Date: Sat, 04 Apr 2020 16:34:16 GMT
< Content-Type: text/html
< Content-Length: 91
< Last-Modified: Sat, 04 Apr 2020 16:04:03 GMT
< Connection: keep-alive
< ETag: "5e88aff3-5b"
< Accept-Ranges: bytes
<
<html>
    <meta http-equiv="refresh" content="0;url=https://www.yangtao.site/">
</html>
* Connection #0 to host yangtao.site left intact
* Closing connection 0
```

## 参考资料

- [在 Nginx/Tengine 服务器上安装证书](https://help.aliyun.com/document_detail/98728.html?spm=5176.2020520163.0.0.36a756a7iFDdyN)
- [Nginx 配置 https 证书](https://www.cnblogs.com/chnmig/p/10343890.html)
- [nginx 配置 http 强制跳转 https](https://www.jianshu.com/p/29add30461ec)
