<template>
  <div class="home-page">
    <!-- 全屏背景轮播区域 -->
    <div class="hero-slideshow">
      <div 
        class="slideshow-bg" 
        :style="{ backgroundImage: `url('${currentImage}')` }"
      ></div>
      
      <div class="slideshow-overlay"></div>

      <!-- 标题、搜索栏等内容 -->
      <div class="hero-content">
        <h1 class="hero-title">石上佛韵</h1>
        <p class="hero-subtitle">中国佛窟的前世今生</p>

        <div class="hero-tags">
          <span class="hero-tag">飞天在人间</span>
          <span class="hero-tag">中国古代美术史的高辉简章</span>
        </div>

        <p class="hero-english">Gaohuichapter in ancient Chinese art history</p>

        <!-- 标签列表 -->
        <div class="nav-tags">
          <router-link to="/About" class="nav-tag">
            关于我们
          </router-link>
          <router-link to="/History" class="nav-tag">
            历史
          </router-link>
          <span class="nav-tag">美术</span>
          <span class="nav-tag">音乐</span>
          <span class="nav-tag">讲座</span>
          <router-link to="/Exhibition" class="nav-tag">
            展会
          </router-link>
        </div>

        <!-- 搜索栏 -->
        <div class="search-container">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="搜索文物、石窟或关键词..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
          <button @click="handleSearch" class="search-button">搜索</button>
        </div>
      </div>

      <!-- 轮播指示器 -->
      <div class="slide-indicators">
        <span 
          v-for="(image, index) in slideshowImages" 
          :key="index"
          class="dot"
          :class="{ active: currentIndex === index }"
          @click="goToSlide(index)"
        ></span>
      </div>
    </div>

    <!-- 敦煌瑰宝 -->
    <div class="glass-card treasures-section">
      <h2 class="section-title">敦煌瑰宝</h2>

      <div v-if="artifacts.length > 0" class="artifacts-list">
        <div 
          v-for="artifact in artifacts" 
          :key="artifact.id"
          class="artifact-item"
          @click="goToDetail(artifact.id)"
        >
          <div class="artifact-info">
            <h3 class="artifact-name">{{ artifact.name }}</h3>
            <p class="artifact-desc">{{ truncateText(artifact.description, 50) }}</p>
          </div>
        </div>
      </div>

      <div v-else class="no-data">
        <p>暂无文物数据</p>
        <button @click="initArtifacts" class="init-button">
          点击初始化示例文物
        </button>
      </div>

      <!-- 查看我的收藏 -->
      <div v-if="artifacts.length > 0" class="view-collection">
        <router-link to="/MyCollection" class="collection-link">
          ❤️ 查看我的收藏
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      currentIndex: 0,
      searchQuery: '',
      slideshowImages: [
        '/public/images/longmen.jpg',
        '/public/images/首页02.jpg',
        '/public/images/banner.jpg',
        '/public/images/首页01.jpg'
      ],
      artifacts: [],
      autoPlayTimer: null
    }
  },
  computed: {
    currentImage() {
      return this.slideshowImages[this.currentIndex]
    }
  },
  methods: {
    // 轮播图相关
    goToSlide(index) {
      this.currentIndex = index
      this.resetAutoPlay()
    },
    
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.slideshowImages.length
    },
    
    startAutoPlay() {
      this.autoPlayTimer = setInterval(() => {
        this.nextSlide()
      }, 5000)
    },
    
    stopAutoPlay() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer)
      }
    },
    
    resetAutoPlay() {
      this.stopAutoPlay()
      this.startAutoPlay()
    },
    
    // 搜索功能
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({
          path: '/search',
          query: { q: this.searchQuery }
        })
      }
    },
    
    // 文物相关
    async loadArtifacts() {
      try {
        // 这里替换为实际的API调用
        // const response = await fetch('/api/artifacts')
        // const data = await response.json()
        // this.artifacts = data
        
        // 模拟数据
        this.artifacts = [
          {
            id: 1,
            name: '飞天壁画',
            description: '敦煌莫高窟的飞天壁画展现了佛教艺术的精髓，飞天身姿轻盈，衣带飘扬，手持乐器，在云端翩翩起舞。',
          },
          {
            id: 2,
            name: '菩萨像',
            description: '唐代菩萨造像，面容慈祥，衣纹流畅，体现了盛唐时期的艺术风格和宗教信仰。',
          },
          {
            id: 3,
            name: '莲花座',
            description: '精美的莲花座雕刻，象征着纯洁和神圣，是佛教艺术中常见的元素。',
          }
        ]
        
      } catch (error) {
        console.error('加载文物数据失败:', error)
      }
    },
    
    initArtifacts() {
      // 初始化示例文物
      this.loadArtifacts()
    },
    
    goToDetail(artifactId) {
      this.$router.push(`/artifact/${artifactId}`)
    },
    
    truncateText(text, maxLength) {
      if (!text) return ''
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    },
    
    handleImageError(event) {
      console.error('图片加载失败:', event.target.src)
    },
    
    // 预加载图片
    preloadImages() {
      this.slideshowImages.forEach(url => {
        const img = new Image()
        img.src = url
      })
    }
  },
  
  mounted() {
    document.title = '石上佛韵 - 首页'
    this.loadArtifacts()
    this.preloadImages()
    this.startAutoPlay()
  },
  
  beforeUnmount() {
    this.stopAutoPlay()
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

/* 全屏轮播区域 */
.hero-slideshow {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  margin-bottom: 2rem;
}

.slideshow-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 1s ease-in-out;
  z-index: 1;
}

