<template>
  <div class="register-container">
    <div class="form-container">
      <div class="form-title">注册</div>

      <!-- 消息提示 -->
      <div v-if="message" class="alert" :class="messageType">
        {{ message }}
      </div>

      <!-- 注册表单 -->
      <form @submit.prevent="handleRegister">
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
            placeholder="请再次输入密码" 
            required
            @input="validateConfirmPassword"
          >
          <span v-if="confirmPasswordError" class="error-text">{{ confirmPasswordError }}</span>
        </div>

        <!-- 验证码 -->
        <div class="input-group verification-group">
          <label for="code">验证码</label>
          <div class="verification-input">
            <input 
              type="text" 
              id="code" 
              v-model="formData.code"
              placeholder="请输入验证码" 
              required
              maxlength="6"
            >
            <button 
              type="button" 
              class="btn-send-code"
              :disabled="isSendingCode || countdown > 0"
              @click="sendVerificationCode"
            >
              {{ countdown > 0 ? `${countdown}秒后重试` : '获取验证码' }}
            </button>
          </div>
          <span v-if="codeError" class="error-text">{{ codeError }}</span>
        </div>

        <!-- 用户协议 -->
        <div class="agreement-group">
          <label class="agreement-label">
            <input 
              type="checkbox" 
              v-model="formData.agreed"
              required
            >
            <span>我已阅读并同意</span>
            <a href="/terms" class="agreement-link">《用户协议》</a>
            <span>和</span>
            <a href="/privacy" class="agreement-link">《隐私政策》</a>
          </label>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="isSubmitting || !isValidForm"
        >
          {{ isSubmitting ? '注册中...' : '注册' }}
        </button>
      </form>

      <!-- 登录链接 -->
      <div class="login-link">
        <p @click="goLogin" class="btn btn-secondary">
          已有账号？登录
        </p>
      </div>

      <!-- 第三方注册 -->
      <div class="other-register">
        <div class="divider">
          <span>其他注册方式</span>
        </div>
        <div class="social-icons">
          <a 
            v-for="(social, index) in socialLogins" 
            :key="index"
            :href="social.url"
            :title="social.name"
            class="social-icon"
            :style="{ background: social.color }"
            @click.prevent="handleSocialRegister(social)"
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
  name: 'Register',
  data() {
    return {
      isSubmitting: false,
      isSendingCode: false,
      showPassword: false,
      countdown: 0,
      message: '',
      messageType: 'success',
      phoneError: '',
      passwordError: '',
      confirmPasswordError: '',
      codeError: '',
      formData: {
        username: '',
        password: '',
        confirmPassword: '',
        code: '',
        agreed: false
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
          url: 'https://api.weibo.com/oauth2/authorize',
          color: '#E62129',
          initial: 'W'
        },
        {
          name: '微信',
          url: 'javascript:void(0)',
          color: '#2DCB56',
          initial: 'W'
        }
      ]
    }
  },
  computed: {
    isValidPhone() {
      return /^1[3-9]\d{9}$/.test(this.formData.username)
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
      return this.isValidPhone && 
             this.isValidPassword && 
             this.formData.password === this.formData.confirmPassword &&
             this.formData.code.length === 6 &&
             this.formData.agreed
    }
  },
  methods: {
    goLogin(){
      this.$router.push('/Login')
    },
    validatePhone() {
      if (this.formData.username && !this.isValidPhone) {
        this.phoneError = '请输入正确的手机号'
      } else {
        this.phoneError = ''
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
        
        // 如果确认密码已填写，重新验证
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
    
async sendVerificationCode() {
  if (!this.isValidPhone) {
    this.showMessage('请输入正确的手机号', 'error')
    return
  }
  
  this.isSendingCode = true
  
  try {
    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    
    // 构建账号数据包
    const accountData = {
      phone: this.formData.username,
      code: code,
      password: this.formData.password,
      type: 'register',
      timestamp: new Date().toISOString()
    }
    
    // 在控制台显示验证码
    console.log('========== 验证码信息 ==========')
    console.log('手机号:', accountData.phone)
    console.log('验证码:', code)
    console.log('完整数据包:', JSON.stringify(accountData, null, 2))
    console.log('================================')
    
    this.showMessage('验证码已发送到您的手机', 'success')
    
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
  } finally {
    this.isSendingCode = false
  }
},
    
    async handleRegister() {
      if (!this.isValidForm) {
        this.validatePhone()
        this.validatePassword()
        this.validateConfirmPassword()
        
        if (!this.formData.code) {
          this.codeError = '请输入验证码'
        }
        
        return
      }
      
      this.isSubmitting = true
      this.message = ''
      
      try {
        // 这里替换为实际的API调用
        // const response = await fetch('/api/register', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     username: this.formData.username,
        //     password: this.formData.password,
        //     code: this.formData.code
        //   })
        // })
        
        // const data = await response.json()
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        this.showMessage('注册成功，正在跳转到登录页...', 'success')
        
        // 延迟跳转到登录页
        setTimeout(() => {
          this.$router.push('/Login')
        }, 2000)
        
      } catch (error) {
        console.error('注册失败:', error)
        this.showMessage('注册失败，请重试', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    handleSocialRegister(social) {
      console.log('第三方注册:', social.name)
      
      if (social.name === '微信') {
        // 微信注册需要扫码
        this.showWeChatQRCode()
      } else {
        // 其他第三方注册
        window.location.href = social.url
      }
    },
    
    showWeChatQRCode() {
      // 显示微信扫码注册
      alert('微信扫码注册功能开发中...')
    },
    
    showMessage(msg, type = 'success') {
      this.message = msg
      this.messageType = type
      
      setTimeout(() => {
        this.message = ''
      }, 5000)
    }
  },
  
  mounted() {
    document.title = '注册 - 石上佛韵'
  }
}
</script>

<style scoped>
.register-container {
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
  padding: 30px;
  background:rgba(255,255,255,0.95);
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
  margin-bottom: 30px;
  font-weight: bold;
}

/* 消息提示 */
.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
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

/* 表单样式 */
.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.95rem;
  opacity: 0.9;
  color:black;
}
.input-group input {
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: black;
  font-size: 1rem;
  transition: all 0.3s ease;
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
  color: black;
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
  color: black;
}

/* 验证码 */
.verification-group {
  margin-bottom: 20px;
}

.verification-input {
  display: flex;
  gap: 0.8rem;
}

.verification-input input {
  flex: 1;
}

.btn-send-code {
  padding: 12px 16px;
  background: rgba(212, 175, 55, 0.2);
  color: #D4AF37;
  border: 1px solid #D4AF37;
  border-radius: 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-send-code:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.3);
}

.btn-send-code:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 用户协议 */
.agreement-group {
  margin-bottom: 20px;
}

.agreement-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: black;
  cursor: pointer;
}

.agreement-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #D4AF37;
}

.agreement-link {
  color: #D4AF37;
  text-decoration: none;
  transition: color 0.3s ease;
}

.agreement-link:hover {
  color: #ffd700;
  text-decoration: underline;
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
}

.btn-primary {
  background: #D4AF37;
  color: #3E2723;
  border: none;
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

/* 登录链接 */
.login-link {
  text-align: center;
  margin-top: 20px;
}

/* 第三方注册 */
.other-register {
  margin-top: 2rem;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin-bottom: 1.5rem;
  color: black;
  font-size: 0.85rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
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
  color: black;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.social-icon:hover {
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  .register-container {
    padding: 0.5rem;
  }
  
  .form-container {
    padding: 1.5rem 1rem;
    border-radius: 16px;
  }
  
  .form-title {
    font-size: 1.3rem;
  }
  
  .verification-input {
    flex-direction: column;
  }
  
  .btn-send-code {
    width: 100%;
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