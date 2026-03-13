<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './component/Navbar.vue'

const route = useRoute()

// 动态设置页面标题
const setPageTitle = () => {
  if (route.meta.title) {
    document.title = route.meta.title
  }
}

// 监听路由变化
watch(() => route.path, () => {
  setPageTitle()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// 页面加载时设置标题
onMounted(() => {
  setPageTitle()
})
</script>

<template>
  <div id="app">
    <!-- 主内容区 -->
    <main class="main-content">
      <router-view />
    </main>
    
    <!-- 底部导航栏 -->
   <Navbar></Navbar>
  </div>
</template>

<style>
/* 全局样式 - 不要加scoped */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: 'Segoe UI', 'Roboto', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.main-content {
  min-height: 100vh;
  padding-bottom: 80px; /* 为导航栏留出空间 */
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.7);
}

/* 全局链接样式 */
a {
  color: #D4AF37;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #ffd700;
}

/* 全局按钮样式 */
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  border: none;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #D4AF37 0%, #b8960c 100%);
  color: #1a1a2e;
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
  background: transparent;
  color: #D4AF37;
  border: 1px solid #D4AF37;
}

.btn-secondary:hover {
  background: rgba(212, 175, 55, 0.1);
}

/* 全局卡片样式 */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(212, 175, 55, 0.2);
}

/* 全局表单样式 */
.form-container {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  padding: 2.5rem 2rem;
}

.form-title {
  text-align: center;
  font-size: 1.8rem;
  color: #D4AF37;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
}

.input-group input {
  width: 100%;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #D4AF37;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.input-group input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* 全局提示样式 */
.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.alert-success {
  background: rgba(46, 125, 50, 0.3);
  color: #a5d6a7;
  border: 1px solid rgba(76, 175, 80, 0.5);
}

.alert-error {
  background: rgba(158, 43, 43, 0.3);
  color: #ef9a9a;
  border: 1px solid rgba(244, 67, 54, 0.5);
}

.alert-warning {
  background: rgba(255, 152, 0, 0.3);
  color: #ffe0b2;
  border: 1px solid rgba(255, 152, 0, 0.5);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding-bottom: 70px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding-bottom: 65px;
  }
}
</style>