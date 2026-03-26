Page({
  data: {
    userInfo: {
      nickName: '小猫美食家',
      avatarUrl: '/images/icons/usercenter-active.png'
    },
    showOrders: false,
    orderList: [],
    showFavorites: false,
    favoriteList: [],
    favoriteCount: 0,
    stats: {
      totalSpend: 0,
      orderCount: 0,
      points: 0
    }
  },

  onLoad() {
    this.loadUserInfo()
    this.loadOrderHistory()
  },

  onShow() {
    // 更新自定义tabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
    // 每次显示页面时刷新订单历史
    this.loadOrderHistory()
    // 同步购物车角标
    this.syncCartBadge()
    // 加载收藏列表
    this.loadFavorites()
  },

  // 加载收藏数据
  loadFavorites() {
    const favorites = wx.getStorageSync('favorites') || []
    this.setData({
      favoriteList: favorites,
      favoriteCount: favorites.length
    })
  },

  // 切换收藏列表显示
  toggleFavorites() {
    this.setData({
      showFavorites: !this.data.showFavorites
    })
  },

  // 取消收藏
  cancelFavorite(e) {
    const id = e.currentTarget.dataset.id
    let favorites = wx.getStorageSync('favorites') || []
    favorites = favorites.filter(item => item.id !== id)
    wx.setStorageSync('favorites', favorites)
    this.loadFavorites()
    wx.showToast({ title: '已取消收藏', icon: 'none' })
    
    // 同步更新首页收藏状态
    const pages = getCurrentPages()
    const homePage = pages.find(p => p.route === 'pages/home/home')
    if (homePage && homePage.loadFavorites) {
      homePage.loadFavorites()
    }
  },

  // 从收藏添加到购物车
  addToCartFromFavorite(e) {
    const item = e.currentTarget.dataset.item
    let cartList = wx.getStorageSync('cartList') || []
    
    const existingItem = cartList.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cartList.push({
        id: item.id,
        name: item.name,
        price: parseInt(item.price),
        quantity: 1,
        image: item.image,
        nameEn: item.nameEn || item.name,
        note: ''
      })
    }
    
    wx.setStorageSync('cartList', cartList)
    
    // 更新TabBar角标
    const totalCount = cartList.reduce((sum, item) => sum + item.quantity, 0)
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ cartCount: totalCount })
    }
    
    wx.showToast({ title: '已加入购物车', icon: 'success' })
  },

  syncCartBadge() {
    const cartList = wx.getStorageSync('cartList') || []
    const totalCount = cartList.reduce((sum, item) => sum + item.quantity, 0)
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ cartCount: totalCount })
    }
  },

  loadUserInfo() {
    // 从缓存或数据库加载用户信息
  },

  loadOrderHistory() {
    const orderHistory = wx.getStorageSync('orderHistory') || []
    
    // 计算统计数据
    const totalSpend = orderHistory.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    const orderCount = orderHistory.length
    const points = Math.floor(totalSpend / 10) // 10元 = 1积分
    
    this.setData({
      orderList: orderHistory,
      stats: {
        totalSpend: this.formatNumber(totalSpend),
        orderCount: orderCount,
        points: this.formatNumber(points)
      }
    })
  },

  // 格式化数字，添加千分位
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  toggleOrders() {
    this.setData({
      showOrders: !this.data.showOrders
    })
  },

  reorder(e) {
    const order = e.currentTarget.dataset.order
    
    // 获取当前购物车
    let cartList = wx.getStorageSync('cartList') || []
    
    // 如果有订单详情，将商品添加到购物车
    if (order.detailList && order.detailList.length > 0) {
      order.detailList.forEach(orderItem => {
        const existingItem = cartList.find(cartItem => cartItem.id === orderItem.id)
        if (existingItem) {
          existingItem.quantity += orderItem.quantity
        } else {
          cartList.push({
            id: orderItem.id,
            name: orderItem.name,
            price: orderItem.price,
            quantity: orderItem.quantity,
            image: orderItem.image,
            nameEn: orderItem.nameEn || orderItem.name,
            note: orderItem.note || ''
          })
        }
      })
      
      // 保存到购物车
      wx.setStorageSync('cartList', cartList)
      
      // 更新TabBar角标
      const totalCount = cartList.reduce((sum, item) => sum + item.quantity, 0)
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({ cartCount: totalCount })
      }
      
      wx.showToast({ title: '已添加到购物车', icon: 'success' })
      
      // 跳转到购物车页面
      setTimeout(() => {
        wx.switchTab({ 
          url: '/pages/cart/cart',
          success: () => {
            // 确保购物车页面刷新数据
            const pages = getCurrentPages()
            const cartPage = pages.find(p => p.route === 'pages/cart/cart')
            if (cartPage && cartPage.loadCartData) {
              cartPage.loadCartData()
            }
          }
        })
      }, 500)
    } else {
      wx.showToast({ title: '该订单无法重新下单', icon: 'none' })
    }
  },

  goToAddress() {
    wx.showToast({ title: '地址管理功能开发中', icon: 'none' })
  }
})
