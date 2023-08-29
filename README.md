# SelfStudyKit

基于 [MDUI](https://github.com/zdhxiong/mdui) 的纯前端自习辅助工具集.

[![License](https://img.shields.io/github/license/BovineBeta/SelfStudyKit?color=blue)](https://github.com/BovineBeta/SelfStudyKit)
[![GitHub release](https://img.shields.io/github/v/release/BovineBeta/SelfStudyKit)](https://github.com/BovineBeta/SelfStudyKit/releases)

每次提交后自动在此构建: <https://SelfStudyKit.fbik.top>

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
-   [ ] 番茄钟多项预设置支持
-   [x] Refactoring with TypeScript

**Desktop version**

-   [ ] Use [Niva](https://github.com/bramblex/niva)
-   [ ] Use [mini-electron](https://github.com/weolar/miniblink49#mini-electron)
-   [ ] Use Electron (low priority)

# 使用

直接访问<https://SelfStudyKit.fbik.top>

或者前往 Releases 下载 Desktop version

# Developement

## 准备

本项目使用`yarn`进行包管理, 请确保安装好了`yarn`.

```bash
npm install -g yarn
```

拉取代码&安装依赖

```bash
git clone https://github.com/BovineBeta/SelfStudyKit.git
cd SelfStudyKit
yarn
```

## 构建应用

生产模式构建:

```bash
yarn build-production
```

构建后的内容将会输出到`/dist`目录下, 可以直接使用浏览器打开`/dist/index.html`离线使用, 或者将`/dist`目录下的文件部署到网页服务器在线使用.

## 开发

运行 webpack dev server (拥有实时构建, 但是 index.html 的修改不会自动更新):

```bash
yarn start
```

开发模式构建:

```bash
yarn build
```

开发模式实时构建 (如果不想使用 webpack dev server, 可搭配 vscode 扩展 live server 使用):

```bash
yarn build-watch
```

生产模式构建:

```bash
yarn build-production
```

# License

SelfStudy 遵循 GPL-3.0 协议.
