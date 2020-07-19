---
title: MacOS 下使用 Vim 的一些事
date: 2020-07-19 18:51:38
tags:
- MacOS
- 终端
categories:
- 系统
---

> Vim 是从 vi 发展出来的一个文本编辑器。代码补完、编译及错误跳转等方便编程的功能特别丰富，在程序员中被广泛使用。---菜鸟教程

<!--more-->

## Vimtutor

vimtutor 是 Vim 的教程程序：

```sh
vimtutor
```

vimtutor 是 vim 和 tutorial 的缩写，tutorial 是英语“教程”的意思，因此，vimtutor 就是“Vim 教程”的意思。

## 基本操作

基本上 vim 共分为三种模式，分别是：

- 交互模式（Command mode）
- 插入模式（Insert mode）
- 命令模式（Last line mode）

### 移动

在交互模式下，使用 h, j, k, l，可以上下左右移动，具体指向：

```text
      ^
      k                提示： h 的键位于左边，每次按下就会向左移动。
< h       l >                l 的键位于右边，每次按下就会向右移动。
      j                      j 键看起来很象一支尖端方向朝下的箭头。
      v
```

- 0 和 $ ：移动到行首和行末
- w/e ：一个单词一个单词地移动（单词开始/结束）

```sh
[Ctrl] + [f] 屏幕『向下』移动一页，相当于 [Page Down]按键 (常用)
[Ctrl] + [b] 屏幕『向上』移动一页，相当于 [Page Up] 按键 (常用)
[Ctrl] + [d] 屏幕『向下』移动半页
[Ctrl] + [u] 屏幕『向上』移动半页
```

### 写入

- i 输入欲插入文本 `<ESC>` 在光标前插入文本
- a 输入欲添加文本 `<ESC>` 在一行后添加文本
- o 类似于回车下一行空白处插入文本

### 保存

Vim 的默认模式是交互模式，进入插入模式需要按 `a|i|o` 中的某一键，从插入模式回到交互模式按 Esc 键。

在交互模式中，按冒号键（:）可以进入命令模式，例如：

- :w 用于保存文件
- :q 用于退出 Vim
- :wq 用于保存并退出 Vim
- :q! 用于不保存最近修改的内容且强制退出 Vim

### 复制，粘贴，撤销

交互模式下：

- x ：删除字符
- d ：删除单词，行等等
- dd ：删除行
- dw ：删除一个单词
- d0 和 d$ ：删除行首或行末
- yy ：复制行到内存中
- p ：粘贴
- r ：替换一个字符
- u ：撤销上一步操作
- g ：跳转到指定行

## 工具使用

### Spacevim

> [Spacevim](https://spacevim.org/) is a distribution of the Vim editor that’s inspired by spacemacs.

SpaceVim 是一个社区驱动的模块化 vim/neovim 配置集合，其中包含了多种功能模块，并且针对 neovim 做了功能优化。

下载安装：

```sh
curl -sLf https://spacevim.org/install.sh | bash
```

### Neovim

[Neovim](https://github.com/neovim/neovim) is a project that seeks to aggressively refactor Vim in order to:

- Simplify maintenance and encourage contributions
- Split the work between multiple developers
- Enable advanced UIs without modifications to the core
- Maximize extensibility

下载安装：

```sh
curl -LO https://github.com/neovim/neovim/releases/download/nightly/nvim-macos.tar.gz
tar xzf nvim-macos.tar.gz
./nvim-osx64/bin/nvim

# Or use homebrew
brew install neovim
```

### MacVim

[MacVim](https://github.com/macvim-dev/macvim), Vim - the text editor - for macOS

![快捷键图](https://www.runoob.com/wp-content/uploads/2015/10/vi-vim-cheat-sheet-sch1.gif)

## 参考资料

- [Linux vi/vim](https://www.runoob.com/linux/linux-vim.html) --- https://www.runoob.com/
- [Neovim](https://github.com/neovim/neovim)
- [MacVim](https://github.com/macvim-dev/macvim)
- [Spacevim](https://spacevim.org/)
