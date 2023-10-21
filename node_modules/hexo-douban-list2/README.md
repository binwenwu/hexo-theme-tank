# hexo-douban-list2

[![GitHub license](https://img.shields.io/github/license/mythsman/hexo-douban.svg)](https://github.com/mythsman/hexo-douban/blob/master/LICENSE)



## 说明：

基于作者TianZonglin基于原作者mythsman二次开发的面向github编程开发。由于此版更改含有部分个人喜好的改变，因此不打算在原repo提交pr。如能正常使用，本项目将不再更新。

**以下是前任作者的说明（有改动），配置使用请参考**：

基于HEXO豆瓣插件 [hexo-douban](https://github.com/mythsman/hexo-douban) 的二次开发插，强烈建议先试用原插件，如果您觉得以下特性更能满足您的需要，那么再使用本插件。

主要特性：

- [原项目](https://github.com/mythsman/hexo-douban)固有特性；

- 重构模板页面，支持移动适配；

- 补全列表影评内容，支持短评和长影评（核心）；

- 支持生成指定长度的列表（对于观影数量较多的用户）；

- 样式inline化，允许直接嵌入同源其他页面；

  ``` html
  <div id="dbcontent"></div>
  <script>$('#dbcontent').load('./movies/index.html .hexo-douban-item:nth-child(1)');</script>
  ```

**注意：本插件构建的页面完全不保证兼容IE等上古浏览器，推广使用现代浏览器，人人有责。**

## 安装

``` bash
$ npm i hexo-douban-list2
```

## 配置

将下面的配置写入站点的配置文件 `_config.yml` 里(不是主题的配置文件)。

``` yaml
douban:
  user: ID（数字或字母|无需引号）
  builtin: true
  movie:
    title: '生成页面的标题'
    quote: '生成页面的内容的导语'
    length: 2
    valine_id: WbLE88qfAcz4hSI5 #事实上可以不写甚至删除
    valine_key: ycqjmtEfUxuxD  #同样可以不写甚至删除
  timeout: 10000 
```

**注意：以上内容中务必确定 USER ID 的正确性！**

- **user**: 你的豆瓣ID.打开豆瓣，登入账户，然后在右上角点击 "个人主页" ，这时候地址栏的URL大概是这样："https://www.douban.com/people/xxxxxx/" ，其中的"xxxxxx"就是你的个人ID了。
- **builtin**: 是否将生成页面的功能嵌入`hexo s`和`hexo g`中，默认嵌入（TRUE）即npm安装后无需任何操作按原命令部署博客即可生效。
- **title**: 该页面的标题。
- **quote**: 写在页面开头的一段话,支持html语法。
- **length**: 默认值为2，爬取数据页数通常为该值*2。
- **timeout**: 爬取数据的超时时间，默认是 10000ms ，如果在使用时发现报了超时的错(ETIMEOUT)可以把这个数据设置的大一点。

## 使用

**注意**，通常大家都喜欢用`hexo d`来作为`hexo deploy`命令的简化，但是当安装了`hexo douban`之后，就不能用`hexo d`了，因为`hexo douban`跟`hexo deploy`的前缀都是`hexo d`。

## 升级

使用 `npm update hexo-douban-list2` 直接更新。

## 测试

执行 `hexo clean && hexo server`，之后访问 `localhost:4000/movies` 即可访问生成的观影页面。

## 删除（可补回来）的内容


相比较于原项目，取消或删除了以下内容：

- 去掉了书籍和音乐，单纯针对电影

## 异常说明

如果构建页面为空或404，且日志输出为 `INFO  0 movies have been loaded in xx ms`，这可能是你的node版本过高，建议使用12。

## 更新内容：

2021.01.01

1.去除movie.ejs中的评论系统配置，经测试能正常评论。

2.更新文档。

2020.12.31

修复“想看”内容的图片显示。

2020.12.24

1.还原电影“在看、想看、看过”菜单，且未恢复“在看”内容；

2.修改点击标题跳转地址，现在能正确跳转到豆瓣相应object了；

## TODO：

优化和精简代码。

## 示例 

本项目作者：https://www.hin.cool/movies/

前任作者：https://www.cz5h.com/movies

### 截图

![watched](https://7.dusays.com/2021/02/25/a6dd1085d1e57.jpg)

![wish](https://7.dusays.com/2021/02/25/41a67f5b8412b.jpg)

-----------------------------------------




