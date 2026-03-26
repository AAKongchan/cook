<template>
  <div class="category-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>分类管理</span>
          <div>
            <el-button type="warning" @click="initDefaultCategories" style="margin-right: 10px;">
              <el-icon><Refresh /></el-icon>
              初始化分类
            </el-button>
            <el-button type="primary" @click="handleAdd">
              <el-icon><Plus /></el-icon>
              添加分类
            </el-button>
          </div>
        </div>
      </template>

      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" width="150" />
        <el-table-column prop="icon" label="图标" width="100">
          <template #default="{ row }">
            <span class="category-icon">{{ row.icon || '📦' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="goodsCount" label="商品数量" width="100">
          <template #default="{ row }">
            <el-tag type="info">{{ row.goodsCount || 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="pagination"
        background
        layout="total, prev, pager, next"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
      />
    </el-card>

    <!-- 添加/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分类' : '添加分类'"
      width="500px"
      destroy-on-close
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标emoji，如：🥩" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="999" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { db, anonymousLogin, callFunction } from '@/utils/cloudbase'

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<any>(null)

const form = reactive({
  id: 0,
  name: '',
  icon: '',
  sort: 0,
  status: 1,
  goodsCount: 0
})

const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }]
}

// 获取分类列表
const loadData = async () => {
  loading.value = true
  try {
    console.log('开始加载分类数据...')
    
    // 获取总数
    let countRes
    try {
      countRes = await db.collection('categories').count()
    } catch (e: any) {
      console.error('获取总数失败:', e)
      // 集合可能不存在
      if (e.code === 'DATABASE_COLLECTION_NOT_EXIST' || 
          e.message?.includes('collection not exists') ||
          e.message?.includes('Db or Table not exist')) {
        console.log('集合不存在，需要初始化')
        ElMessage.warning('数据库集合不存在，请先点击「初始化分类」按钮创建')
        tableData.value = []
        total.value = 0
        return
      }
      throw e
    }
    
    console.log('分类总数:', countRes)
    console.log('countRes类型:', typeof countRes)
    total.value = (countRes && countRes.total) || 0
    
    if (total.value === 0) {
      console.log('没有分类数据')
      tableData.value = []
      return
    }
    
    // 分页查询，按排序字段升序
    const res = await db.collection('categories')
      .orderBy('sort', 'asc')
      .skip((currentPage.value - 1) * pageSize.value)
      .limit(pageSize.value)
      .get()
    
    console.log('查询结果:', res)
    
    // 获取每个分类的商品数量
    const categories = res?.data || []
    
    if (categories.length > 0) {
      for (let category of categories) {
        try {
          const goodsRes = await db.collection('goods').where({ category: category.name }).count()
          category.goodsCount = goodsRes?.total || 0
        } catch (e) {
          category.goodsCount = 0
        }
      }
    }
    
    tableData.value = categories
    console.log('表格数据已更新:', tableData.value)
  } catch (error: any) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败：' + error.message)
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 添加分类
const handleAdd = () => {
  isEdit.value = false
  form.id = 0
  form.name = ''
  form.icon = ''
  form.sort = tableData.value.length + 1
  form.status = 1
  form.goodsCount = 0
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row: any) => {
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.icon = row.icon || ''
  form.sort = row.sort
  form.status = row.status !== undefined ? row.status : 1
  dialogVisible.value = true
}

// 删除分类
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该分类吗？', '提示', { type: 'warning' })
    
    // 检查该分类下是否有商品
    const goodsRes = await db.collection('goods').where({ category: row.name }).count()
    if (goodsRes.total > 0) {
      ElMessage.warning(`该分类下有 ${goodsRes.total} 个商品，无法删除`)
      return
    }
    
    // 获取文档ID并删除
    const res = await db.collection('categories').where({ id: row.id }).get()
    if (res.data.length > 0) {
      await db.collection('categories').doc(res.data[0]._id).remove()
      ElMessage.success('删除成功')
      loadData()
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + error.message)
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  
  submitLoading.value = true
  try {
    if (isEdit.value) {
      // 更新分类
      const res = await db.collection('categories').where({ id: form.id }).get()
      if (res.data.length > 0) {
        await db.collection('categories').doc(res.data[0]._id).update({
          name: form.name,
          icon: form.icon,
          sort: form.sort,
          status: form.status
        })
        ElMessage.success('更新成功')
      }
    } else {
      // 添加分类 - 获取最大ID
      const maxRes = await db.collection('categories').orderBy('id', 'desc').limit(1).get()
      const newId = maxRes.data.length > 0 ? maxRes.data[0].id + 1 : 1
      
      await db.collection('categories').add({
        id: newId,
        name: form.name,
        icon: form.icon,
        sort: form.sort,
        status: form.status,
        goodsCount: 0
      })
      ElMessage.success('添加成功')
    }
    
    dialogVisible.value = false
    loadData()
  } catch (error: any) {
    ElMessage.error('操作失败：' + error.message)
  } finally {
    submitLoading.value = false
  }
}

// 初始化默认分类
const initDefaultCategories = async () => {
  try {
    loading.value = true
    console.log('开始检查分类数据...')
    
    // 检查当前分类数量
    let countRes
    try {
      countRes = await db.collection('categories').count()
    } catch (e: any) {
      console.log('获取分类数量失败:', e)
      // 集合不存在
      if (e.code === 'DATABASE_COLLECTION_NOT_EXIST' || 
          e.message?.includes('Db or Table not exist')) {
        ElMessage.error('数据库集合不存在，请先创建集合')
        // 显示创建指引
        showCreateCollectionGuide()
        return
      }
      countRes = { total: 0 }
    }
    
    console.log('当前分类数量:', countRes)
    const totalCount = (countRes && countRes.total) || 0
    
    if (totalCount === 0) {
      console.log('分类为空，开始初始化...')
      const defaultCategories = [
        { id: 1, name: '全部', icon: '✨', sort: 0, status: 1 },
        { id: 2, name: '肉菜', icon: '🥩', sort: 1, status: 1 },
        { id: 3, name: '素菜', icon: '🥬', sort: 2, status: 1 },
        { id: 4, name: '汤菜', icon: '🍵', sort: 3, status: 1 },
        { id: 5, name: '炖菜', icon: '🍲', sort: 4, status: 1 },
        { id: 6, name: '凉菜', icon: '🧊', sort: 5, status: 1 },
        { id: 7, name: '沙拉', icon: '🥗', sort: 6, status: 1 }
      ]
      
      for (const category of defaultCategories) {
        try {
          console.log('添加分类:', category.name)
          await db.collection('categories').add(category)
        } catch (addErr: any) {
          console.error('添加分类失败:', category.name, addErr)
          if (addErr.code === 'DATABASE_COLLECTION_NOT_EXIST') {
            showCreateCollectionGuide()
            return
          }
        }
      }
      
      ElMessage.success('已初始化默认分类数据')
      await loadData()
    } else {
      console.log('分类数据已存在，跳过初始化')
      ElMessage.info(`已有 ${totalCount} 个分类`)
    }
  } catch (error: any) {
    console.error('初始化分类失败:', error)
    ElMessage.error('初始化分类失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 显示创建集合指引
const showCreateCollectionGuide = () => {
  ElMessageBox.alert(
    `<div style="text-align: left;">
      <p><strong>请在云开发控制台创建集合：</strong></p>
      <ol style="margin: 10px 0; padding-left: 20px;">
        <li>打开 <a href="https://tcb.cloud.tencent.com/dev?envId=cloud1-8g1vupme57ee1bac#/db/doc" target="_blank">云开发控制台 - 数据库</a></li>
        <li>点击「创建集合」按钮</li>
        <li>输入集合名称：<code>categories</code></li>
        <li>点击「确定」创建</li>
        <li>（可选）创建 <code>goods</code> 集合用于存储菜品</li>
      </ol>
      <p>创建完成后，返回此页面点击「初始化分类」按钮</p>
    </div>`,
    '需要创建数据库集合',
    {
      confirmButtonText: '我知道了',
      dangerouslyUseHTMLString: true,
      type: 'warning'
    }
  )
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadData()
}

onMounted(async () => {
  try {
    // 匿名登录
    console.log('开始匿名登录...')
    await anonymousLogin()
    console.log('匿名登录成功')
    
    // 先尝试加载数据，如果失败可能是集合不存在
    try {
      await loadData()
    } catch (loadErr: any) {
      console.log('首次加载失败，尝试初始化:', loadErr)
      // 可能是集合不存在，尝试初始化
      await initDefaultCategories()
      // 再次加载
      await loadData()
    }
  } catch (error: any) {
    console.error('页面加载失败:', error)
    if (error.message && error.message.includes('ACCESS_TOKEN_DISABLED')) {
      ElMessage.error('匿名登录未开启，请前往云开发控制台开启：身份认证 → 登录管理 → 启用匿名登录')
    } else {
      ElMessage.error('页面加载失败：' + error.message)
    }
  }
})
</script>

<style scoped>
.category-manage {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.category-icon {
  font-size: 24px;
}
</style>
