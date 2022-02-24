---
title: vue3的极速开发初体验
date: 2021-09-13 15:46:24
tags: 
- vue3 
- vite
---

# vue3的极速开发初体验

vue3从20年7月发布测试版本以来，一直保持较高的更新频率，在开发者中也广受关注，相对于vue2更新了一些新的特性，我也一直关注vue3生态的发展。
受够了webpack臃肿的配置项，尤其是漫长的打包和热更新速度。而vue3推荐使用的vite因为直接跳过编译过程，打包和热更新速度直接起飞，再配合vue3方便好用的新特性，使用vue3开发的体验一个字概括就是：快！

在“一键挪车“项目中我使用了vue3开发了一些简单的页面。

## 新特性

* 组合式API
* SFC单文件组件的setup语法糖
* 双向绑定实现的不同
* template不再需要独立根节点
* 等等

而生态方面 vue-router、vuex，改动不算太大，简单说，一切皆模块（es6模块）。

## 直接进入主题，vue3项目搭建

``` c
// 创建项目
npm init vite@latest my-vue-app --template vue

// 初始化项目
cd my-vue-app
npm install

// 引入依赖
npm install vue-router@next vuex@next --save
// 引入其他依赖
npm install axios  dayjs vant

// 光速起飞
npm run dev
// 光速打包
npm run dev
```

## 新的开发方式

这里使用实际项目代码演示，组合式api的概念，云云，如何使用setup。
