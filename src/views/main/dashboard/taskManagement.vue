<template>
  <div class="task-management-container">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 顶部统计卡片 -->
      <div class="stats-cards">
        <div 
          class="stat-card" 
          :class="{ active: selectedTaskType === 'allTask' }"
          @click="selectTaskType('allTask')"
        >
          <div class="stat-number">{{ taskStats.allTask }}</div>
          <div class="stat-label">总任务</div>
          <div class="stat-icon">
            <el-icon><Folder /></el-icon>
          </div>
        </div>
        <div 
          class="stat-card" 
          :class="{ active: selectedTaskType === 'submitTaskNum' }"
          @click="selectTaskType('submitTaskNum')"
        >
          <div class="stat-number">{{ taskStats.submitTaskNum }}</div>
          <div class="stat-label">待接收</div>
          <div class="stat-icon">
            <el-icon><Download /></el-icon>
          </div>
        </div>
        <div 
          class="stat-card" 
          :class="{ active: selectedTaskType === 'ongoingTaskNum' }"
          @click="selectTaskType('ongoingTaskNum')"
        >
          <div class="stat-number">{{ taskStats.ongoingTaskNum }}</div>
          <div class="stat-label">进行中</div>
          <div class="stat-icon">
            <el-icon><Loading /></el-icon>
          </div>
        </div>
        <div 
          class="stat-card" 
          :class="{ active: selectedTaskType === 'auditTaskNum' }"
          @click="selectTaskType('auditTaskNum')"
        >
          <div class="stat-number">{{ taskStats. auditTaskNum }}</div>
          <div class="stat-label">待审核</div>
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
        </div>
        <div 
          class="stat-card" 
          :class="{ active: selectedTaskType === 'delayTaskNum' }"
          @click="selectTaskType('delayTaskNum')"
        >
          <div class="stat-number">{{ taskStats.delayTaskNum }}</div>
          <div class="stat-label">超期任务</div>
          <div class="stat-icon">
            <el-icon><WarningFilled /></el-icon>
          </div>
        </div>
      </div>



      <!-- 体系研发任务 -->
      <div class="task-section">
        <div class="section-header">
          <h2 class="section-title">
            <el-icon><Flag /></el-icon>
            体系研发任务
          </h2>
          <div class="view-controls">
            <el-button-group>
              <el-button :type="viewMode === 'list' ? 'primary' : 'default'" @click="viewMode = 'list'">
                <el-icon><List /></el-icon>
              </el-button>
              <el-button :type="viewMode === 'grid' ? 'primary' : 'default'" @click="viewMode = 'grid'">
                <el-icon><Grid /></el-icon>
              </el-button>
            </el-button-group>
          </div>
        </div>

        <!-- 任务列表 -->
        <div class="task-list">
          <!-- 表头 -->
          <div class="task-header">
            <div class="header-cell task-name">任务名称</div>
            <div class="header-cell task-status">任务状态</div>
            <div class="header-cell task-assignee">责任人</div>
            <div class="header-cell task-schedule">计划完成时间</div>
            <div class="header-cell task-progress">活动进度</div>
            <div class="header-cell task-actions">操作</div>
          </div>

          <!-- 项目列表 -->
          <div class="project-list">
            <div 
              v-for="project in filteredProjectsList" 
              :key="project.id" 
              class="project-item"
            >
              <!-- 项目标题行 -->
              <div class="project-header" @click="toggleProject(project.id)">
                <el-icon class="expand-icon" :class="{ expanded: project.expanded }">
                  <ArrowRight />
                </el-icon>
                <span class="project-name">{{ project.name }}</span>
              </div>

              <!-- 项目任务列表 -->
              <div v-show="project.expanded" class="project-tasks">
                <div 
                  v-for="task in getFilteredTasks(project.tasks)" 
                  :key="task.id" 
                  class="task-row"
                >
                  <div class="task-cell task-name">
                    <div class="task-type-icon" :class="task.type">
                      <span>{{ getTaskTypeLabel(task.type) }}</span>
                    </div>
                    <span class="task-title">{{ task.name }}</span>
                  </div>
                  <div class="task-cell task-status">
                    <el-tag 
                      :type="getStatusType(task.statusCode)" 
                      size="small"
                    >
                      {{ task.statusName }}
                    </el-tag>
                  </div>
                  <div class="task-cell task-assignee">
                    <el-icon><User /></el-icon>
                    <span>{{ task.assignee }}</span>
                  </div>
                  <div class="task-cell task-schedule">
                    <el-icon><Calendar /></el-icon>
                    <span>{{ task.planEndDate }}</span>
                    <span v-if="task.duration" class="duration">{{ task.duration }}</span>
                  </div>
                  <div class="task-cell task-progress">
                    <el-progress 
                      :percentage="task.progress" 
                      :stroke-width="8"
                      :show-text="true"
                      :format="() => `${task.progress}%`"
                    />
                  </div>
                  <div class="task-cell task-actions">
                    <el-button 
                      v-for="action in actions" 
                      :key="action.key"
                      :type="action.type" 
                      size="small" 
                      text
                      @click="handleTaskAction(task.id, action.key)"
                    >
                      {{ action.label }}
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧边栏 -->
    <div class="sidebar">
      <!-- 常用系统 -->
      <div class="sidebar-section">
        <h3 class="sidebar-title">常用系统</h3>
        <div class="system-groups">
          <div 
            v-for="group in commonSystems" 
            :key="group.id"
            class="system-group"
          >
            <div class="group-title">
              <el-icon><Flag /></el-icon>
              <span>{{ group.title }}</span>
            </div>
            <div class="system-grid">
              <div 
                v-for="system in group.systems" 
                :key="system.id"
                class="system-item"
                @click="openSystem(system.id)"
              >
                <div class="system-icon" :style="{ backgroundColor: system.color }">
                  <el-icon><component :is="system.icon" /></el-icon>
                </div>
                <div class="system-name">{{ system.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 协同消息 -->
      <div class="sidebar-section">
        <div class="section-header-small">
          <h3 class="sidebar-title">
            <el-icon><Flag /></el-icon>
            <span>协同消息</span>
          </h3>
          <el-icon class="notification-icon"><Bell /></el-icon>
        </div>
        <div class="message-list">
          <div 
            v-for="message in collaborationMessages" 
            :key="message.id"
            class="message-item"
          >
            <div class="message-avatar" :style="{ backgroundColor: message.avatarColor }">
              <span>{{ message.sender.charAt(0) }}</span>
            </div>
            <div class="message-content">
              <div class="message-header">
                <span class="sender-name">{{ message.sender }}</span>
                <span class="message-time">{{ message.time }}</span>
              </div>
              <div class="message-text">{{ message.content }}</div>
              <div class="message-actions">
                <el-button type="primary" size="small" text>查看</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { 
  Folder, Download, Loading, User, WarningFilled, Flag, List, Grid, 
  ArrowRight, Calendar, Bell
} from '@element-plus/icons-vue'
import dataList from '@/libs/common/dataList'
import * as api from '@/api'
import { result } from 'lodash'


// 视图模式
const viewMode = ref('list')

// 当前选择的任务类型
const selectedTaskType = ref('allTask')

// 任务统计数据
const taskStats = reactive({
  allTask: "",
  submitTaskNum: "",
  ongoingTaskNum: "",
  auditTaskNum: "",
  delayTaskNum: ""
})

const actions  =  [  
          { key: 'updpro', label: '更新进度', type: 'primary' },
          { key: 'submit', label: '提交任务', type: 'success' },
          { key: 'run', label: '启动工具', type: 'warning' }
  ];


const {
    sortField,
    sortType,
    query, // 用于绑定查询表单
    page, // 用于绑定当前页
    limit, // 用于绑定查询条数
    total, // 记录列表总数
    list, // 当前列表
    loadList, // 获取列表数据
    search, // 用于搜索，更新列表数据
    changePageSize
} = dataList({ moduleName: 'planTask', immediate: false })
const taskProjectsList = ref(list)

// 过滤只显示有任务列表的项目
const filteredProjectsList = computed(() => {
  return taskProjectsList.value.filter(project => {
    // 检查项目是否有任务列表且不为空
    const taskList = project.tasks
    return taskList && Array.isArray(taskList) && getFilteredTasks(taskList).length > 0
  })
})


// 体系研发任务项目数据
const taskProjects = ref([
  {
    id: 'proj1',
    name: 'XXX体系研发项目',
    expanded: true,
    tasks: [
      {
        id: 'task1',
        name: 'AR-0需求分析任务',
        type: 'requirement',
        status: 'pending',
        assignee: '方小明',
        planEndDate: '2024.01.16',
        duration: '剩25天',
        progress: 0
      },
      {
        id: 'task2',
        name: 'XXX体系架构设计任务',
        type: 'design',
        status: 'progress',
        assignee: '方小明',
        planEndDate: '2024.01.16',
        duration: '剩3天',
        progress: 60
      },
      {
        id: 'task3',
        name: 'AR-0体系满足度评估任务',
        type: 'evaluation',
        status: 'progress',
        assignee: '方小明',
        planEndDate: '2024.01.16',
        duration: '剩25天',
        progress: 34
      },
      {
        id: 'task4',
        name: 'XXXX体系效能评估任务',
        type: 'evaluation',
        status: 'overdue',
        assignee: '方小明',
        planEndDate: '2024.01.16',
        duration: '超期8天',
        progress: 24
      },
      {
        id: 'task5',
        name: 'XXX体系对抗仿真任务',
        type: 'simulation',
        status: 'review',
        assignee: '方小明',
        planEndDate: '2024.01.16',
        duration: '剩3天',
        progress: 0
      }
    ]
  },
  {
    id: 'proj2',
    name: 'XXX-001体系研发项目',
    expanded: true,
    tasks: [
      {
        id: 'task6',
        name: 'AR-0需求满足度评估任务',
        type: 'evaluation',
        status: 'progress',
        assignee: '方小明',
        planEndDate: '2024.01.16',
        duration: '剩25天',
        progress: 67
      }
    ]
  }
])

// 常用系统数据（分组结构）
const commonSystems = ref([
  {
    id: 'planning',
    title: '体系规划论证系统',
    systems: [
      {
        id: 'system1',
        name: '体系需求分析环境',
        icon: 'Document',
        color: '#409EFF'
      },
      {
        id: 'system2',
        name: '体系架构设计环境',
        icon: 'Setting',
        color: '#9932CC'
      },
      {
        id: 'system3',
        name: '体系效能评估系统',
        icon: 'DataAnalysis',
        color: '#20B2AA'
      },
      {
        id: 'system4',
        name: '体系需求管理评估系统',
        icon: 'Monitor',
        color: '#1E90FF'
      },
      {
        id: 'system5',
        name: '体系建模服务',
        icon: 'Box',
        color: '#FF8C00'
      },
      {
        id: 'system6',
        name: '体系对抗仿真',
        icon: 'Connection',
        color: '#00CED1'
      }
    ]
  },
  {
    id: 'experiment',
    title: '虚实试验验证系统',
    systems: [
      {
        id: 'system7',
        name: 'XXX分析环境',
        icon: 'Document',
        color: '#409EFF'
      },
      {
        id: 'system8',
        name: '体系XXXX设计环境',
        icon: 'Setting',
        color: '#9932CC'
      },
      {
        id: 'system9',
        name: '体系XXXXX系统',
        icon: 'DataAnalysis',
        color: '#20B2AA'
      }
    ]
  }
])

// 协同消息数据
const collaborationMessages = ref([
  {
    id: 'msg1',
    sender: '李强',
    content: '指派您一条新任务，XXXXX能评估',
    time: '昨天 16:25',
    avatarColor: '#FF6B6B',
    type: 'task'
  },
  {
    id: 'msg2',
    sender: '工程Ⅰ',
    content: '需求满足度评估内容不满足要求！',
    time: '昨天 4:41',
    avatarColor: '#4ECDC4',
    type: 'feedback'
  },
  {
    id: 'msg3',
    sender: '工程工',
    content: 'XXX项目信息已更新，请查看！',
    time: '昨天14:41',
    avatarColor: '#45B7D1',
    type: 'update'
  },
  {
    id: 'msg4',
    sender: '工程Ⅰ',
    content: '缺少此处有问题，请处理！',
    time: '昨天 4:41',
    avatarColor: '#4ECDC4',
    type: 'issue'
  },
  {
    id: 'msg5',
    sender: '工程Ⅰ',
    content: 'XXX项目发布成功形，请查看！',
    time: '昨天 4:41',
    avatarColor: '#4ECDC4',
    type: 'success'
  }
])

// 方法
const selectTaskType = (type: string) => {
  selectedTaskType.value = type
}



const getFilteredTasks = (tasks: any[]) => {
  if (selectedTaskType.value === 'allTask') {
    return tasks
  }
  
  const statusMap: Record<string, string[]> = {
    submitTaskNum: ['TASK_RUN_STATUS_SUBMIT'],
    ongoingTaskNum: ['TASK_RUN_STATUS_SEND'],
    auditTaskNum: ['TASK_RUN_STATUS_ONGOING'],
    delayTaskNum: ['TASK_RUN_STATUS_DELAY']
  }
  
  const allowedStatuses = statusMap[selectedTaskType.value] || []

  return tasks.filter(task => allowedStatuses.includes(task.statusCode))
}

const toggleProject = (projectId: string) => {
  const project = filteredProjectsList.value.find(p => p.id === projectId)
  if (project) {
    project.expanded = !project.expanded
  }
}

const getTaskTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    requirement: '需求',
    design: '设计',
    evaluation: '评估',
    simulation: '仿真'
  }
  return typeMap[type] || '任务'
}

