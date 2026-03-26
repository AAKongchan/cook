Page({
  data: {
    cartList: [],
    selectedCount: 0,
    totalPrice: 0,
    showSuccessModal: false,
    showNoteModal: false,
    noteText: '',
    selectedItem: {},
    quickTags: ['不加香菜', '少辣', '不加葱', '多加奶酪', '打包带走', '少盐']
  },

  onLoad() {
    // 清空购物车数据（解决数据不一致问题）
    wx.setStorageSync('cartList', [])
    this.loadCartData()
  },

  onShow() {
    // 更新自定义tabBar选中状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 })
    }
    // 延迟加载确保数据同步
    setTimeout(() => {
      this.loadCartData()
    }, 100)
  },

  loadCartData() {
    const cartList = wx.getStorageSync('cartList') || []
    console.log('购物车数据:', cartList)
    this.setData({ 
      cartList: cartList || []
    }, () => {
      this.calculateTotal()
    })
    
    // 更新自定义tabBar角标
    const totalCount = cartList.reduce((sum, item) => sum + item.quantity, 0)
    console.log('购物车数量:', totalCount)
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ cartCount: totalCount })
    }
  },

  increase(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.cartList.map(item => {
      if (item.id === id) {
        item.quantity++
      }
      return item
    })
    this.setData({ cartList: list })
    wx.setStorageSync('cartList', list)
    this.calculateTotal()
    this.updateTabBarBadge()
  },

  decrease(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.cartList.find(item => item.id === id)
    
    if (item && item.quantity === 1) {
      // 数量为1时，从购物车移除
      this.deleteItem(e)
    } else {
      // 数量大于1时，减1
      const list = this.data.cartList.map(item => {
        if (item.id === id) {
          item.quantity--
        }
        return item
      })
      this.setData({ cartList: list })
      wx.setStorageSync('cartList', list)
      this.calculateTotal()
      this.updateTabBarBadge()
    }
  },

  deleteItem(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.cartList.filter(item => item.id !== id)
    this.setData({ cartList: list })
    wx.setStorageSync('cartList', list)
    this.calculateTotal()
    this.updateTabBarBadge()
    wx.showToast({ title: '已删除', icon: 'success' })
  },

  updateTabBarBadge() {
    const totalCount = this.data.cartList.reduce((sum, item) => sum + item.quantity, 0)
    // 更新自定义tabBar角标
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ cartCount: totalCount })
    }
  },

  calculateTotal() {
    let count = 0
    let price = 0
    this.data.cartList.forEach(item => {
      count += item.quantity
      price += item.price * item.quantity
    })
    this.setData({
      selectedCount: count,
      totalPrice: price
    })
  },

  submitOrder() {
    const { cartList, totalPrice } = this.data
    
    // 生成订单数据
    const orderItems = cartList.map(item => `${item.name} x ${item.quantity}`).join('、')
    const newOrder = {
      orderNo: 'ORD' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      items: orderItems,
      totalPrice: totalPrice,
      status: '已完成',
      detailList: cartList
    }
    
    // 保存到历史订单
    let orderHistory = wx.getStorageSync('orderHistory') || []
    orderHistory.unshift(newOrder)
    wx.setStorageSync('orderHistory', orderHistory)
    
    // 清空购物车
    this.setData({ cartList: [], selectedCount: 0, totalPrice: 0 })
    wx.setStorageSync('cartList', [])
    // 更新自定义tabBar角标
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ cartCount: 0 })
    }
    
    // 显示成功弹窗
    this.setData({ showSuccessModal: true })
  },

  closeModal() {
    this.setData({ showSuccessModal: false })
  },

  preventClose() {
    return
  },

  goHome() {
    this.setData({ showSuccessModal: false })
    wx.switchTab({ url: '/pages/home/home' })
  },

  goToMenu() {
    wx.switchTab({ url: '/pages/home/home' })
  },

  showNoteModal(e) {
    const item = e.currentTarget.dataset.item
    this.setData({ 
      showNoteModal: true,
      noteText: item.note || '',
      selectedItem: item
    })
  },

  closeNoteModal() {
    this.setData({ showNoteModal: false })
  },

  onNoteInput(e) {
    this.setData({ noteText: e.detail.value })
  },

  selectTag(e) {
    const tag = e.currentTarget.dataset.tag
    const currentText = this.data.noteText
    const newText = currentText ? currentText + '，' + tag : tag
    this.setData({ noteText: newText })
  },

  saveNote() {
    const { selectedItem, noteText, cartList } = this.data
    const updatedList = cartList.map(item => {
      if (item.id === selectedItem.id) {
        item.note = noteText
      }
      return item
    })
    this.setData({ cartList: updatedList })
    wx.setStorageSync('cartList', updatedList)
    wx.showToast({ title: '备注已保存', icon: 'success' })
    this.setData({ showNoteModal: false })
  },

  clearCart() {
    wx.showModal({
      title: '提示',
      content: '确定清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({ cartList: [], selectedCount: 0, totalPrice: 0 })
          wx.setStorageSync('cartList', [])
          // 更新自定义tabBar角标
          if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({ cartCount: 0 })
          }
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }
    })
  }
})
