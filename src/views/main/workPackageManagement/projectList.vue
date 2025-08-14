<template>
  <div class="project-list-container">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 顶部工具栏 -->
      <div class="header-toolbar">
        <div class="toolbar-left">
          <div class="breadcrumb">
            <el-icon><ArrowRight /></el-icon>
            <span>项目列表</span>
          </div>
          <div class="search-section">
            <span>搜索</span>
            <el-input 
              v-model="searchKeyword" 
              placeholder="" 
              class="search-input"
              clearable
            >
              <template #suffix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
        
        <div class="toolbar-right">
          <div class="filter-section">
            <span>责任人：</span>
            <el-select v-model="selectedResponsible" placeholder="全部" class="filter-select">
              <el-option label="全部" value=""></el-option>
              <el-option label="王敏" value="王敏"></el-option>
              <el-option label="张三" value="张三"></el-option>
              <el-option label="刘强" value="刘强"></el-option>
            </el-select>
            
            <span>状态：</span>
            <el-select v-model="selectedStatus" placeholder="全部" class="filter-select">
              <el-option label="全部" value=""></el-option>
              <el-option label="待派发" value="待派发"></el-option>
              <el-option label="进行中" value="进行中"></el-option>
              <el-option label="已完成" value="已完成"></el-option>
            </el-select>
          </div>
          
          <div class="action-buttons">
            <el-button type="success" class="create-btn">
              同步至基于模型的设计与管理系统
            </el-button>
            <el-button type="primary" class="create-project-btn">
              完成项目
            </el-button>
            <el-button type="primary" class="create-project-btn">
              创建项目
            </el-button>
          </div>
          
          <div class="view-controls">
            <el-icon><Menu /></el-icon>
            <el-icon><Grid /></el-icon>
          </div>
        </div>
      </div>

      <!-- 项目列表表格 -->
      <div class="table-container">
        <el-table 
          :data="projectList" 
          style="width: 100%"
          class="project-table"
          :header-cell-style="{ background: '#f8f9fa', color: '#606266' }"
        >
          <el-table-column prop="name" label="项目名称" min-width="200">
            <template #default="{ row }">
              <div class="project-name">{{ row.name }}</div>
            </template>
          </el-table-column>
          
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag 
                :type="getStatusType(row.status)" 
                size="small"
                class="status-tag"
              >
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          
          <el-table-column prop="taskCount" label="任务数量" width="100" align="center">
            <template #default="{ row }">
              <span>{{ row.taskCount }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="progress" label="进度" width="120" align="center">
            <template #default="{ row }">
              <div class="progress-container">
                <el-progress 
                  :percentage="row.progress" 
                  :color="getProgressColor(row.progress)"
                  :stroke-width="6"
                  :show-text="false"
                />
                <span class="progress-text">{{ row.progress }}%</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="responsible" label="负责人" width="100" align="center">
            <template #default="{ row }">
              <span>{{ row.responsible }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="department" label="作战方向" width="120" align="center">
            <template #default="{ row }">
              <span>{{ row.department }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="specialty" label="任务类型" width="200">
            <template #default="{ row }">
              <span>{{ row.specialty }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="source" label="来源" width="80" align="center">
            <template #default="{ row }">
              <span>{{ row.source }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="level" label="密级" width="80" align="center">
            <template #default="{ row }">
              <span>{{ row.level }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="period" label="项目周期" width="180" align="center">
            <template #default="{ row }">
              <div class="period-info">
                <div>{{ row.period.start }} - {{ row.period.end }}</div>
                <div v-if="row.period.actual" class="actual-period">
                  实际 {{ row.period.actual.start }} - {{ row.period.actual.end }}
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="requirement" label="活动要求" width="120" align="center">
            <template #default="{ row }">
              <span>{{ row.requirement }}</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="description" label="场景描述" width="120" align="center">
            <template #default="{ row }">
              <span>{{ row.description }}</span>
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="200" align="center" fixed="right">
            <template #default="{ row }">
              <div class="action-buttons-cell">
                <el-button size="small" type="text" @click="editProject(row)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button size="small" type="text" @click="copyProject(row)">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
                <el-button size="small" type="text" @click="viewProject(row)">
                  <el-icon><View /></el-icon>
                </el-button>
                <el-button size="small" type="text" @click="deleteProject(row)" class="delete-btn">
                  <el-icon><Delete /></el-icon>
                </el-button>
                <el-button size="small" type="text" @click="shareProject(row)">
                  <el-icon><Share /></el-icon>
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { 
  ArrowRight, 
  Search, 
  Menu, 
  Grid,
  Edit,
  CopyDocument,
  View,
  Delete,
  Share
} from '@element-plus/icons-vue'

// 搜索和筛选
const searchKeyword = ref('')
const selectedResponsible = ref('')
const selectedStatus = ref('')

// 项目列表数据
const projectList = ref([
  {
    id: 1,
    name: 'XXX体系研发项目',
    status: '待派发',
    taskCount: '0/5',
    progress: 0,
    responsible: '王敏',
    department: '南海',
    specialty: '侦查、进攻、防御、信息系统',
    source: '来源1',
    level: '公开',
    period: {
      start: '2024.2.8',
      end: '2025.08.28'
    },
    requirement: '这里是活动要求',
    description: '这里是场景描述'
  },
  {
    id: 2,
    name: 'XXX-25-06体系研发项目',
    status: '进行中',
    taskCount: '4/6',
    progress: 61,
    responsible: '张三',
    department: '南海',
    specialty: '侦查、进攻、防御、信息系统',
    source: '来源2',
    level: '内部',
    period: {
      start: '2024.2.8',
      end: '2025.08.28'
    },
    requirement: '这里是活动要求',
    description: '这里是场景描述'
  },
  {
    id: 3,
    name: 'XXX-0010体系研发项目',
    status: '已完成',
    taskCount: '5/5',
    progress: 100,
    responsible: '刘强',
    department: '中印',
    specialty: '侦查、进攻、防御、信息系统',
    source: '来源3',
    level: '秘密',
    period: {
      start: '2024.2.8',
      end: '2025.08.28',
      actual: {
        start: '2024.2.8',
        end: '2025.08.28'
      }
    },
    requirement: '这里是活动要求',
    description: '这里是场景描述'
  }
])

// 获取状态标签类型
const getStatusType = (status: string) => {
  switch (status) {
    case '待派发':
      return 'info'
    case '进行中':
      return 'warning'
    case '已完成':
      return 'success'
    default:
      return 'info'
  }
}

// 获取进度条颜色
const getProgressColor = (progress: number) => {
  if (progress === 0) return '#e4e7ed'
  if (progress < 50) return '#f56c6c'
  if (progress < 80) return '#e6a23c'
  return '#67c23a'
}

// 操作方法
const editProject = (row: any) => {
  console.log('编辑项目', row)
}

const copyProject = (row: any) => {
  console.log('复制项目', row)
}

const viewProject = (row: any) => {
  console.log('查看项目', row)
}

const deleteProject = (row: any) => {
  console.log('删除项目', row)
}

const shareProject = (row: any) => {
  console.log('分享项目', row)
}

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="less" scoped>
.project-list-container {
  display: flex;
  height: 100vh;
  background: #f5f5f5;

  // 主要内容区域
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    // 顶部工具栏
    .header-toolbar {
      background: #fff;
      padding: 16px 24px;
      border-bottom: 1px solid #e4e7ed;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .toolbar-left {
        display: flex;
        align-items: center;
        gap: 24px;

        .breadcrumb {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #303133;

          .el-icon {
            margin-right: 4px;
          }
        }

        .search-section {
          display: flex;
          align-items: center;
          gap: 8px;

          span {
            font-size: 14px;
            color: #606266;
          }

          .search-input {
            width: 200px;
          }
        }
      }

      .toolbar-right {
        display: flex;
        align-items: center;
        gap: 24px;

        .filter-section {
          display: flex;
          align-items: center;
          gap: 8px;

          span {
            font-size: 14px;
            color: #606266;
            white-space: nowrap;
          }

          .filter-select {
            width: 100px;
          }
        }

        .action-buttons {
          display: flex;
          gap: 8px;

          .create-btn {
            background: #67c23a;
            border-color: #67c23a;
            font-size: 12px;
            padding: 8px 12px;
            white-space: nowrap;
          }

          .create-project-btn {
            font-size: 14px;
            padding: 8px 16px;
          }
        }

        .view-controls {
          display: flex;
          gap: 8px;

          .el-icon {
            font-size: 18px;
            color: #909399;
            cursor: pointer;

            &:hover {
              color: #409eff;
            }
          }
        }
      }
    }

    // 表格容器
    .table-container {
      flex: 1;
      padding: 16px 24px;
      overflow: auto;

      .project-table {
        background: #fff;
        border-radius: 4px;

        :deep(.el-table__header-wrapper) {
          th {
            background: #f8f9fa !important;
            color: #606266 !important;
            font-weight: 500;
          }
        }

        .project-name {
          font-weight: 500;
          color: #303133;
        }

        .status-tag {
          border-radius: 12px;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 8px;

          .el-progress {
            flex: 1;
          }

          .progress-text {
            font-size: 12px;
            color: #606266;
            min-width: 35px;
          }
        }

        .period-info {
          font-size: 12px;

          .actual-period {
            color: #909399;
            margin-top: 2px;
          }
        }

        .action-buttons-cell {
          display: flex;
          gap: 4px;
          justify-content: center;

          .el-button {
            padding: 4px;

            &.delete-btn {
              color: #f56c6c;

              &:hover {
                background: #fef0f0;
              }
            }
          }
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .project-list-container {
    .main-content {
      .header-toolbar {
        .toolbar-right {
          .action-buttons {
            .create-btn {
              font-size: 11px;
              padding: 6px 10px;
            }
          }
        }
      }
    }
  }
}
</style>
