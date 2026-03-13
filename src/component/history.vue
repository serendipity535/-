<template>
  <div class="history-page">
    <router-link to="/Home" class="back-home-link">< 返回首页</router-link>

    <div class="history-container">
      <div class="image-container">
        <img 
          :src="historyData.image" 
          :alt="historyData.title"
          class="history-image"
          @error="handleImageError"
        >
      </div>

      <div class="section-title">
        <h1>{{ historyData.title }}</h1>
        <div class="en-sub">{{ historyData.enTitle }}</div>
      </div>

      <!-- 关键信息卡片 -->
      <div class="info-grid">
        <div 
          v-for="(info, index) in historyData.infoCards" 
          :key="index"
          class="info-card"
        >
          <div class="info-label">{{ info.label }}</div>
          <div class="info-value">
            {{ info.value }}
            <small>{{ info.enValue }}</small>
          </div>
        </div>
      </div>

      <div class="desc-section">
        <p 
          v-for="(paragraph, index) in historyData.description" 
          :key="index"
          v-html="paragraph"
        ></p>
        
        <!-- 区域标签 -->
        <div class="zone-tags">
          <span 
            v-for="(zone, index) in historyData.zones" 
            :key="index"
            class="zone-tag"
          >
            {{ zone }}
          </span>
        </div>
      </div>

      <hr>

      <!-- 相关推荐 -->
      <div v-if="historyData.relatedItems && historyData.relatedItems.length > 0" class="related-section">
        <h3 class="related-title">相关推荐</h3>
        <div class="related-grid">
          <div 
            v-for="(item, index) in historyData.relatedItems" 
            :key="index"
            class="related-item"
            @click="goToRelated(item.id)"
          >
            <img :src="item.image" :alt="item.title" class="related-image">
            <div class="related-info">
              <h4 class="related-name">{{ item.title }}</h4>
              <p class="related-desc">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'History',
  data() {
    return {
      historyData: {
        id: 1,
        title: '新疆库车·森木塞姆石窟',
        enTitle: 'Senmusaimu Grottoes · The Eastern Pearl of Qiuci',
        image: '/public/images/森木塞姆石窟.jpg',
        infoCards: [
          {
            label: '石窟流派',
            value: '龟兹系统',
            enValue: 'Qiuci Buddhist Art'
          },
          {
            label: '石窟年代',
            value: '4 — 9 世纪',
            enValue: '4th-9th Century'
          },
          {
            label: '现存规模',
            value: '57 个编号窟',
            enValue: '54–57 caves'
          }
        ],
        description: [
          '<strong>森木塞姆石窟</strong> 是龟兹境内现存位置最东、开凿时代较早、延续时间较长的一处石窟群。其开凿始于公元4-5世纪（南北朝时期），历经隋唐，延续至高昌回鹘时期（约至14世纪)。约11世纪之后，因伊斯兰教势力深入，石窟寺被废弃并遭破坏。',
          '1903年，日本人渡边哲信到此考察了35个石窟，写下《西域旅行日记》，森木塞姆石窟开始为现代学界所知。此后，1906年至1915年间，德国考察队两次到访，研究、揭取、盗走壁画，运回德国博物馆收藏。2008年以来，克孜尔石窟研究所联合中国文化遗产研究院开始用科学方法对石窟进行修复。2022年的保护修复项目完成了包括森木塞姆石窟在内的41个洞窟壁画的修复工作。',
          '洞窟分布在马蹄形的山谷里，按地理位置可分为 <strong>东、南、西、北、中</strong> 5个区，现有编号洞窟57个。中区中央为一地面寺院遗址。',
          '森木塞姆石窟是龟兹石窟的重要组成部分，代表了4至5世纪西域佛教艺术的杰出创造和较高成就，保存了大量的历史、文化、艺术信息，是不可多得的人类文化遗产。其壁画题材、风格以及建筑形制对研究西域佛教传播、龟兹文明及中西文化交流具有极其珍贵的价值。'
        ],
        zones: ['东区', '南区', '西区', '北区', '中区 · 地面寺院'],
        relatedItems: [
          {
            id: 2,
            title: '克孜尔石窟',
            description: '龟兹石窟的代表性石窟群',
            image: '/public/images/森木塞姆石窟.jpg'
          },
          {
            id: 3,
            title: '库木吐拉石窟',
            description: '龟兹石窟艺术的重要遗存',
            image: '/public/images/森木塞姆石窟.jpg'
          }
        ]
      }
    }
  },
  methods: {
    handleImageError(event) {
      console.error('图片加载失败:', event.target.src)
    },
    
    goToRelated(id) {
      this.$router.push(`/history/${id}`)
    },
    
    async loadHistoryData(id) {
      try {
        // 这里替换为实际的API调用
        // const response = await fetch(`/api/history/${id}`)
        // const data = await response.json()
        // this.historyData = data
        
        // 模拟API调用
        console.log('加载历史数据:', id)
        
      } catch (error) {
        console.error('加载历史数据失败:', error)
      }
    }
  },
  
  mounted() {
    const id = this.$route.params.id || 1
    this.loadHistoryData(id)
    document.title = `${this.historyData.title} - 石上佛韵`
  },
  
  watch: {
    '$route.params.id': {
      handler(newId) {
        if (newId) {
          this.loadHistoryData(newId)
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.history-page {
  background: linear-gradient(145deg, #7a5a5a 0%, #6b4f4f 100%);
  min-height: 100vh;
  padding: 3rem 1.5rem;
  font-family: 'Segoe UI', 'Roboto', system-ui, sans-serif;
  color: #fff;
  position: relative;
  padding-bottom: 80px;
}

.back-home-link {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  color: #ffd700;
  font-size: 1.5rem;
  text-decoration: none;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.4rem 1.2rem;
  border-radius: 40px;
  border: 1px solid rgba(255, 215, 0, 0.5);
  backdrop-filter: blur(5px);
  transition: 0.2s;
  z-index: 10;
}

.back-home-link:hover {
  background: #ffd700;
  color: #1e2b3a;
  border-color: #ffd700;
}

.history-container {
  max-width: 1100px;
  margin: 0 auto;
  background: rgba(20, 30, 40, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 3rem 3rem 2rem 2rem;
  border: 1px solid rgba(255, 215, 0, 0.25);
  box-shadow: 0 25px 45px -12px rgba(0, 0, 0, 0.6);
  padding: 2.8rem 2.5rem;
}

.section-title {
  border-left: 6px solid #ffd700;
  padding-left: 1.5rem;
  margin-bottom: 2rem;
}

.section-title h1 {
  font-size: 3rem;
  font-weight: 600;
  letter-spacing: 2px;
  margin: 0;
  line-height: 1.2;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

.section-title .en-sub {
  font-size: 1.2rem;
  color: #cfd9e6;
  font-style: italic;
  margin-top: 0.4rem;
  opacity: 0.9;
}

.image-container {
  margin: 0 0 2.5rem 0;
  text-align: center;
}

.history-image {
  max-width: 100%;
  height: auto;
  border-radius: 2rem;
  border: 2px solid rgba(255, 215, 0, 0.4);
  box-shadow: 0 20px 30px -10px rgba(0, 0, 0, 0.7);
  display: inline-block;
  transition: transform 0.3s ease;
}

.history-image:hover {
  transform: scale(1.02);
}

.info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1.8rem;
  margin: 2.8rem 0 2.5rem 0;
  justify-content: center;
}

.info-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 40px;
  padding: 1.2rem 2rem;
  min-width: 180px;
  text-align: center;
  transition: transform 0.2s ease, border-color 0.2s;
  box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.5);
  cursor: default;
}

.info-card:hover {
  border-color: #ffd700;
  transform: translateY(-4px);
  background: rgba(255, 215, 0, 0.08);
}

.info-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #ffd700;
  font-weight: 400;
}

.info-value {
  font-size: 1.7rem;
  font-weight: 600;
  margin-top: 0.4rem;
  color: #fff;
  line-height: 1.3;
}

.info-value small {
  font-size: 1rem;
  font-weight: 300;
  color: #c0cbd9;
}

.desc-section {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 2.5rem;
  padding: 2rem 2.5rem;
  margin: 2.5rem 0 2rem 0;
  border: 1px solid rgba(255, 215, 0, 0.2);
  font-size: 1.2rem;
  line-height: 1.7;
  color: #f0f3f8;
  text-align: justify;
}

.desc-section p {
  margin: 1.2rem 0;
}

.desc-section strong {
  color: #ffd700;
  font-weight: 500;
}

.zone-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.8rem;
  justify-content: center;
}

.zone-tag {
  background: rgba(255, 215, 0, 0.18);
  backdrop-filter: blur(4px);
  color: #fff;
  padding: 0.5rem 2rem;
  border-radius: 40px;
  border: 1px solid rgba(255, 215, 0, 0.5);
  font-weight: 500;
  font-size: 1.1rem;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.zone-tag:hover {
  background: rgba(255, 215, 0, 0.3);
  transform: translateY(-2px);
}

hr {
  border: 0.5px solid rgba(255, 215, 0, 0.2);
  margin: 2rem 0;
}

/* 相关推荐 */
.related-section {
  margin-top: 2rem;
}

.related-title {
  font-size: 1.5rem;
  color: #ffd700;
  margin-bottom: 1.5rem;
  text-align: center;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.related-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1.5rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 215, 0, 0.2);
}

.related-item:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 215, 0, 0.5);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.related-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.related-info {
  padding: 1rem;
}

.related-name {
  font-size: 1.1rem;
  color: #fff;
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.related-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .history-page {
    padding: 2rem 1rem;
  }
  
  .history-container {
    padding: 2rem 1.5rem;
    border-radius: 2rem;
  }
  
  .section-title h1 {
    font-size: 2.2rem;
  }
  
  .section-title .en-sub {
    font-size: 1rem;
  }
  
  .back-home-link {
    font-size: 1.2rem;
    top: 1rem;
    left: 1rem;
    padding: 0.3rem 1rem;
  }
  
  .info-card {
    min-width: 140px;
    padding: 1rem 1.2rem;
  }
  
  .info-value {
    font-size: 1.4rem;
  }
  
  .desc-section {
    padding: 1.5rem;
    font-size: 1rem;
  }
  
  .zone-tag {
    padding: 0.4rem 1.5rem;
    font-size: 1rem;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .history-page {
    padding: 1.5rem 0.8rem;
  }
  
  .history-container {
    padding: 1.5rem 1rem;
    border-radius: 1.5rem;
  }
  
  .section-title h1 {
    font-size: 1.8rem;
  }
  
  .section-title .en-sub {
    font-size: 0.9rem;
  }
  
  .back-home-link {
    font-size: 1rem;
    top: 0.8rem;
    left: 0.8rem;
    padding: 0.3rem 0.8rem;
  }
  
  .info-grid {
    gap: 1rem;
  }
  
  .info-card {
    min-width: 120px;
    padding: 0.8rem 1rem;
  }
  
  .info-value {
    font-size: 1.2rem;
  }
  
  .info-value small {
    font-size: 0.85rem;
  }
  
  .desc-section {
    padding: 1.2rem;
    font-size: 0.95rem;
  }
  
  .zone-tag {
    padding: 0.3rem 1.2rem;
    font-size: 0.9rem;
  }
}

/* 加载动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.history-container {
  animation: fadeIn 0.6s ease;
}

/* 图片加载占位符 */
.history-image[loading] {
  background: linear-gradient(90deg, 
    rgba(255,255,255,0.1) 25%, 
    rgba(255,255,255,0.2) 50%, 
    rgba(255,255,255,0.1) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>