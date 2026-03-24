Page({
  data: {
    userInfo: {
      nickName: '小猫美食家',
      avatarUrl: '/images/icons/usercenter-active.png'
    }
  },

  onLoad() {
    this.loadUserInfo()
  },

  loadUserInfo() {
    // 从缓存或数据库加载用户信息
  },

  goToOrders() {
    wx.navigateTo({ url: '/pages/orders/orders' })
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
