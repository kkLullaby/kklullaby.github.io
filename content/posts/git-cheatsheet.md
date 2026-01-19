---
title: "Git 常用命令速查表 (aigc自用)"
date: 2026-01-15T14:30:00+08:00
draft: false
author: "Claude4.5 opus"
categories: ["开发工具", "学习笔记", "aigc"]
tags: ["Git", "版本控制", "速查表", "aigc"]
description: "整理常用的 Git 命令，快速查阅使用"
summary: "Git 日常使用的命令速查，提高开发效率"
---

## 📝 Git 命令速查表

Git 是最流行的版本控制系统，掌握 Git 是每个开发者的必备技能。

### 基础配置

```bash
# 设置用户信息
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 查看配置
git config --list

# 设置默认编辑器
git config --global core.editor "vim"
```

### 仓库操作

```bash
# 初始化仓库
git init

# 克隆仓库
git clone https://github.com/username/repo.git

# 查看远程仓库
git remote -v

# 添加远程仓库
git remote add origin url
```

### 基本操作

```bash
# 查看状态
git status

# 添加文件到暂存区
git add file.txt
git add .              # 添加所有文件

# 提交
git commit -m "commit message"
git commit -am "message"  # add + commit

# 查看提交历史
git log
git log --oneline      # 简洁显示
git log --graph        # 图形显示
```

### 分支管理

```bash
# 查看分支
git branch
git branch -a          # 查看所有分支（包括远程）

# 创建分支
git branch branch-name

# 切换分支
git checkout branch-name
git switch branch-name     # 新命令

# 创建并切换分支
git checkout -b branch-name
git switch -c branch-name

# 合并分支
git merge branch-name

# 删除分支
git branch -d branch-name   # 安全删除
git branch -D branch-name   # 强制删除
```

### 远程操作

```bash
# 拉取代码
git pull origin main

# 推送代码
git push origin main
git push -u origin main    # 首次推送

# 获取远程更新
git fetch origin
```

### 撤销操作

```bash
# 撤销工作区修改
git checkout -- file.txt
git restore file.txt       # 新命令

# 撤销暂存区
git reset HEAD file.txt
git restore --staged file.txt  # 新命令

# 撤销提交
git reset --soft HEAD^     # 保留修改
git reset --hard HEAD^     # 丢弃修改

# 撤销特定提交
git revert commit-hash
```

### 标签管理

```bash
# 创建标签
git tag v1.0.0
git tag -a v1.0.0 -m "version 1.0.0"

# 查看标签
git tag

# 推送标签
git push origin v1.0.0
git push origin --tags     # 推送所有标签

# 删除标签
git tag -d v1.0.0
git push origin :refs/tags/v1.0.0  # 删除远程标签
```

### 实用技巧

```bash
# 暂存当前工作
git stash
git stash list
git stash pop

# 查看差异
git diff                   # 工作区 vs 暂存区
git diff --staged          # 暂存区 vs 仓库
git diff branch1 branch2   # 比较分支

# 美化日志
git log --pretty=format:"%h - %an, %ar : %s"

# 搜索提交
git log --grep="keyword"

# 查看文件修改历史
git log -p filename
git blame filename
```

### .gitignore 模板

```
# 操作系统
.DS_Store
Thumbs.db

# 编辑器
.vscode/
.idea/
*.swp
*~

# 语言相关
node_modules/
*.pyc
__pycache__/
.env

# 构建产物
dist/
build/
*.log
```

### 常见问题

**忘记提交某个文件？**
```bash
git add forgotten_file
git commit --amend --no-edit
```

**修改最后一次提交信息？**
```bash
git commit --amend -m "new message"
```

**删除远程分支？**
```bash
git push origin --delete branch-name
```

**查看某个文件的修改历史？**
```bash
git log --follow filename
```

### Git 工作流

**Feature Branch 工作流：**
```bash
# 1. 创建特性分支
git checkout -b feature/new-feature

# 2. 开发并提交
git add .
git commit -m "Add new feature"

# 3. 推送到远程
git push origin feature/new-feature

# 4. 创建 Pull Request

# 5. 合并后删除分支
git checkout main
git pull origin main
git branch -d feature/new-feature
```

### 最佳实践

1. **频繁提交** - 小步快跑，便于回滚
2. **清晰的提交信息** - 说明做了什么和为什么
3. **使用分支** - 不要直接在 main 分支开发
4. **及时推送** - 避免代码丢失
5. **定期拉取** - 保持代码同步

### 提交信息规范

```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 重构代码
test: 测试相关
chore: 构建工具或辅助工具的变动

示例:
feat: 添加用户登录功能
fix: 修复页面加载缓慢的问题
docs: 更新 README 文档
```

---

**参考资料：**
- [Pro Git Book](https://git-scm.com/book/zh/v2)
- [Git 官方文档](https://git-scm.com/docs)
