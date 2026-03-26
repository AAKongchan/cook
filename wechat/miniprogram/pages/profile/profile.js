Page({
  data: {
    userInfo: {
      nickName: '小猫美食家',
      avatarUrl: '/images/icons/usercenter-active.png'
    },
    showOrders: false,
    orderList: []
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
    this.setData({ orderList: orderHistory })
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

  goToCoupons() {
    wx.showToast({ title: '优惠券功能开发中', icon: 'none' })
  },

  goToFavorites() {
    wx.showToast({ title: '收藏功能开发中', icon: 'none' })
  },

  goToAddress() {
    wx.showToast({ title: '地址管理功能开发中', icon: 'none' })
  }
})
