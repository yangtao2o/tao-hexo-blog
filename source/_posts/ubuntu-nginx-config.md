---
title: 如何在 Ubuntu 18.04 中安装和配置 Nginx
date: 2021-03-21 16:24:39
tags:
  - Ubuntu
  - Nginx
categories:
  - 服务端
---

> Nginx 是一款轻量级的 Web 服务器/反向代理服务器及电子邮件（IMAP/POP3）代理服务器，其特点是占有内存少，并发能力强。很多情况下，它比 Apache 占用更少资源，并且可以使用它作为 Web 服务器或反向代理来使用。

<!--more-->

## 前提工作

首先，我自己使用的是阿里云的云服务器 `Ubuntu 18.04 64位`，并有 root 用户权限，可远程登录。如：

```sh
⟩ ssh root@47.101.33.81
root@47.101.33.81's password:
```

### 第一步：安装 Nginx

由于 Nginx 可以从 ubuntu 软件源中获得，因此我们可以使用 apt 来安装 Nginx。

我们可以使用以下命令安装 Nginx 到 Ubuntu 中。

```sh
sudo apt update
sudo apt install nginx
```

### 第二步：调整防火墙

防火墙是一个用来监视和过滤进出网络流量的工具。它通过定义一系列安全规则，来决定是否允许或者屏蔽指定的流量。

Ubuntu 自带的防火墙配置工具被称为 UFW (Uncomplicated Firewall)。UFW 是一个用来管理 iptables 防火墙规则的用户友好的前端工具。它的主要目的就是为了使得管理 iptables 更简单，就像名字所说的，简单的。

我们需要调整防火墙，让他允许 Nginx 服务通过。Nginx ufw 在安装时会把他自身注册成为服务。

```sh
root@istaotao:~# sudo ufw app list
Available applications:
  Nginx Full
  Nginx HTTP
  Nginx HTTPS
  OpenSSH
```

可以看到 Nginx 提供了三个配置文件：

- Nginx Full：开端口 80 正常，未加密的网络流量；端口 443 TLS / SSL 加密的流量

- Nginx HTTP：仅打开端口 80 正常，未加密

- Nginx HTTPS：仅打开端口 443 TLS / SSL 加密

检查 UFW 的状态，输入：

```sh
sudo ufw status verbose
```

输出如下所示，说明 ufw 是默认状态：

```sh
Status: inactive
```

如上所示默认情况下，UFW 阻塞了所有进来的连接，但允许所有出去的连接。这意味着任何人无法访问你的服务器，除非你打开端口。运行在服务器上的应用和服务可以访问外面的世界。

启用 UFW：

```sh
sudo ufw enable
```

输出如下，你将会被警告启用防火墙可能会中断现有的 SSH 连接，输入"y”，并且回车。

```sh
Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
Firewall is active and enabled on system startup
```

然后看一下使用防火墙之后的状态：

```sh
sudo ufw status
Status: active

To                         Action      From
--                         ------      ----
Nginx HTTP                 ALLOW       Anywhere
Nginx HTTPS                ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
22/tcp                     ALLOW       Anywhere
Nginx HTTP (v6)            ALLOW       Anywhere (v6)
Nginx HTTPS (v6)           ALLOW       Anywhere (v6)
Nginx Full (v6)            ALLOW       Anywhere (v6)
22/tcp (v6)                ALLOW       Anywhere (v6)
```

如果要看具体的配置和包含规则的信息，如下：

```sh
sudo ufw app info 'Nginx Full'
Profile: Nginx Full
Title: Web Server (Nginx, HTTP + HTTPS)
Description: Small, but very powerful and efficient web server

Ports:
  80,443/tcp
```

如果只是单独开启某一项配置，可使用：

```sh
sudo ufw allow ssh
sudo ufw enable
```

如果要禁用 UFW，直接`sudo ufw disable`。
如果要重置 UFW，直接`sudo ufw reset`。

### 第三步：检查我们的 Web 服务器

在安装结束后，Ubuntu 会启动 Nginx。 Web 服务器应该已经在运行了。

我们可以通过 systemd 来检查 init 系统状态，确保它正在运行：

```sh
root@istaotao:~# systemctl status nginx
● nginx.service - A high performance web server and a reverse proxy server
   Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2020-04-17 18:13:45 CST; 11 months 3 days ago
     Docs: man:nginx(8)
  Process: 3636 ExecReload=/usr/sbin/nginx -g daemon on; master_process on; -s reload (code=exited, status=0/SUCCESS)
 Main PID: 9797 (nginx)
    Tasks: 2 (limit: 2340)
   CGroup: /system.slice/nginx.service
           ├─3638 nginx: worker process
           └─9797 nginx: master process /usr/sbin/nginx -g daemon on; master_process on;

Apr 17 18:13:45 istaotao systemd[1]: Starting A high performance web server and a reverse proxy server...
```

如上所示，这个服务已经成功启动。接下来我们要直接来测试 Nginx 是否可以通过浏览器访问。

首先我们执行以下命令：

```sh
ip addr show eth0 | grep inet | awk '{ print $2; }' | sed 's/\/.*$//'
```

这可以让我们在浏览器中查看他们是否正常工作。

接着我们要找到服务器在公网上的 ip，我们可以使用这个命令

```sh
curl -4 icanhazip.com
```

获得服务器 ip 后，我们可以在浏览器输入这个 ip 。当然除了公网，我们也可以输入主机的内网 ip 通过局域网来访问。

```sh
http://your_server_ip
```

