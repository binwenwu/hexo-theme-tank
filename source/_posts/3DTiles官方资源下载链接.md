---
title: 3DTiles官方资源下载链接
cover: >-
  https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/u%3D174763634%2C692513046%26fm%3D253%26fmt%3Dauto%26app%3D138%26f%3DPNG
top_img: 'https://bu.dusays.com/2022/09/01/63103a65e883d.webp'
keywords: 'GIS,3DTiles,下载'
categories:
  - GIS
tags:
  - GIS
  - 3DTiles
abbrlink: 6005debc
date: 2024-01-01 21:56:08
---


>本文列出Cesium官方提供的 3DTiles 1.0和1.1规范的9个示例切块集（tileset）
>
>有关如何使用本地服务器托管这些示例的详细信息，请参阅 [INSTRUCTIONS.md](https://github.com/CesiumGS/3d-tiles-samples/blob/main/INSTRUCTIONS.md)

### 1 Metadata Granularities

Metadata Granularities这个3DTiles 1.1 示例演示了 中元数据在不同粒度级别的使用。 该示例由具有 4 个切块的tileset组成，其中每个切块有 5 个内容，并且这些内容被分配到两个不同的组。 元数据被分配给切块集、切块、每个内容以及组。

![img](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-375.png)

下载地址：[Metadata Granularities Tileset](https://github.com/CesiumGS/3d-tiles-samples/tree/main/1.1/MetadataGranularities)



### 2 Sparse Implicit Quadtree

Sparse Implicit Quadtree是使用3DTiles 1.1的隐式平铺来表示小型稀疏四叉树的示例tileset。

四叉树有 6 个可用级别，每个子树有 3 个级别。 第 5 级中有 32 个可用切块。每个切块都有一个内容，这是一个简单的 glTF 资源，作为 GLB（glTF 二进制）文件，仅包含与相应切块范围相对应的单位正方形的一部分 。 除了具有内容的切块及其各自的祖先之外，没有其他切块可用。

![img](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-376.png)

下图显示了tileset的 6 个级别。 可用的tile包含 1，并显示为绿色。 不可用的tile包含 0，并显示为红色。 包含内容的单元格标记为 1+（仅在级别 5 中）。

![img](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-377.png)

[subtreeInfo.md ](https://github.com/CesiumGS/3d-tiles-samples/blob/main/1.1/SparseImplicitQuadtree/screenshot/subtreeInfo.md)中汇总了 .subtree 文件的 JSON 部分以及存储在二进制缓冲区中的可用性信息。

下载地址：[Sparse Implicit Quadtree Tileset](https://github.com/CesiumGS/3d-tiles-samples/blob/main/1.1/SparseImplicitOctree)



### 3 Sparse Implicit Octree

Sparse Implicit Octree是使用3DTiles 1.1的隐式平铺来表示小型稀疏八叉树的示例切块集。

八叉树有 6 个可用级别，每个子树有 3 个级别。 树中有 31 个包含内容的图块：

- 第 1 层有 1 个切块
- 第 2 层有 2 个切块
- 第 3 级有 4 个切块
- 第 4 级有 8 个切块
- 第5 级 有16 个切块

每个内容都是一个简单的 glTF 资源，作为 GLB（glTF 二进制）文件，仅包含与相应切块范围相对应的单位立方体的一部分。 除了具有内容的切块及其各自的祖先之外，没有其他切块可用。

![img](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-378.png)

下载地址：[Sparse Implicit Octree Tileset](https://github.com/CesiumGS/3d-tiles-samples/blob/main/1.1/SparseImplicitOctree)



### 4 Multiple Contents

此示例演示了3DTiles 1.1如何在单个切块中存储多个内容对象。

![img](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-380.png)

Tileset的根切块包含一个模型，即具有正弦波的简单平面，有两种不同的表示形式：

- 作为纹理三角形网格 glTF 资源的低分辨率表示
- 具有顶点颜色的高分辨率点网格表示，作为另一个 glTF 资源

下载地址：[Multiple Contents Tileset](https://github.com/CesiumGS/3d-tiles-samples/tree/main/1.1/MultipleContents)



### 5 Bounding Box Tests

Bounding Box Tests是一个将单个简单 glTF 模型嵌入到3DTiles 1.1的tileset中的示例切块集，并显示相应 glTF 包围体的适当切块集包围体。

![img](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-381.png)

该目录包含六个不同的图块集，每个图块集都有一个 glTF 资源。 资产和目录是根据模型的包围体命名的，以最小和最大点的形式给出：

- (0,0,0) - (1,1,2)
- (0,0,0) - (1,2,1)
- (0,0,0) - (2,1,1)
- (0,0,2) - (1,1,4)
- (0,2,0) - (1,4,1)
- (2,0,0) - (4,1,1)

下载地址：[Bounding Box Tests Tileset](https://github.com/CesiumGS/3d-tiles-samples/tree/main/1.1/BoundingBoxTests)



### 6 Tileset with full Metadata

此示例根据 3DTiles 1.1的元数据规范中定义的类型系统演示了可能与实体关联的元数据类型。

![img](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-382.png)

该示例包含一个仅存储元数据的切块集，其中包含一个模式和一个元数据实体，两者都涵盖了所有可能的属性类型：

- 类型为 STRING、BOOLEAN 和 ENUM 的单个属性
- 具有所有数字组件类型 UINT8、INT8、UINT16、INT16、UINT32、INT32、UINT64、INT64、FLOAT32、FLOAT64 的单一 (SCALAR) 属性
- 复合类型 VEC2、VEC3、VEC4、MAT2、MAT3 和 MAT4，以及所有数字组件类型
- 具有所有组件类型的数组，一次具有固定长度，一次具有动态长度
- 所有整数分量类型都以标准化形式使用一次，以非标准化形式使用一次

下载地址：[Tileset With Full Metadata](https://github.com/CesiumGS/3d-tiles-samples/tree/main/1.1/TilesetWithFullMetadata)



### 7 Tileset with discrete LODs

这是一个3DTiles 1.0示例，包含三个切块，每个切块都包含不同程度轻量化的斯坦福龙网格模型。

- 根切块 - 高度简化的龙
- 子切块 - 中度简化的龙
- 孙切块-原始的龙

当满足图块的屏幕空间错误时，它将被其更高 LOD 子级替换。

![img](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-383.png)

下载地址：[Tileset with discrete LODs](https://github.com/CesiumGS/3d-tiles-samples/tree/main/1.0/TilesetWithDiscreteLOD)



### 8 Tileset With Request Volume

这个3DTiles 1.0 切块集显示切块的 requestVolume 属性。 当查看器位于点云的请求体积内时，将渲染点云。 此外，此示例说明了从主tileset.json 中加载外部tileset。

![img](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-385.png)

下载地址：[Tileset With Request Volume](https://github.com/CesiumGS/3d-tiles-samples/tree/main/1.0/TilesetWithRequestVolume)



### 9 Tileset With Tree Billboards

这个 3DTiles 1.0切块集包含两个切块，一个具有完整 3D 树的 .i3dm，另一个具有 2D 广告牌树的 .i3dm。 缩小时，3D 树会被广告牌取代。

注意：广告牌效果被编码到 i3dm 的嵌入式 glTF 模型中，但使用矢量切片也可以实现类似的效果。

![img](https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/image-386.png)

下载地址：[Tileset With Tree Billboards](https://github.com/CesiumGS/3d-tiles-samples/tree/main/1.0/TilesetWithTreeBillboards)



---



原文链接：[Sample tilesets for learning how to use 3D Tiles](https://github.com/CesiumGS/3d-tiles-samples)