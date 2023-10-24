# hexo-butterfly-footer-marcus
给博客添加`仿Heo页脚`<br>
适用于`hexo-theme-butterfly`
## 参考
[Heo](https://blog.zhheo.com/)
[Leonus](https://blog.leonus.cn/)
![实际效果](https://img01.anzhiy.cn/useruploads/8/2023/01/29/63d6167eeb517.png)
## 安装
安装插件,在博客根目录[Blogroot]下打开终端，运行以下指令：
```shell
npm install hexo-butterfly-footer-marcus --save
```
如果需要随机友联的话,再运行以下指令：
```shell
npm i yamljs --save
```
与店长的插件冲突!
## 添加配置信息
以下为写法示例 在站点配置文件`_config.yml`或者主题配置文件`_config.butterfly.yml`中添加
```yml
#hexo-butterfly-footer-marcus
#see https://blog.marcus233.top/p/footer.html
footer_beautify:
  enable: true
  priority: 5 #过滤器优先权
  enable_page: / # 应用页面
  layout: # 挂载容器类型
      type: id
      name: footer
      index: 1
  footer_icons:
    enable: true
    left:
      - icon: fa-solid fa-compass
        link: https://www.marcus233.top/
        desrc: 个人主页
        class: out
      - icon: fa-brands fa-qq
        link: https://res.abeim.cn/api/qq/?qq=3105950984
        desrc: 联系QQ
        class: out
      - icon: fa-brands fa-weixin
        link: /wechat/
        desrc: 联系微信
        class: in
      - icon: fa-solid fa-envelope
        link: mailto:marcus@marcus233.top
        desrc: 发送邮件
        class: out
    right:
      - icon: fa-brands fa-github
        link: https://github.com/Marcusyyds
        desrc: Github主页
        class: out
      - icon: fa-brands fa-bilibili
        link: https://space.bilibili.com/1024450661
        desrc: 哔哩哔哩主页
        class: out
      - icon: fa-solid fa-star
        link: /stars/
        desrc: 藏宝阁
        class: in
      - icon: fa-solid fa-comment
        link: /message/
        desrc: 留言
        class: in
  footer_logo:
    enable: true
    url: https://img01.anzhiy.cn/useruploads/8/2022/12/15/639adf5b8806a.png
  footer_group:
    enable: true
    footer_group_link:
      - group_title: 直达
        footer_links: 
          - text: 藏宝阁
            link: /stars/
            class: in
          - text: 优秀句子
            link: /sentence/
            class: in
          - text: 空间说说
            link: /zone/
            class: in
          - text: 友链订阅
            link: /fcircle/
            class: in
          - text: 切换背景
            link: /bg/
            class: in
      - group_title: 关于
        footer_links: 
          - text: 关于我
            link: /about/
            class: in
          - text: RSS订阅
            link: /atom.xml
            class: in
          - text: 站点监控
            link: https://uptime.marcus233.top/
            class: out
          - text: 更新记录
            link: /timeline/
            class: in
          - text: 我的相册
            link: /picture/
            class: in
      - group_title: 分类
        footer_links: 
          - text: 博客相关
            link: /categories/博客相关
            class: in
          - text: 生活点滴
            link: /categories/生活点滴
            class: in 
          - text: 资源分享
            link: /categories/资源分享
            class: in
          - text: 学习笔记
            link: /categories/学习笔记
            class: in 
          - text: 实用教程
            link: /categories/实用教程
            class: in 
          - text: 查看全部
            link: /categories/
            class: in 
  footer_friend_links:
    enable: true
    number: 5
  footer_bottom:
    copyright:
      enable: true
      author: Marcus
      link: https://marcus233.top/
      time: 2022
    left:
      - text: 雨云
        desrc: 本站CDN支持
        link: https://rainyun.com/
      - text: 网盾星球
        desrc: 本站CDN防护主要提供商:网盾星球
        link: https://www.netdun.net/
      - text: 萌ICP备20230221
        desrc: 萌ICP备20230221
        link: https://icp.gov.moe/?keyword=20230221
      - text: 萌ICP备20236688
        desrc: 萌ICP备20236688
        link: https://icp.gov.moe/?keyword=20236688
      - text: 萌ICP备20230002
        desrc: 萌ICP备20230002
        link: https://icp.gov.moe/?keyword=20230002
    right:
      - text: Hexo
        desrc: 框架
        link: https://hexo.io/zh-cn/
      - text: Butterfly
        desrc: 主题
        link: https://butterfly.js.org/
    runtime:
      enable: true
      time: 2022/08/09 00:00:00
  footer_css: https://cdn1.tianli0.top/npm/hexo-butterfly-footer-marcus/lib/footer.min.css
  footer_js: https://cdn1.tianli0.top/npm/hexo-butterfly-footer-marcus/lib/footer.min.js
```
请自行下载footer_js修改建站日期
## 参数释义
 **参数**                             | **备选值/类型**  | **释义**                                                                                                
------------------------------------|-------------|-------------------------------------------------------------------------------------------------------
 **enable**                         | true/false  | 【必选】控制开关                                                                                              
 **priority**                       | number      | 【可选】过滤器优先级，数值越小，执行越早，默认为10，选填                                                                         
 **enable_page**                    | path/all    | 【可选】填写想要应用的页面的相对路径（即路由地址）,如根目录就填'/',分类页面就填'/categories/'。若要应用于所有页面，就填'all'，默认为all                     
 **exclude**                        | path        | 【可选】填写想要屏蔽的页面，可以多个。仅当enable_page为'all'时生效。写法见示例。原理是将屏蔽项的内容逐个放到当前路径去匹配，若当前路径包含任一屏蔽项，则不会挂载。             
 **layout.type**                    | id/class    | 【可选】挂载容器类型，填写id或class，不填则默认为id                                                                        
 **layout.name**                    | text        | 【必选】挂载容器名称                                                                                            
 **layout.index**                   | 0和正整数       | 【可选】前提是layout.type为class，因为同一页面可能有多个class，此项用来确认究竟排在第几个顺位                                             
 **insertposition**                 | text        | 'beforebegin'：元素自身的前面。'afterbegin'：插入元素内部的第一个子节点之前。'beforeend'：插入元素内部的最后一个子节点之后。'afterend'：插入元素自身的后面。 
 **footer_icons.enable**            | true/false  | 【必选】icon控制开关                                                                                          
 ***.text**                         | text        | 【必选】显示文字                                                                                              
 ***.icon**                         | class       | 【必选】icon(例:fa-solid fa-commet)                                                                        
 ***.desrc**                        | text        | 【必选】a标签内的title选项                                                                                      
 ***.class**                        |  in/out     | 【必选】站内/外链接(站内:in,站外:out)                                                                              
 ***.link**                         | url         | 【必选】链接                                                                                                
 **footer_logo.enable**             | true/false  | 【必选】icon内logo控制开关                                                                                     
 **footer_group.enable**            | true/false  | 【必选】group控制开关                                                                                         
 **footer_friend_links.enable**     |  true/false | 【必选】随机友联开关                                                                                            
 **footer_friend_link.number**      | 正整数         | 【可选】随机友联数量                                                                                            
 **footer_bottom.copyright.enable** |  true/false | 【必选】copyright开关                                                                                       
 **footer_bottom.runtime.enable**   |  true/false | 【必选】网站运行时间开关                                                                                          
 **footer_css**                     | url         | 【必选】css链接                                                                                             
 **footer_js**                      | url         | 【必选】js链接                                                                                              
## 使用方法 
填写配置项
## 最后
hexo cl&&hexo g&&hexo s
