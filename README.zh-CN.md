<div align="center"> <a href="http://www.tankenqi.cn"> <img alt="Tankenqi Logo" width="200" height="150" src="https://cdn.jsdelivr.net/gh/binwenwu/picgo_02/img/image%20(1).png"> </a>
<h1>Hexo-theme-TanK</h1>
</div>

**中文** | [English](./README.md)

## 介绍

TanK是一个高品质优雅的**Hexo**主题。它是用心从头开始制作的。

## Features

- 崇尚简洁
- 追求移动端体验
- 希望把加载速度做到极致（努力中）
- 让大家把注意力放到内容上。这是本主题设计初衷


## Preview
[Tankenqi Blog](https://binwenwu.github.io/)

## 使用 Gitpod

在Gitpod（GitHub的免费在线开发环境）中打开项目并立即开始编码。

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/anncwb/vue-vben-admin)


## 安装和使用

- 获取项目代码

```bash
git clone https://github.com/binwenwu/hexo-theme-tank.git
```

- 安装依赖

```bash
cd hexo-theme-tank

npm install
```

- 本地运行

```bash
npm run dev
```

- 部署
> 在部署之前，您应该修改config.yml中的仓库地址
```bash
deploy:
  - type: git
    repo: git@github.com:binwenwu/binwenwu.github.io.git
    branch: main
```
> 然后
```bash
npm run deploy
```

## How to contribute

非常欢迎您的加入提出问题或提交请求。

**拉取请求:**

1. Fork 代码!
2. 创建你自己的分支: `git checkout -b feat/xxxx`
3. 提交你的更改: `git commit -am 'feat(function): add xxxxx'`
4. 推送你的分支: `git push origin feat/xxxx`
5. 提交:`pull request`

## Git贡献提交规范

- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

  - `feat` 添加新功能
  - `fix` 解决问题/BUG
  - `style` 修改不影响功能的代码样式/格式
  - `perf` 优化/性能改进
  - `refactor` 重构
  - `revert` 撤消编辑
  - `test` 测试相关
  - `docs` 文档说明
  - `chore` 依赖项更新/脚手架配置修改等。
  - `workflow` 工作流改进
  - `ci` 持续集成
  - `types` 类型定义文件更改
  - `wip` 正在开发中

## 浏览器支持

建议使用`Chrome 80+`浏览器进行本地开发

支持现代浏览器，不包括IE

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt=" Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari |
| :-: | :-: | :-: | :-: | :-: |
| not support | last 2 versions | last 2 versions | last 2 versions | last 2 versions |

## 维护人员

[@Binwen Wu](https://github.com/binwenwu)

## 感谢

<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png" alt="JetBrains Logo (Main) logo." height="120">


## 许可证

[MIT © Tankenqi-2023](./LICENSE)
