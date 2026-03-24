// 自定义 tabBar 组件
Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: "/pages/home/home",
        text: "菜单",
        icon: "/images/icons/icon-home.svg",
        iconActive: "/images/icons/icon-home.svg"
      },
      {
        pagePath: "/pages/cart/cart",
        text: "购物车",
        icon: "/images/icons/icon-cart.svg",
        iconActive: "/images/icons/icon-cart.svg"
      },
      {
        pagePath: "/pages/profile/profile",
        text: "我的",
        icon: "/images/icons/icon-cat.svg",
        iconActive: "/images/icons/icon-cat.svg"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({ url });
      this.setData({
        selected: data.index
      });
    }
  }
});
