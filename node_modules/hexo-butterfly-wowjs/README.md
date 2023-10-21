# hexo-butterfly-wowjs

给`hexo-theme-butterfly`添加 [wowjs特效](https://akilar.top/posts/abab51cf/)

# 安装

1. 安装插件,在博客根目录`[Blogroot]`下打开终端，运行以下指令：
  ```bash
  npm install hexo-butterfly-wowjs --save
  ```

2. 添加配置信息，以下为写法示例
  在站点配置文件`_config.yml`或者主题配置文件`_config.butterfly.yml`中添加

  ```yaml
  wowjs:
    enable: true #控制动画开关。true是打开，false是关闭
    priority: 10 #过滤器优先级
    mobile: false #移动端是否启用，默认移动端禁用
    animateitem:
      - class: recent-post-item #必填项，需要添加动画的元素的class
        style: animate__zoomIn #必填项，需要添加的动画
        duration: 2s #选填项，动画持续时间，单位可以是ms也可以是s。例如3s，700ms。
        delay: 1s #选填项，动画开始的延迟时间，单位可以是ms也可以是s。例如3s，700ms。
        offset: 100 #选填项，开始动画的距离（相对浏览器底部）
        iteration: 2 #选填项，动画重复的次数
      - class: card-widget
        style: animate__zoomIn
    animate_css: https://unpkg.zhimg.com/hexo-butterfly-wowjs/lib/animate.min.css
    wow_js: https://unpkg.zhimg.com/hexo-butterfly-wowjs/lib/wow.min.js
    wow_init_js: https://unpkg.zhimg.com/hexo-butterfly-wowjs/lib/wow_init.js
  ```
3. 参数释义

  |参数|备选值/类型|释义|
  |:--|:--|:--|
  |enable|true/false|【必选】控制开关|
  |priority|number|【可选】过滤器优先级，数值越小，执行越早，默认为10，选填|
  |mobile|true/false|控制移动端是否启用，默认移动端禁用|
  |animateitem.class|class|【可选】添加动画类名，只支持给class添加|
  |animateitem.style|text|【可选】动画样式，具体类型参考[animate.css](https://animate.style/)|
  |animateitem.duration|time,单位为s或ms|【可选】动画持续时间，单位可以是ms也可以是s。例如3s，700ms。|
  |animateitem.delay|time,单位为s或ms|【可选】动画开始的延迟时间，单位可以是ms也可以是s。例如3s，700ms。|
  |animateitem.offset|number,单位为px|【可选】开始动画的距离（相对浏览器底部）。|
  |animateitem.iteration|number,单位为s或ms|【可选】动画重复的次数|
  |animate_css|URL|【可选】animate.css的CDN链接,默认为`https://unpkg.zhimg.com/hexo-butterfly-wowjs/lib/animate.min.css`|
  |wow_js|URL|【可选】wow.min.js的CDN链接,默认为`https://unpkg.zhimg.com/hexo-butterfly-wowjs/lib/wow.min.js`|
  |wow_init_js|URL|【可选】wow_init.js的CDN链接,默认为`https://unpkg.zhimg.com/hexo-butterfly-wowjs/lib/wow_init.js`|

4. 更多动画样式可以查看[animate.css](https://animate.style/)参考文档。

# 外挂标签用法
您也可以在您的文章中应用动画效果。动画样式可以查看[animate.css](https://animate.style/)参考文档
1. 外挂标签语法
  ```markdown
  {% wow [animete],[duration],[delay],[offset],[iteration] %}
  {% endwow %}
  ```
2. 写法示例
  - `flip`动画效果。
    ```markdown
    {% wow animate__flip %}
    {% note green 'fas fa-fan' modern%}
    `flip`动画效果。
    {% endnote %}
    {% endwow %}
    ```
  - `zoomIn`动画效果，持续`5s`，延时`5s`，离底部`100`距离时启动，重复`10`次。
    ```markdown
    {% wow animate__zoomIn,5s,5s,100,10 %}
    {% note blue 'fas fa-bullhorn' modern%}
    `zoomIn`动画效果，持续`5s`，延时`5s`，离底部`100`距离时启动，重复`10`次
    {% endnote %}
    {% endwow %}
    ```
  - `slideInRight`动画效果，持续`5s`，延时`5s`。
    ```markdown
    {% wow animate__slideInRight,5s,5s %}
    {% note orange 'fas fa-car' modern%}
    `slideInRight`动画效果，持续`5s`，延时`5s`。
    {% endnote %}
    {% endwow %}
    ```
  - `heartBeat`动画效果，延时`5s`，重复`10`次。此处注意**不用的参数位置要留空**，用逗号间隔。
    ```markdown
    {% wow animate__heartBeat,,5s,,10 %}
    {% note red 'fas fa-battery-half' modern%}
    `heartBeat`动画效果，延时`5s`，重复`10`次。
    {% endnote %}
    {% endwow %}
    ```
