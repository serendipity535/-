<template>
  <div class="network-error-container">
    <div class="network-error">
      <!-- C形加载动画 -->
      <div class="spinner" :class="{ 'animate': isLoading }"></div>

      <h2 class="error-title">{{ title }}</h2>
      <p class="error-message">{{ message }}</p>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button 
          @click="handleRefresh" 
          class="btn-refresh"
          :disabled="isRefreshing"
        >
          <span v-if="!isRefreshing">刷新</span>
          <span v-else>刷新中...</span>
        </button>
        
        <button 
          @click="handleGoHome" 
          class="btn-home"
        >
          返回首页
        </button>
      </div>

      <!-- 底部社交媒体图标 -->
      <div class="social-icons">
        <a 
          v-for="(social, index) in socialLinks" 
          :key="index"
          :href="social.url" 
          :title="social.name"
          class="social-icon"
          :style="{ background: social.color }"
          target="_blank"
        >
          <span class="icon-text">{{ social.initial }}</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorNetwork',
  data() {
    return {
      isLoading: true,
      isRefreshing: false,
      title: '网络异常',
      message: '请检查网络连接后重试',
      socialLinks: [
        {
          name: 'QQ',
          url: 'https://wpa.qq.com/msgrd?v=3&uin=123456789&site=qq&menu=yes',
          color: '#1DA1F2',
          initial: 'Q'
        },
        {
          name: '微博',
          url: 'https://weibo.com',
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
  props: {
    // 自定义标题
    customTitle: {
      type: String,
      default: ''
    },
    // 自定义消息
    customMessage: {
      type: String,
      default: ''
    }
  },
  computed: {
    title() {
      return this.customTitle || '网络异常'
    },
    
    message() {
      return this.customMessage || '请检查网络连接后重试'
    }
  },
  methods: {
    handleRefresh() {
      this.isRefreshing = true
      this.isLoading = true
      
      // 模拟刷新延迟
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    },
    
    handleGoHome() {
      this.$router.push('/')
    },
    
    // 检测网络状态
    checkNetworkStatus() {
      if (navigator.onLine) {
        console.log('网络已连接')
      } else {
        console.log('网络已断开')
      }
    },
    
    // 监听网络状态变化
    setupNetworkListeners() {
      window.addEventListener('online', this.handleOnline)
      window.addEventListener('offline', this.handleOffline)
    },
    
    handleOnline() {
      console.log('网络已恢复')
      this.showNetworkToast('网络已恢复', 'success')
    },
    
    handleOffline() {
      console.log('网络已断开')
      this.showNetworkToast('网络已断开', 'warning')
    },
    
    showNetworkToast(message, type = 'info') {
      const toast = document.createElement('div')
      toast.className = `network-toast network-toast-${type}`
      toast.textContent = message
      
      document.body.appendChild(toast)
      
      setTimeout(() => {
        toast.classList.add('show')
      }, 100)
      
      setTimeout(() => {
        toast.classList.remove('show')
        setTimeout(() => toast.remove(), 300)
      }, 3000)
    }
  },
  
  mounted() {
    this.checkNetworkStatus()
    this.setupNetworkListeners()
    
    // 停止加载动画
    setTimeout(() => {
      this.isLoading = false
    }, 2000)
  },
  
  beforeUnmount() {
    window.removeEventListener('online', this.handleOnline)
    window.removeEventListener('offline', this.handleOffline)
  }
}
</script>

<style scoped>
.network-error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.network-error {
  text-align: center;
  max-width: 500px;
  width: 100%;
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* C形加载动画 */
.spinner {
  width: 80px;
  height: 80px;
  border: 4px solid transparent;
  border-top: 4px solid #D4AF37;
  border-right: 4px solid #D4AF37;
  border-radius: 50%;
  margin: 0 auto 24px;
  position: relative;
}

.spinner.animate {
  animation: spin 1s linear infinite;
}

.spinner::before {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  right: 4px;
  bottom: 4px;
  border-radius: 50%;
  background: rgba(26, 26, 46, 0.9);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 错误信息 */
.error-title {
  font-size: 1.8rem;
  color: #D4AF37;
  margin: 16px 0;
  font-weight: 700;
}

.error-message {
  opacity: 0.8;
  margin-bottom: 24px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

button {
  padding: 10px 24px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-refresh {
  background: transparent;
  border: 1px solid var(--dunhuang-gold, #D4AF37);
  color: var(--dunhuang-gold, #D4AF37);
}

.btn-refresh:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.1);
  transform: translateY(-2px);
}

.btn-refresh:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-home {
  background: var(--dunhuang-gold, #D4AF37);
  color: var(--dunhuang-bg, #1a1a2e);
}

.btn-home:hover {
  background: #b5952f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

/* 社交媒体图标 */
.social-icons {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 40px;
  opacity: 0.6;
}

.social-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.social-icon:hover {
  opacity: 1;
  transform: translateY(-4px) scale(1.1);
}

.icon-text {
  font-size: 0.9rem;
}

/* 网络状态提示 */
.network-toast {
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.network-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.network-toast-success {
  background: #4CAF50;
}

.network-toast-warning {
  background: #ff9800;
}

.network-toast-error {
  background: #f44336;
}

.network-toast-info {
  background: #2196F3;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .network-error {
    padding: 2rem 1.5rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-message {
    font-size: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  button {
    width: 100%;
    padding: 12px 20px;
  }
  
  .social-icons {
    gap: 20px;
  }
  
  .social-icon {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}
</style>