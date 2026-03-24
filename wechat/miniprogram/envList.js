// 小程序全局配置
const config = {
  // CloudBase 环境 ID
  env: 'cloud1-8g1vupme57ee1bac',
  
  // 云函数名称
  functions: {
    // 用户相关
    login: 'login',
    getUserInfo: 'getUserInfo',
    
    // 商品相关
    getProductList: 'getProductList',
    getProductDetail: 'getProductDetail',
    getCategoryList: 'getCategoryList',
    
    // 订单相关
    createOrder: 'createOrder',
    getOrderList: 'getOrderList',
    getOrderDetail: 'getOrderDetail',
    payOrder: 'payOrder'
  },
  
  // 数据库集合名称
  collections: {
    users: 'users',
    products: 'products',
    categories: 'categories',
    orders: 'orders',
    carts: 'carts'
  }
}

module.exports = config
