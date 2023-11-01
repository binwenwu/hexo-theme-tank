---
abbrlink: 4e1214ce
categories:
- GIS
cover: https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D3613172890%2C3047148242%26fm%3D253%26fmt%3Dauto%26app%3D138%26f%3DJPEG
date: '2023-08-03T22:04:51+08:00'
keywords: grass,安装,centos
swiper_index: 2
tags:
- 遥感
- GIS
- 软件安装
title: Centos安装Grass
top_img: https://bu.dusays.com/2022/09/01/63103a65e883d.webp
updated: 2023-9-3T14:59:29.426+8:0
---
## 1 方案一：通过 EPEL 源安装（Centos 8）

### 1.1 安装 EPEL8 源

链接：https://grass.osgeo.org/download/linux/#GRASS-GIS-current

![image-20230507202148758](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230507202148758.png)

*安装 EPEL8 源步骤：参考链接：https://blog.csdn.net/Lcongming/article/details/115983236*

- 首先切换到yum仓库源的目录

```BASH
cd /etc/yum.repos.d/
```

- 创建文件

```BASH
touch epel8.repo
# 文件内容如下：
[EPEL]
name=EPEL
baseurl=https://mirrors.cloud.tencent.com/epel/8/Everything/x86_64/ 
gpgcheck=0
# 需要确保这个链接能打开
# epel7用这个：https://mirrors.cloud.tencent.com/epel/7/x86_64/
```

- 执行 yum repolist 读取查看结果，已经都可以读取了

```BASH
yum repolist
```

![image-20230507202627273](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230507202627273.png)

### 1.2 查看软件库中是否包含 GRASS

```BASH
yum search grass
```

![image-20230507202759087](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230507202759087.png)

### 1.3 安装 GRASS

```BASH
yum install grass
```

