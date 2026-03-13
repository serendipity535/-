<template>
  <div class="about-us-container">
    <!-- 返回按钮，左上角 -->
    <div class="back-button">
      <p class="back-link" @click="goHome">&larr; 返回首页</p>
    </div>

    <!-- 卡片容器，内容居中 -->
    <div class="card-container">
      <h2 class="section-title">关于我们</h2>

      <img 
        src="/public/images/logo.png" 
        alt="头像" 
        class="logo-image"
        @error="handleImageError"
      >

      <h1 class="brand-name">{{ brandName }}</h1>

      <p class="version-info">{{ versionInfo }}</p>

      <div class="contact-section">
        <div class="contact-item">
          <div class="contact-label">联系我们</div>
          <div class="contact-value">{{ contactInfo.email }}</div>
        </div>

        <div class="contact-item">
          <div class="contact-label">商务合作</div>
          <div class="contact-value">{{ contactInfo.business }}</div>
        </div>

        <div class="contact-item">
          <div class="contact-label">内容合作</div>
          <div class="contact-value">{{ contactInfo.media }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutUs',
  data() {
    return {
      brandName: '石上佛韵',
      versionInfo: 'Version 2.0.2 build 23020222',
      contactInfo: {
        email: 'contact@huakai.cn',
        business: 'business@huakai.cn',
        media: 'media@huakai.cn'
      }
    }
  },
  methods: {
    handleImageError(event) {
      console.error('图片加载失败:', event.target.src)
    },
    goHome(){
      this.$router.push('/Home')
    }
  }
}
</script>

<style scoped>
.about-us-container {
  font-family: Arial, sans-serif;
  margin:0 auto;
  width:500px
}

.back-button {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem 0 0;
}

.back-link {
  font-size: 1.5rem;
  text-decoration: none;
  color: #b8860b;
}

.back-link:hover {
  color: #d4a017;
}

.card-container {
  max-width: 600px;
  margin: 0 auto 3rem;
  padding: 2rem;
  background-color: #654E45;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.section-title {
  font-size: 1rem;
  color: #b8860b;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 1rem;
}

.logo-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.brand-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: #b8860b;
  margin: 0 0 0.5rem;
}

.version-info {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 1.5rem;
}

.contact-section {
  margin-bottom: 2rem;
}

.contact-item {
  margin-bottom: 2rem;
}

.contact-label {
  font-weight: 600;
  color: #b8860b;
  margin-bottom: 0.2rem;
}

.contact-value {
  color: #FFFFFF;
  font-size: 1.1rem;
}
</style>