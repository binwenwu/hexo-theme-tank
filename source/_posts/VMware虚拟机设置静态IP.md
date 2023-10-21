---
title: VMware虚拟机设置静态IP
cover: 'https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D975125445%2C2172945209%26fm%3D253%26fmt%3Dauto%26app%3D138%26f%3DJPEG'
top_img: https://bu.dusays.com/2022/09/01/63103a65e883d.webp
abbrlink: f5fad029
date: 2023-03-14 16:59:05
keywords: VMware, 虚拟机, 静态IP
categories:
  - Linux
tags:
  - VMware
  - 虚拟机
  - IP
---

### 1、设置虚拟网关

点击导航栏上面的【编辑】-->【虚拟网络编辑器】，并以【管理员】的身份打开虚拟机。

![img](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/watermark%2Ctype_ZHJvaWRzYW5zZmFsbGJhY2s%2Cshadow_50%2Ctext_Q1NETiBAY2hhb2ZlbmdkZXY%3D%2Csize_20%2Ccolor_FFFFFF%2Ct_70%2Cg_se%2Cx_16.png)

点击【VMnet8 NAT模式】，取消使用本地使用本地[dhcp](https://so.csdn.net/so/search?q=dhcp&spm=1001.2101.3001.7020)服务，配置网络段（子网ip段）为192.168.1.0，点击NAT设置。

![image-20230406140828304](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230406140828304.png)

配置【网关ip】，注意【网关ip】需要在【子网ip】段下，这里设置为192.168.1.2

![image-20230406140906021](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230406140906021.png)


### 2、配置虚拟机静态ip

- 打开命令行，输入

```shell
vim /etc/sysconfig/network-scripts/ifcfg-ens33
```

- 修改配置文件内容

![image-20230406141120088](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230406141120088.png)



```shell
#ip
IPADDR=192.168.1.136
NETMASK=255.255.255.0
#gateway
GATEWAY=192.168.1.2
#DNS
DNS1=114.114.114
```

注：DNS1是dns服务器，一般设置为114.114.114.114、114.114.115.115和8.8.8.8等(其他的也可以，只不过这几个用的人比较多而已)


### 3、检测配置是否成功

- 重启网络服务

```shell
service network restart
```

- ping一下百度

```shell
ping www.baidu.com
```















