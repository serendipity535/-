<template>
  <div class="comments-container">
    <div class="glass-card">
      <h3 class="section-title">评论</h3>

      <!-- 评论列表 -->
      <div class="comments-list">
        <div 
          v-for="(comment, index) in comments" 
          :key="index" 
          class="comment-item"
        >
          <div class="user-avatar"></div>
          <div class="comment-content">
            <div class="comment-header">
              <strong class="username">{{ comment.username }}</strong>
              <span class="comment-date">{{ comment.date }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
            <img 
              v-if="comment.image" 
              :src="comment.image" 
              :alt="comment.username + '的图片'"
              class="comment-image"
            >
          </div>
        </div>
      </div>

      <!-- 发表评论框 -->
      <div class="comment-form">
        <textarea
          v-model="newComment"
          placeholder="发表你的评论..."
          class="comment-input"
          @input="handleInput"
        ></textarea>
        
        <div class="form-actions">
          <div class="image-upload">
            <input 
              type="file" 
              ref="imageInput"
              @change="handleImageUpload"
              accept="image/*"
              style="display: none;"
            >
            <button 
              @click="$refs.imageInput.click()" 
              class="btn-upload"
            >
              📷 添加图片
            </button>
            <span v-if="previewImage" class="image-count">已选择1张图片</span>
          </div>
          
          <button 
            @click="submitComment" 
            class="btn-submit"
            :disabled="!newComment.trim()"
          >
            发送
          </button>
        </div>

        <!-- 图片预览 -->
        <div v-if="previewImage" class="image-preview">
          <img :src="previewImage" alt="预览图片">
          <button @click="removeImage" class="btn-remove">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Comments',
  data() {
    return {
      newComment: '',
      previewImage: null,
      imageFile: null,
      comments: [
        {
          username: '百里未',
          date: '2023-01-16',
          content: '第三次来龙门石窟……才看到现在入口也挪到石窟一公里外，中间建起仿古街区，煎炒烹炸，乌烟瘴气，给人的感觉不像是来礼佛，更像是来狎妓吃花酒。我们现在一说旅游开发，基本意同竭泽而渔……比较起来，做得最好的还是莫高窟。',
          image: '/public/images/longmen.jpg'
        }
      ]
    }
  },
  methods: {
    handleInput(event) {
      // 可以添加字数限制等逻辑
      if (this.newComment.length > 500) {
        this.newComment = this.newComment.substring(0, 500)
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          alert('请选择图片文件')
          return
        }
        
        // 验证文件大小（5MB）
        if (file.size > 5 * 1024 * 1024) {
          alert('图片大小不能超过5MB')
          return
        }

        this.imageFile = file
        
        // 创建预览
        const reader = new FileReader()
        reader.onload = (e) => {
          this.previewImage = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    removeImage() {
      this.previewImage = null
      this.imageFile = null
      this.$refs.imageInput.value = ''
    },
    submitComment() {
      if (!this.newComment.trim()) {
        alert('请输入评论内容')
        return
      }

      // 创建新评论对象
      const newCommentObj = {
        username: '我', // 这里应该是当前登录用户的用户名
        date: this.getCurrentDate(),
        content: this.newComment,
        image: this.previewImage || null
      }

      // 添加到评论列表
      this.comments.unshift(newCommentObj)

      // 清空表单
      this.newComment = ''
      this.removeImage()

      // 这里可以添加API调用来保存评论到服务器
      // this.saveCommentToServer(newCommentObj)
      
      // 显示成功提示
      this.showSuccessMessage()
    },
    getCurrentDate() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    showSuccessMessage() {
      // 简单的成功提示
      const message = document.createElement('div')
      message.textContent = '评论发表成功！'
      message.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4CAF50;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        animation: fadeInOut 3s ease;
      `
      document.body.appendChild(message)
      
      setTimeout(() => {
        message.remove()
      }, 3000)
    },
    async saveCommentToServer(comment) {
      try {
        // 这里替换为实际的API调用
        const formData = new FormData()
        formData.append('content', comment.content)
        if (this.imageFile) {
          formData.append('image', this.imageFile)
        }

        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        })

        if (!response.ok) {
          throw new Error('评论保存失败')
        }

        const result = await response.json()
        return result
      } catch (error) {
        console.error('保存评论失败:', error)
        throw error
      }
    },
    async loadComments() {
      try {
        // 这里替换为实际的API调用
        const response = await fetch('/api/comments')
        if (!response.ok) {
          throw new Error('加载评论失败')
        }
        const data = await response.json()
        this.comments = data
      } catch (error) {
        console.error('加载评论失败:', error)
      }
    }
  },
  mounted() {
    // 组件挂载时加载评论
    // this.loadComments()
  },
  computed: {
    charCount() {
      return this.newComment.length
    },
    remainingChars() {
      return 500 - this.newComment.length
    }
  }
}
</script>

<style scoped>
.comments-container {
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
  color: #D4AF37;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

/* 评论列表样式 */
.comments-list {
  max-height: 60vh;
  overflow-y: auto;
  margin-bottom: 2rem;
}

.comment-item {
  display: flex;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.comment-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #D4AF37, #F4E4BC);
  margin-right: 16px;
  flex-shrink: 0;
  border: 2px solid #D4AF37;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  align-items: center;
}

.username {
  color: #D4AF37;
  font-size: 1.1rem;
}

.comment-date {
  font-size: 0.85rem;
  opacity: 0.8;
  color: rgba(255, 255, 255, 0.6);
}

.comment-text {
  line-height: 1.6;
  text-align: justify;
  margin: 0 0 12px 0;
  color: rgba(255, 255, 255, 0.9);
}

.comment-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  margin-top: 12px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.comment-image:hover {
  transform: scale(1.02);
}

/* 评论表单样式 */
.comment-form {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.comment-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 12px;
  color: white;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.comment-input:focus {
  outline: none;
  border-color: #D4AF37;
}

.comment-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.image-upload {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-upload {
  background: rgba(212, 175, 55, 0.2);
  border: 1px solid #D4AF37;
  padding: 8px 16px;
  border-radius: 20px;
  color: #D4AF37;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-upload:hover {
  background: rgba(212, 175, 55, 0.3);
  transform: translateY(-2px);
}

.image-count {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.btn-submit {
  background: var(--dunhuang-red, #C41E3A);
  border: none;
  padding: 10px 24px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-submit:hover:not(:disabled) {
  background: #a01830;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(196, 30, 58, 0.3);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 图片预览样式 */
.image-preview {
  position: relative;
  margin-top: 12px;
  display: inline-block;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
}

.btn-remove {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ff4444;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-remove:hover {
  background: #cc0000;
  transform: scale(1.1);
}

/* 滚动条样式 */
.comments-list::-webkit-scrollbar {
  width: 6px;
}

.comments-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.comments-list::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.5);
  border-radius: 3px;
}

.comments-list::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.7);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .glass-card {
    padding: 1.5rem;
  }
  
  .comment-item {
    margin-bottom: 20px;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
  }
  
  .username {
    font-size: 1rem;
  }
  
  .comment-text {
    font-size: 0.95rem;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .btn-submit {
    width: 100%;
  }
}

/* 动画 */
@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  10% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  90% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
}
</style>