# 图标组件使用说明

## 简介
本项目使用 Icons8 图标库，通过自定义组件实现动态颜色调整。图标风格可爱、现代，非常适合精品厨房小程序的粉色主题设计。

## 使用方法

### 1. 在页面 JSON 中引入组件
```json
{
  "usingComponents": {
    "icon": "/components/icon/icon"
  }
}
```

### 2. 在 WXML 中使用
```xml
<icon name="sparkle" size="32" color="#FF6B9D"/>
```

## 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| name | String | '' | 图标名称 |
| size | Number | 32 | 图标大小（rpx） |
| color | String | '#FF6B9D' | 图标颜色（十六进制） |
| className | String | '' | 自定义样式类名 |

## 可用图标列表

### 首页相关
- `sparkle` - 闪烁星星
- `rice-bowl` - 米饭碗（主食）
- `salad` - 沙拉（轻食）
- `cake` - 蛋糕（甜点）
- `gift` - 礼物
- `search` - 搜索

### 购物车相关
- `cart` - 购物车
- `note` - 笔记/备注
- `trash` - 垃圾桶
- `clipboard` - 剪贴板
- `dinner` - 餐具

### 个人中心相关
- `money` - 金钱
- `restaurant` - 餐厅
- `star` - 星星
- `trophy` - 奖杯
- `flower` - 樱花
- `ribbon` - 丝带
- `crown` - 皇冠
- `coupon` - 优惠券
- `heart` - 心形
- `location` - 位置
- `notification` - 通知
- `chat` - 聊天
- `settings` - 设置
- `order` - 订单列表
- `edit-pen` - 编辑笔
- `clover` - 三叶草

### 其他
- `checkmark` - 对勾

## 使用示例

### 基础用法
```xml
<icon name="star" size="32" color="#FFD700"/>
```

### 动态颜色
```xml
<icon name="star" size="28" color="{{isActive ? '#FFFFFF' : '#FF6B9D'}}"/>
```

### 添加样式类
```xml
<icon name="star" size="32" color="#FFD700" className="my-icon"/>
```

## 设计理念

1. **一致性**：所有图标来自 Icons8 同一图标库，保证风格统一
2. **可定制**：支持动态调整颜色，适应不同主题
3. **轻量级**：使用 PNG 格式，文件体积小（< 5KB）
4. **高清晰**：使用 100px 尺寸源图标，保证显示清晰

## 图标来源

所有图标来自 [Icons8](https://icons8.com/) 图标库：
- URL 格式：`https://img.icons8.com/ios/100/{COLOR}/{ICON-NAME}.png`
- 支持自定义颜色：将颜色十六进制值（去掉#）作为 URL 参数

## 注意事项

1. 图标颜色使用十六进制格式（如：`#FF6B9D`）
2. 图标大小单位为 rpx，会自动适配不同屏幕
3. 如需添加新图标，在 `components/icon/icon.js` 的 `iconMap` 中添加映射