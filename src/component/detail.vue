<template>
  <div class="artifact-detail-container">
    <div class="glass-card">
      <!-- 文物图片 -->
      <img 
        :src="artifact.image_url" 
        :alt="artifact.name" 
        class="artifact-image"
        @error="handleImageError"
      >

      <!-- 文物信息 -->
      <h2 class="artifact-name">{{ artifact.name }}</h2>
      <p class="artifact-description">{{ artifact.description }}</p>

      <!-- 收藏按钮 -->
      <div class="action-buttons">
        <!-- 已登录状态 -->
        <div v-if="isAuthenticated">
          <!-- 已收藏 -->
          <button 
            v-if="isCollected" 
            @click="handleUncollect"
            class="btn-collected"
          >
            ❤️ 已收藏
          </button>
          <!-- 未收藏 -->
          <button 
            v-else 
            @click="handleCollect"
            class="btn-collect"
          >
            ♡ 收藏
          </button>
        </div>
        <!-- 未登录状态 -->
        <p v-else @click="goLogin" class="button-link">
          <button class="btn-login">
            ♡ 登录后可收藏
          </button>
        </p>
      </div>

      <!-- 额外信息 -->
      <div v-if="artifact.extra_info" class="extra-info">
        <div class="info-item">
          <span class="info-label">年代：</span>
          <span class="info-value">{{ artifact.extra_info.period || '未知' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">材质：</span>
          <span class="info-value">{{ artifact.extra_info.material || '未知' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">尺寸：</span>
          <span class="info-value">{{ artifact.extra_info.size || '未知' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">收藏地：</span>
          <span class="info-value">{{ artifact.extra_info.location || '未知' }}</span>
        </div>
      </div>

      <!-- 相关推荐 -->
      <div v-if="relatedArtifacts.length > 0" class="related-section">
        <h3 class="related-title">相关推荐</h3>
        <div class="related-grid">
          <div 
            v-for="related in relatedArtifacts" 
            :key="related.id"
            class="related-item"
            @click="goToArtifact(related.id)"
          >
            <img :src="related.image_url" :alt="related.name" class="related-image">
            <div class="related-name">{{ related.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      artifact: {
        id: null,
        name: '',
        description: '',
        image_url: '',
        extra_info: {
          period: '',
          material: '',
          size: '',
          location: ''
        }
      },
      isAuthenticated: false,
      isCollected: false,
      relatedArtifacts: [],
      loading: false,
      error: null
    }
  },
  methods: {
    goLogin(){
      this.$router.push('/Login')
    },
    async loadArtifactDetail() {
      this.loading = true
      this.error = null
      
      try {
        const artifactId = this.$route.params.id
        
        // 这里替换为实际的API调用
        // const response = await fetch(`/api/artifacts/${artifactId}`)
        // const data = await response.json()
        
        // 模拟数据
        const data = await this.mockArtifactDetail(artifactId)
        
        this.artifact = data
        document.title = `${data.name} - 石上佛韵`
        
        // 检查收藏状态
        if (this.isAuthenticated) {
          await this.checkCollectionStatus()
        }
        
        // 加载相关推荐
        await this.loadRelatedArtifacts()
        
      } catch (error) {
        console.error('加载文物详情失败:', error)
        this.error = '加载失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    
    async checkCollectionStatus() {
      try {
        // 检查当前用户是否收藏了该文物
        const collectedIds = JSON.parse(localStorage.getItem('collected_artifacts') || '[]')
        this.isCollected = collectedIds.includes(this.artifact.id)
        
        // 或者通过API检查
        // const response = await fetch(`/api/artifacts/${this.artifact.id}/collection-status`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // })
        // const data = await response.json()
        // this.isCollected = data.is_collected
        
      } catch (error) {
        console.error('检查收藏状态失败:', error)
      }
    },
    
    async handleCollect() {
      if (!this.isAuthenticated) {
        this.$router.push('/Login')
        return
      }
      
      try {
        // 调用收藏API
        // const response = await fetch(`/api/artifacts/${this.artifact.id}/collect`, {
        //   method: 'POST',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // })
        
        // if (!response.ok) {
        //   throw new Error('收藏失败')
        // }
        
        // 本地存储模拟
        let collectedIds = JSON.parse(localStorage.getItem('collected_artifacts') || '[]')
        if (!collectedIds.includes(this.artifact.id)) {
          collectedIds.push(this.artifact.id)
          localStorage.setItem('collected_artifacts', JSON.stringify(collectedIds))
        }
        
        this.isCollected = true
        this.showSuccessMessage('收藏成功！')
        
      } catch (error) {
        console.error('收藏失败:', error)
        this.showErrorMessage('收藏失败，请稍后重试')
      }
    },
    
    async handleUncollect() {
      try {
        // 调用取消收藏API
        // const response = await fetch(`/api/artifacts/${this.artifact.id}/uncollect`, {
        //   method: 'DELETE',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // })
        
        // if (!response.ok) {
        //   throw new Error('取消收藏失败')
        // }
        
        // 本地存储模拟
        let collectedIds = JSON.parse(localStorage.getItem('collected_artifacts') || '[]')
        collectedIds = collectedIds.filter(id => id !== this.artifact.id)
        localStorage.setItem('collected_artifacts', JSON.stringify(collectedIds))
        
        this.isCollected = false
        this.showSuccessMessage('已取消收藏')
        
      } catch (error) {
        console.error('取消收藏失败:', error)
        this.showErrorMessage('操作失败，请稍后重试')
      }
    },
    
    async loadRelatedArtifacts() {
      try {
        // 加载相关推荐文物
        // const response = await fetch(`/api/artifacts/${this.artifact.id}/related`)
        // const data = await response.json()
        
        // 模拟数据
        this.relatedArtifacts = await this.mockRelatedArtifacts()
        
      } catch (error) {
        console.error('加载相关推荐失败:', error)
      }
    },
    
    goToArtifact(artifactId) {
      this.$router.push(`/artifact/${artifactId}`)
    },
    
    handleImageError(event) {
      console.error('图片加载失败:', event.target.src)
    },
    
    checkAuthStatus() {
      const token = localStorage.getItem('token')
      this.isAuthenticated = !!token
    },
    
    showSuccessMessage(message) {
      this.showToast(message, 'success')
    },
    
    showErrorMessage(message) {
      this.showToast(message, 'error')
    },
    
    showToast(message, type = 'success') {
      const toast = document.createElement('div')
      toast.className = `toast toast-${type}`
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
    
    // 模拟数据方法
    async mockArtifactDetail(artifactId) {
      return {
        id: artifactId,
        name: '敦煌飞天壁画',
        description: '这幅飞天壁画绘制于唐代，展现了敦煌艺术中飞天形象的典型特征。飞天身姿轻盈，衣带飘扬，手持乐器，在云端翩翩起舞，体现了佛教艺术中极乐世界的美好景象。',

        extra_info: {
          period: '唐代',
          material: '壁画',
          size: '200cm × 150cm',
          location: '敦煌莫高窟第320窟'
        }
      }
    },
    
    async mockRelatedArtifacts() {
      return [
        {
          id: 2,
          name: '菩萨头像',
          image_url: '/public/images/artifact2.jpg'
        },
        {
          id: 3,
          name: '莲花座',
          image_url: '/public/images/artifact3.jpg'
        },
        {
          id: 4,
          name: '佛经残卷',
          image_url: '/public/images/artifact4.jpg'
        }
      ]
    }
  },
  
  watch: {
    '$route.params.id': {
      handler(newId) {
        if (newId) {
          this.loadArtifactDetail()
        }
      },
      immediate: true
    }
  },
  
  mounted() {
    this.checkAuthStatus()
    this.loadArtifactDetail()
  }
}
</script>

<style scoped>
.artifact-detail-container {
  padding: 1rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 文物图片 */
.artifact-image {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 20px;
  object-fit: cover;
  min-height: 300px;
  background: rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.artifact-image:hover {
  transform: scale(1.02);
}

/* 文物信息 */
.artifact-name {
  color: #D4AF37;
  margin: 10px 0;
  font-size: 2rem;
  font-weight: 700;
}

.artifact-description {
  line-height: 1.8;
  opacity: 0.9;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 24px;
}

/* 操作按钮 */
.action-buttons {
  margin-top: 24px;
  text-align: center;
}

.button-link {
  text-decoration: none;
}

button {
  border: none;
  padding: 12px 32px;
  border-radius: 24px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-collected {
  background: #9E2B2B;
  color: white;
}

.btn-collected:hover {
  background: #7a2222;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(158, 43, 43, 0.3);
}

.btn-collect {
  background: var(--dunhuang-gold, #D4AF37);
  color: var(--dunhuang-bg, #1a1a2e);
}

.btn-collect:hover {
  background: #b5952f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.btn-login {
  background: #666;
  color: white;
}

.btn-login:hover {
  background: #555;
  transform: translateY(-2px);
}

/* 额外信息 */
.extra-info {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.info-item {
  display: flex;
  margin-bottom: 16px;
  align-items: center;
}

.info-label {
  color: #D4AF37;
  font-weight: 600;
  min-width: 80px;
  font-size: 1rem;
}

.info-value {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
}

/* 相关推荐 */
.related-section {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.related-title {
  color: #D4AF37;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.related-item {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.related-item:hover {
  transform: translateY(-4px);
}

.related-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
  background: rgba(0, 0, 0, 0.2);
}

.related-name {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.6);
}

.error {
  text-align: center;
  padding: 40px;
  color: #ff4444;
}

/* Toast 提示 */
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
  .glass-card {
    padding: 1.5rem;
  }
  
  .artifact-name {
    font-size: 1.5rem;
  }
  
  .artifact-description {
    font-size: 1rem;
  }
  
  button {
    padding: 10px 24px;
    font-size: 0.95rem;
  }
  
  .related-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
  }
  
  .related-image {
    height: 120px;
  }
}

/* 图片加载动画 */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.artifact-image.loading {
  background: linear-gradient(90deg, 
    rgba(255,255,255,0.1) 25%, 
    rgba(255,255,255,0.2) 50%, 
    rgba(255,255,255,0.1) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>