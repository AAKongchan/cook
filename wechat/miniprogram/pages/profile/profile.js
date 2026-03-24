Page({
  data: {
    userInfo: {
      nickName: '小猫美食家',
      avatarUrl: '/images/icons/usercenter-active.png'
    },
    showOrders: false,
    orderList: [
      {
        orderNo: 'ORD202603001',
        date: '2026-03-22',
        items: '奶油蘑菇意面、抹茶拿铁',
        totalPrice: 90,
        status: '已完成'
      },
      {
        orderNo: 'ORD202603002',
        date: '2026-03-20',
        items: '梦幻马卡龙塔、彩虹鲜蔬沙拉、舒芙蕾松饼',
        totalPrice: 162,
        status: '已完成'
      },
      {
        orderNo: 'ORD202603003',
        date: '2026-03-18',
        items: '精选寿司拼盘',
        totalPrice: 128,
        status: '已完成'
      }
    ]
  },

  onLoad() {
    this.loadUserInfo()
  },

  onShow() {
    // 更新自定义tabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 })
    }
  },

  loadUserInfo() {
    // 从缓存或数据库加载用户信息
  },

  toggleOrders() {
    this.setData({
      showOrders: !this.data.showOrders
    })
  },

  reorder(e) {
    const order = e.currentTarget.dataset.order
    wx.showToast({ title: `已重新下单`, icon: 'success' })
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
