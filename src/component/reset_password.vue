<template>
  <div class="reset-password-container">
    <div class="form-container">
      <div class="form-title">重置密码</div>

      <!-- 消息提示 -->
      <div v-if="message" class="alert" :class="messageType">
        {{ message }}
      </div>

      <!-- 验证码验证状态 -->
      <div v-if="!codeVerified" class="code-verification">
        <div class="verification-info">
          <div class="info-icon">📱</div>
          <p class="info-text">验证码已发送到您的手机</p>
          <p class="phone-display">{{ maskedPhone }}</p>
        </div>
        
        <form @submit.prevent="verifyCode">
          <div class="input-group">
            <label for="code">验证码</label>
            <input 
              type="text" 
              id="code" 
              v-model="formData.code"
              placeholder="请输入6位验证码" 
              required
              maxlength="6"
            >
            <span v-if="codeError" class="error-text">{{ codeError }}</span>
          </div>
          
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="isVerifying"
          >
            {{ isVerifying ? '验证中...' : '下一步' }}
          </button>
        </form>
        
        <div class="resend-section">
          <span v-if="countdown > 0" class="countdown-text">
            {{ countdown }}秒后可重新获取
          </span>
          <button 
            v-else
            @click="resendCode"
            class="btn-resend"
          >
            重新获取验证码
          </button>
        </div>
      </div>

      <!-- 重置密码表单 -->
      <form v-else @submit.prevent="handleResetPassword">
        <div class="input-group">
          <label for="password">新密码</label>
          <div class="password-input-wrapper">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="formData.password"
              placeholder="6-20位字符" 
              required
              minlength="6"
              maxlength="20"
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
          <!-- 密码强度指示器 -->
          <div v-if="formData.password" class="password-strength">
            <div class="strength-bar">
              <div 
                class="strength-fill" 
                :class="passwordStrengthClass"
                :style="{ width: passwordStrengthPercent + '%' }"
              ></div>
            </div>
            <span class="strength-text">{{ passwordStrengthText }}</span>
          </div>
          <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
        </div>
        
        <div class="input-group">
          <label for="confirmPassword">确认密码</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="formData.confirmPassword"
            placeholder="请再次输入新密码" 
            required
            @input="validateConfirmPassword"
          >
          <span v-if="confirmPasswordError" class="error-text">{{ confirmPasswordError }}</span>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="isSubmitting || !isValidForm"
        >
          {{ isSubmitting ? '重置中...' : '确认重置' }}
        </button>
      </form>

      <!-- 返回和重新获取 -->
      <div class="action-links">
        <router-link to="/Login" class="btn btn-secondary">
          返回登录
        </router-link>
        
        <button @click="goToForgotPassword" class="btn-resend-link">
          重新获取验证码
        </button>
      </div>
    </div>

    <!-- 成功弹窗 -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="success-modal" @click.stop>
        <div class="success-icon">✓</div>
        <h3 class="success-title">密码重置成功</h3>
        <p class="success-message">您的密码已成功重置，请使用新密码登录</p>
        <button @click="goToLogin" class="btn btn-primary">
          立即登录
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResetPassword',
  data() {
    return {
      codeVerified: false,
      isVerifying: false,
      isSubmitting: false,
      showPassword: false,
      countdown: 0,
      message: '',
      messageType: 'success',
      showSuccessModal: false,
      phone: '',
      codeError: '',
      passwordError: '',
      confirmPasswordError: '',
      formData: {
        code: '',
        password: '',
        confirmPassword: ''
      },
      // 存储生成的验证码
      generatedCode: '',
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
    maskedPhone() {
      if (!this.phone) return ''
      return this.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    },
    
    isValidPassword() {
      return this.formData.password.length >= 6 && this.formData.password.length <= 20
    },
    
    passwordStrength() {
      const password = this.formData.password
      if (!password) return 0
      
      let strength = 0
      if (password.length >= 8) strength++
      if (password.length >= 12) strength++
      if (/[A-Z]/.test(password)) strength++
      if (/[a-z]/.test(password)) strength++
      if (/[0-9]/.test(password)) strength++
      if (/[^A-Za-z0-9]/.test(password)) strength++
      
      return Math.min(strength, 3)
    },
    
    passwordStrengthClass() {
      const classes = ['weak', 'medium', 'strong']
      return classes[this.passwordStrength - 1] || 'weak'
    },
    
    passwordStrengthText() {
      const texts = ['弱', '中', '强']
      return texts[this.passwordStrength - 1] || '弱'
    },
    
    passwordStrengthPercent() {
      const percents = [33, 66, 100]
      return percents[this.passwordStrength - 1] || 33
    },
    
    isValidForm() {
      return this.isValidPassword && 
             this.formData.password === this.formData.confirmPassword
    }
  },
  methods: {
    // 从JSON数据中查找用户
    findUserByPhone(phone) {
      return this.usersData.users.find(user => user.phone === phone)
    },
    
    // 更新用户密码
    updateUserPassword(phone, newPassword) {
      const user = this.findUserByPhone(phone)
      if (user) {
        user.password = newPassword
        return true
      }
      return false
    },
    
    async verifyCode() {
      if (!this.formData.code || this.formData.code.length !== 6) {
        this.codeError = '请输入6位验证码'
        return
      }
      
      this.isVerifying = true
      this.codeError = ''
      
      try {
        // 构建验证数据包
        const verifyData = {
          phone: this.phone,
          code: this.formData.code,
          timestamp: new Date().toISOString()
        }
        
        // 在控制台显示验证数据包
        console.log('========== 验证码验证数据包 ==========')
        console.log('手机号:', verifyData.phone)
        console.log('输入的验证码:', verifyData.code)
        console.log('生成的验证码:', this.generatedCode)
        console.log('完整数据包:', JSON.stringify(verifyData, null, 2))
        console.log('================================')
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 验证验证码
        if (this.formData.code === this.generatedCode) {
          this.codeVerified = true
          this.showMessage('验证码验证成功', 'success')
          
          console.log('========== 验证码验证成功 ==========')
          console.log('================================')
        } else {
          this.codeError = '验证码错误，请重试'
          
          console.log('========== 验证码验证失败 ==========')
          console.log('错误信息:', '验证码错误')
          console.log('================================')
        }
        
      } catch (error) {
        console.error('验证码验证失败:', error)
        this.codeError = '验证失败，请重试'
      } finally {
        this.isVerifying = false
      }
    },
    
    async resendCode() {
      if (this.countdown > 0) return
      
      try {
        // 生成6位随机验证码
        this.generatedCode = Math.floor(100000 + Math.random() * 900000).toString()
        
        // 构建发送验证码数据包
        const codeData = {
          phone: this.phone,
          code: this.generatedCode,
          type: 'reset',
          timestamp: new Date().toISOString()
        }
        
        // 在控制台显示验证码
        console.log('========== 验证码已发送 ==========')
        console.log('手机号:', codeData.phone)
        console.log('验证码:', codeData.code)
        console.log('类型:', codeData.type)
        console.log('完整数据包:', JSON.stringify(codeData, null, 2))
        console.log('================================')
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showMessage('验证码已重新发送', 'success')
        
        // 开始倒计时
        this.countdown = 60
        const timer = setInterval(() => {
          this.countdown--
          if (this.countdown <= 0) {
            clearInterval(timer)
          }
        }, 1000)
        
      } catch (error) {
        console.error('发送验证码失败:', error)
        this.showMessage('发送验证码失败，请重试', 'error')
      }
    },
    
    validatePassword() {
      if (this.formData.password) {
        if (this.formData.password.length < 6) {
          this.passwordError = '密码长度不能少于6位'
        } else if (this.formData.password.length > 20) {
          this.passwordError = '密码长度不能超过20位'
        } else {
          this.passwordError = ''
        }
        
        if (this.formData.confirmPassword) {
          this.validateConfirmPassword()
        }
      }
    },
    
    validateConfirmPassword() {
      if (this.formData.confirmPassword) {
        if (this.formData.password !== this.formData.confirmPassword) {
          this.confirmPasswordError = '两次输入的密码不一致'
        } else {
          this.confirmPasswordError = ''
        }
      }
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    async handleResetPassword() {
      if (!this.isValidForm) {
        this.validatePassword()
        this.validateConfirmPassword()
        return
      }
      
      this.isSubmitting = true
      this.message = ''
      
      try {
        // 构建重置密码数据包
        const resetData = {
          phone: this.phone,
          code: this.formData.code,
          newPassword: this.formData.password,
          timestamp: new Date().toISOString()
        }
        
        // 在控制台显示重置密码数据包
        console.log('========== 重置密码数据包 ==========')
        console.log('手机号:', resetData.phone)
        console.log('验证码:', resetData.code)
        console.log('新密码:', resetData.newPassword)
        console.log('完整数据包:', JSON.stringify(resetData, null, 2))
        console.log('================================')
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 更新用户密码
        const updated = this.updateUserPassword(this.phone, this.formData.password)
        
        if (updated) {
          console.log('========== 密码重置成功 ==========')
          console.log('手机号:', this.phone)
          console.log('新密码:', this.formData.password)
          console.log('================================')
          
          // 保存登录状态
          const user = this.findUserByPhone(this.phone)
          if (user) {
            localStorage.setItem('loginState', JSON.stringify({
              isLoggedIn: true,
              userInfo: {
                phone: user.phone,
                nickname: user.nickname,
                loginTime: new Date().toISOString()
              }
            }))
            localStorage.setItem('token', 'mock-token-' + Date.now())
          }
          
          this.showMessage('密码重置成功，正在跳转...', 'success')
          
          // 跳转到主页
          setTimeout(() => {
            this.$router.push('/')
          }, 1500)
        } else {
          this.showMessage('用户不存在', 'error')
        }
        
      } catch (error) {
        console.error('重置密码失败:', error)
        this.showMessage('重置密码失败，请重试', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    goToForgotPassword() {
      this.$router.push('/ResetPassword')
    },
    
    goToLogin() {
      this.$router.push('/Login')
    },
    
    closeSuccessModal() {
      this.showSuccessModal = false
    },
    
    showMessage(msg, type = 'success') {
      this.message = msg
      this.messageType = type
      
      setTimeout(() => {
        this.message = ''
      }, 5000)
    },
    
    loadResetInfo() {
      const phone = this.$route.query.phone || localStorage.getItem('reset_phone')
      const code = this.$route.query.code
      
      if (phone) {
        this.phone = phone
        localStorage.setItem('reset_phone', phone)
      }
      
      if (code) {
        this.formData.code = code
        this.verifyCode()
      }
    }
  },
  
  mounted() {
    document.title = '重置密码 - 石上佛韵'
    this.loadResetInfo()
    
    // 生成验证码并开始倒计时
    this.generatedCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    console.log('========== 验证码已生成 ==========')
    console.log('手机号:', this.phone)
    console.log('验证码:', this.generatedCode)
    console.log('================================')
    
    this.countdown = 60
    const timer = setInterval(() => {
      this.countdown--
      if (this.countdown <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  }
}
</script>

<style scoped>
.reset-password-container {
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
  padding: 2.5rem 2rem;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.3);
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
  text-align: center;
  font-size: 1.8rem;
  color: #D4AF37;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

/* 消息提示 */
.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  animation: slideIn 0.3s ease;
}

.alert-success {
  background: rgba(46, 125, 50, 0.3);
  color: #a5d6a7;
  border: 1px solid rgba(76, 175, 80, 0.5);
}

.alert-error {
  background: rgba(158, 43, 43, 0.3);
  color: #ef9a9a;
  border: 1px solid rgba(244, 67, 54, 0.5);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 验证码验证 */
.code-verification {
  text-align: center;
}

.verification-info {
  background: rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.info-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.info-text {
  color: rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0;
  font-size: 1rem;
}

.phone-display {
  color: #D4AF37;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.resend-section {
  margin-top: 1.5rem;
}

.countdown-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.btn-resend {
  background: none;
  border: none;
  color: #D4AF37;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.btn-resend:hover {
  color: #ffd700;
}

/* 表单样式 */
.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
}

.input-group input {
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #D4AF37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
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
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.3s ease;
}

.toggle-password:hover {
  color: #D4AF37;
}

/* 密码强度指示器 */
.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.3rem;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 2px;
}

.strength-fill.weak {
  background: #f44336;
}

.strength-fill.medium {
  background: #ff9800;
}

.strength-fill.strong {
  background: #4CAF50;
}

.strength-text {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

/* 错误提示 */
.error-text {
  display: block;
  margin-top: 0.5rem;
  color: #f44336;
  font-size: 0.85rem;
}

/* 按钮样式 */
.btn {
  width: 100%;
  padding: 14px;
  border-radius: 24px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.3s ease;
  font-size: 1rem;
  border: none;
}

.btn-primary {
  background: #D4AF37;
  color: #3E2723;
}

.btn-primary:hover:not(:disabled) {
  background: #b8960c;
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
  color: #D4AF37;
  border: 1px solid #D4AF37;
  display: inline-block;
  width: auto;
  padding: 8px 24px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(212, 175, 55, 0.1);
}

/* 操作链接 */
.action-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
  text-align: center;
}

.btn-resend-link {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.btn-resend-link:hover {
  color: #D4AF37;
}

/* 成功弹窗 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.success-modal {
  background: rgba(20, 30, 40, 0.95);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.5rem;
  font-weight: bold;
}

.success-title {
  font-size: 1.5rem;
  color: #D4AF37;
  margin: 0 0 1rem;
}

.success-message {
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 2rem;
  line-height: 1.6;
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
    padding: 10px;
    font-size: 0.95rem;
  }
  
  .btn {
    padding: 12px;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .reset-password-container {
    padding: 0.5rem;
  }
  
  .form-container {
    padding: 1.5rem 1rem;
    border-radius: 16px;
  }
  
  .form-title {
    font-size: 1.3rem;
  }
  
  .verification-info {
    padding: 1rem;
  }
  
  .info-icon {
    font-size: 2.5rem;
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