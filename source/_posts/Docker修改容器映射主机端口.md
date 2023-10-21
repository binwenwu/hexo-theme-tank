---
title: Docker修改容器映射主机端口
cover: 'https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D3767987760%2C254654213%26fm%3D253%26fmt%3Dauto%26app%3D138%26f%3DPNG'
top_img: https://bu.dusays.com/2022/09/01/63103a65e883d.webp
abbrlink: 9c5d9ac5
date: 2023-05-12 15:26:51
keywords: docker,端口
categories:
  - 云原生
tags:
  - 容器
  - Docker
---

### 1 对于已经存在的容器，更改端口

- 停止容器

- 将容器打包成镜像

```bash
docker commit 4f4561192346 wbw-geoserver:0.1（自定义镜像名:自定版本号）
```

- 通过新镜像开启新容器

```BASH
docker run -d --name wbw-geoserver -p 31520:8080 wbw-geoserver:0.1


#-d  ——>后台启动
#-p  ——>主机端口：容器端口
```
