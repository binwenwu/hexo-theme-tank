---
title: Postgres展平JSON(b)
cover: >-
  https://cdn.jsdelivr.net/gh/binwenwu/picgo_demo/img/flattening-json-in-postgres.png
top_img: 'https://bu.dusays.com/2022/09/01/63103a65e883d.webp'
keywords: Postgres
categories:
  - 后端开发
tags:
  - Postgres
abbrlink: 2922fd2b
date: 2024-01-01 22:56:08
---

>开发人员喜欢使用 JSON，当他们存储数据时，通常不会对其进行规范化。 因此，在数据库中遇到 JSON(b) 字段并不罕见。 对于数据分析师、数据科学家和机器学习工程师来说，取消嵌套或扁平化，数据往往是后续分析的先决条件。
>
>整理数据库中的 JSON 列可能具有挑战性。 通常目标是将 JSON 数组扩展到新行并将 JSON 对象取消嵌套到新列中。 幸运的是，Postgres 有几个内置函数，可以组合这些函数来处理数据库中复杂 JSON 的规范化。



### 1 数据集

- 下表说明了一个常见的场景，其中一个表（我们将其称为城市）包含一个 JSON 或 JSON(b) 列（即坐标）。

```TEXT
+---+-------------------+-------+---------------------------------+
|idx|name               |country|coordinates                      |
+---+-------------------+-------+---------------------------------+
|1  |Sant Julià de Lòria|AD     |{"lat": 42.46372, "lng": 1.49129}|
|2  |Pas de la Casa     |AD     |{"lat": 42.54277, "lng": 1.73361}|
|3  |Ordino             |AD     |{"lat": 42.55623, "lng": 1.53319}|
|4  |les Escaldes       |AD     |{"lat": 42.50729, "lng": 1.53414}|
|5  |la Massana         |AD     |{"lat": 42.54499, "lng": 1.51483}|
|6  |Encamp             |AD     |{"lat": 42.53474, "lng": 1.58014}|
+---+-------------------+-------+---------------------------------+
```

- 虽然数据存储为 JSON 对象，但数据分析师、数据科学家或 ML 工程师更喜欢将 lat 和 lng 规范化为列。 幸运的是，我们可以使用 Postgres 内置的 `jsonb_to_record` 函数来构造 JSON 对象。



### 2 使用 jsonb_to_record 展平 JSON 对象

- 如果相关列包含 JSON(b) 对象，你可以使用内置函数 `jsonb_to_record`（或 `json_to_record`）将键值对规范化为列。 该函数接受一个 JSON 对象或包含 JSON 对象的列，并返回一条记录。 通过在 AS 表达式中匹配用户提供的复合类型来扩展记录。 复合类型表达式只是 JSON 对象键名（区分大小写）和用于它的 Postgres 数据类型。 JSON 对象可以包含比您在复合类型中定义的更多的键值对，它们将被排除。 如果复合类型定义了 JSON 对象中缺少的键，则它的值为 null。

- Postgres 文档显示了如何在给定 JSON 对象的情况下使用  `json_to_record`：

```SQL
SELECT *
FROM json_to_record('{"a":1,"b":[1,2,3],"c":"bar"}') AS
  x(a int, b text, d text)
```

```TEXT
 a |    b    | d
---+---------+---
 1 | [1,2,3] |
```

- 在此示例中，该函数接收一个 JSON 对象 {"a":1,"b":[1,2,3],"c":"bar"}。 用户定义的复合类型 x 定义键 a、b 和 d 的映射。 因为 JSON 对象包含键 a 和 b，并且数据类型与复合类型中的数据类型匹配，所以它们被提取为记录的一部分。 复合类型没有为 c 定义映射，所以它不是从对象中提取的。 此外，复合类型定义了对象中缺少的 d，因此未被提取。

- 文档中的示例很好，但通常我们希望在表列而不是字符串中取消嵌套 JSON。 幸运的是，我们可以在包含 JSON 对象的列上使用相同的 json_to_record 和 jsonb_to_record 函数。

- 以上面的城市表为例，我们可以将坐标列中的 JSON 对象展平。

```SQL
SELECT
  city.idx,
  city."name",
  city.country,
  coord.lat,
  coord.lng
FROM
  city,
  jsonb_to_record(coordinates) AS coord(lat numeric, lng numeric);
```

```TEXT
+---+-------------------+-------+--------+-------+
|idx|name               |country|lat     |lng    |
+---+-------------------+-------+--------+-------+
|1  |Sant Julià de Lòria|AD     |42.46372|1.49129|
|2  |Pas de la Casa     |AD     |42.54277|1.73361|
|3  |Ordino             |AD     |42.55623|1.53319|
|4  |les Escaldes       |AD     |42.50729|1.53414|
|5  |la Massana         |AD     |42.54499|1.51483|
|6  |Encamp             |AD     |42.53474|1.58014|
+---+-------------------+-------+--------+-------+
```

