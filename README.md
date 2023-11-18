# SelfStudyKit

基于 [MDUI](https://github.com/zdhxiong/mdui) 的纯前端自习辅助工具集.

[![License](https://img.shields.io/github/license/FBIKdot/SelfStudyKit?color=blue)](https://github.com/FBIKdot/SelfStudyKit)
[![GitHub release](https://img.shields.io/github/v/release/FBIKdot/SelfStudyKit)](https://github.com/FBIKdot/SelfStudyKit/releases)

每次`main`分支的提交将自动部署于此: <https://SelfStudyKit.fbik.top>

# 特点

-   Material Design 界面设计, 简洁且自适应大小屏幕.
-   基于 HTML5, 通过跨平台的浏览器使用.
-   可以直接在本地离线打开, 也可以部署到网页服务器在线使用.
-   为了增强离线的便携性, 有桌面版, 而且文件大小不大.

# Feature

勾选内容为已完成的内容

**Core**

-   [x] 一言
-   [x] 时钟
-   [x] 番茄钟
-   [ ] 单词本
-   [x] 设置

**Plus**

-   [x] gzipped, 使加载速度增快
-   [ ] Support PWA
-   [ ] Use ServiceWorker API
-   [ ] 番茄钟多项预设置支持
-   [x] 模块化重构
-   [x] Refactoring with TypeScript

**Desktop version**

-   [x] Use [Niva](https://github.com/bramblex/niva)
-   [x] Use [mini-electron](https://github.com/weolar/miniblink49#mini-electron)
-   [x] Use Electron (`.asar` only)

# 使用

SelfStudyKit 是纯前端应用, 你可以直接使用浏览器打开构建好的`index.html`, 在本地启动一个 Web Server, 或者部署到服务器.

每次`main`分支的提交将自动部署于此: <https://SelfStudyKit.fbik.top>

如果你有离线使用的需求, 可以前往 Releases 下载 Desktop version 或已经构建好的`dist`打包, 或者使用源代码自己进行生产模式构建.

# Developement

## 准备

本项目使用`yarn`进行包管理, 请确保安装好了`yarn`.

```bash
npm install -g yarn
```

拉取代码&安装依赖

```bash
git clone https://github.com/FBIKdot/SelfStudyKit.git
cd SelfStudyKit
yarn
```

## 开发

开发模式构建:

```bash
yarn build
```

开发模式实时构建 (如果不想使用 webpack dev server, 可搭配 vscode 扩展 live server 使用):

```bash
yarn start # webpack dev server

yarn dev # 监听模式, 不启用webpack dev server
```

## 生产模式构建

构建后的内容将会输出到`/dist`目录下, 可以直接使用浏览器打开`/dist/index.html`离线使用, 或者将`/dist`目录下的文件部署到网页服务器在线使用.

```bash
yarn production
```

# License

SelfStudy 遵循 GPL-3.0 协议.
