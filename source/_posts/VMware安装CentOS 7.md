---
title: VMware安装CentOS 7
cover: >-
  https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D3933667462%2C2332434810%26fm%3D253%26fmt%3Dauto%26app%3D138%26f%3DJPEG
top_img: https://bu.dusays.com/2022/09/01/63103a65e883d.webp
keywords: 'VMware, 虚拟机, 静态IP, CentOS'
categories:
  - Linux
tags:
  - VMware
  - 虚拟机
  - CentOS
abbrlink: 7ddf46fc
date: 2023-08-04 16:59:05
---


### 0 准备工作

- CentOS 操作系统镜像文件下载：[https://mirrors.aliyun.com](https://links.jianshu.com/go?to=https%3A%2F%2Fmirrors.aliyun.com)

![image-20230908171707525](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908171707525.png)



---



![image-20230908171728656](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908171728656.png)



---



![image-20230908171742599](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908171742599.png)



---

![image-20230908175418265](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908175418265.png)

---



![image-20230908175442769](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908175442769.png)

---

![image-20230908175605742](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908175605742.png)



### 1 新建虚拟机

![image-20230908142236250](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908142236250.png)



### 2 选择自定义安装

![image-20230908142400187](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908142400187.png)



### 3 硬件兼容性选择

- 选择与**VMware**相匹配的版本，点击下一步

![image-20230908142621786](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908142621786.png)



### 4 选择稍后安装操作系统

![image-20230908142816382](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908142816382.png)



### 5 选择要安装的操作系统

![image-20230908143027761](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908143027761.png)



### 6 给虚拟机起名并选择它安装在什么位置

![image-20230908143346019](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908143346019.png)



### 7 选择处理器配置

![image-20230908143509051](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908143509051.png)



### 8 设置内存大小

![image-20230908143642480](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908143642480.png)



### 9  网络类型选择NAT

![image-20230908143745954](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908143745954.png)



### 10 I/O控制器类型，默认即可

![image-20230908143828126](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908143828126.png)



### 11 磁盘类型，默认即可

![image-20230908143902825](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908143902825.png)



### 12 创建磁盘

![image-20230908143937104](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908143937104.png)



### 13 磁盘分配

![image-20230908144028674](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908144028674.png)



### 14 指定磁盘文件，默认即可

![image-20230908144110656](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908144110656.png)



### 15 新建虚拟机完成

![image-20230908144157428](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908144157428.png)



### 16 安装CentOS镜像

- 点击编辑虚拟机配置

![image-20230908145309603](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908145309603.png)

- 选择`CD/DVD` 找到下载好的`iso`镜像路径放进去，点击确定

![image-20230908150005089](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908150005089.png)

- 开启虚拟机
  - 上下箭头可选择 `↑` 选中 `Install CentOS7`，回车

![25517196-04af085f7eebd103](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/25517196-04af085f7eebd103.webp)

- 选择语言，点击继续

![image-20230908150311393](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908150311393.png)

- 软件安装选择最小化安装

![image-20230908150818220](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908150818220.png)

![image-20230908150924342](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908150924342.png)

- 创建分区

  - 点击安装位置

  ![image-20230908151004104](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908151004104.png)

  - 选择我要配置分区，然后点击完成

  ![image-20230908151145430](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908151145430.png)

  - 选择标准分区，然后点击 `+` 添加分区

  ![image-20230908151507360](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908151507360.png)

  - `/boot`分区就是操作系统的内核及在引导过程中使用的文件

  ![image-20230908151957680](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908151957680.png)

  - `Swap`分区在系统的物理内存不够用的时候，把硬盘内存中的一部分空间释放出来，以供当前运行的程序使用

  ![image-20230908152029333](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908152029333.png)

  - 剩下的空间全部给根分区`/`，然后点击完成

  ![image-20230908152219217](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908152219217.png)

  - 点击接受更改

  ![image-20230908152300028](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908152300028.png)

- 下面进行网络配置

  ![image-20230908152422052](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908152422052.png)

  - 点击配置，按如下更改，然后点击保存，并设置主机名

  ![image-20230908152612519](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908152612519.png)

  ![image-20230908152926994](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908152926994.png)

  ![image-20230908153001212](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908153001212.png)

  ![image-20230908153240349](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908153240349.png)

- 点击开始安装，安装过程中可以设置`root`的密码

![image-20230908153341136](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908153341136.png)

![image-20230908153417882](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908153417882.png)

- 安装完成后，设置网卡，让虚拟机可以上网

  - 点击编辑 → 虚拟网络编辑器

  ![25517196-489dac124b1be481](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/25517196-489dac124b1be481.webp)

  - 点击更改设置

  ![image-20230908154539205](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908154539205.png)

  - 根据下图进行配置

  ![image-20230908154748383](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908154748383.png)

  ![image-20230908154821137](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908154821137.png)

  - 应用，然后点击确定，现在就可以正常使用了

  ![image-20230908160139747](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908160139747.png)





### 17 配置静态IP

- 打开命令行，输入
  - 网卡默认名称不一定为`ens33`，需要自行查看

```BASH
vim /etc/sysconfig/network-scripts/ifcfg-ens33
```

- 修改配置文件内容

![image-20230908173017415](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230908173017415.png)

- 重启网络服务

```BASH
service network restart
```