- 在此示例中，我们在坐标列上使用 jsonb_to_record 将对象展平为两列。 复合类型坐标匹配对象键和数据类型。 然后，我们可以在 SELECT 语句中引用与复合类型匹配的记录，以将 lat 和 lng 作为单独的列返回。



### 3 使用 jsonb_to_recordset 取消嵌套 JSON 数组

- 如果你的数据是 JSON 数组而不是 JSON 对象，则不能使用 `jsonb_to_record` 对其进行规范化。 相反，您想使用相关函数 `jsonb_to_recordset`。

- 内置函数 `json_to_recordset` 和 `jsonb_to_recordset` 与对应的 `json_to_record` 和 `jsonb_to_record` 非常相似。 不同之处在于 `*_to_recordset` 函数对 JSON 数组而不是 JSON 对象进行操作。

- 为了说明这一点，请考虑下表（称为国家/地区）。 该表与上面的城市表类似，只是每个城市一行，每个国家一行。 cities 列包含一个 JSON 数组，其中每个条目都是一个城市，存储为 JSON 对象。

```TEXT
+---+------------+---------------------------------------------------------------+
|idx|country_name|cities                                                         |
+---+------------+---------------------------------------------------------------+
|1  |AU          |[{"name": "York", "coordinates": {"lat": -31.88809, "lng": 1...|
|2  |AT          |[{"name": "Neu-Guntramsdorf", "coordinates": {"lat": 48.0642...|
|3  |AR          |[{"name": "Zárate", "coordinates": {"lat": -34.09814, "lng":...|
|4  |AG          |[{"name": "Saint John’s", "coordinates": {"lat": 17.12096, "...|
|5  |AO          |[{"name": "Saurimo", "coordinates": {"lat": -9.66078, "lng":...|
|6  |AQ          |[{"name": "McMurdo Station", "coordinates": {"lat": -77.846,...|
+---+------------+---------------------------------------------------------------+
```

- 在 cities 列上使用 jsonb_to_recordset 函数，我们可以将 JSON 数组扩展为单独的行。 和以前一样，我们提供了一个包含键名和数据类型的复合类型。

```SQL
SELECT
  idx,
  country_name,
  city.name,
  city.coordinates
FROM country,
     jsonb_to_recordset(cities) AS city(name text, coordinates jsonb);
```

```TEXT
+---+------------+---------+------------------------------------+
|idx|country_name|name     |coordinates                         |
+---+------------+---------+------------------------------------+
|1  |AU          |York     |{"lat": -31.88809, "lng": 116.7678} |
|1  |AU          |Yanchep  |{"lat": -31.54678, "lng": 115.63171}|
|1  |AU          |Yallingup|{"lat": -33.64592, "lng": 115.03514}|
|1  |AU          |Wundowie |{"lat": -31.76163, "lng": 116.3799} |
|1  |AU          |Wooroloo |{"lat": -31.8038, "lng": 116.31311} |
|1  |AU          |Woodville|{"lat": -34.88333, "lng": 138.55}   |
+---+------------+---------+------------------------------------+
```

- 请注意每个城市的 idx 值（国家/地区索引列）重复。



### 4 展平嵌套的 JSON

- 在前面的示例中，复合类型使用 jsonb 类型作为坐标键。 因此，查询将坐标作为 JSONB 列返回。 鉴于我们的目标是扁平化 JSON 数据，我们可以在之前的查询的基础上构建以返回单独的 lat 和 lng 列。

```SQL
SELECT
  idx,
  country_name,
  city.name,
  coord.lat,
  coord.lng
FROM country,
     jsonb_to_recordset(cities) AS city(name text, coordinates jsonb),
     jsonb_to_record(coordinates) AS coord(lat numeric, lng numeric);
```

```TEXT
+---+------------+---------+---------+---------+
|idx|country_name|name     |lat      |lng      |
+---+------------+---------+---------+---------+
|1  |AU          |York     |-31.88809|116.7678 |
|1  |AU          |Yanchep  |-31.54678|115.63171|
|1  |AU          |Yallingup|-33.64592|115.03514|
|1  |AU          |Wundowie |-31.76163|116.3799 |
|1  |AU          |Wooroloo |-31.8038 |116.31311|
|1  |AU          |Woodville|-34.88333|138.55   |
+---+------------+---------+---------+---------+
```

- 同时使用 `jsonb_to_recordset` 和 `jsonb_to_record`，我们能够展平 JSON 数据，以便每个城市有一行，重复国家数据。



### 5 结束语

>在数据库中争论 JSON 的数据分析师、数据科学家和 ML 工程师可以使用 Postgres 的内置函数来规范化数据。 通过将这些函数组合在一起，可以将复杂的 JSON 扩展为新的行和列，以便它们可以在下游用于数据探索、数据分析和构建模型。



---

原文链接：[Flattening JSON(b) in Postgres](https://ellisvalentiner.com/post/2022-01-06-flattening-json-in-postgres/)