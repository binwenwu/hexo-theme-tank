---
title: 3DCityDB 性能测试
cover: https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/20240407150827-min.png
top_img: 'https://bu.dusays.com/2022/09/01/63103a65e883d.webp'
keywords: 'GIS,3DCityDB,性能测试'
categories:
  - GIS
tags:
  - GIS
  - 3DCityDB
abbrlink: 8066b642
date: 2024-04-07 15:56:08
---
## 1 硬件环境

- **芯片**：*Apple M2 Pro*
- **内存**：*32GB*
- **核数**：*12*

## 2 测试流程

#### 2.1**创建*3DCityDB*数据库**

>方便起见使用*Docker*

- 拉取镜像

```BASH
docker pull 3dcitydb/3dcitydb-pg
```

- 运行容器

```bash
docker run -d -p 5432:5432 --name cdb \
  -e POSTGRES_PASSWORD=123456 \
  -e SRID=25832 \
3dcitydb/3dcitydb-pg
```

#### 2.2 下载*Importer/Exporter*

>下载链接：https://github.com/3dcitydb/importer-exporter/releases
>
>使用Docker形式也行，具体参见[文档-1.5.2节](https://3dcitydb-docs.readthedocs.io/en/latest/first-steps/docker.html)：

- 下载完毕后根据系统进行启动

  - `3DCityDB-Importer-Exporter.bat` (*Microsoft Windows family*)

  - `3DCityDB-Importer-Exporter` (*UNIX/Linux/Mac OS family*)

>在大多数平台上，双击启动脚本或其快捷方式即可运行，但对于某些 *UNIX/Linux* 发行版，必须在 *shell* 环境中运行启动脚本

```BASH
chmod u+x 3DCityDB-Importer-Exporter
./3DCityDB-Importer-Exporter
```

#### 2.3 设置数据库连接

![image-20240407141123781](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/20240407142027.png)

#### 2.4 开始测试

##### 2.4.1 **导入测试**

> 测试数据集来自[增强的纽约市 3D 建筑模型](https://github.com/georocket/new-york-city-model-enhanced?tab=readme-ov-file)
> 导入模式：*Import All*

![image-20240407141232505](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-20240407141232505.png)

- 测试结果

|                             Data                             |    Size    | Number of buildings | Import time（Avg） |
| :----------------------------------------------------------: | :--------: | :-----------------: | :----------------: |
| [*DA1_3D_Buildings_Merged.gml.zip*](https://github.com/georocket/new-york-city-model-enhanced/releases/download/20v5/DA1_3D_Buildings_Merged.gml.zip) | *412.3 MB* |      *19,408*       |    *01min,44s*     |
| [*DA5_3D_Buildings_Merged.gml.zip*](https://github.com/georocket/new-york-city-model-enhanced/releases/download/20v5/DA5_3D_Buildings_Merged.gml.zip) | *747.3 MB* |      *34,082*       |    *03min,16s*     |
| [*DA8_3D_Buildings_Merged.gml.zip*](https://github.com/georocket/new-york-city-model-enhanced/releases/download/20v5/DA8_3D_Buildings_Merged.gml.zip) | *1.20 GB*  |      *66,277*       |    *06min,21s*     |
| [*DA19_3D_Buildings_Merged.gml.zip*](https://github.com/georocket/new-york-city-model-enhanced/releases/download/20v5/DA19_3D_Buildings_Merged.gml.zip) | *2.24 GB*  |      *105,569*      |    *12min,50s*     |

##### 2.4.2 查询测试

>本实验测试从不同体积量的数据库中检索出不同复杂程度的模型所需时长

- **测试所用具有不同体积量的数据库**

|   ID    |   Size    | Number of buildings | 子节点数量 |
| :-----: | :-------: | :-----------------: | :--------: |
| **DB1** | *500 MB*  |      *37,149*       | *21,24255* |
| **DB2** | *4587 MB* |     *277,5159*      | 246,98085  |

- **不同复杂程度三维场景在不同体积数据库下的检索效率**

| 场景 ID | 子节点数量 | Number of buildings | DB1 Time  | DB2 Time  |
| :-----: | :--------: | :-----------------: | :-------: | :-------: |
| **S1**  |  *10098*   |        *918*        | *0.391 s* | *1.44 s*  |
| **S2**  |  *22869*   |       *2110*        | *0.520 s* | *1.502 s* |
| **S3**  |  *33506*   |       *3046*        | *0.664 s* | *1.732 s* |
| **S4**  |  *45859*   |       *4169*        | *0.783 s* | *1.901 s* |
| **S5**  |  *82478*   |       *7498*        | *1.254 s* | *2.316 s* |