---
title: CentOS中为Docker配置代理
cover: 'https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/images-min.jpeg'
top_img: 'https://bu.dusays.com/2022/09/01/63103a65e883d.webp'
keywords: 'CentOS,Docker,proxy'
categories:
  - 云原生
tags:
  - Docker
  - CentOS
abbrlink: 8bacdc7a
date: 2024-04-10 21:46:58
---
### 背景

>因为一些安全原因，公司的机器网络环境不能直接访问外网，需要配置代理才能够访问，导致我使用拉取镜像的时候连接不到，报了如下的错误

`Error response from daemon: Get https://registry-1.docker.io/v2/: net/http: request canceled while......`

一般来说主机通过代理访问外网方式就是通过在命令行设置 `export` 来设置代理，如下所示:

`export http_proxy=http://proxy_server:7890`
`export https_proxy=https://proxy_server:7890`

但是docker拉取镜像是通过 `docker daemon` 服务完成，`docker daemon` 服务是在另一个进程中，不会读取当前`shell` 命令行的代理，所以 `docker pull` 会失败，官网的说明如下:

![](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/d3ea11faffa34a2fa6cfd541051b2f8e-min.png)

### 代理配置

- 创建目录

```BASH
mkdir /etc/systemd/system/docker.service.d
cd /etc/systemd/system/docker.service.d
```

- 创建配置文件`http-proxy.conf`，内容如下：
  - 我这里的代理没有对外提供`https`，因此所以我在`https_proxy`协议还是写了`http`的

```conf
[Service]
Environment="HTTP_PROXY=http://your.proxy.server:port/"
Environment="HTTPS_PROXY=http://your.proxy.server:port/"
Environment="NO_PROXY=localhost,127.0.0.1"
```

- 重新加载`systemd`守护程序

```bash
systemctl daemon-reload
```

- 重启`Docker`

```bash
systemctl restart docker
```

- 验证是否已经加载

```BASH
systemctl show docker --property Environment
```

>Environment= .....

- 配置完后使用`docker pull`，发现有反应了