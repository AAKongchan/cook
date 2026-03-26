<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="login-header">
          <h2>精品厨房后台管理</h2>
          <p>请使用云开发匿名登录</p>
        </div>
      </template>
      
      <div class="login-content">
        <el-alert
          v-if="showError"
          :title="errorMessage"
          type="error"
          :closable="false"
          show-icon
          style="margin-bottom: 20px;"
        />
        
        <el-steps :active="activeStep" finish-status="success" direction="vertical">
          <el-step title="开启匿名登录">
            <template #description>
              <div class="step-desc">
                <p>1. 打开 <a href="https://tcb.cloud.tencent.com/dev" target="_blank">云开发控制台</a></p>
                <p>2. 进入「身份认证」→「登录管理」</p>
                <p>3. 启用「匿名登录」</p>
                <el-image 
                  src="https://docs.cloudbase.net/assets/img/anonymous-login.7e5c8c7e.png" 
                  style="width: 100%; max-width: 400px; margin-top: 10px;"
                  :preview-src-list="['https://docs.cloudbase.net/assets/img/anonymous-login.7e5c8c7e.png']"
                />
              </div>
            </template>
          </el-step>
          
          <el-step title="配置数据库权限">
            <template #description>
              <div class="step-desc">
                <p>1. 进入「数据库」</p>
                <p>2. 创建集合：categories、goods</p>
                <p>3. 设置权限为「所有用户可读，仅创建者可写」</p>
              </div>
            </template>
          </el-step>
          
          <el-step title="登录系统">
            <template #description>
              <div class="step-desc">
                <el-button 
                  type="primary" 
                  size="large" 
                  @click="handleLogin"
                  :loading="loading"
                  style="margin-top: 10px;"
                >
                  立即登录
                </el-button>
              </div>
            </template>
          </el-step>
        </el-steps>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { anonymousLogin } from '@/utils/cloudbase'

const router = useRouter()
const loading = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const activeStep = ref(2)

const handleLogin = async () => {
  loading.value = true
  showError.value = false
  
  try {
    await anonymousLogin()
    ElMessage.success('登录成功')
    router.push('/dashboard')
  } catch (error: any) {
    console.error('登录失败:', error)
    showError.value = true
    
    if (error.message && error.message.includes('ACCESS_TOKEN_DISABLED')) {
      errorMessage.value = '匿名登录未开启，请按照上方步骤开启匿名登录功能'
      activeStep.value = 0
    } else {
      errorMessage.value = '登录失败：' + error.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 600px;
}

.login-header {
  text-align: center;
}

.login-header h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.login-header p {
  margin: 0;
  color: #666;
}

.login-content {
  padding: 20px 0;
}

.step-desc {
  padding: 10px 0;
}

.step-desc p {
  margin: 5px 0;
  color: #666;
}

.step-desc a {
  color: #409eff;
  text-decoration: none;
}

.step-desc a:hover {
  text-decoration: underline;
}
</style>
