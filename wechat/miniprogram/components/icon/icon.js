// components/icon/icon.js
Component({
  properties: {
    name: {
      type: String,
      value: ''
    },
    size: {
      type: Number,
      value: 32
    },
    color: {
      type: String,
      value: '#FF6B9D'
    },
    className: {
      type: String,
      value: ''
    }
  },

  data: {
    iconSrc: ''
  },

  observers: {
    'name, color': function(name, color) {
      this.setIconSrc(name, color)
    }
  },

  methods: {
    setIconSrc(name, color) {
      // 使用本地图标映射
      const localIconMap = {
        // 首页图标
        'sparkle': '/images/icons/icon-sparkle.png',
        'chef-hat': '/images/icons/home-active.png',
        'rice-bowl': '/images/icons/icon-rice.png',
        'salad': '/images/icons/icon-salad.png',
        'cake': '/images/icons/icon-cake.png',
        'gift': '/images/icons/icon-gift.png',
        'search': '/images/icons/search.png',
        'dinner': '/images/icons/home-active.png',
        
        // 购物车图标
        'cart': '/images/icons/cart.png',
        'note': '/images/icons/note.png',
        'trash': '/images/icons/trash.png',
        'clipboard': '/images/icons/clipboard.png',
        
        // 个人中心图标
        'money': '/images/icons/money.png',
        'restaurant': '/images/icons/restaurant.png',
        'star': '/images/icons/star.png',
        'trophy': '/images/icons/trophy.png',
        'flower': '/images/icons/flower.png',
        'ribbon': '/images/icons/ribbon.png',
        'crown': '/images/icons/crown.png',
        'coupon': '/images/icons/coupon.png',
        'heart': '/images/icons/heart.png',
        'location': '/images/icons/location.png',
        'notification': '/images/icons/notification.png',
        'chat': '/images/icons/chat.png',
        'settings': '/images/icons/setting.svg',
        'order': '/images/icons/order.png',
        
        // 其他
        'checkmark': '/images/icons/checkmark.png',
        'edit-pen': '/images/icons/edit.png',
        'clover': '/images/icons/clover.png'
      }

      // 优先使用本地图标，如果没有则使用默认
      const iconSrc = localIconMap[name] || '/images/icons/home.png'
      
      this.setData({ iconSrc })
    }
  }
})