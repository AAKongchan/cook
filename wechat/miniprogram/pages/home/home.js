Page({
  data: {
    currentTab: 0,
    searchKeyword: '',
    allGoodsList: [],
    goodsList: []
  },

  onLoad() {
    this.loadGoods()
  },

  onLoad() {
    this.loadGoods()
  },

  onShow() {
    // 恢复购物车角标
    const cartList = wx.getStorageSync('cartList') || []
    const totalCount = cartList.reduce((sum, item) => sum + item.quantity, 0)
    if (totalCount > 0) {
      wx.setTabBarBadge({
        index: 1,
        text: String(totalCount)
      })
    }
  },

  switchTab(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    this.setData({ currentTab: index })
    this.filterGoods(index, this.data.searchKeyword)
  },

  filterGoods(index) {
    const categories = ['全部', '主食', '轻食', '甜点', '饮品', '小吃', '素食', '海鲜', '烧烤']
    const category = categories[index]
    
    if (category === '全部') {
      this.setData({ goodsList: this.data.goodsList })
    } else {
      // 根据分类筛选
    }
  },

  addToCart(e) {
    const item = e.currentTarget.dataset.item
    
    // 获取当前购物车数据
    let cartList = wx.getStorageSync('cartList') || []
    
    // 检查商品是否已在购物车中
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
    
    // 保存到本地存储
    wx.setStorageSync('cartList', cartList)
    
    // 更新TabBar角标
    const totalCount = cartList.reduce((sum, item) => sum + item.quantity, 0)
    if (totalCount > 0) {
      wx.setTabBarBadge({
        index: 1,
        text: String(totalCount)
      })
    }
    
    wx.showToast({ title: '已加入购物车', icon: 'success' })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/goods/detail?id=${id}` })
  },

  loadGoods() {
    // 30个菜品数据，每个分类至少4个
    const allGoods = [
      // 主食 (4个)
      { id: 1, name: '奶油蘑菇意面', description: '新鲜松茸配奶油白酱', price: '68', image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400', category: '主食', isHot: true },
      { id: 2, name: '经典牛肉炒饭', description: '香嫩牛肉粒配蛋炒饭', price: '48', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?w=400', category: '主食' },
      { id: 3, name: '日式豚骨拉面', description: '浓郁骨汤配叉烧', price: '58', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400', category: '主食', isNew: true },
      { id: 4, name: '招牌红烧肉饭', description: '肥瘦相间入口即化', price: '52', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', category: '主食' },
      
      // 轻食 (4个)
      { id: 5, name: '精选寿司拼盘', description: '8种新鲜时令鱼生', price: '128', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', category: '轻食', isNew: true },
      { id: 6, name: '凯撒沙拉', description: '新鲜罗马生菜配帕尔马干酪', price: '42', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400', category: '轻食' },
      { id: 7, name: '牛油果三明治', description: '全麦面包配新鲜牛油果', price: '38', image: 'https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?w=400', category: '轻食', isHot: true },
      { id: 8, name: '鲜虾沙拉碗', description: 'Q弹虾仁配时蔬', price: '56', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: '轻食' },
      
      // 甜点 (4个)
      { id: 9, name: '梦幻马卡龙塔', description: '6种口味法式马卡龙', price: '68', image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400', category: '甜点', isHot: true },
      { id: 10, name: '舒芙蕾松饼', description: '日式厚松饼配草莓', price: '52', image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400', category: '甜点', isNew: true },
      { id: 11, name: '提拉米苏', description: '经典意式咖啡蛋糕', price: '45', image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400', category: '甜点' },
      { id: 12, name: '抹茶千层', description: '20层手工班戟皮', price: '58', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400', category: '甜点' },
      
      // 饮品 (4个)
      { id: 13, name: '鲜榨西瓜汁', description: '现榨无添加', price: '22', image: 'https://images.unsplash.com/photo-158973821 intended?w=400', category: '饮品' },
      { id: 14, name: '珍珠奶茶', description: '手工熬制黑糖珍珠', price: '18', image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400', category: '饮品', isHot: true },
      { id: 15, name: '杨枝甘露', description: '芒果西柚椰奶经典', price: '28', image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400', category: '饮品', isNew: true },
      { id: 16, name: '草莓奶昔', description: '新鲜草莓现打', price: '26', image: 'https://images.unsplash.com/photo-1553530979-7ee52a2670c4?w=400', category: '饮品' },
      
      // 小吃 (4个)
      { id: 17, name: '香脆薯条', description: '金黄酥脆配番茄酱', price: '22', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', category: '小吃' },
      { id: 18, name: '奥尔良烤翅', description: '秘制腌料烤制', price: '32', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', category: '小吃', isHot: true },
      { id: 19, name: '芝士玉米杯', description: '拉丝芝士配甜玉米', price: '28', image: 'https://images.unsplash.com/photo-1470119693884-47d3a1d1f180?w=400', category: '小吃' },
      { id: 20, name: '章鱼小丸子', description: '外酥里嫩木鱼花', price: '25', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400', category: '小吃', isNew: true },
      
      // 素食 (4个)
      { id: 21, name: '素春卷', description: '新鲜蔬菜脆皮卷', price: '18', image: 'https://images.unsplash.com/photo-1540713434306-58505cf1b6fc?w=400', category: '素食' },
      { id: 22, name: '麻婆豆腐', description: '嫩滑豆腐麻辣鲜香', price: '32', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', category: '素食', isHot: true },
      { id: 23, name: '清炒时蔬', description: '当季新鲜蔬菜', price: '28', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400', category: '素食' },
      { id: 24, name: '素烧鹅', description: '豆制品仿荤经典', price: '35', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: '素食', isNew: true },
      
      // 海鲜 (4个)
      { id: 25, name: '清蒸鲈鱼', description: '鲜嫩原汁原味', price: '88', image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400', category: '海鲜', isHot: true },
      { id: 26, name: '蒜蓉粉丝虾', description: '粉丝吸满虾鲜味', price: '68', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', category: '海鲜' },
      { id: 27, name: '香辣蟹', description: '秘制香辣酱汁', price: '128', image: 'https://images.unsplash.com/photo-1559742811-822873691df8?w=400', category: '海鲜', isNew: true },
      { id: 28, name: '白灼虾', description: '鲜甜Q弹配蘸料', price: '78', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400', category: '海鲜' },
      
      // 烧烤 (4个)
      { id: 29, name: '羊肉串', description: '新疆风味烤串', price: '8', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400', category: '烧烤', isHot: true },
      { id: 30, name: '烤鸡翅', description: '皮脆肉嫩多汁', price: '12', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400', category: '烧烤' },
      { id: 31, name: '烤茄子', description: '蒜香浓郁软糯', price: '15', image: 'https://images.unsplash.com/photo-1594040291048-15a5db47f5e9?w=400', category: '烧烤', isNew: true },
      { id: 32, name: '烤玉米', description: '甜糯玉米炭火香', price: '10', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400', category: '烧烤' }
    ]
    
    this.setData({ 
      allGoodsList: allGoods,
      goodsList: allGoods 
    })
  },

  onSearchInput(e) {
    const keyword = e.detail.value
    this.setData({ searchKeyword: keyword })
    this.filterGoods(this.data.currentTab, keyword)
  },

  filterGoods(index, keyword = '') {
    const categories = ['全部', '主食', '轻食', '甜点', '饮品', '小吃', '素食', '海鲜', '烧烤']
    const category = categories[index]
    
    let filteredList = this.data.allGoodsList
    
    // 按分类筛选
    if (category !== '全部') {
      filteredList = filteredList.filter(item => item.category === category)
    }
    
    // 按搜索关键词筛选
    if (keyword) {
      filteredList = filteredList.filter(item => 
        item.name.includes(keyword) || item.description.includes(keyword)
      )
    }
    
    this.setData({ goodsList: filteredList })
  }
})
