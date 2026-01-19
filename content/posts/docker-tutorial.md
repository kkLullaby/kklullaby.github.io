---
title: "Docker 入门实战教程 (aigc自用)"
date: 2026-01-12T10:20:00+08:00
draft: false
author: "Claude4.5 opus"
categories: ["开发工具", "学习笔记"]
tags: ["Docker", "容器", "DevOps"]
description: "Docker 容器技术入门教程，从安装到实战"
summary: "学习 Docker 容器技术，掌握现代化应用部署方式"
---

## 🐳 Docker 入门教程

Docker 是一个开源的容器化平台，让应用的部署变得更加简单和可靠。

### 什么是 Docker？

Docker 允许你将应用及其依赖打包到一个轻量级、可移植的容器中，然后可以在任何支持 Docker 的机器上运行。

**核心概念：**
- **镜像 (Image)** - 应用的只读模板
- **容器 (Container)** - 镜像的运行实例
- **仓库 (Registry)** - 存储和分发镜像的服务

### 安装 Docker

**Ubuntu/Debian:**
```bash
# 更新包索引
sudo apt update

# 安装依赖
sudo apt install apt-transport-https ca-certificates curl software-properties-common

# 添加 Docker 官方 GPG 密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# 添加 Docker 仓库
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# 安装 Docker
sudo apt update
sudo apt install docker-ce

# 验证安装
docker --version
```

**配置用户权限：**
```bash
sudo usermod -aG docker $USER
# 重新登录生效
```

### 基础命令

**镜像操作：**
```bash
# 搜索镜像
docker search nginx

# 拉取镜像
docker pull nginx

# 查看本地镜像
docker images

# 删除镜像
docker rmi nginx
```

**容器操作：**
```bash
# 运行容器
docker run -d -p 80:80 --name my-nginx nginx

# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 停止容器
docker stop my-nginx

# 启动容器
docker start my-nginx

# 重启容器
docker restart my-nginx

# 删除容器
docker rm my-nginx

# 查看容器日志
docker logs my-nginx

# 进入容器
docker exec -it my-nginx /bin/bash
```

### 实战示例

#### 1. 运行 Nginx Web 服务器

```bash
# 运行 Nginx 容器
docker run -d \
  --name web-server \
  -p 8080:80 \
  -v $(pwd)/html:/usr/share/nginx/html \
  nginx

# 访问 http://localhost:8080
```

#### 2. 运行 MySQL 数据库

```bash
# 运行 MySQL 容器
docker run -d \
  --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=mysecretpassword \
  -p 3306:3306 \
  -v mysql-data:/var/lib/mysql \
  mysql:8.0

# 连接到 MySQL
docker exec -it mysql-db mysql -uroot -p
```

#### 3. 运行 Node.js 应用

```bash
# 创建 Dockerfile
cat > Dockerfile << EOF
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "app.js"]
EOF

# 构建镜像
docker build -t my-node-app .

# 运行容器
docker run -d -p 3000:3000 --name node-app my-node-app
```

### Dockerfile 编写

**基础结构：**
```dockerfile
# 基础镜像
FROM ubuntu:22.04

# 维护者信息
LABEL maintainer="your-email@example.com"

# 设置工作目录
WORKDIR /app

# 复制文件
COPY . /app

# 安装依赖
RUN apt-get update && \
    apt-get install -y python3 && \
    rm -rf /var/lib/apt/lists/*

# 设置环境变量
ENV APP_ENV=production

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["python3", "app.py"]
```

**多阶段构建示例：**
```dockerfile
# 构建阶段
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

**docker-compose.yml 示例：**
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
    volumes:
      - ./app:/app

  db:
    image: postgres:14
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres-data:
```

**使用 Docker Compose：**
```bash
# 启动服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 停止并删除卷
docker-compose down -v
```

### 数据卷管理

```bash
# 创建数据卷
docker volume create my-volume

# 查看数据卷
docker volume ls

# 查看数据卷详情
docker volume inspect my-volume

# 使用数据卷
docker run -v my-volume:/data nginx

# 删除数据卷
docker volume rm my-volume

# 清理未使用的数据卷
docker volume prune
```

### 网络管理

```bash
# 创建网络
docker network create my-network

# 查看网络
docker network ls

# 连接容器到网络
docker network connect my-network container-name

# 断开网络连接
docker network disconnect my-network container-name

# 删除网络
docker network rm my-network
```

### 最佳实践

1. **使用官方镜像** - 更安全、更稳定
2. **最小化镜像大小** - 使用 alpine 等轻量级基础镜像
3. **单一进程** - 每个容器只运行一个主进程
4. **使用 .dockerignore** - 排除不必要的文件
5. **不要在容器中存储数据** - 使用数据卷
6. **使用环境变量** - 方便配置管理
7. **多阶段构建** - 减小最终镜像大小
8. **合理使用缓存** - 优化构建速度

### 常用命令总结

```bash
# 清理系统
docker system prune -a      # 清理所有未使用的资源

# 查看资源使用
docker stats                # 查看容器资源使用情况

# 导出导入镜像
docker save -o image.tar my-image
docker load -i image.tar

# 导出导入容器
docker export container > container.tar
docker import container.tar my-image

# 查看容器详细信息
docker inspect container-name
```

### 故障排查

**容器无法启动？**
```bash
# 查看容器日志
docker logs container-name

# 查看容器详细信息
docker inspect container-name
```

**进入容器调试：**
```bash
# 使用 bash
docker exec -it container-name /bin/bash

# 使用 sh（如果没有 bash）
docker exec -it container-name /bin/sh
```

**端口冲突？**
```bash
# 检查端口占用
netstat -tuln | grep 8080

# 使用不同的端口
docker run -p 8081:80 nginx
```

### 学习资源

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Play with Docker](https://labs.play-with-docker.com/)

---

Docker 让应用部署变得简单高效，值得每个开发者学习掌握！

*Happy Dockering! 🐳*
