---
title: 如何在 Nginx 服务器上配置免费 SSL
date: 2020-04-04 21:56:50
tags:
  - Ubuntu
  - Hexo
  - 阿里云
  - Nginx
categories:
  - 服务端
---

> 安装 https 阿里云免费云盾 SSL 证书、升级 http2、http 强制 https 的方式等...

<!--more-->

## 前提

```txt
操作系统 Ubuntu 18.04 64位
nginx version: nginx/1.14.0 (Ubuntu)
```

## 云盾 SSL 证书下载

我使用的阿里云免费型 DV SSL，有效期一年。关于如何申请免费证书，可以去`阿里云/云盾 SSL 证书`下去申请，里面有非常详细的使用文档。

申请好证书，选择自己的服务器类型并下载，比如我的是 Nginx，就下载 Nginx。然后，解压会有两个文件：

```sh
~/Downloads ❯❯❯ cd 3713633_www.yangtao.site_nginx/
~/D/3713633_www.yangtao.site_nginx ❯❯❯ ls
3713633_www.yangtao.site.key 3713633_www.yangtao.site.pem
```

接着，我们把下载好的文件上传给服务器 cert 目录下，使用 `scp` 命令：

> scp 是 secure copy 的缩写, scp 是 linux 系统下基于 ssh 登陆进行安全的远程文件拷贝命令。
> scp 是加密的，rcp 是不加密的，scp 是 rcp 的加强版。

注意：cert 的目录，一般是在 `/usr/local/nginx/cert/`，但是我的目录是：`/etc/nginx/cert`

```sh
nginx -v
nginx version: nginx/1.14.0 (Ubuntu)
```

```sh
scp 3713633_www.yangtao.site.key 3713633_www.yangtao.site.pem root@47.101.33.81:/etc/nginx/cert/
root@47.101.33.81's password:
Permission denied, please try again.
root@47.101.33.81's password:
3713633_www.yangtao.site.key            100% 1675    88.9KB/s   00:00
3713633_www.yangtao.site.pem            100% 3675   274.2KB/s   00:00
```

接着去服务端验证下是否存在：

```sh
root@istaotao:/etc/nginx/cert# ls
3713633_www.yangtao.site.key  3713633_www.yangtao.site.pem
```

## 修改 nginx.conf 配置信息

首先，找到 nginx.conf 文件目录：

```sh
root@istaotao:/etc/nginx/cert# find / -name "nginx.conf"
/etc/nginx/nginx.conf
```

在同目录下找到 sites-available

```tree
├── nginx.conf
├── nginx.conf.bak
├── proxy_params
├── scgi_params
├── sites-available
│   ├── default
│   ├── default.bak
```

并打开 `vim default` 进行编辑：

```sh
server {
  listen 443 ssl;   #SSL协议访问端口号为443。此处如未添加ssl，可能会造成Nginx无法启动。
  #需要将 cert-file-name.pem cert-file-name.key 替换成已上传的证书文件的名称。
  ssl_certificate cert/cert-file-name.pem;
  ssl_certificate_key cert/cert-file-name.key;
  ssl_session_timeout 5m;
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;  #使用此加密套件。

  root /var/www/hexo/;  #站点根目录
  index index.html index.htm;
  server_name yangtao.site www.yangtao.site;  #修改为证书绑定的域名

  location / {
    # First attempt to serve request as file, then
    # as directory, then fall back to displaying a 404.
    try_files $uri $uri/ =404;
  }
  location /vuepress {
    root /var/www/;
    try_files $uri $uri/ =404;
  }
}
```

重点就是把我们自己的证书文件目录发上去：

```sh
#需要将 cert-file-name.pem cert-file-name.key 替换成已上传的证书文件的名称。
ssl_certificate cert/3713633_www.yangtao.site.pem;
ssl_certificate_key cert/3713633_www.yangtao.site.key;
```

接着，保存并退出；验证是否正确，再重启 nginx：

```sh
# 验证
sudo nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

# 重启
sudo nginx -s reload

# 或者
/usr/sbin/nginx -s reload

# 或者
sudo systemctl reload nginx
```

最后打开我们的网址，验证网址栏是否有小锁标志，并可以点击它查看具体证书详情。

免费证书有效期为一年，到时候会提前邮件通知，可以重复以上操作替换证书即可。

## 升级 HTTP2

修改 nginx 配置，原本 https 的 listen 为：

```sh
listen 443 ssl;
```

现在在后面加上 http2：

```sh
listen 443 ssl http2;
```

然后，关闭 Nginx，重启。这时候去看页面，原本的 http1.1 就会变成 http2。

参考资料：[怎样把网站升级到 http/2](https://zhuanlan.zhihu.com/p/29609078)

## 强制 http 跳转 https

> 很多网站虽然支持 https, 但是直接在浏览器地址栏输入网址后, 默认仍是以 http 协议去访问的, http 强制跳转 https 的需求应运而生

使用 curl 命令打开百度地址：

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

可以看到百度很巧妙的利用 meta 的刷新作用，将 baidu.com 跳转到 www.baidu.com。

然后在 `/etc/nginx/vhost`下新建 `hexo.conf`（之前有 include 过：`include /etc/nginx/vhost/*.conf;`）:

```sh
server {
  listen 80;
  server_name yangtao.site;

  location / {
      root /var/www/html/refresh/;
  }
}
```

根据 root 目录在 html 下新建`refresh/index.html`目录，并编辑 index.html 文件：

```html
<html>
  <meta http-equiv="refresh" content="0;url=https://www.yangtao.site/" />
</html>
```

## 参考资料

- [在 Nginx/Tengine 服务器上安装证书](https://help.aliyun.com/document_detail/98728.html?spm=5176.2020520163.0.0.36a756a7iFDdyN)
- [Nginx 配置 https 证书](https://www.cnblogs.com/chnmig/p/10343890.html)
- [nginx 配置 http 强制跳转 https](https://www.jianshu.com/p/29add30461ec)
- [如何在 Ubuntu 20.04 中安装和配置 Nginx](https://kalasearch.cn/community/tutorials/how-to-install-nginx-on-ubuntu-20-04/)
