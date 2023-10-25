---
title: 基于 MPI 的埃拉托斯特尼筛法的并行化设计、实现与结果分析
cover: >-
  https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D4009061548%2C3284864615%26fm%3D253%26fmt%3Dauto%26app%3D138%26f%3DJPEG
top_img: 'https://bu.dusays.com/2022/09/01/63103a65e883d.webp'
keywords: '算法,并行计算'
categories:
  - 算法
tags:
  - 并行计算
  - 算法
abbrlink: '55978286'
date: 2023-03-12 17:59:05
---

## 1 算法介绍

​	埃拉托斯特尼是一位古希腊数学家，他在寻找整数N以内的素数时，采用了一种与众不同的方法：先将2～N的各个数写在纸上：

​	在2的上面画一个圆圈，然后划去2的其他倍数；第一个既未画圈又没有被划去的数是3，将它画圈，再划去3的其他倍数；现在既未画圈又没有被划去的第一个数是5，将它画圈，并划去5的其他倍数……依此类推，一直到所有小于或等于Ｎ的各数都画了圈或划去为止。这时，画了圈的以及未划去的那些数正好就是小于Ｎ的素数。

![image-20231025224209018](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20231025224209018.png)

- 其伪代码如下：

```TEXT
Input: an integer n > 1

Let A be an array of Boolean values, indexed by integers 2 to n,
initially all set to true.

 for i = 2, 3, 4, ..., not exceeding √n:
  if A[i] is true:
    for j = i2, i2+i, i2+2i, i2+3i, ..., not exceeding n :
      A[j] := false

Output: all i such that A[i] is true.
```



## 2 实验环境

- 硬件环境

![image-20231025224344521](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/20231025225837.png)

- 开发环境
  - Visual Studio 2019，MSMPI v10.0



## 3 MPI环境配置（Windows）

windows 下运行mpi首推微软的msmp，因为比较简单，下载地址为：https://docs.microsoft.com/en-us/message-passing-interface/microsoft-mpi，
将两个安装包msmpisdk.msi和msmpisetup.exe分别下载然后安装完成后即可，下面是在VS2019中引入MSMPI的步骤：

- 在VS中新建C++控制台应用程序，将项目编译改为X64

![image-20231025224621719](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20231025224621719.png)

- 去安装的SDK目录，找到include与lib文件夹右键项目 -- 属性 -- vc++ 目录中包含目录添加 include 文件夹路径，库目录中添加 lib 文件夹路径。

![image-20231025224632397](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20231025224632397.png)

- C/C++ ->预处理器 -> 预处理器定义 -> 添加MPICH_SKIP_MPICXX

![image-20231025224644983](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20231025224644983.png)

- C/C++ -> 代码生成  -> 运行库 ->选择：多线程调试(/MTD)

![image-20231025224658506](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20231025224658506.png)

- 属性 -- 链接器 -- 输入 -- 附加依赖项中添加msmpi.lib; 

![image-20231025224712946](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20231025224712946.png)



## 4 Linux下配置MPICH

- 安装

```BASH
sudo apt-get install mpic  
```

- CmakeLists.txt 下配置

```BASH
cmake_minimum_required(VERSION 3.13)    
project(MPI)        
set(CMAKE_CXX_STANDARD 17)              
find_package(MPI REQUIRED)    
include_directories(${MPI_INCLUDE_PATH})    
set(CMAKE_CXX_COMPILER mpicxx)    
set(CMAKE_C_COMPILER mpicc)      
add_executable(MPI main.cpp)
```



## 5 源码及更多分析文档

{% link Github源码, https://github.com/binwenwu/Eratosthenes, https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D1662322932%2C969135674%26fm%3D253%26fmt%3Dauto%26app%3D120%26f%3DJPEG %}