.slideshow-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 2;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 1200px;
  text-align: center;
  color: white;
  z-index: 3;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 700;
  margin-bottom: 0.25rem;
  letter-spacing: 0.1em;
}

.hero-subtitle {
  font-size: clamp(1.2rem, 4vw, 2rem);
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  font-size: 1.4rem;
  margin: 1.5rem 0;
}

.hero-tag {
  border-left: 4px solid #ffd700;
  padding-left: 1rem;
}

.hero-english {
  font-size: 1.1rem;
  font-style: italic;
  margin-bottom: 2rem;
  opacity: 0.9;
}

/* 导航标签 */
.nav-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.8rem;
  margin: 2rem 0;
}

.nav-tag {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 40px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-tag:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: #ffd700;
  transform: translateY(-2px);
}

/* 搜索栏 */
.search-container {
  max-width: 600px;
  margin: 2rem auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.search-input {
  flex: 1 1 250px;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 40px 0 0 40px;
  font-size: 1rem;
  outline: none;
  background: rgba(255, 255, 255, 0.9);
}

.search-input:focus {
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.3);
}

.search-button {
  padding: 0.8rem 2rem;
  background: #ffd700;
  color: #2c3e50;
  border: none;
  border-radius: 0 40px 40px 0;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  background: #e6c200;
  transform: translateX(-2px);
}

/* 轮播指示器 */
.slide-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 4;
}

.dot {
  width: 12px;
  height: 12px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

.dot:hover {
  background: rgba(255, 255, 255, 0.8);
}

.dot.active {
  background: #ffd700;
  transform: scale(1.2);
}

/* 敦煌瑰宝区域 */
.treasures-section {
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 2rem;
}

.section-title {
  text-align: center;
  color: #D4AF37;
  margin-bottom: 24px;
  font-size: 2rem;
  font-weight: 700;
}

.artifacts-list {
  display: grid;
  gap: 20px;
}

.artifact-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.artifact-item:hover {
  background: rgba(0, 0, 0, 0.3);
  transform: translateX(8px);
  border-color: rgba(255, 215, 0, 0.5);
}

.artifact-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  margin-right: 16px;
  flex-shrink: 0;
}

.artifact-info {
  flex: 1;
}

.artifact-name {
  margin: 0;
  color: #D4AF37;
  font-size: 1.2rem;
  font-weight: 600;
}

.artifact-desc {
  margin: 6px 0 0;
  font-size: 0.95rem;
  opacity: 0.9;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.8);
}

.no-data {
  text-align: center;
  padding: 3rem;
}

.no-data p {
  opacity: 0.7;
  margin-bottom: 1rem;
}

.init-button {
  background: rgba(212, 175, 55, 0.2);
  color: #D4AF37;
  border: 1px solid #D4AF37;
  padding: 0.8rem 2rem;
  border-radius: 24px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.init-button:hover {
  background: rgba(212, 175, 55, 0.3);
  transform: translateY(-2px);
}

.view-collection {
  text-align: center;
  margin-top: 24px;
}

.collection-link {
  color: #D4AF37;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.collection-link:hover {
  color: #ffd700;
  transform: scale(1.05);
  display: inline-block;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
  }
  
  .hero-tags {
    flex-direction: column;
    gap: 1rem;
    font-size: 1.2rem;
  }
  
  .nav-tags {
    gap: 0.6rem;
  }
  
  .nav-tag {
    padding: 0.4rem 1.2rem;
    font-size: 0.9rem;
  }
  
  .search-container {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .search-input {
    border-radius: 40px;
    width: 100%;
  }
  
  .search-button {
    border-radius: 40px;
    width: 100%;
  }
  
  .artifact-item {
    flex-direction: column;
    text-align: center;
  }
  
  .artifact-image {
    width: 100px;
    height: 100px;
    margin-right: 0;
    margin-bottom: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-tags {
    font-size: 1rem;
  }
  
  .nav-tags {
    gap: 0.5rem;
  }
  
  .nav-tag {
    padding: 0.3rem 1rem;
    font-size: 0.85rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .treasures-section {
    padding: 1rem;
  }
}

/* 加载动画 */
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

.hero-content {
  animation: fadeInUp 1s ease;
}

.artifact-item {
  animation: fadeInUp 0.6s ease;
}

.artifact-item:nth-child(1) { animation-delay: 0.1s; }
.artifact-item:nth-child(2) { animation-delay: 0.2s; }
.artifact-item:nth-child(3) { animation-delay: 0.3s; }
</style>