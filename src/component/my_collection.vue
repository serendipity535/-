<template>
  <div class="collection-container">
    <div class="glass-card collection-card">
      <h2 class="page-title">我的收藏</h2>

      <!-- 收藏统计 -->
      <div v-if="collections.length > 0" class="collection-stats">
        <div class="stat-item">
          <div class="stat-value">{{ collections.length }}</div>
          <div class="stat-label">收藏总数</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ recentAdded }}</div>
          <div class="stat-label">本周新增</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ categoriesCount }}</div>
          <div class="stat-label">分类数量</div>
        </div>
      </div>

      <!-- 筛选和排序 -->
      <div v-if="collections.length > 0" class="filter-section">
        <div class="filter-group">
          <select v-model="filterCategory" class="filter-select">
            <option value="">全部分类</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
          
          <select v-model="sortBy" class="filter-select">
            <option value="date">按时间排序</option>
            <option value="name">按名称排序</option>
            <option value="category">按分类排序</option>
          </select>
        </div>
        
        <button @click="toggleEditMode" class="btn btn-edit">
          {{ isEditMode ? '完成' : '管理' }}
        </button>
      </div>

      <!-- 收藏列表 -->
      <div v-if="filteredCollections.length > 0" class="collections-grid">
        <div 
          v-for="item in filteredCollections" 
          :key="item.id"
          class="collection-item"
          :class="{ selected: selectedItems.includes(item.id) }"
          @click="handleItemClick(item)"
        >
          <div class="item-checkbox" v-if="isEditMode">
            <input 
              type="checkbox" 
              :id="`check-${item.id}`"
              :value="item.id"
              v-model="selectedItems"
              @click.stop
            >
          </div>
          
          
          <div class="item-info">
            <h3 class="item-name">{{ item.name }}</h3>
            <p class="item-desc">{{ truncateText(item.description, 30) }}</p>
            <div class="item-meta">
              <span class="item-category">{{ item.category }}</span>
              <span class="item-date">{{ formatDate(item.created_at) }}</span>
            </div>
          </div>
          
          <button 
            v-if="!isEditMode"
            class="btn-remove"
            @click.stop="removeFromCollection(item.id)"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">💔</div>
        <p class="empty-text">暂无收藏</p>
        <p class="empty-sub">去探索更多精彩内容吧</p>
        <router-link to="/Home" class="btn btn-primary">
          去首页看看
        </router-link>
      </div>

      <!-- 批量操作栏 -->
      <div v-if="isEditMode && selectedItems.length > 0" class="batch-actions">
        <span class="selected-count">已选择 {{ selectedItems.length }} 项</span>
        <div class="action-buttons">
          <button @click="batchRemove" class="btn btn-danger">
            删除选中
          </button>
          <button @click="batchCancel" class="btn btn-secondary">
            取消选择
          </button>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="page-btn"
        >
          上一页
        </button>
        
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        
        <button 
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="page-btn"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyCollection',
  data() {
    return {
      collections: [],
      isEditMode: false,
      selectedItems: [],
      filterCategory: '',
      sortBy: 'date',
      currentPage: 1,
      pageSize: 10,
      isLoading: false
    }
  },
  computed: {
    categories() {
      const cats = new Set(this.collections.map(item => item.category))
      return Array.from(cats)
    },
    
    filteredCollections() {
      let filtered = [...this.collections]
      
      // 分类筛选
      if (this.filterCategory) {
        filtered = filtered.filter(item => item.category === this.filterCategory)
      }
      
      // 排序
      switch (this.sortBy) {
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'category':
          filtered.sort((a, b) => a.category.localeCompare(b.category))
          break
        case 'date':
        default:
          filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }
      
      // 分页
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return filtered.slice(start, end)
    },
    
    totalPages() {
      return Math.ceil(this.collections.length / this.pageSize)
    },
    
    recentAdded() {
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return this.collections.filter(item => 
        new Date(item.created_at) >= weekAgo
      ).length
    },
    
    categoriesCount() {
      return this.categories.length
    }
  },
  methods: {
    async loadCollections() {
      this.isLoading = true
      
      try {
        // 这里替换为实际的API调用
        // const response = await fetch('/api/collections')
        // const data = await response.json()
        // this.collections = data
        
        // 模拟数据
        this.collections = [
          {
            id: 1,
            name: '飞天壁画',
            description: '敦煌莫高窟的飞天壁画展现了佛教艺术的精髓，飞天身姿轻盈，衣带飘扬，手持乐器，在云端翩翩起舞。',
            category: '壁画',
            created_at: '2024-01-15T10:30:00'
          },
          {
            id: 2,
            name: '菩萨像',
            description: '唐代菩萨造像，面容慈祥，衣纹流畅，体现了盛唐时期的艺术风格和宗教信仰。',
            category: '造像',
            created_at: '2024-01-10T14:20:00'
          },
          {
            id: 3,
            name: '莲花座',
            description: '精美的莲花座雕刻，象征着纯洁和神圣，是佛教艺术中常见的元素。',
            category: '雕刻',
            created_at: '2024-01-05T09:15:00'
          },
          {
            id: 4,
            name: '石窟全景',
            description: '石窟全景图，展现了石窟的整体布局和建筑特色。',
            category: '建筑',
            created_at: '2024-01-20T16:45:00'
          },
          {
            id: 5,
            name: '佛经残卷',
            description: '珍贵的佛经残卷，记录了古代佛教文化的传承。',
            category: '文献',
            created_at: '2024-01-18T11:30:00'
          }
        ]
        
      } catch (error) {
        console.error('加载收藏失败:', error)
        this.showErrorMessage('加载收藏失败，请重试')
      } finally {
        this.isLoading = false
      }
    },
    
    handleItemClick(item) {
      if (this.isEditMode) {
        // 编辑模式下，切换选中状态
        const index = this.selectedItems.indexOf(item.id)
        if (index > -1) {
          this.selectedItems.splice(index, 1)
        } else {
          this.selectedItems.push(item.id)
        }
      } else {
        // 普通模式下，跳转到详情页
        this.$router.push(`/artifact/${item.id}`)
      }
    },
    
    async removeFromCollection(id) {
      if (confirm('确定要取消收藏吗？')) {
        try {
          // 调用取消收藏API
          // await fetch(`/api/collections/${id}`, { method: 'DELETE' })
          
          // 模拟删除
          this.collections = this.collections.filter(item => item.id !== id)
          
          this.showSuccessMessage('已取消收藏')
          
        } catch (error) {
          console.error('取消收藏失败:', error)
          this.showErrorMessage('操作失败，请重试')
        }
      }
    },
    
    async batchRemove() {
      if (confirm(`确定要删除选中的 ${this.selectedItems.length} 项收藏吗？`)) {
        try {
          // 调用批量删除API
          // await fetch('/api/collections/batch', {
          //   method: 'DELETE',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ ids: this.selectedItems })
          // })
          
          // 模拟批量删除
          this.collections = this.collections.filter(item => 
            !this.selectedItems.includes(item.id)
          )
          
          this.selectedItems = []
          this.isEditMode = false
          
          this.showSuccessMessage('删除成功')
          
        } catch (error) {
          console.error('批量删除失败:', error)
          this.showErrorMessage('操作失败，请重试')
        }
      }
    },
    
    batchCancel() {
      this.selectedItems = []
    },
    
    toggleEditMode() {
      this.isEditMode = !this.isEditMode
      if (!this.isEditMode) {
        this.selectedItems = []
      }
    },
    
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    
    truncateText(text, maxLength) {
      if (!text) return ''
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    },
    
    formatDate(dateStr) {
      const date = new Date(dateStr)
      const now = new Date()
      const diff = now - date
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) return '今天'
      if (days === 1) return '昨天'
      if (days < 7) return `${days}天前`
      
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
      })
    },
    
    handleImageError(event) {
      console.error('图片加载失败:', event.target.src)
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
    }
  },
  
  mounted() {
    document.title = '我的收藏 - 石上佛韵'
    this.loadCollections()
  }
}
</script>