const getStatusType = (status: string) => {
  const statusMap: Record<string, string> = {
    TASK_RUN_STATUS_SUBMIT: 'info',
    TASK_RUN_STATUS_SEND: 'warning',
    TASK_RUN_STATUS_ONGOING: 'success',
    TASK_RUN_STATUS_FINISH: 'success',
    TASK_RUN_STATUS_DELAY: 'danger'
  }
  return statusMap[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: '待接收',
    progress: '进行中',
    review: '进行中',
    completed: '已完成',
    overdue: '已超期'
  }
  return statusMap[status] || '未知'
}

const handleTaskAction = (taskId: string, actionKey: string) => {
  console.log(`Task ${taskId} action: ${actionKey}`)
  // 这里可以添加具体的任务操作逻辑
    if(actionKey === 'updpro'){
        
    }else if(actionKey === 'submit'){

    }else if(actionKey === 'run'){
        
    }
}

const openSystem = (systemId: string) => {
  console.log(`Open system: ${systemId}`)
  // 这里可以添加打开系统的逻辑
}

onMounted(async() => {
  // 初始化数据
    query.value.businessCode='BUSINESS_CODE_TXZJXT'
    loadList()

    const totalresult =await api.planTask.totalTaskNum(query);
    const resultData = totalresult.data;
    // Object.assign(resultData, taskStats)
    console.log("totalresult" + resultData?.allTask)
    taskStats.allTask = resultData?.allTask;
    taskStats.submitTaskNum =  resultData?.submitTaskNum;
    taskStats.ongoingTaskNum = resultData?.ongoingTaskNum;
    taskStats.auditTaskNum =  resultData?.auditTaskNum;
    taskStats.delayTaskNum =  resultData?.delayTaskNum;
})


