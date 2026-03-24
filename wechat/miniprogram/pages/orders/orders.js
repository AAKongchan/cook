Page({
  data: {
    orders: [
      {
        orderNo: 'ORD202603001',
        date: '2026-03-22',
        items: '奶油蘑菇意面、抹茶拿铁',
        price: '90',
        status: 'completed',
        statusText: '已完成'
      },
      {
        orderNo: 'ORD202603002',
        date: '2026-03-20',
        items: '梦幻马卡龙塔、彩虹鲜蔬沙拉、舒芙蕾松饼',
        price: '162',
        status: 'completed',
        statusText: '已完成'
      },
      {
        orderNo: 'ORD202603003',
        date: '2026-03-18',
        items: '精选寿司拼盘',
        price: '128',
        status: 'completed',
        statusText: '已完成'
      }
    ]
  },

  onLoad() {
    this.loadOrders()
  },

  loadOrders() {
    // 从数据库加载订单
  },

  goBack() {
    wx.navigateBack()
  },

  reorder(e) {
    const order = e.currentTarget.dataset.order
    wx.showToast({
      title: '已添加到购物车',
      icon: 'success'
    })
  }
})