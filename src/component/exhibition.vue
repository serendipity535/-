<template>
  <div class="exhibition-container">
    <!-- 展会列表页面 -->
    <div v-if="!showDetail" class="exhibition-list">
      <!-- 返回按钮 + 标题栏 -->
      <div class="header-bar">
        <router-link to="/Home" class="back-button">&larr;</router-link>
        <h1 class="page-title">展会</h1>
        <div class="spacer"></div>
      </div>

      <!-- 轮播图 -->
      <div class="carousel-container">
        <div 
          class="carousel-track"
          ref="carouselTrack"
          @scroll="handleCarouselScroll"
        >
          <div 
            v-for="(slide, index) in carouselSlides" 
            :key="index"
            class="carousel-slide"
            :style="{ backgroundImage: `url(${slide.image})` }"
          ></div>
        </div>
        
        <!-- 轮播指示器 -->
        <div class="carousel-indicators">
          <div 
            v-for="(slide, index) in carouselSlides" 
            :key="index"
            class="indicator"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></div>
        </div>
      </div>

      <!-- 分类导航 -->
      <div class="category-nav">
        <a 
          v-for="(category, index) in categories" 
          :key="index"
          href="#"
          class="category-item"
          :class="{ active: activeCategory === index }"
          @click.prevent="handleCategoryClick(index)"
        >
          {{ category }}
        </a>
      </div>

      <!-- 最新展览板块 -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">最新展览</h2>
          <p class="view-more">
            查看更多 &gt;
          </p>
        </div>

        <div class="exhibition-grid">
          <div 
            v-for="exhibition in latestExhibitions" 
            :key="exhibition.id"
            class="exhibition-card"
            @click="goToDetail(exhibition.id)"
          >
            <div class="card-image-wrapper">
              <img 
                :src="exhibition.image" 
                :alt="exhibition.title"
                class="card-image"
                @error="handleImageError"
              >
              <div class="card-overlay">
                <h3 class="card-title">{{ exhibition.title }}</h3>
                <p class="card-subtitle">{{ exhibition.subtitle }}</p>
                <p class="card-date">{{ exhibition.date }}</p>
                <p class="card-location">{{ exhibition.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 附近的展板块 -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">附近的展</h2>
          <p class="view-more">
            查看更多 &gt;
          </p>
        </div>

        <div class="exhibition-grid">
          <div 
            v-for="exhibition in nearbyExhibitions" 
            :key="exhibition.id"
            class="exhibition-card"
            @click="goToDetail(exhibition.id)"
          >
            <div class="card-image-wrapper">
              <img 
                :src="exhibition.image" 
                :alt="exhibition.title"
                class="card-image"
                @error="handleImageError"
              >
              <div class="card-overlay">
                <h3 class="card-title">{{ exhibition.title }}</h3>
                <p class="card-subtitle">{{ exhibition.subtitle }}</p>
                <p class="card-date">{{ exhibition.date }}</p>
                <p class="card-location">{{ exhibition.location }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 近期热门板块 -->
      <div class="section section-hot">
        <h2 class="section-title">近期热门</h2>
        <div class="hot-list">
          <div 
            v-for="(hot, index) in hotExhibitions" 
            :key="index"
            class="hot-item"
            @click="goToDetail(hot.id)"
          >
            {{ hot.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 展会详情页面 -->
    <div v-else class="exhibition-detail">
      <!-- 头部导航 -->
      <div class="header-bar">
        <button @click="goBackToList" class="back-button">&larr;</button>
        <h1 class="page-title">展会详情</h1>
        <div class="spacer"></div>
      </div>

      <!-- 展会封面 -->
      <div class="cover-image">
        <img 
          :src="currentExhibition.image" 
          :alt="currentExhibition.title"
          @error="handleImageError"
        >
      </div>

      <!-- 展会信息 -->
      <div class="exhibition-info">
        <h2 class="exhibition-title">{{ currentExhibition.title }}</h2>
        <p class="exhibition-subtitle">{{ currentExhibition.subtitle }}</p>
        
        <div class="info-section">
          <h3 class="info-title">展览时间</h3>
          <p class="info-content">{{ currentExhibition.date }}</p>
        </div>
        
        <div class="info-section">
          <h3 class="info-title">展览地点</h3>
          <p class="info-content">{{ currentExhibition.location }}</p>
        </div>
        
        <div class="info-section">
          <h3 class="info-title">展览简介</h3>
          <p class="info-content">{{ currentExhibition.description }}</p>
        </div>
        
        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button @click="handleCollect" class="btn-collect">
            {{ isCollected ? '❤️ 已收藏' : '♡ 收藏' }}
          </button>
          <button @click="handleShare" class="btn-share">
            分享
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Exhibition',
  data() {
    return {
      showDetail: false,
      currentSlide: 0,
      activeCategory: 0,
      isCollected: false,
      carouselSlides: [
        {
          image: '/public/images/ssfy01.jpg',
          title: '展会1'
        },
        {
          image: '/public/images/senmusem.jpg',
          title: '展会2'
        },
        {
          image: '/public/images/longmen.jpg',
          title: '展会3'
        }
      ],
      categories: ['分类看展', '导览', '讲解', '衍生品'],
      latestExhibitions: [
        {
          id: 1,
          title: '五星出东方',
          subtitle: '和田历史文物展',
          date: '12.30 - 02.05',
          location: '中华世纪坛二层世纪大厅',
          image: '/public/images/和田历史文物展.jpg',
          description: '本次展览精选和田地区出土的历史文物，展示了丝绸之路上的文化交流与文明互鉴。展览包括青铜器、玉器、纺织品等各类珍贵文物，全面呈现了和田地区的历史文化底蕴。'
        },
        {
          id: 2,
          title: '陕西非遗皮影展',
          subtitle: '影戏人间',
          date: '12.30 - 02.05',
          location: '地点待定',
          image: '/public/images/影戏人间.jpg',
          description: '皮影戏是中国民间古老的传统艺术，本次展览展示了陕西地区精美的皮影作品，让观众感受这一非物质文化遗产的独特魅力。'
        },
        {
          id: 3,
          title: '佛教石刻文物展',
          subtitle: '佛光蜀韵',
          date: '07.17 - 10.20',
          location: '深圳博物馆古代艺术馆',
          image: '/public/images/佛教石刻文物展.jpg',
          description: '展览汇集了四川地区出土的佛教石刻文物，展现了佛教艺术在蜀地的发展历程和独特风格。'
        }
      ],
      nearbyExhibitions: [
        {
          id: 4,
          title: 'The Craft of Metalwork',
          subtitle: '和田历史文物展',
          date: '12.30 - 02.05',
          location: '地点暂定',
          image: '/public/images/附近的展1.jpg',
          description: '本次展览展示了亚欧大陆早期金属艺术的发展历程，呈现了不同文明间的艺术交流与互鉴。'
        },
        {
          id: 5,
          title: '智慧之光',
          subtitle: '中医药文化展',
          date: '12.30 - 02.05',
          location: '地点暂定',
          image: '/public/images/中医药文化展.jpg',
          description: '展览通过珍贵文物和现代科技手段，展示了中医药文化的博大精深和传承发展。'
        },
        {
          id: 6,
          title: '玉见华夏',
          subtitle: '中国古文献四大发现展',
          date: '12.30 - 02.05',
          location: '国家典籍博物馆',
          image: '/public/images/中国古文献四大发现展.jpg',
          description: '展览展示了甲骨文、简牍、敦煌遗书、明清档案等中国古文献的四大发现，让观众领略中华文明的悠久历史。'
        }
      ],
      hotExhibitions: [
        {
          id: 7,
          name: '热门展1'
        },
        {
          id: 8,
          name: '热门展2'
        },
        {
          id: 9,
          name: '热门展3'
        }
      ],
      currentExhibition: {
        id: null,
        title: '',
        subtitle: '',
        date: '',
        location: '',
        description: '',
        image: ''
      }
    }
  },
  methods: {
    // 轮播图相关方法
    handleCarouselScroll() {
      const track = this.$refs.carouselTrack
      const slideWidth = track.offsetWidth
      this.currentSlide = Math.round(track.scrollLeft / slideWidth)
    },
    
    goToSlide(index) {
      const track = this.$refs.carouselTrack
      const slideWidth = track.offsetWidth
      track.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      })
    },
    
    // 分类导航
    handleCategoryClick(index) {
      this.activeCategory = index
      console.log('选择分类:', this.categories[index])
    },
    
    // 跳转到详情
    goToDetail(exhibitionId) {
      // 查找展会数据
      const allExhibitions = [
        ...this.latestExhibitions,
        ...this.nearbyExhibitions,
        ...this.hotExhibitions
      ]
      
      const exhibition = allExhibitions.find(e => e.id === exhibitionId)
      
      if (exhibition) {
        this.currentExhibition = exhibition
        this.showDetail = true
        document.title = `${exhibition.title} - 石上佛韵`
        this.checkCollectionStatus()
        window.scrollTo(0, 0)
      }
    },
    
    // 返回列表
    goBackToList() {
      this.showDetail = false
      document.title = '展会 - 石上佛韵'
      window.scrollTo(0, 0)
    },
    
    // 收藏功能
    checkCollectionStatus() {
      const collectedIds = JSON.parse(localStorage.getItem('collected_exhibitions') || '[]')
      this.isCollected = collectedIds.includes(this.currentExhibition.id)
    },
    
    handleCollect() {
      let collectedIds = JSON.parse(localStorage.getItem('collected_exhibitions') || '[]')
      
      if (this.isCollected) {
        collectedIds = collectedIds.filter(id => id !== this.currentExhibition.id)
        this.showSuccessMessage('已取消收藏')
      } else {
        collectedIds.push(this.currentExhibition.id)
        this.showSuccessMessage('收藏成功')
      }
      
      localStorage.setItem('collected_exhibitions', JSON.stringify(collectedIds))
      this.isCollected = !this.isCollected
    },
    
    // 分享功能
    handleShare() {
      if (navigator.share) {
        navigator.share({
          title: this.currentExhibition.title,
          text: this.currentExhibition.subtitle,
          url: window.location.href
        }).catch(console.error)
      } else {
        navigator.clipboard.writeText(window.location.href)
        this.showSuccessMessage('链接已复制到剪贴板')
      }
    },
    
    // 图片错误处理
    handleImageError(event) {
      console.error('图片加载失败:', event.target.src)
    },
    
    // Toast提示
    showSuccessMessage(message) {
      const toast = document.createElement('div')
      toast.className = 'toast'
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
    
    // 自动轮播
    startAutoPlay() {
      this.autoPlayTimer = setInterval(() => {
        const nextSlide = (this.currentSlide + 1) % this.carouselSlides.length
        this.goToSlide(nextSlide)
      }, 5000)
    },
    
    stopAutoPlay() {
      if (this.autoPlayTimer) {
        clearInterval(this.autoPlayTimer)
      }
    },
    
    // 获取地理位置
    async getLocation() {
      try {
        if (navigator.geolocation) {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject)
          })
          console.log('用户位置:', position.coords)
        }
      } catch (error) {
        console.error('获取位置失败:', error)
      }
    }
  },
  
  mounted() {
    this.startAutoPlay()
    this.getLocation()
    
    const track = this.$refs.carouselTrack
    if (track) {
      track.addEventListener('scroll', this.handleCarouselScroll)
    }
  },
  
  beforeUnmount() {
    this.stopAutoPlay()
    
    const track = this.$refs.carouselTrack
    if (track) {
      track.removeEventListener('scroll', this.handleCarouselScroll)
    }
  }
}
</script>

