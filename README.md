# SelfStudyKit

基于 [MDUI](https://github.com/zdhxiong/mdui) 的纯前端自习辅助工具集.

[![License](https://img.shields.io/github/license/BovineBeta/SelfStudyKit?color=blue)](https://github.com/BovineBeta/SelfStudyKit)
[![GitHub release](https://img.shields.io/github/v/release/BovineBeta/SelfStudyKit)](https://github.com/BovineBeta/SelfStudyKit/releases)

# Feature

-   Material Design 设计, 界面简洁
-   基于 HTML5, 跨平台

# Development

准备:

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

运行 webpack dev server:

```bash
yarn start
```

开发模式构建:

```bash
yarn build
```

实时构建 (可搭配 vscode 扩展 live server 使用):

```bash
yarn build-watch
```

生产模式构建:

```bash
yarn build-production
```

# Todo

**Core**

-   [x] 主页
-   [x] 一言
-   [x] 时钟
-   [x] 番茄钟
-   [ ] 单词本
-   [x] 设置

**Plus**

-   [ ] PWA Support
-   [ ] 番茄钟多项预设置支持
-   [x] Refactoring with TypeScript

**Desktop version**

-   [ ] Niva Support
-   [ ] Electron build (low priority)

# License

SelfStudy 遵循 GPL-3.0 协议.
