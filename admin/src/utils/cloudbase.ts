import cloudbase from '@cloudbase/js-sdk'

// CloudBase 环境ID - 从小程序端获取
const ENV_ID = 'cloud1-8g1vupme57ee1bac'

let app: any = null
let auth: any = null
let db: any = null

export const initCloudBase = async () => {
  try {
    app = cloudbase.init({
      env: ENV_ID
    })
    
    auth = app.auth()
    db = app.database()
    
    console.log('CloudBase 初始化成功')
    return app
  } catch (error) {
    console.error('CloudBase 初始化失败:', error)
    throw error
  }
}

export const getApp = () => app
export const getAuth = () => auth
export const getDb = () => db

// 调用云函数
export const callFunction = async (name: string, data: any = {}) => {
  if (!app) {
    throw new Error('CloudBase 未初始化')
  }
  
  try {
    const result = await app.callFunction({
      name,
      data
    })
    return result.result
  } catch (error) {
    console.error(`调用云函数 ${name} 失败:`, error)
    throw error
  }
}

// 数据库操作封装
export const db = {
  collection: (name: string) => {
    if (!getDb()) {
      throw new Error('CloudBase 未初始化')
    }
    return getDb().collection(name)
  }
}
