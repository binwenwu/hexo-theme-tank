'use strict'
// 全局声明依赖
const pug = require('pug')
const path = require('path')
const urlFor = require('hexo-util').url_for.bind(hexo)
const util = require('hexo-util')

hexo.extend.filter.register('after_generate', function (locals) {
  // 首先获取整体的配置项名称
  const config = hexo.config.wowjs ? hexo.config.wowjs : hexo.theme.config.wowjs
  // 如果配置开启
  if (!(config && config.enable)) return
  // 集体声明配置项
  const data = {
    animateitem: config.animateitem,
    mobile: config.mobile ? config.mobile : false,
    animate_css: config.animate_css ? urlFor(config.animate_css) : "https://unpkg.zhimg.com/hexo-butterfly-wowjs/lib/animate.min.css",
    wow_js: config.wow_js ? urlFor(config.wow_js) : "https://unpkg.zhimg.com/hexo-butterfly-wowjs/lib/wow.min.js",
    wow_init_js: config.wow_init_js ? urlFor(config.wow_init_js) : "https://unpkg.zhimg.com/hexo-butterfly-wowjs/lib/wow_init.js"

  }
  // 渲染页面
  const wowjs_html = pug.renderFile(path.join(__dirname, './lib/html.pug'),data)
  //cdn资源声明
    //样式资源
  const css_text = data.mobile ? `<link rel="stylesheet" href="${data.animate_css}" media="print" onload="this.media='all'">` : `<link rel="stylesheet" href="${data.animate_css}" media="print" onload="this.media='screen'">`;
    //脚本资源
  const js_text = `<script defer src="${data.wow_js}"></script><script defer src="${data.wow_init_js}"></script>`;

  // 注入用户脚本
  // 此处利用挂载容器实现了二级注入
  hexo.extend.injector.register('body_end', wowjs_html, "default");
  // 注入脚本资源
  hexo.extend.injector.register('body_end', js_text, "default");
  // 注入样式资源
  hexo.extend.injector.register('head_end', css_text, "default");

},
hexo.extend.helper.register('priority', function(){
  // 过滤器优先级，priority 值越低，过滤器会越早执行，默认priority是10
  const pre_priority = hexo.config.electric_clock.priority ?  hexo.config.electric_clock.priority : hexo.theme.config.electric_clock.priority
  const priority = pre_priority ? pre_priority : 10
  return priority
})
)

// 附赠wowjs外挂标签
function wow (args, content) {
  args = args.join(' ').split(',')
  let p0 = args[0]?args[0].trim():''
  let p1 = args[1]?args[1].trim():''
  let p2 = args[2]?args[2].trim():''
  let p3 = args[3]?args[3].trim():''
  let p4 = args[4]?args[4].trim():''
  return `<div class='wow ${p0}' data-wow-duration='${p1}' data-wow-delay='${p2}' data-wow-offset='${p3}'  data-wow-iteration='${p4}' >${hexo.render.renderSync({ text: content, engine: 'markdown' })}</div>`
}

hexo.extend.tag.register('wow',wow,{ ends: true });
