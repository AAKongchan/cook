// 初始化分类数据
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    // 检查是否已有分类数据
    const countRes = await db.collection('categories').count()
    
    if (countRes.total > 0) {
      return {
        code: 0,
        message: '分类数据已存在，无需初始化',
        data: { total: countRes.total }
      }
    }
    
    // 小程序分类数据（与小程序完全一致）
    const defaultCategories = [
      { id: 1, name: '全部', icon: '✨', sort: 0, status: 1 },
      { id: 2, name: '肉菜', icon: '🥩', sort: 1, status: 1 },
      { id: 3, name: '素菜', icon: '🥬', sort: 2, status: 1 },
      { id: 4, name: '汤菜', icon: '🍵', sort: 3, status: 1 },
      { id: 5, name: '炖菜', icon: '🍲', sort: 4, status: 1 },
      { id: 6, name: '凉菜', icon: '🧊', sort: 5, status: 1 },
      { id: 7, name: '沙拉', icon: '🥗', sort: 6, status: 1 }
    ]
    
    // 批量添加分类
    const tasks = defaultCategories.map(category => {
      return db.collection('categories').add({
        data: category
      })
    })
    
    await Promise.all(tasks)
    
    return {
      code: 0,
      message: '分类数据初始化成功',
      data: { categories: defaultCategories }
    }
  } catch (err) {
    console.error('初始化分类失败:', err)
    return {
      code: -1,
      message: '初始化分类失败: ' + err.message,
      data: null
    }
  }
}
