---
title: Oh My Fish! 让你的 Shell 漂亮起来
date: 2020-07-19 20:06:01
tags:
- MacOS
- 终端
categories:
- 系统
---

> Oh My Fish provides core infrastructure to allow you to install packages which extend or modify the look of your shell. It's fast, extensible and easy to use. --- [oh-my-fish](https://github.com/oh-my-fish/oh-my-fish)

<!--more-->

## 使用 fish

下载：

```sh
brew install fish
```

使用：

```sh
fish
Welcome to fish, the friendly interactive shell
```

You can find the default fish configuration at `~/.config/fish/config.fish` (similar to `.bashrc`). If it doesn’t exist, just create it.（当时配置 nvm 的时候，就遇到过这个问题）

可视化配置：

```sh
fish_config
```

详细内容，可参考这里：[How To Install Fish, The Friendly Interactive Shell, In Linux](https://www.ostechnix.com/install-fish-friendly-interactive-shell-linux/)

## 使用 Oh My Fish

### 下载安装

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

修改 hosts，并添加如下内容，保存退出：

```sh
sudo vim /etc/hosts

# hosts
199.232.28.133 raw.githubusercontent.com
```

### 基本操作

```sh
omf list  # 列出所有的安装包
omf theme  # 可用的和已安装的主题列表
omf install agnoster  # 下载主题
omf theme agnoster  # 配置主题
omf remove agnoster  # 移除包
omf search nvm  # 搜索主题或插件
omf update omf  # 仅更新核心功能
omf update  # 更新所有包
omf doctor  # 报错处理
omf destroy  # 卸载
```

### 主题预览

Oh-my-fish [themes](https://github.com/oh-my-fish/oh-my-fish/blob/master/docs/Themes.md).

### 主题配置失效

多次切换主题，会出现无效的问题，使用 `omf doctor` ，提示删除配置文件即可：

```sh
rm ~/.config/fish/functions/fish_prompt.fish
```

## 参考资料

- [fishshell.com](http://fishshell.com/)
- [oh-my-fish](https://github.com/oh-my-fish/oh-my-fish)
- [How To Install Fish, The Friendly Interactive Shell, In Linux](https://www.ostechnix.com/install-fish-friendly-interactive-shell-linux/)
- [Oh My Fish! 让你的 Shell 漂亮起来](https://linux.cn/article-9515-1.html?pr)
