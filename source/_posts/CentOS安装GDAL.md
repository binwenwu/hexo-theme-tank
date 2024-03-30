---
title: CentOS安装GDAL
cover: >-
  https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/71142167-26f88680-2249-11ea-8fda-0ac44956bad5.png
top_img: 'https://bu.dusays.com/2022/09/01/63103a65e883d.webp'
keywords: 'gdal,centos,安装'
categories:
  - 后端开发
tags:
  - 后端
  - gdal
abbrlink: '84542e25'
date: 2024-02-09 15:26:08
---

### 1 GDAL ≥ 3.5 安装

- 安装CMake

```BASH
# 下载
wget -c -P /storage/software/gdal-related-libs https://github.com/Kitware/CMake/releases/download/v3.13.2/cmake-3.13.2.tar.gz
# 解压
tar -zxvf cmake-3.13.2.tar.gz
# 安装
./bootstrap
make
make install
```

- 安装sqlite（官网：https://www.sqlite.org/download.html）

```bash
# 下载
wget -c -P /gdal https://www.sqlite.org/2023/sqlite-autoconf-3440000.tar.gz
# 解压
tar -xvzf sqlite-autoconf-3440000.tar.gz
# 安装
./configure
make
make install
ldconfig
```

- 安装proj（官网：https://proj.org/download.html）

```BASH
# 下载
wget -c -P /gdal https://download.osgeo.org/proj/proj-8.1.0.tar.gz
# 解压
tar -xvzf proj-8.1.0.tar.gz
# 安装
./configure
make
make check
make install
```

- 安装GDAL（教程：https://gdal.org/development/building_from_source.html）

```BASH
# 下载
wget -c -P /gdal http://download.osgeo.org/gdal/3.8.0/gdal-3.8.0.tar.gz
# 解压
tar -xvzf gdal-3.8.0.tar.gz
# 编译安装
cd /gdal/gdal-3.8.0
# 创建安装路径
mkdir build
cd build
cmake ..
cmake --build .
cmake --build . --target install
```

- 编写环境变量

```BASH
# 在export PATH下一行添加，依赖的动态库和静态库添加到LD_LIBRARY_PATH环境变量中去
export PATH=$PATH:/usr/local/bin
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib
# 使环境变量生效
source ~/.bashrc
# 查看GDAL版本信息
gdalinfo --version 
```



### 2 GDAL ＜ 3.5 安装

- 安装sqlite和proj（略）
- 安装gcc gcc-c++

```BASH
yum -y install gcc gcc-c++ kernel-devel
```

- 安装GDAL

```BASH
tar -zxvf gdal-3.0.4.tar.gz
cd gdal-3.0.4
./configure
make
make install
```

- 编写环境变量

```BASH
# 在export PATH下一行添加，依赖的动态库和静态库添加到LD_LIBRARY_PATH环境变量中去
export PATH=$PATH:/usr/local/bin
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib
# 使环境变量生效
source ~/.bashrc
# 查看GDAL版本信息
gdalinfo --version 
```



### 3 yum 安装 GDAL

- 添加EPEL仓库

```BASH
sudo yum install epel-release
```

- 安装GDAL及其相关软件包

```BASH
sudo yum install gdal gdal-devel gdal-python
```

- 查看版本

```BASH
gdalinfo --version 
```