<style scoped>
.exhibition-container {
  background-color: white;
  min-height: 100vh;
  padding-bottom: 80px;
}

/* 头部导航栏 */
.header-bar {
  position: sticky;
  top: 0;
  padding: 1rem;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  z-index: 100;
}

.back-button {
  font-size: 1.5rem;
  background: none;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 0;
  margin-right: 1rem;
  text-decoration: none;
}

.back-button:hover {
  color: #b8860b;
}

.page-title {
  flex: 1;
  text-align: center;
  font-size: 1.8rem;
  margin: 0;
  color: #333;
}

.spacer {
  width: 2rem;
}

/* 轮播图 */
.carousel-container {
  width: 100%;
  height: 200px;
  overflow: hidden;
  margin: 1rem 0;
  position: relative;
}

.carousel-track {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}

.carousel-slide {
  min-width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  scroll-snap-align: start;
  flex-shrink: 0;
}

.carousel-indicators {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #fff;
  transform: scale(1.2);
}

/* 分类导航 */
.category-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 0.5rem 1rem;
  background-color: #f8f8f8;
  margin: 1rem 0;
}

.category-item {
  padding: 0.5rem 1rem;
  color: #333;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  font-weight: 500;
}

.category-item:hover {
  color: #b8860b;
}

.category-item.active {
  color: #b8860b;
  border-bottom-color: #b8860b;
}

