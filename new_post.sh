#!/bin/bash

# 交互式创建新文章脚本

echo "📝 欢迎使用新文章创建向导"
echo "--------------------------------"

read -p "请输入文章标题 (例如：My New Post): " title
read -p "请输入文件名 (英文，例如: my-new-post): " filename

if [ -z "$filename" ]; then
    echo "❌ 文件名不能为空！"
    exit 1
fi

# 检查是否包含 .md 后缀
if [[ "$filename" != *.md ]]; then
    filename="${filename}.md"
fi

echo "正在创建文章: content/posts/$filename ..."

# 使用 Hugo 创建文章
hugo new "posts/$filename"

# 自动替换 title
sed -i "s/title: \".*\"/title: \"$title\"/" "content/posts/$filename"

echo "--------------------------------"
echo "✅ 文章创建成功！"
echo "📂 文件路径: content/posts/$filename"
echo "记得修改 draft: true 为 false 以发布文章"
echo "--------------------------------"
