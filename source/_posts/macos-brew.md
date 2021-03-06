---
title: macOS安装homebrew报错 LibreSSL SSL_read SSL_ERROR_SYSCALL errno 54
date: 2018-08-05 16:55:14
tags:
- MacOS
- Homebrew
categories:
- 系统
---

> LibreSSL SSL_read: SSL_ERROR_SYSCALL, errno 54

<!--more-->

## curl 总是报 443 的解决办法（20200718 更新）

### 查询真实 IP

在[https://www.ipaddress.com/](https://www.ipaddress.com/)查询`raw.githubusercontent.com`的真实 IP。

### 修改 hosts

```sh
sudo vim /etc/hosts
```

添加如下内容：

```sh
199.232.28.133 raw.githubusercontent.com
```

## 中科院的镜像

### 安装

```bash
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```

### 报错

```bash
==> Tapping homebrew/core
Cloning into '/usr/local/Homebrew/Library/Taps/homebrew/homebrew-core'...
fatal: unable to access 'https://github.com/Homebrew/homebrew-core/': LibreSSL SSL_read: SSL_ERROR_SYSCALL, errno 54
Error: Failure while executing; `git clone https://github.com/Homebrew/homebrew-core /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core --depth=1` exited with 128.
Error: Failure while executing; `/usr/local/bin/brew tap homebrew/core` exited with 1.
```

### 解决：

- 执行下面这句命令，更换为中科院的镜像：

```bash
git clone git://mirrors.ustc.edu.cn/homebrew-core.git/ /usr/local/Homebrew/Library/Taps/homebrew/homebrew-core --depth=1
```

- 把 homebrew-core 的镜像地址也设为中科院的国内镜像

```bash
cd "$(brew --repo)"

git remote set-url origin https://mirrors.ustc.edu.cn/brew.git

cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"

git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
```

- 更新

```bash
brew update
```

- 使用

```bash
brew install node
```

## 参考资料

- 报错解决：[macOS High Sierra10.13.3 安装 homebrew 报错 LibreSSL SSL_read: SSL_ERROR_SYSCALL, errno 54 解决方法](https://blog.csdn.net/qq_35624642/article/details/79682979)
- [Mac 安装，简单实用，卸载 homebrew 详细教程](https://blog.csdn.net/qq_41234116/article/details/79366454)
