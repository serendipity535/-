<!-- src/components/NavBar.vue -->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 判断当前路由是否激活
const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// 导航项配置
const navItems = [
  { path: '/Home', label: '首页', target: '_self' },
  { path: '/member', label: '会员', target: '_blank' },
  { path: '/comments', label: '关注', target: '_self' },
  { path: '/about', label: '我的', target: '_self' }
]
</script>

<template>
  <nav class="nav-bar">
    <a 
      v-for="item in navItems" 
      :key="item.path"
      :href="item.path"
      class="nav-item"
      :class="{ active: isActive(item.path) }"
      :target="item.target"
    >
      <div class="nav-icon"></div>
      <div>{{ item.label }}</div>
    </a>
  </nav>
</template>

<style scoped>
.nav-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(212, 175, 55, 0.3);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
  padding: 0 10px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: all 0.3s ease;
  flex: 1;
  height: 100%;
  cursor: pointer;
}

.nav-item:hover {
  color: #D4AF37;
}

.nav-item.active {
  color: #D4AF37;
}

.nav-item.active .nav-icon {
  background: #D4AF37;
  box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
}

.nav-icon {
  width: 24px;
  height: 24px;
  background: rgba(212, 175, 55, 0.4);
  border-radius: 50%;
  margin-bottom: 4px;
  transition: all 0.3s ease;
}

.nav-item div:last-child {
  font-size: 12px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-bar {
    height: 55px;
  }
  
  .nav-icon {
    width: 22px;
    height: 22px;
  }
}

@media (max-width: 480px) {
  .nav-bar {
    height: 50px;
  }
  
  .nav-icon {
    width: 20px;
    height: 20px;
  }
  
  .nav-item div:last-child {
    font-size: 11px;
  }
}
</style>