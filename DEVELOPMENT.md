# 项目开发指南

## 项目概览

精品厨房小程序是一个完整的电商解决方案，包含：
- **微信小程序端**：面向用户的购物应用
- **管理后台**：用于商品、订单、用户管理的后台系统
- **CloudBase 后端**：提供数据库、云函数、存储等云服务

## 目录结构

```
cook/
├── admin/                    # 后台管理系统
│   ├── src/
│   │   ├── layout/          # 布局组件
│   │   ├── router/          # 路由配置
│   │   ├── store/           # 状态管理
│   │   ├── types/           # 类型定义
│   │   ├── utils/           # 工具函数
│   │   ├── views/           # 页面组件
│   │   │   ├── dashboard/   # 首页
│   │   │   ├── login/       # 登录
│   │   │   ├── product/     # 商品管理
│   │   │   ├── order/       # 订单管理
│   │   │   └── user/        # 用户管理
│   │   ├── App.vue          # 根组件
│   │   └── main.ts          # 入口文件
│   ├── index.html           # HTML 模板
│   ├── package.json         # 依赖配置
│   ├── tsconfig.json        # TypeScript 配置
│   └── vite.config.ts       # Vite 配置
│
├── wechat/                   # 微信小程序
│   ├── cloudfunctions/      # 云函数
│   │   └── quickstartFunctions/
│   ├── miniprogram/         # 小程序代码
│   │   ├── components/      # 组件
│   │   ├── images/          # 图片资源
│   │   ├── pages/           # 页面
│   │   ├── app.js           # 小程序入口
│   │   ├── app.json         # 小程序配置
│   │   └── app.wxss         # 全局样式
│   └── project.config.json  # 项目配置
│
├── .gitignore               # Git 忽略配置
└── README.md                # 项目说明
```

## 开发环境配置

### 前置要求
- Node.js >= 16.x
- npm >= 8.x 或 yarn >= 1.22
- 微信开发者工具（最新版本）

### 小程序开发

1. **安装微信开发者工具**
   - 下载地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

2. **导入项目**
   - 打开微信开发者工具
   - 选择「导入项目」
   - 项目路径选择 `wechat` 目录
   - AppID 已配置：`wx9716dae820c74f3f`

3. **云开发环境**
   - 环境ID：`cloud1-8g1vupme57ee1bac`
   - 点击工具栏「云开发」按钮进入控制台
   - 需要开通云开发服务（如未开通）

4. **数据库集合创建**
   
   在云开发控制台创建以下集合：
   - `users` - 用户信息
   - `products` - 商品信息
   - `categories` - 分类信息
   - `orders` - 订单信息
   - `carts` - 购物车

### 后台管理系统开发

1. **安装依赖**
   ```bash
   cd admin
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```
   访问 http://localhost:3000

3. **构建生产版本**
   ```bash
   npm run build
   ```

## CloudBase 配置

### 环境信息
- 环境 ID: `cloud1-8g1vupme57ee1bac`
- 区域: ap-shanghai

### 数据库结构

#### users 集合
```json
{
  "_id": "用户ID",
  "openid": "微信openid",
  "nickName": "昵称",
  "avatarUrl": "头像URL",
  "phone": "手机号",
  "createTime": "创建时间",
  "updateTime": "更新时间"
}
```

#### products 集合
```json
{
  "_id": "商品ID",
  "name": "商品名称",
  "image": "商品图片URL",
  "categoryId": "分类ID",
  "price": "价格",
  "originalPrice": "原价",
  "stock": "库存",
  "sales": "销量",
  "description": "描述",
  "status": "状态: active/inactive",
  "createTime": "创建时间",
  "updateTime": "更新时间"
}
```

#### categories 集合
```json
{
  "_id": "分类ID",
  "name": "分类名称",
  "icon": "图标",
  "sort": "排序",
  "status": "状态: active/inactive"
}
```

