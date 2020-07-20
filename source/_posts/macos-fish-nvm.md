---
title: Fish 环境下如何安装 nvm
date: 2020-07-18 19:10:58
tags:
- MacOS
- 终端
categories:
- 系统
---

> **问题描述：** nvm 主要用于 Node 版本控制，macOS 系统下，在 zsh 或 bash 终端，使用 Homebrew 下载，一般都能正常使用，但是切换到 fish 终端就会无法找到此命令。

<!--more-->

## 问题

在 fish 终端使用 nvm，会报找不到命令的错误，切换回 zsh，可以正常使用。

主要原因：fish 环境下无法识别 nvm shell 命令，比如 Gihub issues：[NVM in fish](https://github.com/nvm-sh/nvm/issues/303):

> May I request that this issue be reformatted in the form of a bug?
> ...
> NVM does not install if you use the fish shell.
> NVM does not work in the fish shell shell shell if previously installed in the bash shell. In fact, nvm > isn't even in the path.

## 寻找解决办法

在刚刚 Github [Issues](https://github.com/nvm-sh/nvm/issues/303#issuecomment-121086278) 下就有解决方案：

> I also wrote a general wrapper to bring almost any bash utility to fish shell: [https://github.com/edc/bass](https://github.com/edc/bass). It works flawlessly with nvm using syntax like bass `source ~/.nvm/nvm.sh \; nvm --version`. For convenience, one can create an alias Fish function:

```sh
function nvm
      bass source ~/.nvm/nvm.sh ';' nvm $argv
  end
and then just use nvm --version, nvm ls, etc.
```

## 动手实践

### 第一步 下载 oh-my-fish

> Oh My Fish provides core infrastructure to allow you to install packages which extend or modify the look of your shell. It's fast, extensible and easy to use.

默认设置安装：

```sh
curl -L https://get.oh-my.fish | fish
```

检测：

```sh
omf -v
Oh My Fish version 7
```

或者可以自定义安装：

```sh
curl -L https://get.oh-my.fish > install
fish install --path=~/.local/share/omf --config=~/.config/omf
```

关于使用 curl，这里可能会报错：

```log
Failed to connect to raw.githubusercontent.com port 443: Connection refused
```

说得也很明白，就是请求被拒绝访问，那我们怎么办？问度娘！咔咔咔，一段萌操作...之后：

访问[ipaddress.com](https://githubusercontent.com.ipaddress.com/raw.githubusercontent.com)，获取 `raw.githubusercontent.com` 域名真实 IP，然后在本地 hosts 文件添加即可：

```sh
sudo vim /etc/hosts
```

添加如下内容，并保存退出：

```hosts
199.232.28.133 raw.githubusercontent.com
```

### 第二步 下载 Bass

官网介绍：Bass makes it easy to use utilities written for Bash in fish shell.

下载好 oh-my-fish，直接下载 bass:

```sh
omf install bass
```

当然，也可以使用官网提到的 fisher、Fundle 等包管理器。

### 第三步 配置 nvm

前提是你已经下载好了 nvm，比如我使用 Homebrew 安装：

```sh
brew install nvm
```

然后，安装完成会有一堆提示，如一下关键信息：

```sh
You should create NVM's working directory if it doesn't exist:

  mkdir ~/.nvm

Add the following to ~/.config/fish/config.fish or your desired shell
configuration file:

  export NVM_DIR="$HOME/.nvm"
  [ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && . "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion

You can set $NVM_DIR to any location, but leaving it unchanged from
/usr/local/opt/nvm will destroy any nvm-installed Node installations
upon upgrade/reinstall.
```

根据提示进入如下目录，并创建 config.fish 文件：

```sh
cd ~/.config/fish/
touch config.fish
```

`config.fish`添加如下配置：

```sh
function nvm
    bass source /usr/local/opt/nvm/nvm.sh ';' nvm $argv
end
```

激活配置：

```sh
source ~/.config/fish/config.fish
```

最后检测：

```sh
nvm --version
0.35.3
```

如果你是全局安装 nvm，比如使用 curl 或者 wget，config.fish 应该是：

```sh
function nvm
      bass source ~/.nvm/nvm.sh ';' nvm $argv
  end
```

主要是 nvm.sh 文件的路径问题是否存在！

大功告成，打完收工！

## 参考资料

- [NVM in fish](https://github.com/nvm-sh/nvm/issues/303)
- [Bass](https://github.com/edc/bass)
- [Oh My Fish](https://github.com/oh-my-fish/oh-my-fish)
- [fish 环境下安装 nvm](https://tp.miaosuwulimi.cn/w/354.html)
- [mac 安装 homebrew 出错 Failed to connect to raw.githubusercontent.com port 443: Connection refused error:](https://blog.csdn.net/txl910514/article/details/105880125)
