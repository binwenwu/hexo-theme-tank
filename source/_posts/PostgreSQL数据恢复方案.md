---
title: PostgreSQL数据恢复方案
cover: >-
  https://x0.ifengimg.com/ucms/2021_32/C407CC5A0399616CA0F2CBF716F4434DBB0FC959_size103_w600_h356.png
top_img: 'https://bu.dusays.com/2022/09/01/63103a65e883d.webp'
keywords: '数据库恢复,数据库,恢复,PostgreSQL'
categories:
  - 后端开发
tags:
  - 后端
  - 数据库
abbrlink: dda2580a
date: 2023-10-27 09:20:52
---



### 1 问题

{% note info modern %}存在docker或者服务器上（无论是windows还是linux）的PostgreSQL无法启动，需要对数据进行恢复{% endnote %}



### 2 解决

#### 2.1 参考

{% link 云数据库 PostgreSQL 在云服务器上恢复 PostgreSQL 数据-操作指南, https://cloud.tencent.com/document/product/409/11642, https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/postGis%E5%B7%A5%E4%BD%9C%E7%A9%BA%E9%97%B4.svg %}

#### 2.2 导出数据目录

​	找到“`.../data`”目录下所有的数据文件，如下图所示（注意并不是所有数据文件都长这样，因版本、软件和操作系统不同而异，但是绝大多数文件相同，故只列出了以下这些）。一般这些文件位于PostgreSQL的`../data/`目录，可以自行查找（网络，或者find命令查找`postgresql.conf`，在里面的`data_directory`会告诉你真的物理存储在哪），记得删除多余的临时文件。

![image-20231027224423789](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20231027224423789.png)

#### 2.3 搭建PostgreSQL

​	在一个没有任何PostgreSQL的服务器上搭建跟原先版本一模一样的PostgreSQL（有postgis也得安装到位），这步也可以使用虚拟机来搭建，但是千万别用**docker**这类软件。

#### 2.4 使用postgres用户创建恢复目录

- 切换为postgres用户，在云服务器中创建恢复目录`recovery`

```BASH
mkdir /var/lib/pgsql/10/recovery
```

- 其中，`recovery` 为示例目录，用户可自行修改恢复目录。后续示例中不同版本目录名将不再区分描述，请以实际为准，如PostgreSQL 10.x 均为`/var/lib/pgsql/10`，PostgreSQL 9.5.x 均为`/var/lib/pgsql/9.5`。

  - PostgreSQL 9.5 版本命令如下：

  ```BASH
  mkdir /var/lib/pgsql/9.6/recovery
  ```

  - PostgreSQL 14 版本命令如下：

  ``` BASH
  mkdir /var/lib/PostgreSQL/14/recovery
  ```

#### 2.5 修改配置文件

- 将配置文件`PostgreSQL.conf`中的以下选项注释掉，注释方法：在行首使用#。如有多个该选项，则全部注释掉（说明：如果恢复版本为 PostgreSQL 12.4，还需要注释 `include = 'standby.conf'` 这一行）

```TEXT
shared_preload_libraries
local_preload_libraries
pg_stat_statements.max
pg_stat_statements.track
archive_mode
archive_command
synchronous_commit
synchronous_standby_names
```

- 修改配置文件`PostgreSQL.conf`

```TEXT
port = '5432'    # 将port参数的值修改为5432
unix_socket_directories = '/var/run/PostgreSQL/'  # 将unix_socket_directories的值修改为/var/run/PostgreSQL/，    # 如未设置此值，可跳过此项
```

- 在`PostgreSQL.conf`文件末尾追加配置，表示不再使用强同步模式

```TEXT
synchronous_commit = local
synchronous_standby_names = ''
```

- 添加**pg_hba.conf**
  - 可以在安装好的数据库位置下，大概是`/usr/pgsql-10/bin/pg_hba.conf`(可能版本不同路径不同，但绝大多数是)，找到`pg_hba.conf`。然后cp到`recovery/`。可能要`vim`进行修改一下，主要是port需要设置成默认的5432。
  - 最后配置结果如下所示:

![image-20231027230057946](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20231027230057946.png)

#### 2.6 使用root用户更改文件夹权限

```BASH
chmod 0700 /var/lib/pgsql/10（版本号）/recovery
chown postgres:postgres /var/lib/pgsql/10（版本号）/recovery -R
```

#### 2.7 使用postgres用户启动数据库

```BASH
/usr/pgsql-10/bin/pg_ctl start -D /var/lib/pgsql/10/recovery
```

![image-20231027230220463](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20231027230220463.png)

- 如果没有`server start`那就挨个去看log信息，可能是某个配置文件没有找到（那就在main里面或者原来数据库的安装位置中寻找，然后cp），可能是端口。

#### 2.8 登陆数据库验证

- 查看版本

```BASH
export PGDATA=/var/lib/pgsql/10（版本号）/recovery
psql
```

![image-20231027230400659](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20231027230400659.png)

- 验证运行
  - 如提示`server is running`，则代表数据库正在运行

```BASH
/usr/pgsql-10（自定义）/bin/pg_ctl status -D /var/lib/pgsql/10（版本号）/recovery
```

#### 2.9 通过手动导出数据进行恢复

>您也可以手动导出备份数据，然后在服务器上进行恢复操作，该方案在 **Windows** 和 **Linux** 下同样适用，与物理文件所在的文件系统无关

- 在云服务器下 dump 出数据，示例如下：
  - 若数据较大，可通过 `-Fc` 指定为二进制文件

```BASH
# 命令格式为：pg_dump -h <访问IP> -U <访问用户> -f <备份文件全路径> -c -C <导出的数据库名>

# Example：
/usr/pgsql-10/bin/pg_dump -h 192.168.0.16(可不要) -U testroot -f backup.sql -c -C postgres
```

- 服务器上恢复数据

> 进入PostgreSQL安装目录的bin文件夹下(例如，`/usr/pgsql-14/bin/`)，使用**psql**工具进行数据恢复。

```BASH
./psql -p 端口号 -U 用户名 -W -f ../backup.sql
```

>其中这里端口号自定义，用户名建议都换成旧数据库一样的名称（如果没有，记得先创建被赋予超级权限）

{% tip info %}**说明**：因为有 pg_stat_error 等插件，可能会导致报错，但不影响数据导入。只要能运行下去不报错停止就行{% endtip %}