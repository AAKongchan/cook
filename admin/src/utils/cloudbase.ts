import cloudbase from '@cloudbase/js-sdk'

// 检查 SDK 版本
console.log('CloudBase SDK 版本:', cloudbase.VERSION)

// 初始化云开发
const app = cloudbase.init({
  env: 'cloud1-8g1vupme57ee1bac', // 小程序环境ID
  // 添加版本控制，避免缓存问题
  appVersion: '2.0.0'
})

// 获取数据库实例
export const db = app.database()

// 获取云函数实例
export const callFunction = (name: string, data?: any) => {
  return app.callFunction({
    name,
    data
  })
}

// 初始化云开发（兼容旧代码）
export const initCloudBase = async () => {
  // 云开发已经初始化，这里只做占位
  console.log('CloudBase initialized')
}

// 检查登录状态
export const checkLogin = async () => {
  const auth = app.auth({ persistence: 'local' })
  const loginState = await auth.getLoginState()
  return loginState
}

// 匿名登录
export const anonymousLogin = async () => {
  const auth = app.auth({ persistence: 'local' })
  
  // 检查当前登录状态
  const loginState = await auth.getLoginState()
  if (loginState) {
    console.log('已登录，跳过匿名登录')
    return
  }
  
  // 执行匿名登录
  try {
    await auth.anonymousAuthProvider().signIn()
    console.log('匿名登录成功')
  } catch (err: any) {
    console.error('匿名登录失败:', err)
    // 如果匿名登录失败，尝试使用自定义登录（空ticket）
    if (err.message && err.message.includes('ACCESS_TOKEN_DISABLED')) {
      console.log('匿名登录被禁用，尝试无认证访问...')
      // 返回但不抛出错误，让数据库操作尝试使用默认权限
      return
    }
    throw err
  }
}

export default app