#### orders 集合
```json
{
  "_id": "订单ID",
  "orderNo": "订单编号",
  "userId": "用户ID",
  "products": [
    {
      "productId": "商品ID",
      "name": "商品名称",
      "price": "单价",
      "quantity": "数量"
    }
  ],
  "totalAmount": "总金额",
  "status": "状态: pending/paid/shipping/completed/cancelled",
  "address": {
    "name": "收货人",
    "phone": "手机号",
    "province": "省",
    "city": "市",
    "district": "区",
    "detail": "详细地址"
  },
  "createTime": "创建时间",
  "payTime": "支付时间",
  "shipTime": "发货时间",
  "completeTime": "完成时间"
}
```

#### carts 集合
```json
{
  "_id": "购物车ID",
  "userId": "用户ID",
  "productId": "商品ID",
  "quantity": "数量",
  "selected": "是否选中",
  "createTime": "创建时间"
}
```

### 安全规则配置

在云开发控制台为每个集合配置安全规则：

```json
{
  "read": true,
  "write": "doc._openid == auth.openid"
}
```

## 开发流程

### 小程序开发流程

1. **创建新页面**
   - 在 `wechat/miniprogram/pages/` 下创建页面目录
   - 在 `app.json` 的 `pages` 数组中添加页面路径
   - 创建 `.wxml`、`.wxss`、`.js`、`.json` 文件

2. **调用云函数**
   ```javascript
   wx.cloud.callFunction({
     name: 'functionName',
     data: {
       // 参数
     }
   }).then(res => {
     console.log(res.result)
   })
   ```

3. **数据库操作**
   ```javascript
   const db = wx.cloud.database()
   
   // 查询
   db.collection('products').get()
   
   // 新增
   db.collection('orders').add({
     data: {
       // 订单数据
     }
   })
   ```

### 后台开发流程

1. **添加新页面**
   - 在 `admin/src/views/` 下创建页面组件
   - 在 `admin/src/router/index.ts` 中添加路由配置

2. **调用云函数**
   ```typescript
   import { callFunction } from '@/utils/cloudbase'

   const result = await callFunction('functionName', {
     // 参数
   })
   ```

3. **数据库操作**
   ```typescript
   import { db } from '@/utils/cloudbase'

   // 查询
   const result = await db.collection('products').get()

   // 新增
   await db.collection('orders').add({
     // 订单数据
   })
   ```

## 部署说明

### 小程序部署

1. **上传代码**
   - 在微信开发者工具中点击「上传」
   - 填写版本号和项目备注

2. **提交审核**
   - 登录微信公众平台
   - 在「版本管理」中提交审核

3. **发布上线**
   - 审核通过后点击「发布」

### 后台部署

1. **构建项目**
   ```bash
   cd admin
   npm run build
   ```

2. **部署到 CloudBase 静态托管**
   - 在 CloudBase 控制台进入「静态网站托管」
   - 上传 `dist` 目录下的所有文件
   - 配置域名和 HTTPS

3. **配置安全域名**
   - 在 CloudBase 控制台添加安全域名
   - 将部署的域名添加到允许列表

## 常见问题

### 小程序端

**Q: 云函数调用失败？**
A: 检查云函数是否已部署，环境ID是否正确

**Q: 数据库操作无权限？**
A: 检查安全规则配置，确保规则正确

**Q: 图片无法显示？**
A: 检查图片URL是否正确，是否已配置下载域名

### 后台端

**Q: 登录失败？**
A: 检查 CloudBase 环境ID，确保已在安全域名列表中

**Q: 跨域问题？**
A: 确保已配置 CloudBase 安全域名

**Q: 构建失败？**
A: 检查 Node.js 版本，清除 node_modules 重新安装

## 相关文档

- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [CloudBase 文档](https://cloud.tencent.com/document/product/876)
- [Vue 3 文档](https://cn.vuejs.org/)
- [Element Plus 文档](https://element-plus.org/zh-CN/)
- [TypeScript 文档](https://www.typescriptlang.org/)
