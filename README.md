# 精品厨房小程序项目

一个基于微信小程序和 CloudBase 云开发的精品厨房电商项目，包含用户端小程序和管理后台。

## 项目结构

```
cook/
├── admin/          # 后台管理系统（Vue 3 + TypeScript + Element Plus）
├── wechat/         # 微信小程序端
└── README.md       # 项目说明文档
```

## 技术栈

### 小程序端
- 微信小程序原生开发
- 微信云开发
- CloudBase 环境：`cloud1-8g1vupme57ee1bac`

### 后台管理系统
- Vue 3 + TypeScript
- Vite 构建工具
- Element Plus UI 框架
- Vue Router 路由管理
- Pinia 状态管理
- CloudBase JS SDK

## 功能模块

### 小程序端
- 商品浏览与分类
- 购物车管理
- 订单下单与支付
- 个人中心

### 后台管理系统
- 数据统计面板
- 商品管理（列表、分类）
- 订单管理
- 用户管理

## 快速开始

### 小程序端

1. 使用微信开发者工具打开 `wechat` 目录
2. 配置 AppID（已配置：wx9716dae820c74f3f）
3. 点击「云开发」控制台，确保云环境已开通
4. 编译运行小程序

### 后台管理系统

```bash
# 进入 admin 目录
cd admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## CloudBase 环境配置

项目使用 CloudBase 作为后端服务，环境 ID：`cloud1-8g1vupme57ee1bac`

### 主要功能
- 云数据库：存储商品、订单、用户等数据
- 云函数：处理业务逻辑
- 云存储：存储商品图片等资源
- 静态网站托管：部署管理后台

## 开发说明

### 小程序开发
- 小程序代码位于 `wechat/miniprogram/` 目录
- 云函数位于 `wechat/cloudfunctions/` 目录
- 使用 `wx.cloud` API 访问云开发资源

### 后台开发
- 源代码位于 `admin/src/` 目录
- 使用 `@cloudbase/js-sdk` 访问云开发资源
- 路由使用 hash 模式，适配静态托管部署
- 组件库使用 Element Plus

## 部署

### 小程序部署
1. 在微信开发者工具中上传代码
2. 在微信公众平台提交审核
3. 审核通过后发布

### 后台部署
1. 执行 `npm run build` 构建项目
2. 使用 CloudBase 静态网站托管部署 `dist` 目录
3. 配置安全域名

## 相关链接

- [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [CloudBase 文档](https://cloud.tencent.com/document/product/876)
- [Vue 3 文档](https://cn.vuejs.org/)
- [Element Plus 文档](https://element-plus.org/zh-CN/)

## 许可证

MIT