```BASH
Error: Package: wxBase3-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(GLIBCXX_3.4.20)(64bit)
Error: Package: grass-7.8.7-1.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(GLIBCXX_3.4.21)(64bit)
Error: Package: xerces-c-3.2.3-5.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.9)(64bit)
Error: Package: hdf-4.2.14-5.el8.x86_64 (EPEL)
           Requires: libtirpc.so.3(TIRPC_0.3.0)(64bit)
Error: Package: wxGTK3-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.9)(64bit)
Error: Package: grass-libs-7.8.7-1.el8.x86_64 (EPEL)
           Requires: libpng16.so.16(PNG16_0)(64bit)
Error: Package: wxBase3-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.8)(64bit)
Error: Package: PDAL-libs-2.1.0-8.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(GLIBCXX_3.4.21)(64bit)
Error: Package: wxBase3-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libc.so.6(GLIBC_2.28)(64bit)
Error: Package: grass-7.8.7-1.el8.x86_64 (EPEL)
           Requires: libm.so.6(GLIBC_2.27)(64bit)
Error: Package: wxGTK3-gl-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.9)(64bit)
Error: Package: grass-7.8.7-1.el8.x86_64 (EPEL)
           Requires: libreadline.so.7()(64bit)
Error: Package: PDAL-libs-2.1.0-8.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.8)(64bit)
Error: Package: python3-wxpython4-4.0.7-13.el8.x86_64 (EPEL)
           Requires: python3-wx-siplib-api(12)(x86-64) >= 12.7
Error: Package: gdal-libs-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(GLIBCXX_3.4.21)(64bit)
Error: Package: python3-wxpython4-4.0.7-13.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(GLIBCXX_3.4.21)(64bit)
Error: Package: grass-libs-7.8.7-1.el8.x86_64 (EPEL)
           Requires: libpng16.so.16()(64bit)
Error: Package: PDAL-libs-2.1.0-8.el8.x86_64 (EPEL)
           Requires: libc.so.6(GLIBC_2.27)(64bit)
Error: Package: proj-6.3.2-4.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.8)(64bit)
Error: Package: PDAL-2.1.0-8.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(GLIBCXX_3.4.20)(64bit)
Error: Package: libbsd-0.11.7-2.el8.x86_64 (EPEL)
           Requires: libc.so.6(GLIBC_2.25)(64bit)
Error: Package: python3-wxpython4-4.0.7-13.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.9)(64bit)
Error: Package: gdal-libs-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libm.so.6(GLIBC_2.27)(64bit)
Error: Package: gdal-libs-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libjson-c.so.4(JSONC_0.14)(64bit)
Error: Package: xerces-c-3.2.3-5.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.8)(64bit)
Error: Package: hdf5-1.10.5-4.el8.x86_64 (EPEL)
           Requires: libm.so.6(GLIBC_2.27)(64bit)
Error: Package: wxGTK3-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libpng16.so.16(PNG16_0)(64bit)
Error: Package: hdf5-1.10.5-4.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.9)(64bit)
Error: Package: PDAL-2.1.0-8.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(GLIBCXX_3.4.21)(64bit)
Error: Package: gdal-libs-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(GLIBCXX_3.4.20)(64bit)
Error: Package: grass-libs-7.8.7-1.el8.x86_64 (EPEL)
           Requires: libm.so.6(GLIBC_2.23)(64bit)
Error: Package: ogdi-4.1.0-1.el8.x86_64 (EPEL)
           Requires: libtirpc.so.3()(64bit)
Error: Package: grass-7.8.7-1.el8.x86_64 (EPEL)
           Requires: libpng16.so.16(PNG16_0)(64bit)
Error: Package: gdal-libs-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libjson-c.so.4()(64bit)
Error: Package: wxGTK3-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(GLIBCXX_3.4.20)(64bit)
Error: Package: PDAL-libs-2.1.0-8.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(GLIBCXX_3.4.22)(64bit)
Error: Package: gdal-libs-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libpoppler.so.104()(64bit)
Error: Package: xerces-c-3.2.3-5.el8.x86_64 (EPEL)
           Requires: libm.so.6(GLIBC_2.27)(64bit)
Error: Package: gdal-libs-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.9)(64bit)
Error: Package: python3-wxpython4-4.0.7-13.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.8)(64bit)
Error: Package: wxGTK3-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.8)(64bit)
Error: Package: grass-7.8.7-1.el8.x86_64 (EPEL)
           Requires: python3-dateutil
Error: Package: gdal-libs-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libcfitsio.so.7()(64bit)
           Available: cfitsio-3.47-1.el8.x86_64 (EPEL)
               libcfitsio.so.7()(64bit)
           Installed: cfitsio-3.370-10.el7.x86_64 (@epel)
              ~libcfitsio.so.2()(64bit)
Error: Package: hdf-4.2.14-5.el8.x86_64 (EPEL)
           Requires: libtirpc.so.3()(64bit)
Error: Package: proj-6.3.2-4.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(GLIBCXX_3.4.20)(64bit)
Error: Package: netcdf-4.7.0-2.el8.x86_64 (EPEL)
           Requires: libtirpc.so.3()(64bit)
Error: Package: gdal-libs-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libdap.so.25()(64bit)
Error: Package: ogdi-4.1.0-1.el8.x86_64 (EPEL)
           Requires: libtirpc.so.3(TIRPC_0.3.0)(64bit)
Error: Package: PDAL-libs-2.1.0-8.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(GLIBCXX_3.4.20)(64bit)
Error: Package: python3-wxpython4-4.0.7-13.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(GLIBCXX_3.4.20)(64bit)
Error: Package: gdal-libs-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.8)(64bit)
Error: Package: gdal-libs-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libpng16.so.16(PNG16_0)(64bit)
Error: Package: gdal-libs-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libgif.so.7()(64bit)
Error: Package: gdal-libs-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libjasper.so.4()(64bit)
Error: Package: proj-epsg-4.8.0-4.el7.x86_64 (@epel)
           Requires: proj = 4.8.0-4.el7
           Removing: proj-4.8.0-4.el7.x86_64 (@epel)
               proj = 4.8.0-4.el7
           Updated By: proj-6.3.2-4.el8.x86_64 (EPEL)
               proj = 6.3.2-4.el8
Error: Package: proj-nad-4.8.0-4.el7.x86_64 (@epel)
           Requires: proj = 4.8.0-4.el7
           Removing: proj-4.8.0-4.el7.x86_64 (@epel)
               proj = 4.8.0-4.el7
           Updated By: proj-6.3.2-4.el8.x86_64 (EPEL)
               proj = 6.3.2-4.el8
Error: Package: grass-7.8.7-1.el8.x86_64 (EPEL)
           Requires: libhistory.so.7()(64bit)
Error: Package: wxBase3-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.9)(64bit)
Error: Package: gdal-libs-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libpng16.so.16()(64bit)
Error: Package: arpack-3.7.0-1.el8.x86_64 (EPEL)
           Requires: libm.so.6(GLIBC_2.27)(64bit)
Error: Package: proj-6.3.2-4.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(CXXABI_1.3.9)(64bit)
Error: Package: proj-6.3.2-4.el8.x86_64 (EPEL)
           Requires: libstdc++.so.6(GLIBCXX_3.4.21)(64bit)
Error: Package: grass-7.8.7-1.el8.x86_64 (EPEL)
           Requires: libpng16.so.16()(64bit)
Error: Package: wxGTK3-3.0.4-11.el8.x86_64 (EPEL)
           Requires: libpng16.so.16()(64bit)
```

