<template>
  <div class="member-center-container">
    <div class="glass-card member-card">
      <h2 class="card-title">💎 会员中心</h2>
      <p class="card-subtitle">尊享高清图下载 · 专家解读 · 专属内容</p>

      <!-- 会员状态 -->
      <div class="member-status" :class="memberStatus">
        <div class="status-icon">{{ memberStatus === 'active' ? '👑' : '👤' }}</div>
        <div class="status-info">
          <h3 class="status-title">{{ memberStatus === 'active' ? '尊贵会员' : '普通用户' }}</h3>
          <p class="status-desc">{{ statusDescription }}</p>
        </div>
      </div>

      <!-- 会员权益 -->
      <div class="benefits-section">
        <h4 class="benefits-title">会员权益</h4>
        <ul class="benefits-list">
          <li 
            v-for="(benefit, index) in benefits" 
            :key="index"
            class="benefit-item"
            :class="{ active: memberStatus === 'active' || benefit.free }"
          >
            <span class="benefit-icon">{{ memberStatus === 'active' || benefit.free ? '✅' : '🔒' }}</span>
            <span class="benefit-text">{{ benefit.text }}</span>
          </li>
        </ul>
      </div>

      <!-- 会员套餐 -->
      <div v-if="memberStatus !== 'active'" class="plans-section">
        <h4 class="plans-title">选择套餐</h4>
        <div class="plans-grid">
          <div 
            v-for="(plan, index) in plans" 
            :key="index"
            class="plan-card"
            :class="{ active: selectedPlan === index, recommended: plan.recommended }"
            @click="selectPlan(index)"
          >
            <div v-if="plan.recommended" class="plan-badge">推荐</div>
            <h5 class="plan-name">{{ plan.name }}</h5>
            <div class="plan-price">
              <span class="price-symbol">¥</span>
              <span class="price-value">{{ plan.price }}</span>
              <span class="price-unit">/{{ plan.unit }}</span>
            </div>
            <p class="plan-desc">{{ plan.description }}</p>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-section">
        <button 
          v-if="memberStatus !== 'active'"
          @click="handleSubscribe"
          class="btn btn-primary"
          :disabled="isSubscribing"
        >
          {{ isSubscribing ? '处理中...' : `立即开通 ¥${plans[selectedPlan].price}/${plans[selectedPlan].unit}` }}
        </button>
        
        <button 
          v-else
          @click="handleRenew"
          class="btn btn-secondary"
        >
          续费会员
        </button>
        
        <button 
          v-if="memberStatus === 'active'"
          @click="handleCancel"
          class="btn btn-cancel"
        >
          取消订阅
        </button>
      </div>

      <!-- 会员信息 -->
      <div v-if="memberStatus === 'active'" class="member-info">
        <div class="info-row">
          <span class="info-label">会员类型：</span>
          <span class="info-value">{{ memberInfo.type }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">开通时间：</span>
          <span class="info-value">{{ formatDate(memberInfo.startDate) }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">到期时间：</span>
          <span class="info-value">{{ formatDate(memberInfo.endDate) }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">剩余天数：</span>
          <span class="info-value">{{ remainingDays }} 天</span>
        </div>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <div v-if="showPaymentModal" class="modal-overlay" @click="closePaymentModal">
      <div class="payment-modal" @click.stop>
        <h3 class="modal-title">选择支付方式</h3>
        <div class="payment-methods">
          <div 
            v-for="(method, index) in paymentMethods" 
            :key="index"
            class="payment-method"
            :class="{ active: selectedPayment === index }"
            @click="selectedPayment = index"
          >
            <div class="method-icon" :style="{ background: method.color }">
              {{ method.icon }}
            </div>
            <span class="method-name">{{ method.name }}</span>
          </div>
        </div>
        <div class="payment-amount">
          <span class="amount-label">支付金额：</span>
          <span class="amount-value">¥{{ plans[selectedPlan].price }}</span>
        </div>
        <div class="modal-actions">
          <button @click="closePaymentModal" class="btn btn-cancel">取消</button>
          <button @click="confirmPayment" class="btn btn-primary" :disabled="isProcessing">
            {{ isProcessing ? '支付中...' : '确认支付' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Member',
  data() {
    return {
      memberStatus: 'inactive', // active, inactive, expired
      isSubscribing: false,
      isProcessing: false,
      showPaymentModal: false,
      selectedPlan: 0,
      selectedPayment: 0,
      memberInfo: {
        type: '年度会员',
        startDate: '2024-01-01',
        endDate: '2025-01-01'
      },
      benefits: [
        { text: '无水印高清石窟图片下载', free: false },
        { text: '专家音频讲解（龙门/云冈/莫高窟）', free: false },
        { text: '优先参与线下研学活动', free: false },
        { text: '专属数字藏品空投', free: false },
        { text: '基础内容浏览', free: true },
        { text: '收藏功能', free: true }
      ],
      plans: [
        {
          name: '月度会员',
          price: 5,
          unit: '月',
          description: '适合短期体验',
          recommended: false
        },
        {
          name: '年度会员',
          price: 30,
          unit: '年',
          description: '超值首选，日均不到0.1元',
          recommended: true
        },
        {
          name: '永久会员',
          price: 299,
          unit: '永久',
          description: '一次购买，终身享受',
          recommended: false
        }
      ],
      paymentMethods: [
        {
          name: '微信支付',
          icon: '💚',
          color: '#2DCB56'
        },
        {
          name: '支付宝',
          icon: '💙',
          color: '#1677FF'
        },
        {
          name: '银行卡',
          icon: '💳',
          color: '#FF6B6B'
        }
      ]
    }
  },
  computed: {
    statusDescription() {
      if (this.memberStatus === 'active') {
        return '您的会员权益生效中'
      } else if (this.memberStatus === 'expired') {
        return '您的会员已过期'
      } else {
        return '开通会员，解锁全部权益'
      }
    },
    remainingDays() {
      const end = new Date(this.memberInfo.endDate)
      const now = new Date()
      const diff = end - now
      return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
    }
  },
  methods: {
    selectPlan(index) {
      this.selectedPlan = index
    },
    
    async handleSubscribe() {
      this.showPaymentModal = true
    },
    
    async confirmPayment() {
      this.isProcessing = true
      
      try {
        // 这里替换为实际的支付API调用
        // const response = await fetch('/api/payment/create', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({
        //     plan: this.plans[this.selectedPlan],
        //     paymentMethod: this.paymentMethods[this.selectedPayment]
        //   })
        // })
        
        // 模拟支付过程
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // 模拟支付成功
        this.memberStatus = 'active'
        this.memberInfo.startDate = new Date().toISOString().split('T')[0]
        this.memberInfo.endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        
        this.showSuccessMessage('支付成功，会员已开通！')
        this.closePaymentModal()
        
      } catch (error) {
        console.error('支付失败:', error)
        this.showErrorMessage('支付失败，请重试')
      } finally {
        this.isProcessing = false
      }
    },
    
    handleRenew() {
      this.showPaymentModal = true
    },
    
    async handleCancel() {
      if (confirm('确定要取消会员订阅吗？')) {
        try {
          // 调用取消订阅API
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          this.showSuccessMessage('订阅已取消')
          
        } catch (error) {
          console.error('取消订阅失败:', error)
          this.showErrorMessage('操作失败，请重试')
        }
      }
    },
    
    closePaymentModal() {
      this.showPaymentModal = false
      this.selectedPayment = 0
    },
    
    formatDate(dateStr) {
      const date = new Date(dateStr)
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
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
    
    showErrorMessage(message) {
      const toast = document.createElement('div')
      toast.className = 'toast toast-error'
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
    
    loadMemberInfo() {
      // 加载会员信息
      const memberData = localStorage.getItem('memberInfo')
      if (memberData) {
        const data = JSON.parse(memberData)
        this.memberStatus = data.status
        this.memberInfo = data.info
      }
    }
  },
  
  mounted() {
    document.title = '会员中心 - 石上佛韵'
    this.loadMemberInfo()
  }
}
</script>

<style scoped>
.member-center-container {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.member-card {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
}

.card-title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #D4AF37;
}

.card-subtitle {
  margin: 20px 0;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 会员状态 */
.member-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 16px;
  margin: 20px 0;
  border: 2px solid rgba(255, 215, 0, 0.3);
}

.member-status.active {
  background: rgba(212, 175, 55, 0.1);
  border-color: #D4AF37;
}

.status-icon {
  font-size: 3rem;
}

.status-info {
  text-align: left;
}

.status-title {
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  color: #D4AF37;
}

.status-desc {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
}

/* 会员权益 */
.benefits-section {
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 16px;
  margin: 20px 0;
  text-align: left;
}

.benefits-title {
  margin: 0 0 1rem;
  color: #D4AF37;
  font-size: 1.2rem;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.benefit-item:last-child {
  border-bottom: none;
}

.benefit-item.active {
  color: #4CAF50;
}

.benefit-icon {
  font-size: 1.2rem;
}

.benefit-text {
  flex: 1;
}

/* 会员套餐 */
.plans-section {
  margin: 2rem 0;
}

.plans-title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #D4AF37;
  font-size: 1.2rem;
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.plan-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 1.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.plan-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 215, 0, 0.6);
}

.plan-card.active {
  background: rgba(212, 175, 55, 0.1);
  border-color: #D4AF37;
}

.plan-card.recommended {
  border-color: #D4AF37;
}

.plan-badge {
  position: absolute;
  top: -10px;
  right: 10px;
  background: #D4AF37;
  color: #1a1a2e;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.plan-name {
  margin: 0 0 0.5rem;
  color: #fff;
  font-size: 1.1rem;
}

.plan-price {
  margin: 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #D4AF37;
}

.price-symbol {
  font-size: 1rem;
}

.price-value {
  font-size: 2rem;
}

.price-unit {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

.plan-desc {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

/* 操作按钮 */
.action-section {
  margin-top: 2rem;
}

.btn {
  display: inline-block;
  width: 100%;
  padding: 12px 32px;
  border: none;
  border-radius: 24px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  margin-bottom: 0.8rem;
}

.btn-primary {
  background: var(--dunhuang-gold, #D4AF37);
  color: var(--dunhuang-bg, #1a1a2e);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 215, 0, 0.5);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-cancel {
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-cancel:hover {
  color: #f44336;
  border-color: #f44336;
}

/* 会员信息 */
.member-info {
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 2rem;
  text-align: left;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: rgba(255, 255, 255, 0.6);
}

.info-value {
  color: #D4AF37;
  font-weight: 600;
}

/* 支付弹窗 */
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

.payment-modal {
  background: rgba(20, 30, 40, 0.95);
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-title {
  margin: 0 0 1.5rem;
  color: #D4AF37;
  text-align: center;
  font-size: 1.5rem;
}

.payment-methods {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-method:hover {
  border-color: rgba(255, 215, 0, 0.6);
}

.payment-method.active {
  border-color: #D4AF37;
  background: rgba(212, 175, 55, 0.1);
}

.method-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.method-name {
  flex: 1;
  color: #fff;
}

.payment-amount {
  text-align: center;
  padding: 1rem;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.amount-label {
  color: rgba(255, 255, 255, 0.6);
}

.amount-value {
  color: #D4AF37;
  font-size: 1.5rem;
  font-weight: 700;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.modal-actions .btn {
  flex: 1;
  margin-bottom: 0;
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

.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.toast-success {
  background: #4CAF50;
}

.toast-error {
  background: #f44336;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .member-card {
    padding: 2rem 1.5rem;
  }
  
  .card-title {
    font-size: 1.5rem;
  }
  
  .plans-grid {
    grid-template-columns: 1fr;
  }
  
  .member-status {
    flex-direction: column;
    text-align: center;
  }
  
  .status-info {
    text-align: center;
  }
}

@media (max-width: 480px) {
  .member-center-container {
    padding: 1rem 0.5rem;
  }
  
  .member-card {
    padding: 1.5rem 1rem;
  }
  
  .card-title {
    font-size: 1.3rem;
  }
  
  .card-subtitle {
    font-size: 1rem;
  }
}
</style>