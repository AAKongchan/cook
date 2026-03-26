// 数据管理页面
Page({
  data: {
    loading: false,
    result: null
  },

  onLoad() {
    // 检查是否已初始化
    this.checkDataStatus()
  },

  // 检查数据状态
  async checkDataStatus() {
    try {
      const db = wx.cloud.database()
      const countRes = await db.collection('goods').count()
      this.setData({
        result: {
          success: true,
          message: `数据库已有 ${countRes.total} 个商品`
        }
      })
    } catch (err) {
      this.setData({
        result: {
          success: false,
          message: '数据库未初始化或权限不足'
        }
      })
    }
  },

  // 初始化商品数据
  async initGoods() {
    this.setData({ loading: true })
    try {
      const res = await wx.cloud.callFunction({
        name: 'initData',
        data: { type: 'goods' }
      })
      this.setData({
        result: res.result,
        loading: false
      })
    } catch (err) {
      this.setData({
        result: {
          success: false,
          message: err.message
        },
        loading: false
      })
    }
  },

  // 清空所有数据
  async clearAll() {
    const { confirm } = await wx.showModal({
      title: '确认清空',
      content: '这将清空所有商品、收藏和订单数据，确定吗？',
      confirmColor: '#FF6B9D'
    })
    
    if (!confirm) return
    
    this.setData({ loading: true })
    try {
      const res = await wx.cloud.callFunction({
        name: 'initData',
        data: { type: 'all' }
      })
      this.setData({
        result: res.result,
        loading: false
      })
    } catch (err) {
      this.setData({
        result: {
          success: false,
          message: err.message
        },
        loading: false
      })
    }
  },

  // 从数据库加载商品（替代本地数据）
  async loadGoodsFromDB() {
    this.setData({ loading: true })
    try {
      const db = wx.cloud.database()
      const { data } = await db.collection('goods').get()
      
      // 保存到本地存储
      wx.setStorageSync('allGoodsList', data)
      
      this.setData({
        result: {
          success: true,
          message: `成功从数据库加载 ${data.length} 个商品到本地`
        },
        loading: false
      })
    } catch (err) {
      this.setData({
        result: {
          success: false,
          message: err.message
        },
        loading: false
      })
    }
  }
})
