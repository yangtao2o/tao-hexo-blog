---
title: Git 提交的正确姿势：Commit message 编写指南
date: 2019-09-26 18:12:30
tags:
  - git
categories:
  - 开发工具
---

## Header

Header 部分只有一行，包括三个字段：type（必需）、scope（可选）和 subject（必需）

- feat：新功能（feature）
- fix：修补 bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动
  <!--more-->

### 提交信息规范

我们对项目的 git 提交信息格式进行统一格式约定，每条提交信息由 `type`+`subject` 组成，这将提升项目日志的可读性。

- `type` 用于表述此次提交信息的意义，首写字母大写，包括但不局限于如下类型：
  - `Build`：基础构建系统或依赖库的变化
  - `Ci`：CI 构建系统及其脚本变化
  - `Docs`：文档内容变化
  - `Feat`：新功能
  - `Fix`：Bug 修复
  - `Perf`：性能优化
  - `Refactor`：重构（即不是新增功能，也不是修改 Bug 的代码变动）
  - `Style`：格式（不影响代码运行的变动）
  - `Revert`：代码回滚
  - `Release`：版本发布
- `subject` 用于简要描述修改变更的内容，如 `Update code highlighting in readme.md`。
  - 句尾不要使用符号。
  - 使用现在时、祈使句语气。

### 标签规范

为了方便维护人员和用户能够快速找到他们想要查看的问题，我们使用“标签”功能对 Pull requests 和 Issues 进行分类。

如果您不确定某个标签的含义，或者不知道将哪些标签应用于 PR 或 issue，千万别错过这个。

Issue 的标签：

- 类型
  - `Bug`: 检测到需要进行确认的 Bug
  - `Feature Request`: 提出了新功能请求的 Issue
  - `Question`: 提出疑问的 Issue
  - `Meta`: 表明使用条款变更的 Issue
  - `Support`: 被标记为支持请求的 Issue
  - `Polls`: 发起投票的 Issue
- 结果
  - `Duplicate`: 重复提及的 Issue
  - `Irrelevant`: 与 NexT 主题无关的 Issue
  - `Expected Behavior`: 与预期行为相符的 Issue
  - `Need More Info`: 需要更多信息的 Issue
  - `Need Verify`: 需要开发人员或用户确认 Bug 或解决方法的 Issue
  - `Verified`: 已经被确认的 Issue
  - `Can't Reproduce`: 无法复现的 Issue
  - `Solved`: 已经解决的 Issue
  - `Stale`: 由于长期无人回应被封存的 Issue

Pull Request 的标签：

- `Breaking Change`: 产生重大变动的 Pull Request
- `Bug Fix`: 修复相关 Bug 的 Pull Request
- `New Feature`: 添加了新功能的 Pull Request
- `Feature`: 为现有功能提供选项或加成的 Pull Request
- `i18n`: 更新了翻译的 Pull Request
- `Work in Progress`: 仍在进行改动和完善的 Pull Request
- `Skip Release`: 无需在 Release Note 中展现的 Pull Request

两者兼有：

- `Roadmap`: 与 NexT 主题发展相关的 Issue 或者 Pull Request
- `Help Wanted`: 需要帮助的 Issue 或者 Pull Request
- `Discussion`: 需要进行讨论的 Issue 或者 Pull Request
- `Improvement`: 需要改进的 Issue 或者改进了 NexT 主题的 Pull Request
- `Performance`: 提出性能问题的 Issue 或者提高了 NexT 主题性能的 Pull Request
- `Hexo`: 与 Hexo 和 Hexo 插件相关的 Issue 或者 Pull Request
- `Template Engine`: 与模版引擎相关的 Issue 或者 Pull Request
- `CSS`: 与 NexT 主题 CSS 文件相关的 Issue 或者 Pull Request
- `Fonts`: 与 NexT 主题字体相关的 Issue 或者 Pull Request
- `PJAX`: 与 PJAX 相关的 Issue 或者 Pull Request
- `3rd Party Plugin`: 与第三方插件和服务相关的 Issue 或者 Pull Request
- `Docs`: 与文档说明相关的 Issue 或者 Pull Request
- `Configurations`: 与 NexT 主题设置相关的 Issue 或者 Pull Request


## 资料

- [Git 提交的正确姿势：Commit message 编写指南](https://www.cnblogs.com/daysme/p/7722474.html)
- [Next 主题贡献规范](https://github.com/theme-next/hexo-theme-next/blob/master/docs/zh-CN/CONTRIBUTING.md)