</script>

<style lang="less" scoped>
.task-management-container {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

// 统计卡片
.stats-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &.active {
    border-color: #409EFF;
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
    position: relative;

    .stat-number {
      color: #409EFF;
    }

    .stat-label {
      color: #409EFF;
      font-weight: 600;
    }

    .stat-icon {
      color: #409EFF;
      opacity: 1;
    }
  }

  .stat-number {
    font-size: 32px;
    font-weight: bold;
    color: #409EFF;
    margin-right: 12px;
    transition: color 0.3s ease;
  }

  .stat-label {
    font-size: 14px;
    color: #666;
    transition: color 0.3s ease;
  }

  .stat-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 24px;
    color: #409EFF;
    opacity: 0.3;
    transition: all 0.3s ease;
  }
}



// 任务部分
.task-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
}

// 表格样式
.task-header {
  display: flex;
  background: #f8f9fa;
  padding: 12px 20px;
  font-weight: 600;
  font-size: 14px;
  color: #666;

  .header-cell {
    &.task-name { flex: 3; }
    &.task-status { flex: 1; }
    &.task-assignee { flex: 1; }
    &.task-schedule { flex: 2; }
    &.task-progress { flex: 2; }
    &.task-actions { flex: 2; }
  }
}

.project-list {
  .project-item {
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }
  }

  .project-header {
    display: flex;
    align-items: center;
    padding: 16px 20px;
    cursor: pointer;
    background: #fafafa;
    border-bottom: 1px solid #eee;

    &:hover {
      background: #f0f0f0;
    }

    .expand-icon {
      margin-right: 8px;
      transition: transform 0.3s;
      
      &.expanded {
        transform: rotate(90deg);
      }
    }

    .project-name {
      font-weight: 600;
      font-size: 16px;
    }
  }

  .project-tasks {
    .task-row {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      border-bottom: 1px solid #f5f5f5;

      &:hover {
        background: #f9f9f9;
      }

      .task-cell {
        display: flex;
        align-items: center;
        gap: 8px;

        &.task-name { 
          flex: 3;
          
          .task-type-icon {
            width: 40px;
            height: 24px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: white;
            font-weight: 600;

            &.requirement { background: #409EFF; }
            &.design { background: #FF8C00; }
            &.evaluation { background: #67C23A; }
            &.simulation { background: #E6A23C; }
          }

          .task-title {
            font-weight: 500;
          }
        }
        &.task-status { flex: 1; }
        &.task-assignee { 
          flex: 1;
          font-size: 14px;
          color: #666;
        }
        &.task-schedule { 
          flex: 2;
          font-size: 14px;
          color: #666;
          
          .duration {
            margin-left: 8px;
            color: #E6A23C;
          }
        }
        &.task-progress { flex: 2; }
        &.task-actions { 
          flex: 2;
          gap: 4px;
        }
      }
    }
  }
}

// 侧边栏
.sidebar {
  width: 350px;
  background: #f5f7fa;
  border-left: 1px solid #eee;
  padding: 20px;
  overflow-y: auto;
}

.sidebar-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:last-child {
    margin-bottom: 0;
  }

  .sidebar-title {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #409EFF;

    .el-icon {
      font-size: 16px;
    }
  }

  .section-header-small {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .notification-icon {
      font-size: 18px;
      color: #666;
    }
  }
}

// 常用系统分组
.system-groups {
  .system-group {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .group-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      font-size: 14px;
      font-weight: 600;
      color: #409EFF;
      padding-bottom: 8px;
      border-bottom: 1px solid #f0f0f0;

      .el-icon {
        font-size: 16px;
      }
    }
  }
}

// 常用系统网格
.system-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.system-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f5f7fa;
    transform: translateY(-2px);
  }

  .system-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 8px;
    font-size: 18px;
  }

  .system-name {
    font-size: 12px;
    text-align: center;
    line-height: 1.3;
    color: #666;
  }
}

// 消息列表
.message-list {
  .message-item {
    display: flex;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .message-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: 600;
      flex-shrink: 0;
    }

    .message-content {
      flex: 1;
      
      .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;

        .sender-name {
          font-weight: 600;
          font-size: 14px;
        }

        .message-time {
          font-size: 12px;
          color: #999;
        }
      }

      .message-text {
        font-size: 13px;
        color: #666;
        line-height: 1.4;
        margin-bottom: 8px;
      }

      .message-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
}

// 响应式
@media (max-width: 1200px) {
  .sidebar {
    width: 300px;
  }

  .system-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .task-management-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    border-left: none;
    border-top: 1px solid #eee;
  }

  .stats-cards {
    flex-wrap: wrap;
  }

  .stat-card {
    min-width: calc(50% - 8px);
  }
}
</style>
