---
title: Nginx搭建静态资源服务器
cover: 'https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/cacascascascas.jpg'
top_img: 'https://bu.dusays.com/2022/09/01/63103a65e883d.webp'
keywords: 'nginx,存储,静态资源'
categories:
  - 后端开发
tags:
  - nginx
  - 存储
abbrlink: 85b8b565
date: 2023-11-01 09:20:52
---


### 1 nginx.conf文件中配置

- 假设静态资源放在服务器 `/home/data/`

```conf
user  root; # 启动用户
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;
    gzip  on; # 打开gzip压缩，可以减少带宽

    server {
        listen       80; # 1.指定端口
        server_name  dlib; # 2.服务名

        location /data/ {
            alias /home/data/; # 3.指定静态文件目录
            autoindex on; # 自动索引
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

}
```

- 或者

```conf
user  root; # 启动用户
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  65;
    gzip  on; # 打开gzip压缩，可以减少带宽

    server {
        listen       80; # 1.指定端口
        server_name  dlib; # 2.服务名

        location /data/ {
            root /home/; # 3.指定静态文件目录
            autoindex on; # 自动索引
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

}
```

- 重启nginx

```BASH
nginx -s reload
```

- 访问：http://yourIP:80/data/



### 2 二者区别

> 在Nginx配置中，`alias` 和 `root` 是两个用于指定文件系统路径的指令，但它们在用法和行为上有一些重要的区别：

- alias

  - `alias` 指令用于将 URL 路径的一部分映射到文件系统的不同位置。

  - 它允许你将 URL 中的一部分路径与文件系统中的完全不同的路径关联起来。

  - `alias` 通常用于创建虚拟目录，其中 URL 中的路径部分与文件系统中的路径不一致。

  - 当使用 `alias` 时，Nginx会将 URL 路径与 `location` 块中指定的 `alias` 路径拼接在一起，然后在文件系统中查找文件。

```conf
nginxCopy code
location /images/ {
    alias /var/www/images/;
}
```

> 在上述示例中，如果访问 `http://yourdomain.com/images/pic.jpg`，Nginx会查找 `/var/www/images/pic.jpg`。

- root

  - `root` 指令用于设置一个目录，该目录是请求的 URL 路径的基础部分。

  - 它将 URL 路径直接映射到文件系统中的路径，URL 路径的开头部分与文件系统路径一致。

  - `root` 通常用于将请求直接映射到文件系统中的目录，而不需要额外的路径拼接。

  - 当使用 `root` 时，Nginx会将 URL 路径直接映射到指定的根目录。

```conf
nginxCopy code
location /data/ {
    root /var/www/;
}
```

> 在上述示例中，如果访问 `http://yourdomain.com/data/file.txt`，Nginx会查找 `/var/www/data/file.txt`。



总结：`alias` 用于创建虚拟目录，可以将 URL 路径与文件系统中的不同路径关联，而 `root` 用于将 URL 路径直接映射到文件系统中的目录。你可以根据需要选择合适的指令来配置 Nginx 以满足你的要求。