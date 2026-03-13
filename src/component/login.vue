<template>
  <div class="login-container">
    <div class="form-container">
      <div class="form-title">石上佛韵</div>

      <!-- 错误消息 -->
      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label for="username">手机号</label>
          <input 
            type="tel" 
            id="username" 
            v-model="formData.username"
            placeholder="请输入手机号" 
            required
            maxlength="11"
            @input="validatePhone"
          >
          <span v-if="phoneError" class="error-text">{{ phoneError }}</span>
        </div>
        
        <div class="input-group">
          <label for="password">密码</label>
          <div class="password-input-wrapper">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="formData.password"
              placeholder="请输入密码" 
              required
              @input="validatePassword"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="togglePassword"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="isSubmitting || !isValidForm"
        >
          {{ isSubmitting ? '登录中...' : '登录' }}
        </button>
      </form>

      <!-- 记住我 & 忘记密码 -->
      <div class="form-options">
        <label class="remember-me">
          <input type="checkbox" v-model="rememberMe">
          <span>记住我</span>
        </label>
        <router-link to="/ResetPassword" class="forgot-password">
          忘记密码？
        </router-link>
      </div>

      <!-- 注册链接 -->
      <div class="register-link">
        <router-link to="/" class="btn btn-secondary">
          没有账号？注册
        </router-link>
      </div>

      <!-- 第三方登录 -->
      <div class="other-login">
        <div class="divider">
          <span>其他登录方式</span>
        </div>
        <div class="social-icons">
          <a 
            v-for="(social, index) in socialLogins" 
            :key="index"
            :href="social.url"
            :title="social.name"
            class="social-icon"
            :style="{ background: social.color }"
            @click.prevent="handleSocialLogin(social)"
          >
            <span>{{ social.initial }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      isSubmitting: false,
      showPassword: false,
      rememberMe: false,
      errorMessage: '',
      phoneError: '',
      passwordError: '',
      formData: {
        username: '',
        password: ''
      },
      socialLogins: [
        {
          name: 'QQ',
          url: 'https://graph.qq.com/oauth2.0/authorize',
          color: '#1DA1F2',
          initial: 'Q'
        },
        {
          name: '微博',
          url: 'https://api.weibo.com/oauth2.0/authorize',
          color: '#E62129',
          initial: 'W'
        },
        {
          name: '微信',
          url: 'javascript:void(0)',
          color: '#2DCB56',
          initial: 'W'
        }
      ],
      // JSON数据存储的用户信息
      usersData: {
        users: [
          {
            phone: '13800138000',
            password: '123456',
            nickname: '测试用户',
            createTime: '2024-01-01 00:00:00'
          }
        ]
      }
    }
  },
  computed: {
    isValidPhone() {
      return /^1[3-9]\d{9}$/.test(this.formData.username)
    },
    isValidPassword() {
      return this.formData.password.length >= 6
    },
    isValidForm() {
      return this.isValidPhone && this.isValidPassword
    }
  },
  methods: {
    validatePhone() {
      if (this.formData.username && !this.isValidPhone) {
        this.phoneError = '请输入正确的手机号'
      } else {
        this.phoneError = ''
      }
    },
    
    validatePassword() {
      if (this.formData.password && !this.isValidPassword) {
        this.passwordError = '密码长度不能少于6位'
      } else {
        this.passwordError = ''
      }
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    // 从JSON数据中查找用户
    findUserByPhone(phone) {
      return this.usersData.users.find(user => user.phone === phone)
    },
    
    // 验证用户密码
    validateUserPassword(user, password) {
      return user.password === password
    },
    
    // 保存登录状态到localStorage
    saveLoginState(user) {
      const loginState = {
        isLoggedIn: true,
        userInfo: {
          phone: user.phone,
          nickname: user.nickname,
          loginTime: new Date().toISOString()
        }
      }
      localStorage.setItem('loginState', JSON.stringify(loginState))
      localStorage.setItem('token', 'mock-token-' + Date.now())
      console.log('登录状态已保存:', loginState)
    },
    
    async handleLogin() {
      if (!this.isValidForm) {
        this.validatePhone()
        this.validatePassword()
        return
      }
      
      this.isSubmitting = true
      this.errorMessage = ''
      
      try {
        // 构建登录数据包
        const loginData = {
          username: this.formData.username,
          password: this.formData.password,
          remember: this.rememberMe,
          timestamp: new Date().toISOString(),
          deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform
          }
        }
        
        // 在控制台显示登录数据包
        console.log('========== 登录数据包 ==========')
        console.log('手机号:', loginData.username)
        console.log('密码:', loginData.password)
        console.log('记住我:', loginData.remember)
        console.log('完整数据包:', JSON.stringify(loginData, null, 2))
        console.log('================================')
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 从JSON数据中查找用户
        const user = this.findUserByPhone(this.formData.username)
        
        if (!user) {
          this.errorMessage = '用户不存在，请先注册'
          
          // 在控制台显示登录失败
          console.log('========== 登录失败 ==========')
          console.log('错误信息:', '用户不存在，请先注册')
          console.log('输入的手机号:', this.formData.username)
          console.log('存储的用户列表:', this.usersData.users)
          console.log('================================')
          return
        }
        
        // 验证密码
        if (!this.validateUserPassword(user, this.formData.password)) {
          this.errorMessage = '密码错误，请重新输入'
          
          // 在控制台显示登录失败
          console.log('========== 登录失败 ==========')
          console.log('错误信息:', '密码错误，请重新输入')
          console.log('输入的密码:', this.formData.password)
          console.log('正确的密码:', user.password)
          console.log('================================')
          return
        }
        
        // 登录成功
        console.log('========== 登录成功 ==========')
        console.log('手机号:', this.formData.username)
        console.log('密码:', this.formData.password)
        console.log('用户信息:', user)
        console.log('================================')
        
        // 保存登录状态
        this.saveLoginState(user)
        
        if (this.rememberMe) {
          localStorage.setItem('rememberedUsername', this.formData.username)
        }
        
        this.showSuccessMessage('登录成功')
        
        // 跳转到首页或之前访问的页面
        const redirect = this.$route.query.redirect || '/Home'
        this.$router.push(redirect)
        
      } catch (error) {
        console.error('登录失败:', error)
        this.errorMessage = '登录失败，请稍后重试'
      } finally {
        this.isSubmitting = false
      }
    },
    
    handleSocialLogin(social) {
      console.log('第三方登录:', social.name)
      
      if (social.name === '微信') {
        // 微信登录需要扫码
        this.showWeChatQRCode()
      } else {
        // 其他第三方登录
        window.location.href = social.url
      }
    },
    
    showWeChatQRCode() {
      // 显示微信扫码登录
      alert('微信扫码登录功能开发中...')
    },
    
    showSuccessMessage(message) {
      const toast = document.createElement('div')
      toast.className = 'toast toast-success'
      toast.textContent = message
      document.body.appendChild(toast)
      
      setTimeout(() => {
        toast.classList.add('show')
      }, 100)
      
      setTimeout(() => {
        toast.classList.remove('show')
        setTimeout(() => toast.remove(), 300)
      }, 3000)
    },
    
    loadRememberedUsername() {
      const remembered = localStorage.getItem('rememberedUsername')
      if (remembered) {
        this.formData.username = remembered
        this.rememberMe = true
      }
    },
    
    checkLoginStatus() {
      const token = localStorage.getItem('token')
      if (token) {
        // 已登录，跳转到首页
        this.$router.push('/Home')
      }
    }
  },
  
  mounted() {
    document.title = '登录 - 石上佛韵'
    this.loadRememberedUsername()
    this.checkLoginStatus()
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.form-container {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
}

/* 错误消息 */
.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  animation: shake 0.5s ease;
}