直接 yum 安装 grass 会存在依赖错误的问题，先看报错缺的是什么包，然后通过rpm的方式先把缺的包装好，所有缺的包安装完毕后，就可以通过yum install grass完成grass的安装，缺的包可以在这个网站上找：https://pkgs.org/

![image-20230507203155606](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230507203155606.png)

- 假设缺的包是下面这个：

  ![image-20230507203400626](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230507203400626.png)
- 点进去，查看这个包的下载地址：

![image-20230507203411137](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230507203411137.png)

- 然后通过rpm命令安装这个包：rpm -Uvh 包的URL

```BASH
# rpm -Uvh 包的URL
rpm -Uvh https://vault.centos.org/centos/8/BaseOS/x86_64/os/Packages/glibc-2.28-164.el8.x86_64.rpm
# 强制安装，忽略依赖错误
# rpm -Uvh https://vault.centos.org/centos/8/BaseOS/x86_64/os/Packages/glibc-2.28-164.el8.x86_64.rpm --force --nodeps
```

- 参考资料：https://blog.csdn.net/fancy_xunbei/article/details/6268441

## 2 方案二：源码编译安装

参考链接：https://www.zhihu.com/zvideo/1496911384683773952

- 下载安装包
- 解压并进入
- 开始编译

```BASH
./configure --prefix=/home/oge/oge-grass
```

疑难杂症

- GRASS需要针对 zstd 进行编译和链接。查看您尝试的命令(`yum install zstd-devel`)，我假设您使用的是RHEL/CentOS7。在CentOS存储库中没有zstd的包-您需要从[EPEL](https://fedoraproject.org/wiki/EPEL)安装它。它应该看起来像这样

![image-20230508084941624](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230508084941624.png)

```BASH
yum install libzstd-devel
```

![image-20230508084900049](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230508084900049.png)

```BASH
whereis gdal-config
# 然后再在编译时指定依赖的位置
./configure --with-gdal=/usr/local/bin/gdal-config --prefix=/home/oge/oge-grass
```

![image-20230508090349691](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230508090349691.png)

```BASH
yum install PNG-devel
```

![image-20230508090437991](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230508090437991.png)

```BASH
yum install fftw-devel
```

![image-20230508090610207](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230508090610207.png)

```BASH
yum install cairo-devel
```

![image-20230508091746038](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230508091746038.png)

```BASH
yum install freetype-devel
```

- ......

## 3 方案三： Docker镜像方式安装 (推荐)

- grass docker 镜像：https://grass.osgeo.org/download/docker/

![image-20230508194802552](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230508194802552.png)

- 创建容器
