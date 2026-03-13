<template>
  <div class="forgot-password-container">
    <div class="form-container">
      <div class="form-title">找回密码</div>

      <!-- 消息提示 -->
      <div v-if="message" class="alert" :class="messageType">
        {{ message }}
      </div>

      <!-- 步骤1：输入手机号 -->
      <form v-if="currentStep === 1" @submit.prevent="handleGetCode">
        <div class="input-group">
          <label for="phone">注册手机号</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="formData.phone"
            placeholder="请输入手机号" 
            required
            maxlength="11"
            @input="validatePhone"
          >
          <span v-if="phoneError" class="error-text">{{ phoneError }}</span>
        </div>
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="isSubmitting || !isValidPhone"
        >
          {{ isSubmitting ? '提交中...' : '获取验证码' }}
        </button>
      </form>

      <!-- 步骤2：输入验证码 -->
      <form v-if="currentStep === 2" @submit.prevent="handleVerifyCode">
        <div class="input-group">
          <label for="code">验证码</label>
          <input 
            type="text" 
            id="code" 
            v-model="formData.code"
            placeholder="请输入验证码" 
            required
            maxlength="6"
          >
        </div>
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '验证中...' : '下一步' }}
        </button>
      </form>

      <!-- 步骤3：重置密码 -->
      <form v-if="currentStep === 3" @submit.prevent="handleResetPassword">
        <div class="input-group">
          <label for="newPassword">新密码</label>
          <input 
            type="password" 
            id="newPassword" 
            v-model="formData.newPassword"
            placeholder="请输入新密码（6-20位）" 
            required
            minlength="6"
            maxlength="20"
          >
        </div>
        <div class="input-group">
          <label for="confirmPassword">确认密码</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="formData.confirmPassword"
            placeholder="请再次输入新密码" 
            required
            @input="validatePassword"
          >
          <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
        </div>
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="isSubmitting || !isValidPassword"
        >
          {{ isSubmitting ? '重置中...' : '重置密码' }}
        </button>
      </form>

      <!-- 成功页面 -->
      <div v-if="currentStep === 4" class="success-container">
        <div class="success-icon">✓</div>
        <div class="success-title">密码重置成功</div>
        <div class="success-message">您的密码已成功重置，请使用新密码登录</div>
        <button @click="goToLogin" class="btn btn-primary">立即登录</button>
      </div>

      <!-- 返回登录 -->
      <div v-if="currentStep !== 4" style="text-align: center; margin-top: 20px;">
        <router-link to="/Login" class="btn btn-secondary">
          返回登录
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      currentStep: 1,
      isSubmitting: false,
      message: '',
      messageType: 'success',
      phoneError: '',
      passwordError: '',
      formData: {
        phone: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    isValidPhone() {
      return /^1[3-9]\d{9}$/.test(this.formData.phone)
    },
    isValidPassword() {
      return this.formData.newPassword.length >= 6 && 
             this.formData.newPassword === this.formData.confirmPassword
    }
  },
  methods: {
    validatePhone() {
      if (this.formData.phone && !this.isValidPhone) {
        this.phoneError = '请输入正确的手机号'
      } else {
        this.phoneError = ''
      }
    },
    
    validatePassword() {
      if (this.formData.confirmPassword) {
        if (this.formData.newPassword !== this.formData.confirmPassword) {
          this.passwordError = '两次输入的密码不一致'
        } else if (this.formData.newPassword.length < 6) {
          this.passwordError = '密码长度不能少于6位'
        } else {
          this.passwordError = ''
        }
      }
    },
    
    showMessage(msg, type = 'success') {
      this.message = msg
      this.messageType = type
      
      setTimeout(() => {
        this.message = ''
      }, 3000)
    },
    
    async handleGetCode() {
      if (!this.isValidPhone) {
        this.showMessage('请输入正确的手机号', 'error')
        return
      }
      
      this.isSubmitting = true
      
      try {
        // 这里替换为实际的API调用
        // const response = await fetch('/api/send-code', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     phone: this.formData.phone
        //   })
        // })
        
        // const data = await response.json()
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showMessage('验证码已发送到您的手机', 'success')
        this.currentStep = 2
        
      } catch (error) {
        console.error('发送验证码失败:', error)
        this.showMessage('发送验证码失败，请重试', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async handleVerifyCode() {
      if (!this.formData.code || this.formData.code.length !== 6) {
        this.showMessage('请输入6位验证码', 'error')
        return
      }
      
      this.isSubmitting = true
      
      try {
        // 这里替换为实际的API调用
        // const response = await fetch('/api/verify-code', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     phone: this.formData.phone,
        //     code: this.formData.code
        //   })
        // })
        
        // const data = await response.json()
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showMessage('验证码验证成功', 'success')
        this.currentStep = 3
        
      } catch (error) {
        console.error('验证码验证失败:', error)
        this.showMessage('验证码错误，请重试', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    async handleResetPassword() {
      if (!this.isValidPassword) {
        this.showMessage('请检查密码输入', 'error')
        return
      }
      
      this.isSubmitting = true
      
      try {
        // 这里替换为实际的API调用
        // const response = await fetch('/api/reset-password', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     phone: this.formData.phone,
        //     code: this.formData.code,
        //     newPassword: this.formData.newPassword
        //   })
        // })
        
        // const data = await response.json()
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        this.showMessage('密码重置成功', 'success')
        this.currentStep = 4
        
      } catch (error) {
        console.error('重置密码失败:', error)
        this.showMessage('重置密码失败，请重试', 'error')
      } finally {
        this.isSubmitting = false
      }
    },
    
    goToLogin() {
      this.$router.push('/Login')
    },
    
    resetForm() {
      this.currentStep = 1
      this.formData = {
        phone: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
      }
      this.message = ''
      this.phoneError = ''
      this.passwordError = ''
    }
  },
  
  mounted() {
    document.title = '找回密码 - 石上佛韵'
  }
}
</script>

<style scoped>
.forgot-password-container {
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
}

.form-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 1.5rem;
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
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.alert-error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.alert-warning {
  background: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
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
}

.input-group input:focus {
  outline: none;
  border-color: #D4AF37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.input-group input::placeholder {
  color: #999;
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

/* 成功页面 */
.success-container {
  text-align: center;
  padding: 1rem 0;
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
  animation: scaleIn 0.5s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.success-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
}

.success-message {
  color: #666;
  margin-bottom: 2rem;
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
    padding: 10px 14px;
    font-size: 0.95rem;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .forgot-password-container {
    padding: 0.5rem;
  }
  
  .form-container {
    padding: 1.5rem 1rem;
    border-radius: 12px;
  }
  
  .form-title {
    font-size: 1.3rem;
  }
  
  .success-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
  
  .success-title {
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

/* 步骤指示器 */
.step-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.step {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e0e0e0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.step.active {
  background: linear-gradient(135deg, #D4AF37 0%, #b8960c 100%);
  color: white;
}

.step.completed {
  background: #4CAF50;
  color: white;
}

.step-line {
  width: 40px;
  height: 2px;
  background: #e0e0e0;
  transition: all 0.3s ease;
}

.step-line.completed {
  background: #4CAF50;
}
</style>