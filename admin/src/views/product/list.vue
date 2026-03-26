<template>
  <div class="product-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加菜品
          </el-button>
        </div>
      </template>

      <!-- 搜索区域 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="菜品名称">
          <el-input v-model="searchForm.name" placeholder="请输入菜品名称" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
            <el-option label="全部" value="" />
            <el-option 
              v-for="cat in categoryOptions" 
              :key="cat.id" 
              :label="cat.name" 
              :value="cat.name" 
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="syncToMiniprogram">
            <el-icon><Refresh /></el-icon>
            同步到小程序
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="菜品名称" width="150" />
        <el-table-column prop="image" label="图片" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              :preview-src-list="[row.image]"
              style="width: 60px; height: 60px; border-radius: 8px"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="description" label="描述" min-width="150" show-overflow-tooltip />
        <el-table-column prop="price" label="价格" width="100">
          <template #default="{ row }">
            <span style="color: #FF6B9D; font-weight: 600;">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.isHot" type="danger" size="small" style="margin-right: 5px;">招牌</el-tag>
            <el-tag v-if="row.isNew" type="success" size="small">新品</el-tag>
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
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </el-card>

    <!-- 添加/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑菜品' : '添加菜品'"
      width="600px"
      destroy-on-close
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="菜品名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜品名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
            <el-option 
              v-for="cat in categoryOptions" 
              :key="cat.id" 
              :label="cat.name" 
              :value="cat.name" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :precision="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" rows="3" placeholder="请输入菜品描述" />
        </el-form-item>
        <el-form-item label="图片URL" prop="image">
          <el-input v-model="form.image" placeholder="请输入图片URL" />
        </el-form-item>
        <el-form-item label="标签">
          <el-checkbox v-model="form.isHot">招牌</el-checkbox>
          <el-checkbox v-model="form.isNew" style="margin-left: 20px;">新品</el-checkbox>
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
import { db, anonymousLogin } from '@/utils/cloudbase'

const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<any>(null)
const categoryOptions = ref<any[]>([])

const searchForm = reactive({
  name: '',
  category: ''
})

const form = reactive({
  id: 0,
  name: '',
  category: '肉菜',
  price: 0,
  description: '',
  image: '',
  isHot: false,
  isNew: false
})

const rules = {
  name: [{ required: true, message: '请输入菜品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  image: [{ required: true, message: '请输入图片URL', trigger: 'blur' }]
}

// 获取菜品列表
const loadData = async () => {
  loading.value = true
  try {
    let query = db.collection('goods')
    
    // 搜索条件
    if (searchForm.name) {
      query = query.where({
        name: db.RegExp({
          regexp: searchForm.name,
          options: 'i'
        })
      })
    }
    
    if (searchForm.category) {
      query = query.where({ category: searchForm.category })
    }
    
    // 获取总数
    const countRes = await query.count()
    total.value = countRes.total
    
    // 分页查询
    const res = await query
      .skip((currentPage.value - 1) * pageSize.value)
      .limit(pageSize.value)
      .get()
    
    tableData.value = res.data
  } catch (error: any) {
    ElMessage.error('加载数据失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 添加菜品
const handleAdd = () => {
  isEdit.value = false
  form.id = 0
  form.name = ''
  // 使用第一个可用分类作为默认值
  form.category = categoryOptions.value.length > 0 ? categoryOptions.value[0].name : ''
  form.price = 0
  form.description = ''
  form.image = ''
  form.isHot = false
  form.isNew = false
  dialogVisible.value = true
}

// 编辑菜品
const handleEdit = (row: any) => {
  isEdit.value = true
  form.id = row.id
  form.name = row.name
  form.category = row.category
  form.price = row.price
  form.description = row.description
  form.image = row.image
  form.isHot = row.isHot || false
  form.isNew = row.isNew || false
  dialogVisible.value = true
}

// 删除菜品
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该菜品吗？', '提示', { type: 'warning' })
    
    // 获取文档ID
    const res = await db.collection('goods').where({ id: row.id }).get()
    if (res.data.length > 0) {
      await db.collection('goods').doc(res.data[0]._id).remove()
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
      // 更新菜品
      const res = await db.collection('goods').where({ id: form.id }).get()
      if (res.data.length > 0) {
        await db.collection('goods').doc(res.data[0]._id).update({
          name: form.name,
          category: form.category,
          price: form.price,
          description: form.description,
          image: form.image,
          isHot: form.isHot,
          isNew: form.isNew
        })
        ElMessage.success('更新成功')
      }
    } else {
      // 添加菜品 - 获取最大ID
      const maxRes = await db.collection('goods').orderBy('id', 'desc').limit(1).get()
      const newId = maxRes.data.length > 0 ? maxRes.data[0].id + 1 : 1
      
      await db.collection('goods').add({
        id: newId,
        name: form.name,
        category: form.category,
        price: form.price,
        description: form.description,
        image: form.image,
        isHot: form.isHot,
        isNew: form.isNew
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

// 同步到小程序（更新小程序本地存储）
const syncToMiniprogram = async () => {
  try {
    loading.value = true
    const res = await db.collection('goods').limit(1000).get()
    
    // 这里可以调用云函数通知小程序更新
    ElMessage.success(`已同步 ${res.data.length} 个菜品到数据库，小程序将自动读取最新数据`)
  } catch (error: any) {
    ElMessage.error('同步失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.category = ''
  handleSearch()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadData()
}

// 加载分类选项
const loadCategories = async () => {
  try {
    const res = await db.collection('categories')
      .where({ status: 1 })
      .orderBy('sort', 'asc')
      .get()
    // 过滤掉"全部"
    categoryOptions.value = res.data.filter((cat: any) => cat.name !== '全部')
  } catch (error: any) {
    console.error('加载分类失败:', error)
  }
}

onMounted(async () => {
  // 匿名登录
  await anonymousLogin()
  // 加载分类
  await loadCategories()
  loadData()
})
</script>

<style scoped>
.product-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
