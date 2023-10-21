---
title: Docker镜像打包迁移
cover: >-
  https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D3909901784%2C2254357094%26fm%3D253%26fmt%3Dauto%26app%3D138%26f%3DPNG
top_img: https://bu.dusays.com/2022/09/01/63103a65e883d.webp
keywords: 'docker,配置,迁移'
categories:
  - 云原生
tags:
  - 容器
  - Docker
abbrlink: 620cff7f
date: 2023-10-09 09:20:52
---

{% note simple %} 要将 Docker 镜像从一台服务器传输到另一台服务器，您可以使用以下步骤：{% endnote %}

### **1 导出 Docker 镜像**：

- 首先，在源服务器上导出您要传输的 Docker 镜像。使用以下命令将镜像导出为一个文件：

```bash
docker save -o image.tar image_name:tag
```

- 其中 `image_name:tag` 是您要导出的 Docker 镜像的名称和标签。此命令将创建一个名为 `image.tar` 的镜像文件。

### **2 传输 Docker 镜像文件**

- 将导出的 Docker 镜像文件 `image.tar` 从源服务器传输到目标服务器。您可以使用各种方法，如SCP、SFTP、rsync 或者将文件上传到云存储服务（如Amazon S3、Google Cloud Storage）等方式来传输文件。

### **3 导入 Docker 镜像**

- 在目标服务器上导入传输过来的 Docker 镜像文件。使用以下命令来导入镜像：

```bash
docker load -i image.tar
```

- 这将从 `image.tar` 文件中加载镜像到目标服务器的 Docker 环境中。

### **4 验证导入的 Docker 镜像**

- 您可以使用以下命令来验证在目标服务器上成功导入了镜像：

```BASH
docker images
```

- 这将列出在目标服务器上可用的 Docker 镜像，确保您的镜像已成功导入。

- 现在，您已经成功将 Docker 镜像从一台服务器传输到另一台服务器。请注意，在进行这些操作时，确保您有足够的权限来执行 Docker 命令和文件传输操作，并且在网络连接方面没有限制。另外，确保目标服务器上的 Docker 环境与源服务器兼容，以便正常运行您的镜像。
