# 精品厨房 - 云数据库迁移指南

## 概述

现在数据已迁移到云开发数据库，支持：
- Admin 管理后台：增删改查菜品
- 小程序：从数据库读取菜品数据
- 数据实时同步

## 数据库集合

需要创建以下集合：

1. **goods** - 菜品数据
2. **categories** - 分类数据
3. **favorites** - 用户收藏
4. **orders** - 订单数据
5. **cart** - 购物车数据

## 使用步骤

### 1. 部署云函数

在微信开发者工具中：

```bash
# 右键点击 cloudfunctions/initData 文件夹
# 选择 "创建并部署：云端安装依赖"
```

### 2. 创建数据库集合

在云开发控制台 - 数据库中创建集合：
- `goods` - 菜品数据
- `categories` - 分类数据
- `favorites` - 用户收藏
- `orders` - 订单数据
- `cart` - 购物车数据

### 3. 初始化数据

**方式一：使用小程序 admin 页面**
1. 访问小程序的 `pages/admin/admin` 页面
2. 点击「初始化商品数据」

**方式二：使用云函数**
```javascript
// 调用云函数
wx.cloud.callFunction({
  name: 'initData',
  data: { type: 'goods' }
})
```

### 3.2 批量生成200个菜品

**部署云函数**
```bash
# 在微信开发者工具中
# 右键点击 cloudfunctions/generateDishes 文件夹
# 选择 "创建并部署：云端安装依赖"
```

**调用云函数生成菜品**
```javascript
wx.cloud.callFunction({
  name: 'generateDishes'
})
```

生成规则：
- 每个分类生成35个菜品（共210个）
- 肉菜：35个，价格 35-55 元
- 素菜：35个，价格 8-28 元
- 汤菜：35个，价格 18-38 元
- 炖菜：35个，价格 38-58 元
- 凉菜：35个，价格 12-32 元
- 沙拉：35个，价格 22-42 元

### 3.1 初始化分类数据

**方式一：通过 Admin 后台**
1. 启动 Admin 后台并登录
2. 进入「菜单管理」→「分类管理」
3. 系统会自动初始化默认分类数据

**方式二：使用云函数**
```bash
# 在微信开发者工具中
# 右键点击 cloudfunctions/initCategories 文件夹
# 选择 "创建并部署：云端安装依赖"

# 调用云函数
wx.cloud.callFunction({
  name: 'initCategories'
})
```

### 4. 使用 Admin 管理后台

```bash
# 进入 admin 目录
cd admin

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000`，登录后进入「菜单管理」：
- 查看所有菜品
- 添加新菜品
- 编辑菜品信息
- 删除菜品
- 所有操作实时同步到数据库

### 5. 小程序读取数据

小程序首页会自动从数据库加载菜品数据：

```javascript
// pages/home/home.js
async loadGoods() {
  const db = wx.cloud.database()
  const res = await db.collection('goods').limit(1000).get()
  this.setData({ 
    allGoodsList: res.data,
    goodsList: res.data 
  })
}
```

## 数据结构

### 菜品 (goods)

```javascript
{
  id: Number,           // 菜品ID
  name: String,         // 名称
  description: String,  // 描述
  price: Number,        // 价格
  image: String,        // 图片URL
  category: String,     // 分类：肉菜/素菜/汤菜/炖菜/凉菜/沙拉
  isHot: Boolean,       // 是否招牌
  isNew: Boolean,       // 是否新品
  _openid: String       // 用户ID（商品数据为空）
}
```

### 分类 (categories)

```javascript
{
  id: Number,           // 分类ID
  name: String,         // 分类名称
  icon: String,         // 图标emoji
  sort: Number,         // 排序（升序）
  status: Number,       // 状态：1启用 0禁用
  _openid: String       // 用户ID（分类数据为空）
}
```

**默认分类（与小程序一致）：**
- 全部 (✨)
- 肉菜 (🥩)
- 素菜 (🥬)
- 汤菜 (🍵)
- 炖菜 (🍲)
- 凉菜 (🧊)
- 沙拉 (🥗)

### 收藏 (favorites)

```javascript
{
  id: Number,           // 菜品ID
  name: String,
  price: Number,
  image: String,
  _openid: String       // 用户ID
}
```

### 订单 (orders)

```javascript
{
  orderNo: String,      // 订单号
  items: String,        // 商品摘要
  totalPrice: Number,   // 总价
  detailList: Array,    // 商品详情
  date: String,         // 日期
  status: String,       // 状态
  _openid: String       // 用户ID
}
```

## Admin 后台功能

### 分类管理
- 查看所有分类
- 添加新分类
- 编辑分类（名称、图标、排序、状态）
- 删除分类（分类下有商品时不可删除）
- 自动统计每个分类的商品数量
- 默认分类自动初始化

### 菜品列表
- 分页显示所有菜品
- 按名称搜索
- 按分类筛选
- 查看菜品图片

### 添加/编辑菜品
- 菜品名称
- 分类选择（从数据库动态加载）
- 价格设置
- 描述信息
- 图片URL
- 标签设置（招牌/新品）

### 删除菜品
- 确认删除对话框
- 从数据库彻底删除

## 数据同步机制

1. **Admin 操作 → 数据库**
   - 分类管理：写入/更新/删除 categories 集合
   - 菜品管理：写入/更新/删除 goods 集合

2. **小程序读取 ← 数据库**
   - 首页加载分类：从 categories 读取
   - 首页加载菜品：从 goods 读取
   - 收藏读取：从 favorites 读取
   - 订单读取：从 orders 读取

3. **本地缓存**
   - 小程序使用 `cachedGoods` 缓存
   - 数据库加载失败时自动使用缓存

## 注意事项

1. 确保云开发环境已开通
2. 确保数据库权限设置正确
3. Admin 后台使用匿名登录访问数据库
4. 小程序端需要配置 `cloud: true` 在 `app.json`

## 故障排除

### 数据加载失败
- 检查网络连接
- 检查数据库权限
- 查看是否有缓存数据

### Admin 无法登录
- 确保匿名登录已开启
- 检查云开发环境ID配置

### 同步延迟
- 数据库操作可能有短暂延迟
- 刷新页面即可看到最新数据
