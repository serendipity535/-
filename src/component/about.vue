<template>
  <div class="my-profile-container">
    <div class="glass-card">
      <h2 class="section-title">我的</h2>

      <!-- 已登录状态 -->
      <div v-if="isAuthenticated" class="logged-in-content">
        <!-- 用户信息 -->
        <div class="user-info">
          <div class="user-avatar"></div>
          <div class="user-details">
            <p class="username">{{ currentUser.username }}</p>
            <p class="user-role">敦煌文化爱好者</p>
          </div>
        </div>

        <!-- 功能入口 -->
        <div class="function-buttons">
          <p @click="goMember" class="button-link">
            <button class="btn-member">会员中心</button>
          </p>

          <p @click="goMyCollection" class="button-link">
            <button class="btn-collection">我的收藏</button>
          </p>

          <button @click="handleLogout" class="btn-logout">退出登录</button>
        </div>
      </div>

      <!-- 未登录状态 -->
      <div v-else class="logged-out-content">
        <p class="login-prompt">请登录以查看个人中心</p>
        <div class="login-button-container">
          <p @click="goLogin" class="button-link">
            <button class="btn-login">立即登录</button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      isAuthenticated: false,
      currentUser: {
        username: '',
        email: ''
      },
      isLoading: false
    }
  },
  computed: {
    // 计算属性：用户显示名称
    displayName() {
      return this.currentUser.username || '未登录用户'
    },
    
    // 计算属性：用户角色标签
    userRole() {
      return this.isAuthenticated ? '敦煌文化爱好者' : '游客'
    }
  },
  methods: {
    /**
     * 跳转到我的收藏页面
     */
    goMyCollection() {
      try {
        this.$router.push('/MyCollection')
      } catch (error) {
        console.error('跳转到我的收藏失败:', error)
        this.showError('无法跳转到收藏页面')
      }
    },
    
    /**
     * 跳转到会员中心
     */
    goMember() {
      try {
        this.$router.push('/Member')
      } catch (error) {
        console.error('跳转到会员中心失败:', error)
        this.showError('无法跳转到会员中心')
      }
    },
    
    /**
     * 跳转到登录页面
     */
    goLogin() {
      try {
        console.log('尝试跳转到登录页面')
        this.$router.push('/Login').then(() => {
          console.log('成功跳转到登录页面')
        }).catch(error => {
          console.error('路由跳转失败:', error)
          // 如果路由跳转失败，尝试其他方式
          this.fallbackToLogin()
        })
      } catch (error) {
        console.error('跳转到登录页面失败:', error)
        this.fallbackToLogin()
      }
    },
    
    /**
     * 备用登录跳转方法
     */
    fallbackToLogin() {
      // 方法1：使用hash模式跳转
      if (window.location.hash) {
        window.location.hash = '#/Login'
        return
      }
      
      // 方法2：使用完整URL
      const baseUrl = window.location.origin
      const loginUrl = `${baseUrl}/#/Login`
      window.location.href = loginUrl
    },
    
    /**
     * 处理用户退出登录
     */
    async handleLogout() {
      if (!confirm('确定要退出登录吗？')) {
        return
      }
      
      this.isLoading = true
      
      try {
        // 1. 清除本地存储
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('memberInfo')
        
        // 2. 更新组件状态
        this.isAuthenticated = false
        this.currentUser = { username: '', email: '' }
        
        // 3. 显示成功消息
        this.showSuccess('已成功退出登录')
        
        // 4. 延迟跳转到登录页（让用户看到成功消息）
        setTimeout(() => {
          this.goLogin()
        }, 1500)
        
      } catch (error) {
        console.error('退出登录失败:', error)
        this.showError('退出登录失败，请重试')
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * 检查用户认证状态
     */
    checkAuthStatus() {
      try {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        
        if (token && userStr) {
          const user = JSON.parse(userStr)
          
          // 验证token是否有效（这里可以添加更复杂的验证逻辑）
          if (this.isValidToken(token)) {
            this.isAuthenticated = true
            this.currentUser = {
              username: user.username || '用户',
              email: user.email || ''
            }
            console.log('用户已认证:', this.currentUser.username)
          } else {
            // token无效，清除存储
            this.clearAuthData()
          }
        } else {
          this.isAuthenticated = false
        }
      } catch (error) {
        console.error('检查认证状态失败:', error)
        this.clearAuthData()
      }
    },
    
    /**
     * 验证token有效性（简单示例）
     */
    isValidToken(token) {
      // 这里可以添加实际的token验证逻辑
      // 例如检查过期时间、格式等
      return token && token.length > 10
    },
    
    /**
     * 清除认证数据
     */
    clearAuthData() {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      this.isAuthenticated = false
      this.currentUser = { username: '', email: '' }
    },
    
    /**
     * 显示成功消息
     */
    showSuccess(message) {
      // 这里可以集成Toast组件
      alert(`✅ ${message}`)
      // 或者使用Vue的全局消息组件
      // this.$message.success(message)
    },
    
    /**
     * 显示错误消息
     */
    showError(message) {
      alert(`❌ ${message}`)
      // this.$message.error(message)
    },
    
    /**
     * 刷新用户信息
     */
    async refreshUserInfo() {
      if (!this.isAuthenticated) return
      
      try {
        // 这里可以调用API获取最新用户信息
        // const response = await this.$api.user.getProfile()
        // this.currentUser = response.data
        
        console.log('用户信息已刷新')
      } catch (error) {
        console.error('刷新用户信息失败:', error)
      }
    }
  },
  
  watch: {
    // 监听认证状态变化
    isAuthenticated(newVal) {
      console.log('认证状态变化:', newVal ? '已登录' : '未登录')
      
      if (newVal) {
        // 登录后执行的操作
        document.title = `${this.displayName} - 个人中心`
      } else {
        document.title = '个人中心 - 石上佛韵'
      }
    }
  },
  
  mounted() {
    console.log('个人中心组件已加载')
    
    // 组件挂载时检查登录状态
    this.checkAuthStatus()
    
    // 设置页面标题
    document.title = this.isAuthenticated 
      ? `${this.displayName} - 个人中心` 
      : '个人中心 - 石上佛韵'
    
    // 添加页面加载完成事件
    window.addEventListener('storage', this.handleStorageChange)
  },
  
  beforeDestroy() {
    // 清理事件监听
    window.removeEventListener('storage', this.handleStorageChange)
  },
  
  created() {
    // 组件创建时初始化
    console.log('个人中心组件创建')
  }
}
</script>

<style scoped>
.my-profile-container {
  padding: 1rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-title {
  text-align: center;
  color: #D4AF37;
  margin-bottom: 24px;
  font-size: 1.5rem;
}

/* 已登录状态样式 */
.logged-in-content {
  display: flex;
  flex-direction: column;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  margin-bottom: 20px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #D4AF37, #F4E4BC);
  margin-right: 16px;
  border: 2px solid #D4AF37;
}

.user-details {
  flex: 1;
}

.username {
  margin: 0;
  font-weight: bold;
  color: #D4AF37;
  font-size: 1.1rem;
}

.user-role {
  margin: 4px 0 0;
  font-size: 0.9rem;
  opacity: 0.8;
  color: #fff;
}

.function-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.button-link {
  text-decoration: none;
  display: block;
}

button {
  width: 100%;
  padding: 12px 40px;
  border-radius: 24px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-member {
  background: var(--dunhuang-red, #C41E3A);
  color: white;
}

.btn-member:hover {
  background: #a01830;
  transform: translateY(-2px);
}

.btn-collection {
  background: #2E7D32;
  color: white;
}

.btn-collection:hover {
  background: #1b5e20;
  transform: translateY(-2px);
}

.btn-logout {
  background: #666;
  color: white;
}

.btn-logout:hover {
  background: #555;
  transform: translateY(-2px);
}

/* 未登录状态样式 */
.logged-out-content {
  text-align: center;
}

.login-prompt {
  opacity: 0.8;
  margin-bottom: 24px;
  color: #fff;
}

.login-button-container {
  text-align: center;
}

.btn-login {
  background: var(--dunhuang-gold, #D4AF37);
  color: var(--dunhuang-bg, #1a1a2e);
  width: auto;
  min-width: 200px;
}

.btn-login:hover {
  background: #b5952f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .glass-card {
    padding: 1.5rem;
  }
  
  button {
    padding: 10px 32px;
    font-size: 0.95rem;
  }
}
</style>