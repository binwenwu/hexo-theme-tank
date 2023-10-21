---
title: Docker安装PostgreSQL并添加PostGIS拓展
cover: >-
  https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D1460018586%2C621419257%26fm%3D253%26fmt%3Dauto%26app%3D138%26f%3DJPEG
top_img: https://bu.dusays.com/2022/09/01/63103a65e883d.webp
keywords: 'docker,postgres,postgis'
categories:
  - 云原生
tags:
  - 容器
  - Docker
  - PostgreSQL
  - PostGIS
  - 数据库
abbrlink: e232bc22
date: 2023-10-09 20:20:52
---


### 1 下载镜像

- 访问dockerhub官网：https://registry.hub.docker.com/ 地址，下载指定版本的PostgreSQL数据库。

![image-20231009173917562](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20231009173917562.png)

- 下载

```bash
docker pull postgres:14
```

- 查看

```BASH
docker images
```

![image-20231009200905029](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20231009200905029.png)



### 2 镜像转为容器

```BASH
docker run -d --restart=always --name postgres -v /mnt/storage/postgresql/data:/var/lib/postgresql/data -e POSTGRES_PASSWORD=123456 -p 5432:5432 postgres:14
```

- `docker run`: 这是Docker命令的开头，用于运行一个容器。
- `-d`: 这是一个标志，表示容器应以后台模式运行（detached mode），这意味着容器将在后台运行，不会占用终端。
- `--restart=always`: 这是一个标志，指定容器在退出时应该始终自动重新启动。如果容器不期望停止运行，这可以确保容器总是在它退出时重新启动。
- `--name postgres`: 这是一个标志，为容器指定了一个名称，即"postgres"。这使得容器可以通过这个名称来引用，而不必使用容器ID。
- `-v /mnt/storage/postgresql/data:/var/lib/postgresql/data`: 这是一个标志，指定了主机文件系统路径`/mnt/storage/postgresql/data`和容器内部路径`/var/lib/postgresql/data`之间的卷映射。这个映射用于将PostgreSQL数据库数据存储在主机上，以便数据持久性。容器内的数据将被存储在主机的`/mnt/storage/postgresql/data`目录中。
- `-e POSTGRES_PASSWORD=123456`: 这是一个标志，用于设置PostgreSQL数据库的密码。在这个例子中，密码被设置为"123456"，这是一个示例密码。你可以根据需要更改它。
- `-p 5432:5432`: 这是一个标志，用于将主机端口5432映射到容器内的端口5432。这是PostgreSQL数据库默认监听的端口。通过这个映射，你可以在主机上通过5432端口访问容器内运行的PostgreSQL数据库。
- `postgres:14`: 这是要运行的Docker镜像的名称和标签。在这里，使用的是PostgreSQL 14版本的官方Docker镜像。Docker将下载并运行此镜像以创建容器。

{% tip warning faa-horizontal animated %}一旦运行此命令，Docker将创建一个PostgreSQL容器，该容器以后台模式运行，具有指定的名称`postgres`，将数据存储在主机上的`/mnt/storage/postgresql/data`目录中，使用指定的密码，同时将主机端口5432映射到容器内的5432端口上。容器将在退出时自动重新启动，以确保持续可用性。{% endtip %}

### 3 添加PostGIS拓展

- 进入容器

```BASH
docker exec -it ca24dbe6f3d7 bash
```

- 更新软件包列表

```bash
apt update
```

- 使用apt在线安装PostGIS（注意版本要和PostgreSQL兼容）

```bash
apt install postgresql-14-postgis-3 postgresql-14-postgis-3-dbgsym postgresql-14-postgis-3-scripts
```

- 使用Navicat等客户端软件连接到PostgreSQL，并新建查询，输入以下SQL语句，点击执行

```SQL
CREATE EXTENSION postgis;
SELECT postgis_full_version();
```

- 出现类似如下查询结果即为成功

```TEXT
POSTGIS="3.4.0 0874ea3" [EXTENSION] PGSQL="140" GEOS="3.11.1-CAPI-1.17.1" PROJ="9.1.1 NETWORK_ENABLED=OFF URL_ENDPOINT=https://cdn.proj.org USER_WRITABLE_DIRECTORY=/var/lib/postgresql/.local/share/proj DATABASE_PATH=/usr/share/proj/proj.db" LIBXML="2.9.14" LIBJSON="0.16" LIBPROTOBUF="1.4.1" WAGYU="0.5.0 (Internal)"
```
