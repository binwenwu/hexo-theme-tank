---
title: yum无法拉取到镜像资源
cover: 'https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/remove-yum-repository.jpg'
top_img: 'https://bu.dusays.com/2022/09/01/63103a65e883d.webp'
keywords: 'Linux,yum'
categories:
  - Linux
tags:
  - Linux
  - yum
abbrlink: e51b1ecb
date: 2023-11-09 21:59:05
---

{% tip bell %}今天在Linux上使用yum时，遇到如下这个问题，当时首先检查了网络，能够正常ping通百度，接着我又怀疑是DNS服务器没有设置或设置的DNS服务器无法解析一些域名，因此我又尝试切换了几大DNS服务器，但是也没有解决问题，DNS服务器和网关都能ping通，实在令人不解，最后也是没有办法，采取了比较傻瓜式的办法，我直接用能够正常使用的yum的缓存文件去替换掉无法正常使用的yum的缓存配置文件，因为yum的缓存文件中包含有镜像源软件包的元数据信息{% endtip %}



### 1 问题

```BASH
Could not retrieve mirrorlist http://mirrorlist.centos.org/?release=7&arch=x86_64&repo=os&infra=stock error was
14: curl#7 - "Failed connect to mirrorlist.centos.org:80; Operation now in progress"

One of the configured repositories failed (Unknown),
and yum doesn't have enough cached data to continue. At this point the only
safe thing yum can do is fail. There are a few ways to work "fix" this:

 1. Contact the upstream for the repository and get them to fix the problem.

 2. Reconfigure the baseurl/etc. for the repository, to point to a working
    upstream. This is most often useful if you are using a newer
    distribution release than is supported by the repository (and the
    packages for the previous distribution release still work).

 3. Run the command with the repository temporarily disabled
        yum --disablerepo=<repoid> ...

 4. Disable the repository permanently, so yum won't use it by default. Yum
    will then just ignore the repository until you permanently enable it
    again or use --enablerepo for temporary usage:

        yum-config-manager --disable <repoid>
    or
        subscription-manager repos --disable=<repoid>

 5. Configure the failing repository to be skipped, if it is unavailable.
    Note that yum will try to contact the repo. when it runs most commands,
    so will have to try and fail each time (and thus. yum will be be much
    slower). If it is a very temporary problem though, this is often a nice
    compromise:

        yum-config-manager --save --setopt=<repoid>.skip_if_unavailable=true
Cannot find a valid baseurl for repo: base/7/x86_64
```

### 2 解决办法

替换`yum`缓存文件 （`/var/cache/yum`）