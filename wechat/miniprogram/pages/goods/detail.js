Page({
  data: {
    goods: {}
  },

  onLoad(options) {
    const { id } = options
    this.loadGoodsDetail(id)
  },

  loadGoodsDetail(id) {
    // 从数据库加载商品详情
    this.setData({
      goods: {
        id,
        name: '梦幻马卡龙塔',
        description: '6种口味法式马卡龙，精美礼盒装',
        price: 68,
        image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400'
      }
    })
  },

  addToCart() {
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  },

  buyNow() {
    wx.navigateTo({
      url: '/pages/cart/cart'
    })
  }
})