打开浏览器输入 ip 就能看到 Nginx 的默认页面。这也说明服务器运行起来了。

### 第四步：管理 Nginx

接下来，让我们来学习一下 Nginx 的基本命令。

每次修改完配置文件，首先检查下是否有错误：

```sh
sudo nginx -t
```

要停止 Web 服务器，输入：

```sh
sudo systemctl stop nginx
```

要在停止时，启动 Web 服务器，键入：

```sh
sudo systemctl start nginx
```

要停止，然后再次启动该服务，键入：

```sh
sudo systemctl restart nginx
```

如果我们只是修改配置，Nginx 可以在不终端的情况下热加载。我们可以键入：

```sh
sudo systemctl reload nginx
```

默认情况下，Nginx 会在服务器启动时，跟随系统启动，如果我们不想这样，我们可以用这个命令来禁止：

```sh
sudo systemctl disable nginx
```

要重新让系统启动时引导 Nginx 启动，那么我们可以输入：

```sh
sudo systemctl enable nginx
```

也可以使用 service 管理 Nginx 服务：

```bash
# 停止Nginx服务，请运行：
service nginx stop

# 要再次启动，请键入：
service nginx start

#重新启动Nginx服务：
service nginx restart

#在进行一些配置更改后重新加载Nginx服务：
service nginx reload
```

### 第五步：设置服务器块（Server block）

使用 Nginx Web 服务器时，服务器块（类似于 Apache 中的虚拟主机）可用于封装配置详细信息，并在一台服务器中托管多个域。我们将建立一个名为 example.com 的域，但我们可以用自己的域名替换它。

在 Ubuntu 上的 Nginx 默认情况下启用了一个服务器块（server block），服务器块的配置是为给服务器的目录提供地址 `/var/www/html`。尽管这对于单个站点非常有效，但是如果我们在服务器上托管多个站点，则可能变很臃肿。让我们给`/var/www/html`目录添加上分站点目录。

比如我的网站是 yangtao.site ，那我们创建一个对应的目录 yangtao.site 目录：

```sh
sudo mkdir -p /var/www/yangtao.site/html
```

接下来，使用`$USER`环境变量分配目录的所有权：

```sh
sudo chown -R $USER:$USER /var/www/yangtao.site/html
```

如果我们没有修改自己的 umask 值，那么 Web 根目录的权限应该正确，我们可以通过输入以下命令来确认：

```sh
sudo chmod -R 755 /var/www/yangtao.site
```

然后，编辑 `nano /var/www/yangtao.site/html/index.html`。

接着去创建一个服务器块，新建`/etc/nginx/sites-available/yangtao.site`:

```sh
server {
    listen 80;
    listen [::]:80;

    server_name www.yangtao.site yangtao.site;

    root /var/www/yangtao.site/html;
    index index.html index.htm;

    location  /html {
        try_files $uri $uri/ =404;
    }
}
```

接下来，让我们通过在 sites-enabled 目录新建一个链接，好让 Nginx 在启动过程中会读取这个目录：

```sh
sudo ln -s /etc/nginx/sites-available/yangtao.site /etc/nginx/sites-enabled/
```

现在已启用并配置了两个服务器块，以及基于它们的 listen 和 server_name 指令响应请求：

- example.com: 将会响应 example.com 和 www.example.com的请求
- default: 将会响应 80 端口的请求，以及不能匹配到两个服务器块上的请求

为避免可能由于添加其他服务器名称而引起的哈希存储区内存问题，有必要调整`/etc/nginx/nginx.conf`文件中的单个值。

打开文件：

```sh
sudo nano /etc/nginx/nginx.conf
```

找到`server_names_hash_bucket_size`指令并删除#符号：

```sh
http {
    server_names_hash_bucket_size 64;
}
```

完成后保存并关闭文件。然后，验证并重启：

```sh
sudo nginx -t
sudo systemctl restart nginx
```

这时候，访问`http://yangtao.site/index.html`，就会出现内容了。

```txt
Request URL: http://yangtao.site/index.html
Request Method: GET
Status Code: 200 OK
Remote Address: 47.101.33.81:80
```

### 第六步：学习 Nginx 文件及目录结构

接下来，我们来学习 Nginx 的文件及目录结构。

#### 内容

- `/var/www/html` 默认打开可以看到 Nginx 页面。

- `/var/www/html` 实际的 Web 内容。我们可以通过更改 Nginx 配置来更改文件。

#### 服务器配置

- `/etc/nginx` Nginx 配置目录。所有 Nginx 的配置文件都在这里。

- `/etc/nginx/nginx.conf` Nginx 的配置文件。大多数全局配置可以通过这个文件来修改。

- `/etc/nginx/sites-available/sites-enabled` 用来存储服务器下每个站点服务器块的目录。 默认情况下 Nginx 不会直接使用目录下的配置文件，需要我们更改配置来告诉 Nginx 来去读。

- `/etc/nginx/sites-enabled/sites-available` 这里是存储已经启用站点服务器块的目录。

#### 服务器日志

- `/var/log/nginx/access.log` 这里是 Nginx 到日志文件，对 Web 服务器的每个请求都会记录在这个日志中。

- `/var/log/nginx/error.log 记录 Nginx 运行过程中发生的错误日志。

## 参考资料

- [如何在 Ubuntu 20.04 上使用 UFW 来设置防火墙](https://cloud.tencent.com/developer/article/1627453)
- [如何在 Ubuntu 20.04 中安装和配置 Nginx](https://kalasearch.cn/community/tutorials/how-to-install-nginx-on-ubuntu-20-04/)
