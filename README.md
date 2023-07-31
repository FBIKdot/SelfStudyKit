# SelfStudyKit

# :warning:此项目的最初版本未完成. 如果你对这个项目有兴趣, 可以启用 watch 勾选 Releases 以便让 Github 在每次 Release 时进行通知.

基于 [MDUI](https://github.com/zdhxiong/mdui) 的纯前端自习辅助工具集.

# Feature

-   Material Design 设计, 界面简洁
-   基于 HTML5, 跨平台

# Development

准备:

```bash
git clone https://github.com/BovineBeta/SelfStudyKit.git
cd SelfStudyKit
yarn # 或者 npm install
```

运行 webpack dev server:

```
yarn start # 或者 npm run start, 以此类推
```

开发模式构建:

```
yarn build
```

实时构建 (可搭配 vscode 扩展 live server 使用):

```
yarn build-watch
```

生产模式构建:

```
yarn build-production
```

# Todo

**Core**

-   [x] 主页
-   [x] 一言
-   [x] 时钟
-   [ ] 番茄钟
-   [ ] 单词本
-   [ ] 设置

**Plus**

-   [ ] PWA Support
-   [ ] 番茄钟多项预设置支持
-   [ ] Refactoring with TypeScript

**Desktop version**

-   [ ] Niva Support
-   [ ] Electron build (low priority)
