import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'House' }
      }
    ]
  },
  {
    path: '/menu',
    component: Layout,
    redirect: '/menu/list',
    meta: { title: '菜单管理', icon: 'Food' },
    children: [
      {
        path: 'list',
        name: 'MenuList',
        component: () => import('@/views/product/list.vue'),
        meta: { title: '菜品列表', icon: 'List' }
      },
      {
        path: 'category',
        name: 'MenuCategory',
        component: () => import('@/views/product/category.vue'),
        meta: { title: '分类管理', icon: 'Grid' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    meta: { title: '订单管理', icon: 'Document' },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/list.vue'),
        meta: { title: '订单列表', icon: 'List' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    meta: { title: '用户管理', icon: 'User' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/list.vue'),
        meta: { title: '用户列表', icon: 'List' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = (to.meta.title as string) || '精品厨房后台'
  
  // 检查登录状态
  if (to.path !== '/login') {
    try {
      const { checkLogin } = await import('@/utils/cloudbase')
      const loginState = await checkLogin()
      if (!loginState) {
        next('/login')
        return
      }
    } catch (err) {
      console.error('检查登录状态失败:', err)
      next('/login')
      return
    }
  }
  
  next()
})

export default router
