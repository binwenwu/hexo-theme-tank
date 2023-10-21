---
title: Linux安装Clash – 代理 – VPN
cover: >-
  https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D19750327%2C3266188780%26fm%3D253%26fmt%3Dauto%26app%3D138%26f%3DJPEG
top_img: https://bu.dusays.com/2022/09/01/63103a65e883d.webp
keywords: 'Linux,安装,VPN'
categories:
  - Linux
tags:
  - Linux
  - Clash
  - 软件安装
  - VPN
date: '2023-08-01 18:25:15'
abbrlink: 438a2103
---

### 1 什么是Clash?

![78805a221a988e7-44](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/78805a221a988e7-44.png)



Clash 是一个跨平台的基于规则的代理实用程序，运行在网络和应用层，支持开箱即用的各种代理和反审查协议。

Clash 的使用对普通用户来说可能具有挑战性。那些可能想考虑改用 GUI 客户端，我们确实有一些建议：

- [Windows 版 Clash](https://github.com/Fndroid/clash_for_windows_pkg/releases)（Windows 和 macOS）
- [安卓版 Clash](https://github.com/Kr328/ClashForAndroid)
- [ClashX](https://github.com/yichengchen/clashX) 或者 [ClashX Pro](https://install.appcenter.ms/users/clashx/apps/clashx-pro/distribution_groups/public) (macOS)



### 2 安装Linux Clash

#### 2.1 下载Clash

- 下载链接：https://github.com/Dreamacro/clash/releases

![image-20230906191333077](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20230906191333077.png)



#### 2.2 上传至Linux服务器

- 创建文件夹

```BASH
mkdir /opt/clash && cd /opt/clash
```

- 上传或移动

```BASH
mv clash-linux-386-v1.16.0 /opt/clash/clash
```



#### 2.3 解压Clash

```BASH
gunzip clash-linux-386-v1.16.0.gz
```



#### 2.4 文件夹授权

```BASH
chmod +x clash
```



### 3 设置Clash的配置

注：clash默认读取的配置文件位置在：`~/.config/clash/`

#### 3.1 设置配置文件

- 创建一个文件夹：放置我们的Clash配置文件

```BASH
mkdir ~/.config/clash/ && cd ~/.config/clash/ 
```

- 获取配置文件

如果没法直接下载，从PC电脑获取到Windows本地Clash的`yaml`、`mmdb`文件放到服务器的`./config/clash/`下面亦可，`yaml`文件命名为`config.yaml`、`mmdb`文件命名为：`Country.mmdb`

```BASH
sudo wget -O config.yaml "yaml下载链接"
sudo wget -O XXX.mmdb "mmdb下载链接"
```

`yaml `文件大致内容如：

```yaml
mixed-port: 7890
allow-lan: true
bind-address: '*'
mode: rule
log-level: info
external-controller: '127.0.0.1:9090'
dns:
    enable: true
    ......
```



### 4 启动服务

- 直接启动我们的`./clash`即可

```bash
[root@VM-4-12-centos clash]# ./clash 
INFO[0000] Start initial compatible provider 自动选择       
INFO[0000] Start initial compatible provider FreeGecko  
INFO[0000] Start initial compatible provider 故障转移       
INFO[0000] RESTful API listening at: 127.0.0.1:34567    
INFO[0000] Mixed(http+socks) proxy listening at: [::]:7890
```

