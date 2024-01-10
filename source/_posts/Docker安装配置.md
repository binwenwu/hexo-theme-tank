---
title: Docker安装配置
cover: 'https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D3909901784%2C2254357094%26fm%3D253%26fmt%3Dauto%26app%3D138%26f%3DPNG'
top_img: https://bu.dusays.com/2022/09/01/63103a65e883d.webp
abbrlink: b035bcd6
date: 2023-05-11 09:20:52
keywords: docker,安装,配置
categories:
  - 云原生
tags:
  - 容器
  - Docker
---

## 1  安装docker 20.10.7

**注意 Docker 版本，要和 Kubernetes 版本 有对应关系**

```shell
# 安装/更新 yum-utils
yum install -y yum-utils

# 配置 yum源
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装 docker 20.10.7 版本
yum -y install docker-ce-20.10.7 docker-ce-cli-20.10.7 containerd.io

# 查看 docker 版本
docker -v

# 启动 docker
systemctl start docker

# 查看 docker 是否成功, 有 Client 和 Server 即成功
docker version
```

## 2  配置加速镜像

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
 "registry-mirrors" : [
   "https://mirror.ccs.tencentyun.com",
   "http://registry.docker-cn.com",
   "http://docker.mirrors.ustc.edu.cn",
   "http://hub-mirror.c.163.com"
 ],
 "insecure-registries" : [
   "registry.docker-cn.com",
   "docker.mirrors.ustc.edu.cn"
 ],
 "debug" : true,
 "experimental" : true
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker

# 查看是否配置成功
docker info
```