<style scoped>
.collection-container {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.collection-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.page-title {
  text-align: center;
  color: #D4AF37;
  margin-bottom: 2rem;
  font-size: 2rem;
}

/* 收藏统计 */
.collection-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #D4AF37;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
}

/* 筛选和排序 */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-group {
  display: flex;
  gap: 0.8rem;
  flex: 1;
}

.filter-select {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #D4AF37;
}

.filter-select option {
  background: #1a1a2e;
  color: #fff;
}

.btn-edit {
  padding: 0.6rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 215, 0, 0.5);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 收藏列表 */
.collections-grid {
  display: grid;
  gap: 1rem;
}

.collection-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.collection-item:hover {
  background: rgba(0, 0, 0, 0.3);
  transform: translateX(4px);
}

.collection-item.selected {
  border-color: #D4AF37;
  background: rgba(212, 175, 55, 0.1);
}

.item-checkbox {
  margin-right: 1rem;
}

.item-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #D4AF37;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 1rem;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  margin: 0 0 0.3rem;
  color: #D4AF37;
  font-size: 1.1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-desc {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  opacity: 0.6;
}

.item-category {
  color: #D4AF37;
}

.btn-remove {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btn-remove:hover {
  background: rgba(244, 67, 54, 0.4);
  transform: scale(1.1);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 0.5rem;
}

.empty-sub {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 2rem;
}

/* 批量操作栏 */
.batch-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(20, 30, 40, 0.95);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 215, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.selected-count {
  color: #D4AF37;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #D4AF37;
  color: #1a1a2e;
}

.btn-primary:hover {
  background: #b8960c;
  transform: translateY(-2px);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 215, 0, 0.5);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-danger {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.5);
}

.btn-danger:hover {
  background: rgba(244, 67, 54, 0.4);
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: #D4AF37;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: rgba(255, 255, 255, 0.6);
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
  .collection-card {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .collection-stats {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
  }
  
  .collection-item {
    padding: 0.8rem;
  }
  
  .item-image {
    width: 50px;
    height: 50px;
  }
  
  .item-name {
    font-size: 1rem;
  }
  
  .batch-actions {
    padding: 0.8rem 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .action-buttons .btn {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .collection-container {
    padding: 1rem 0.5rem;
  }
  
  .collection-card {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.3rem;
  }
  
  .item-image {
    width: 45px;
    height: 45px;
  }
}
</style>