.alert-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

/* 表单样式 */
.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 1rem;
}

.input-group input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fff;
  color: black;
}

.input-group input:focus {
  outline: none;
  border-color: #D4AF37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.input-group input::placeholder {
  color: #999;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input-wrapper input {
  padding-right: 50px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #999;
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #D4AF37;
}

.error-text {
  display: block;
  margin-top: 0.5rem;
  color: #f44336;
  font-size: 0.85rem;
}

/* 按钮样式 */
.btn {
  display: inline-block;
  width: 100%;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, #D4AF37 0%, #b8960c 100%);
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: transparent;
  color: #666;
  border: 1px solid #e0e0e0;
}

.btn-secondary:hover {
  background: #f5f5f5;
  color: #333;
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #666;
}

.remember-me input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.forgot-password {
  color: #D4AF37;
  text-decoration: none;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #b8960c;
  text-decoration: underline;
}

/* 注册链接 */
.register-link {
  text-align: center;
  margin-top: 1.5rem;
}

/* 第三方登录 */
.other-login {
  margin-top: 2rem;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #999;
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.divider span {
  padding: 0 1rem;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.social-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.social-icon:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Toast提示 */
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-20px);
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 10000;
  opacity: 0;
  transition: all 0.3s ease;
}

.toast-success {
  background: #4CAF50;
}

.toast-error {
  background: #f44336;
}

.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-container {
    padding: 2rem 1.5rem;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .input-group input {
    padding: 10px 14px;
    font-size: 0.95rem;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 0.5rem;
  }
  
  .form-container {
    padding: 1.5rem 1rem;
    border-radius: 12px;
  }
  
  .form-title {
    font-size: 1.3rem;
  }
}

/* 加载动画 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn:disabled::after {
  content: '';
  display: inline-block;
  width: 14px;
  height: 14px;
  margin-left: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
</style>