/* 板块通用样式 */
.section {
  padding: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.5rem;
  margin: 0;
  color: #333;
  font-weight: 700;
}

.view-more {
  color: #b8860b;
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.view-more:hover {
  color: #d4a017;
}

/* 展览卡片网格 */
.exhibition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.exhibition-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.exhibition-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 66.67%;
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
}

.card-title {
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.card-subtitle {
  margin: 0.2rem 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.card-date {
  font-size: 0.9rem;
  margin: 0.2rem 0;
  opacity: 0.8;
}

.card-location {
  font-size: 0.9rem;
  margin: 0.2rem 0 0;
  opacity: 0.8;
}

/* 热门展览列表 */
.section-hot {
  margin-bottom: 2rem;
}

.hot-list {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding-bottom: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: #b8860b #f0f0f0;
}

.hot-list::-webkit-scrollbar {
  height: 6px;
}

.hot-list::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 3px;
}

.hot-list::-webkit-scrollbar-thumb {
  background: #b8860b;
  border-radius: 3px;
}

.hot-item {
  min-width: 150px;
  background: #5D3A1A;
  border-radius: 8px;
  padding: 0.8rem;
  text-align: center;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hot-item:hover {
  background: #7a4d24;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(93, 58, 26, 0.3);
}

/* 展会详情页面样式 */
.exhibition-detail {
  background-color: white;
  min-height: 100vh;
}

.cover-image {
  width: 100%;
  padding-top: 66.67%;
  position: relative;
  overflow: hidden;
}

.cover-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.exhibition-info {
  padding: 1.5rem;
}

.exhibition-title {
  font-size: 1.8rem;
  color: #333;
  margin: 0 0 0.5rem;
  font-weight: 700;
}

.exhibition-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin: 0 0 1.5rem;
}

.info-section {
  margin-bottom: 1.5rem;
}

.info-title {
  font-size: 1rem;
  color: #b8860b;
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.info-content {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.action-buttons button {
  flex: 1;
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-collect {
  background: var(--dunhuang-gold, #D4AF37);
  color: var(--dunhuang-bg, #1a1a2e);
}

.btn-collect:hover {
  background: #b5952f;
  transform: translateY(-2px);
}

.btn-share {
  background: #f0f0f0;
  color: #333;
}

.btn-share:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 16px 24px;
  border-radius: 8px;
  z-index: 10000;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.toast.show {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }
  
  .carousel-container {
    height: 180px;
  }
  
  .carousel-slide {
    height: 180px;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .exhibition-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .card-subtitle,
  .card-date,
  .card-location {
    font-size: 0.85rem;
  }
  
  .category-nav {
    justify-content: flex-start;
    overflow-x: auto;
    padding: 0.5rem;
  }
  
  .category-item {
    white-space: nowrap;
    padding: 0.5rem 0.8rem;
  }
  
  .hot-item {
    min-width: 120px;
    padding: 0.6rem;
    font-size: 0.9rem;
  }
  
  .exhibition-info {
    padding: 1rem;
  }
  
  .exhibition-title {
    font-size: 1.5rem;
  }
  
  .exhibition-subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .header-bar {
    padding: 0.8rem;
  }
  
  .back-button {
    font-size: 1.3rem;
  }
  
  .page-title {
    font-size: 1.3rem;
  }
  
  .carousel-container {
    height: 160px;
    margin: 0.5rem 0;
  }
  
  .carousel-slide {
    height: 160px;
  }
  
  .section {
    padding: 0.8rem;
  }
  
  .section-title {
    font-size: 1.2rem;
  }
  
  .exhibition-grid {
    gap: 0.8rem;
  }
  
  .card-overlay {
    padding: 0.8rem;
  }
}
</style>