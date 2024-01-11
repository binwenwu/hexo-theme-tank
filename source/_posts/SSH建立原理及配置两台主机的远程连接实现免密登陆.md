---
title: SSH建立原理及配置两台主机的远程连接实现免密登陆
cover: >-
  https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D1159764395%2C3385530698%26fm%3D253%26fmt%3Dauto%26app%3D138%26f%3DJPEG
top_img: 'https://bu.dusays.com/2022/09/01/63103a65e883d.webp'
keywords: 'Linux,SSH免密,非对称加密'
categories:
  - Linux
tags:
  - Linux
  - SSH
abbrlink: 85912ba6
date: 2024-01-10 16:23:08
---

## 1 SSH原理

> SSH是一种**协议标准**
>
> SSH是用在**安全远程登录**以及其它**安全网络服务**

SSH为Secure Shell的缩写，默认端口22，由IETF的网络小组（Network Working Group）所制定；SSH为建立在应用层基础上的安全协议。SSH是目前较可靠，专为远程登录会话和其他网络服务提供安全性的协议。利用SSH协议可以有效防止远程管理过程中的信息泄露问题。SSH仅仅是一协议标准，其具体的实现有很多，既有开源实现的OpenSSH，也有商业实现方案。使用范围最广泛的当然是开源实现OpenSSH


## 2 非对称加密

>SSH协议与telnet、ftp等协议主要的区别在于安全性。这就引出下一个问题：如何实现数据的安全呢？首先想到的实现方案肯定是对数据进行加密。加密的方式主要有两种：
>
>- 对称加密（也称为密钥加密）
>- 非对称加密（也称公钥加密）
>- 对称加密原理：指加密解密使用同一套密钥。对称加密的加密强度高，很难破解。
>
>但是在实际应用过程中不得不面临一个棘手的问题：如何安全的保存密钥呢？尤其是考虑到数量庞大的Client端，很难保证密钥不被泄露。一旦一个Client端的密钥被窃据，那么整个系统的安全性也就不复存在。为了解决这个问题，非对称加密应运而生

- 下图是两台机器SSH免密登录的原理

![image-20240110161954471](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20240110161954471.png)



## 3 免密设置

- A上执行ssh-keygen -t rsa，三次回车。生成之后会在用户的根目录生成一个 “.ssh”的文件夹

![这里写图片描述](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/70-20240110162125966.png)

- 查看.ssh下面的文件

![这里写图片描述](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/70.png)

```TEXT
authorized_keys : 存放远程免密登录的公钥,主要通过这个文件记录多台机器的公钥（初始不存在该文件） 
id_rsa : 生成的私钥文件 
id_rsa.pub : 生成的公钥文件
know_hosts : 已知的主机公钥清单
```

- 将A上的`id_rsa.pub`中的公钥拷贝至B中的`authorized_keys`
- 设置完成，现在A可以实现免密登录B，反之想要让B免密登录A则进行对应设置



## 4 注意事项

> Linux服务器之间进行SSH互信免密登录时，文件及目录的权限有严格控制，不能过度授权

- `~/.ssh`目录权限为700
- `id_rsa`：私钥，相当于“锁”，文件权限：600
- `id_rsa.pub`：公钥，相当于“钥匙”，文件权限：644
- `authorized_keys`：认证文件，记录别人给你的公钥，文件权限：600

- `known_hosts`：”指纹文件“，记录首次SSH互信对端留给你的”指纹信息“，文件权限：600


