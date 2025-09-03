<template>
  <div class="system-overview-container">
    <div class="page-header">
      <h1 class="page-title">体系与系统整机协同服务</h1>
    </div>
    
    <div class="cards-container">
      <!-- 体系规划论证 -->
      <div class="system-card">
        <div class="card-header system-planning">
          <h2 class="card-title">体系规划论证</h2>
        </div>
        <div class="card-content">
          <div class="icon-container">
            <div class="system-icon planning-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="1" fill="currentColor"/>
                <circle cx="19" cy="7" r="1" fill="currentColor"/>
                <circle cx="5" cy="17" r="1" fill="currentColor"/>
                <circle cx="19" cy="17" r="1" fill="currentColor"/>
                <circle cx="5" cy="7" r="1" fill="currentColor"/>
                <path d="M13.73 7.26l5.01-5.01" stroke="currentColor" stroke-width="1"/>
                <path d="M10.27 16.74l-5.01 5.01" stroke="currentColor" stroke-width="1"/>
                <path d="M13.73 16.74l5.01 5.01" stroke="currentColor" stroke-width="1"/>
                <path d="M10.27 7.26l-5.01-5.01" stroke="currentColor" stroke-width="1"/>
              </svg>
            </div>
          </div>
          <div class="card-description">
            <p>体系研发任务的策划、执行，以及对体系研发数据查看</p>
          </div>
          <div class="card-action">
            <el-button 
              type="primary" 
              class="enter-system-btn"
              @click="enterPlanningSystem"
            >
              进入系统
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 虚实试验验证 -->
      <div class="system-card">
        <div class="card-header virtual-test">
          <h2 class="card-title">虚实试验验证</h2>
        </div>
        <div class="card-content">
          <div class="icon-container">
            <div class="system-icon test-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 2v6h6V2H9z" stroke="currentColor" stroke-width="2" fill="none"/>
                <path d="M9 8l-2 14h10l-2-14H9z" stroke="currentColor" stroke-width="2" fill="none"/>
                <circle cx="12" cy="14" r="2" stroke="currentColor" stroke-width="1"/>
                <path d="M12 12v4" stroke="currentColor" stroke-width="1"/>
              </svg>
            </div>
          </div>
          <div class="card-description">
            <p>需求实验验证任务管理以及实验数据查看</p>
          </div>
          <div class="card-action">
            <el-button 
              type="primary" 
              class="enter-system-btn disabled"
              disabled
            >
              进入系统
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 装备体系运用 -->
      <div class="system-card">
        <div class="card-header equipment-system">
          <h2 class="card-title">装备体系运用</h2>
        </div>
        <div class="card-content">
          <div class="icon-container">
            <div class="system-icon equipment-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
                <rect x="6" y="9" width="12" height="6" rx="1" stroke="currentColor" stroke-width="1" fill="none"/>
                <rect x="8" y="11" width="8" height="2" fill="currentColor"/>
                <circle cx="18" cy="4" r="1" fill="currentColor"/>
                <circle cx="20" cy="6" r="1" fill="currentColor"/>
              </svg>
            </div>
          </div>
          <div class="card-description">
            <p>XXXXXXXXX</p>
          </div>
          <div class="card-action">
            <el-button 
              type="primary" 
              class="enter-system-btn disabled"
              disabled
            >
              进入系统
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()

// 进入体系规划论证系统
const enterPlanningSystem = () => {
  // 这里可以根据实际需求跳转到对应的页面
  router.push('/main/dashboard')
}
</script>

<style lang="less" scoped>
.system-overview-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #3d7eaa 100%);
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-header {
  margin-bottom: 80px;
  text-align: center;
}

.page-title {
  color: #ffffff;
  font-size: 48px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 2px;
}

.cards-container {
  display: flex;
  gap: 40px;
  max-width: 1400px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}

.system-card {
  width: 400px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
}

.card-header {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 600;
  font-size: 20px;
  letter-spacing: 1px;

  &.system-planning {
    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
  }

  &.virtual-test {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  }

  &.equipment-system {
    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
  }
}

.card-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.card-content {
  padding: 40px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 320px;
}

.icon-container {
  margin-bottom: 30px;
}

.system-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #ffffff;

  svg {
    width: 40px;
    height: 40px;
  }

  &.planning-icon {
    background: rgba(79, 70, 229, 0.2);
  }

  &.test-icon {
    background: rgba(5, 150, 105, 0.2);
  }

  &.equipment-icon {
    background: rgba(220, 38, 38, 0.2);
  }
}

.card-description {
  margin-bottom: 40px;
  flex: 1;
  display: flex;
  align-items: center;

  p {
    color: #ffffff;
    font-size: 16px;
    line-height: 1.6;
    margin: 0;
    opacity: 0.9;
  }
}

.card-action {
  width: 100%;
}

.enter-system-btn {
  width: 180px;
  height: 44px;
  border-radius: 22px;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #ffffff;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;

  &:hover:not(.disabled) {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }

  &.disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
    cursor: not-allowed;
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: none;
      box-shadow: none;
    }
  }

  .arrow-icon {
    font-size: 18px;
    transition: transform 0.3s ease;
  }

  &:hover:not(.disabled) .arrow-icon {
    transform: translateX(3px);
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .cards-container {
    gap: 30px;
  }

  .system-card {
    width: 350px;
  }
}

@media (max-width: 768px) {
  .system-overview-container {
    padding: 40px 20px;
  }

  .page-title {
    font-size: 32px;
  }

  .cards-container {
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .system-card {
    width: 100%;
    max-width: 400px;
  }

  .card-content {
    padding: 30px 20px;
    min-height: 280px;
  }
}
</style>
