<template>
  <div class="create-task-container">
    <!-- 左侧项目基础信息抽屉 -->
    <div class="left-drawer" :class="{ collapsed: leftDrawerCollapsed }">
      <div class="drawer-header">
        <span class="drawer-title">项目基础信息</span>
        <el-button 
          type="text" 
          @click="toggleLeftDrawer"
          class="toggle-btn"
        >
          <el-icon>
            <ArrowLeft v-if="!leftDrawerCollapsed" />
            <ArrowRight v-if="leftDrawerCollapsed" />
          </el-icon>
        </el-button>
      </div>
      
      <div class="drawer-content" v-show="!leftDrawerCollapsed">
        <div class="project-info">
          <div class="info-item">
            <label>项目名称：</label>
            <span>{{ projectInfo.name || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>作战方向：</label>
            <span>{{ projectInfo.direction || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>任务类型：</label>
            <span>{{ formatArrayToString(projectInfo.taskType) || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>起止时间：</label>
            <span>{{ formatTimeRange(projectInfo.timeRange) || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>团队成员：</label>
            <span>{{ formatArrayToString(projectInfo.teamMembers) || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>来源：</label>
            <span>{{ projectInfo.source || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>项目负责人：</label>
            <span>{{ formatArrayToString(projectInfo.projectManager) || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>军兵种：</label>
            <span>{{ formatArrayToString(projectInfo.militaryBranch) || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>场景描述：</label>
            <div class="description-text">{{ projectInfo.description || '-' }}</div>
          </div>
          
          <div class="info-item">
            <label>活动要求：</label>
            <div class="description-text">{{ projectInfo.activityRequirement || '-' }}</div>
          </div>
          
          <div class="info-item" v-if="projectInfo.attachments">
            <label>附件：</label>
            <div class="attachment-list">
              <div class="attachment-item">
                <el-icon><Document /></el-icon>
                <span>项目说明书.word</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间流程图区域 -->
    <div class="center-flowchart" :class="{ 'full-width': leftDrawerCollapsed && rightDrawerCollapsed }">
      <div class="flowchart-header">
        <h2>任务流程设计</h2>
        <div class="toolbar">
          <el-button size="small" @click="addTask">
            <el-icon><Plus /></el-icon>
            添加任务
          </el-button>
          <el-button size="small" @click="saveFlow">
            <el-icon><Document /></el-icon>
            保存流程
          </el-button>
          <el-popover 
            placement="bottom" 
            width="300" 
            trigger="hover"
            content="使用说明：
            • 鼠标悬停节点可显示连接点
            • 拖拽连接点可创建连线
            • 双击连线可删除连接
            • 点击节点查看详细信息"
          >
            <template #reference>
              <el-button size="small" type="info" link>
                <el-icon><Document /></el-icon>
                使用说明
              </el-button>
            </template>
          </el-popover>
        </div>
      </div>
      
      <div class="flowchart-canvas" ref="canvasRef"></div>
    </div>

    <!-- 右侧任务基础信息抽屉 -->
    <div class="right-drawer" :class="{ collapsed: rightDrawerCollapsed }">
      <div class="drawer-header">
        <el-button 
          type="text" 
          @click="toggleRightDrawer"
          class="toggle-btn"
        >
          <el-icon>
            <ArrowRight v-if="!rightDrawerCollapsed" />
            <ArrowLeft v-if="rightDrawerCollapsed" />
          </el-icon>
        </el-button>
        <span class="drawer-title">任务基础信息</span>
      </div>
      
      <div class="drawer-content" v-show="!rightDrawerCollapsed">
        <div class="task-info" v-if="selectedTask">
          <el-form 
            :model="selectedTask" 
            label-width="100px"
            class="task-form"
          >
            <el-form-item label="任务名称">
              <el-input v-model="selectedTask.name" placeholder="请输入任务名称" />
            </el-form-item>
            
            <el-form-item label="起止时间">
              <el-date-picker
                v-model="selectedTask.dateRange"
                type="daterange"
                range-separator=" - "
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY.MM.DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            
            <el-form-item label="执行天数">
              <el-input-number 
                v-model="selectedTask.executionDays" 
                :min="1" 
                :max="365"
                placeholder="天数"
              />
            </el-form-item>
            
            <el-form-item label="责任人">
              <el-select v-model="selectedTask.assignee" placeholder="请选择责任人">
                <el-option label="方小明" value="方小明" />
                <el-option label="李强" value="李强" />
                <el-option label="张三" value="张三" />
                <el-option label="王五" value="王五" />
                <el-option label="赵六" value="赵六" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="工具关联">
              <el-select v-model="selectedTask.toolAssociation" placeholder="请选择关联工具">
                <el-option label="需求管理工具" value="requirement-tool" />
                <el-option label="设计工具" value="design-tool" />
                <el-option label="仿真工具" value="simulation-tool" />
                <el-option label="测试工具" value="test-tool" />
                <el-option label="项目管理工具" value="project-tool" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="▲">
              <div class="input-section">
                <div class="section-title">
                  <span>输入 2项</span>
                </div>
                <div class="section-actions">
                  <el-button size="small" text>新增</el-button>
                  <el-button size="small" text>模型下载</el-button>
                </div>
                <div class="data-table">
                  <div class="table-header">
                    <span>名称</span>
                    <span>图标</span>
                    <span>附件</span>
                    <span>类型</span>
                    <span>操作</span>
                  </div>
                  <div class="table-row">
                    <span>体系需求</span>
                    <span>内部</span>
                    <span>Req</span>
                    <span>xxx需求.Req</span>
                    <span>
                      <el-button size="small" text type="primary">编辑</el-button>
                      <el-button size="small" text type="danger">删除</el-button>
                    </span>
                  </div>
                </div>
              </div>
            </el-form-item>
            
            <el-form-item label="▼">
              <div class="output-section">
                <div class="section-title">
                  <span>输出 2项</span>
                </div>
                <div class="section-actions">
                  <el-button size="small" text>新增</el-button>
                  <el-button size="small" text>上传至模型库</el-button>
                  <el-button size="small" text>解析模型</el-button>
                </div>
                <div class="data-table">
                  <div class="table-header">
                    <span>名称</span>
                    <span>图标</span>
                    <span>附件</span>
                    <span>类型</span>
                    <span>操作</span>
                  </div>
                  <div class="table-row">
                    <span>体系需求Req</span>
                    <span>内部</span>
                    <span>Req</span>
                    <span>xxx需求.Req</span>
                    <span>
                      <el-button size="small" text type="primary">编辑</el-button>
                      <el-button size="small" text type="danger">删除</el-button>
                    </span>
                  </div>
                  <div class="table-row">
                    <span>新的需求</span>
                    <span>图标</span>
                    <span>附件</span>
                    <span>类型</span>
                    <span>
                      <el-button size="small" text type="primary">编辑</el-button>
                      <el-button size="small" text type="danger">删除</el-button>
                    </span>
                  </div>
                </div>
              </div>
            </el-form-item>
            
            <el-form-item label="前置任务">
              <el-select 
                v-model="selectedTask.dependencies" 
                multiple
                placeholder="请选择前置任务"
              >
                <el-option 
                  v-for="task in taskList.filter(t => t.id !== selectedTask.id)"
                  :key="task.id"
                  :label="task.name"
                  :value="task.id"
                />
              </el-select>
            </el-form-item>
            
            <div class="form-actions">
              <el-button type="primary" @click="updateTask">更新任务</el-button>
              <el-button @click="deleteTask" type="danger">删除任务</el-button>
            </div>
          </el-form>
        </div>
        
        <div class="empty-state" v-else>
          <el-empty description="请选择一个任务节点" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Graph, Node, Edge, Shape } from '@antv/x6'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Document
} from '@element-plus/icons-vue'

// 定义组件的 props
const props = defineProps<{
  projectId?: string
  projectData?: any
}>()

// 响应式数据
const leftDrawerCollapsed = ref(false)
const rightDrawerCollapsed = ref(false)
const canvasRef = ref<HTMLElement>()
const graph = ref<Graph>()
const selectedTask = ref<any>(null)

// 项目信息
const projectInfo = reactive(props.projectData || {})

// 任务列表
const taskList = ref<any[]>([
  {
    id: 'start',
    name: '开始',
    type: 'start',
    nodeType: 'start',
    x: 50,
    y: 150,
    shape: 'circle'
  },
  {
    id: 'task1',
    name: '体系需求分析活动',
    type: 'analysis',
    nodeType: 'task',
    assignee: '方小明',
    taskStats: { up: 3, down: 2 },
    dateRange: ['2024-01-06', '2024-01-16'],
    executionDays: 10,
    toolAssociation: '体系需求调研基线',
    x: 200,
    y: 80,
    expanded: false
  },
  {
    id: 'task2',
    name: '体系架构设计',
    type: 'design',
    nodeType: 'task',
    assignee: '',
    taskStats: { up: 0, down: 0 },
    dateRange: null,
    executionDays: null,
    toolAssociation: '',
    x: 420,
    y: 180,
    expanded: false
  },
  {
    id: 'task3',
    name: '体系需求满足度评估',
    type: 'evaluation',
    nodeType: 'task',
    assignee: '李强',
    taskStats: { up: 7, down: 4 },
    dateRange: ['2024-01-06', '2024-01-16'],
    executionDays: 10,
    toolAssociation: '体系需求满足度评估基线',
    x: 220,
    y: 320,
    expanded: false
  },
  {
    id: 'task4',
    name: '体系对抗仿真',
    type: 'simulation',
    nodeType: 'task',
    assignee: '方小明',
    taskStats: { up: 3, down: 2 },
    dateRange: ['2024-01-06', '2024-01-16'],
    executionDays: 10,
    toolAssociation: '体系对抗仿真基线',
    x: 590,
    y: 320,
    expanded: false
  },
  {
    id: 'task5',
    name: '体系效能评估',
    type: 'performance',
    nodeType: 'task',
    assignee: '李强强',
    taskStats: { up: 2, down: 4 },
    dateRange: ['2024-01-06', '2024-01-16'],
    executionDays: 10,
    toolAssociation: '体系效能评估基线',
    x: 590,
    y: 450,
    expanded: false
  },
  {
    id: 'end',
    name: '结束',
    type: 'end',
    nodeType: 'end',
    x: 800,
    y: 350,
    shape: 'circle'
  }
])

// 格式化数组为字符串
const formatArrayToString = (arr: string[] | undefined) => {
  if (!arr || arr.length === 0) return ''
  return arr.join('、')
}

// 格式化时间范围
const formatTimeRange = (timeRange: string[] | undefined) => {
  if (!timeRange || timeRange.length !== 2) return ''
  return `${timeRange[0]} ~ ${timeRange[1]}`
}

// 切换左侧抽屉
const toggleLeftDrawer = () => {
  leftDrawerCollapsed.value = !leftDrawerCollapsed.value
  // autoResize: true 会自动处理画布大小调整，无需手动调用 resize()
}

// 切换右侧抽屉
const toggleRightDrawer = () => {
  rightDrawerCollapsed.value = !rightDrawerCollapsed.value
  // autoResize: true 会自动处理画布大小调整，无需手动调用 resize()
}

// 自定义任务节点
const registerCustomNode = () => {
  // 注册任务节点
  Graph.registerNode('task-node', {
    inherit: 'html',
    width: 220,
    height: 32,
    attrs: {
      body: {
        stroke: '#d9d9d9',
        fill: '#ffffff',
        rx: 8,
        ry: 8,
        strokeWidth: 1
      }
    },
    markup: [
      { tagName: 'rect', selector: 'body' },
      { tagName: 'rect', selector: 'header' },
      { tagName: 'text', selector: 'type-icon' },
      { tagName: 'text', selector: 'title' },
      { tagName: 'circle', selector: 'avatar' },
      { tagName: 'text', selector: 'assignee' },
      { tagName: 'text', selector: 'task-days' },
      { tagName: 'text', selector: 'stats-up' },
      { tagName: 'text', selector: 'stats-down' },
      { tagName: 'text', selector: 'toolAssociation' },
      { tagName: 'text', selector: 'expand-indicator' }
    ],
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 2,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 2,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        },
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 2,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 2,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        }
      }
    }
  }, true)

  // 注册开始节点
  Graph.registerNode('start-node', {
    inherit: 'circle',
    width: 40,
    height: 40,
    attrs: {
      circle: {
        stroke: '#52c41a',
        fill: '#52c41a',
        r: 20
      },
      text: {
        fontSize: 12,
        fill: '#fff',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle'
      }
    },
    ports: {
      groups: {
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 2,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 2,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        }
      }
    }
  }, true)

  // 注册结束节点  
  Graph.registerNode('end-node', {
    inherit: 'circle',
    width: 40,
    height: 40,
    attrs: {
      circle: {
        stroke: '#ff4d4f',
        fill: '#ff4d4f',
        r: 20
      },
      text: {
        fontSize: 12,
        fill: '#fff',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle'
      }
    },
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 2,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        },
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 6,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 2,
              fill: '#fff',
              style: {
                visibility: 'hidden'
              }
            }
          }
        }
      }
    }
  }, true)
}

// 创建节点
const createTaskNode = (task: any) => {
  if (task.nodeType === 'start') {
    return createStartNode(task)
  } else if (task.nodeType === 'end') {
    return createEndNode(task)  
  } else {
    return createNormalTaskNode(task)
  }
}

// 创建开始节点
const createStartNode = (task: any) => {
  const node = graph.value!.addNode({
    id: task.id,
    shape: 'start-node',
    x: task.x,
    y: task.y,
    data: task,
    attrs: {
      text: {
        text: '▶'
      }
    },
    ports: [
      { group: 'bottom', id: `${task.id}-bottom` },
      { group: 'right', id: `${task.id}-right` }
    ]
  })
  return node
}

// 创建结束节点
const createEndNode = (task: any) => {
  const node = graph.value!.addNode({
    id: task.id,
    shape: 'end-node',
    x: task.x,
    y: task.y,
    data: task,
    attrs: {
      text: {
        text: '■'
      }
    },
    ports: [
      { group: 'top', id: `${task.id}-top` },
      { group: 'left', id: `${task.id}-left` }
    ]
  })
  return node
}

// 创建普通任务节点
const createNormalTaskNode = (task: any) => {
  // 获取任务类型图标
  const getTypeIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      'analysis': '需要',
      'design': '设计', 
      'evaluation': '任务',
      'simulation': '仿真',
      'performance': '性能'
    }
    return iconMap[type] || '任务'
  }

  // 获取任务类型背景色
  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'analysis': '#722ed1',
      'design': '#1890ff',
      'evaluation': '#f5222d', 
      'simulation': '#fa8c16',
      'performance': '#52c41a'
    }
    return colorMap[type] || '#1890ff'
  }

  const node = graph.value!.addNode({
    id: task.id,
    shape: 'task-node',
    x: task.x,
    y: task.y,
    data: task,
    attrs: {
      // 头部区域
      header: {
        x: 0,
        y: 0,
        width: 220,
        height: 32,
        fill: '#f5f5f5',
        stroke: '#d9d9d9',
        strokeWidth: 1
      },
      // 任务类型图标
      'type-icon': {
        text: getTypeIcon(task.type),
        x: 12,
        y: 20,
        fontSize: 12,
        fill: '#fff',
        fontWeight: 'bold'
      },
      // 任务标题
      title: {
        text: task.name,
        x: 45,
        y: 20,
        fontSize: 13,
        fontWeight: 'bold',
        fill: '#262626'
      },
      // 负责人头像
      avatar: {
        cx: 12,
        cy: 50,
        r: 10,
        fill: '#fa8c16',
        stroke: '#fff',
        strokeWidth: 2,
        display: task.expanded ? 'block' : 'none'
      },
      // 负责人姓名
      assignee: {
        text: task.expanded ? (task.assignee ? `参与者：${task.assignee}` : '参与者：未分配') : '',
        x: 28,
        y: 54,
        fontSize: 11,
        fill: '#595959'
      },
      // 任务时间
      'task-days': {
        text: (() => {
          if (!task.expanded) return ''
          if (task.dateRange && Array.isArray(task.dateRange) && task.dateRange.length === 2) {
            const startDate = task.dateRange[0] ? task.dateRange[0].replace(/-/g, '.') : ''
            const endDate = task.dateRange[1] ? task.dateRange[1].replace(/-/g, '.') : ''
            if (startDate && endDate) {
              return `任务周期：${startDate} - ${endDate}`
            }
          }
          return '任务周期：未设置'
        })(),
        x: 28,
        y: 70,
        fontSize: 10,
        fill: '#8c8c8c'
      },
      // 上箭头统计
      'stats-up': {
        text: task.expanded && task.taskStats?.up ? `▲ ${task.taskStats.up}` : '',
        x: 150,
        y: 54,
        fontSize: 11,
        fill: '#52c41a'
      },
      // 下箭头统计  
      'stats-down': {
        text: task.expanded && task.taskStats?.down ? `▼ ${task.taskStats.down}` : '',
        x: 180,
        y: 54,
        fontSize: 11,
        fill: '#ff4d4f'
      },
      // 工具关联信息
      toolAssociation: {
        text: task.expanded ? (task.toolAssociation || '') : '',
        x: 12,
        y: 88,
        fontSize: 10,
        fill: '#52c41a'
      },
      // 展开指示符
      'expand-indicator': {
        text: task.expanded ? '▼' : '▶',
        x: 200,
        y: 20,
        fontSize: 12,
        fill: '#1890ff',
        cursor: 'pointer'
      }
    },
    ports: [
      { group: 'top', id: `${task.id}-top` },
      { group: 'bottom', id: `${task.id}-bottom` },
      { group: 'left', id: `${task.id}-left` },
      { group: 'right', id: `${task.id}-right` }
    ]
  })

  // 添加任务类型背景色（暂时注释掉，避免TypeScript错误）
  // setTimeout(() => {
  //   try {
  //     // TODO: 实现任务类型背景色
  //   } catch (error) {
  //     console.warn('Failed to add type background:', error)
  //   }
  // }, 0)

  return node
}

// 切换任务展开/收起
const toggleTaskExpansion = (taskId: string) => {
  const task = taskList.value.find(t => t.id === taskId)
  if (task) {
    task.expanded = !task.expanded
    updateTaskNode(task)
  }
}



// 更新任务节点
const updateTaskNode = (task: any) => {
  const node = graph.value!.getCellById(task.id) as Node
  if (node && task.nodeType === 'task') {
    const height = task.expanded ? 140 : 32
    node.resize(220, height)
    
    // 更新展开指示符
    node.attr('expand-indicator/text', task.expanded ? '▼' : '▶')
    
    // 格式化起止时间为任务周期显示
    let taskPeriod = '任务周期：未设置'
    if (task.dateRange && Array.isArray(task.dateRange) && task.dateRange.length === 2) {
      const startDate = task.dateRange[0] ? task.dateRange[0].replace(/-/g, '.') : ''
      const endDate = task.dateRange[1] ? task.dateRange[1].replace(/-/g, '.') : ''
      if (startDate && endDate) {
        taskPeriod = `任务周期：${startDate} - ${endDate}`
      }
    }
    
    // 更新基本信息
    node.attr('title/text', task.name)
    
    // 根据展开状态显示或隐藏内容
    if (task.expanded) {
      // 展开状态：显示所有内容
      node.attr('assignee/text', task.assignee ? `参与者：${task.assignee}` : '参与者：未分配')
      node.attr('task-days/text', taskPeriod)
      node.attr('stats-up/text', task.taskStats?.up ? `▲ ${task.taskStats.up}` : '')
      node.attr('stats-down/text', task.taskStats?.down ? `▼ ${task.taskStats.down}` : '')
      node.attr('toolAssociation/text', task.toolAssociation || '')
      // 显示头像
      node.attr('avatar/display', 'block')
    } else {
      // 收起状态：隐藏除头部以外的所有内容
      node.attr('assignee/text', '')
      node.attr('task-days/text', '')
      node.attr('stats-up/text', '')
      node.attr('stats-down/text', '')
      node.attr('toolAssociation/text', '')
      // 隐藏头像
      node.attr('avatar/display', 'none')
    }
  }
}

// 初始化流程图
const initFlowChart = () => {
  if (!canvasRef.value) return

  graph.value = new Graph({
    container: canvasRef.value,
    width: canvasRef.value.clientWidth,
    height: canvasRef.value.clientHeight,
    autoResize: true,
    background: {
      color: '#f8f9fa'
    },
    grid: {
      visible: true,
      type: 'doubleMesh',
      args: [
        {
          color: '#eee',
          thickness: 1
        },
        {
          color: '#ddd',
          thickness: 1,
          factor: 4
        }
      ]
    },

    connecting: {
      router: 'manhattan',
      connector: {
        name: 'rounded',
        args: {
          radius: 8
        }
      },
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false,
      snap: {
        radius: 20
      },
      allowMulti: false,
      allowLoop: false,
      highlight: true,
      validateMagnet({ magnet }) {
        return magnet.getAttribute('port-group') !== 'in'
      },
      validateConnection({ sourceMagnet, targetMagnet }) {
        return !!(sourceMagnet && targetMagnet && sourceMagnet !== targetMagnet)
      },
      createEdge() {
        return graph.value!.createEdge({
          attrs: {
            line: {
              stroke: '#1890ff',
              strokeWidth: 2,
              targetMarker: {
                name: 'block',
                width: 8,
                height: 8
              }
            }
          },
          zIndex: 0
        })
      }
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#5F95FF',
            stroke: '#5F95FF'
          }
        }
      }
    },

  })

  // 注册自定义节点
  registerCustomNode()



  // 添加所有节点
  taskList.value.forEach(task => {
    createTaskNode(task)
  })

  // 添加连线
  setTimeout(() => {
    const edgeStyle = {
      attrs: {
        line: {
          stroke: '#A2A2A2',
          strokeWidth: 2,
          targetMarker: 'classic'
        }
      }
    }

    // 开始节点 -> 体系需求分析活动
    graph.value!.addEdge({
      source: { cell: 'start', anchor: { name: 'bottom' } },
      target: { cell: 'task1', anchor: { name: 'top' } },
      ...edgeStyle
    })

    // 体系需求分析活动 -> 体系架构设计
    graph.value!.addEdge({
      source: { cell: 'task1', anchor: { name: 'bottom' } },
      target: { cell: 'task2', anchor: { name: 'top' } },
      ...edgeStyle
    })

    // 体系需求分析活动 -> 体系需求满足度评估
    graph.value!.addEdge({
      source: { cell: 'task1', anchor: { name: 'bottom' } },
      target: { cell: 'task3', anchor: { name: 'top' } },
      ...edgeStyle
    })

    // 体系架构设计 -> 体系对抗仿真
    graph.value!.addEdge({
      source: { cell: 'task2', anchor: { name: 'bottom' } },
      target: { cell: 'task4', anchor: { name: 'top' } },
      ...edgeStyle
    })

    // 体系需求满足度评估 -> 体系效能评估
    graph.value!.addEdge({
      source: { cell: 'task3', anchor: { name: 'bottom' } },
      target: { cell: 'task5', anchor: { name: 'top' } },
      ...edgeStyle
    })

    // 体系对抗仿真 -> 结束节点
    graph.value!.addEdge({
      source: { cell: 'task4', anchor: { name: 'bottom' } },
      target: { cell: 'end', anchor: { name: 'top' } },
      ...edgeStyle
    })

    // 体系效能评估 -> 结束节点
    graph.value!.addEdge({
      source: { cell: 'task5', anchor: { name: 'bottom' } },
      target: { cell: 'end', anchor: { name: 'top' } },
      ...edgeStyle
    })
  }, 200)

  // 监听节点选择
  graph.value.on('node:click', ({ node, e }) => {
    const target = e.target as SVGElement
    
    // 通过文本内容和位置判断是否为展开指示符
    const isExpandIndicator = 
      target.textContent === '▼' || 
      target.textContent === '▶'
    
    if (isExpandIndicator) {
      toggleTaskExpansion(node.id)
      return
    }
    
    const taskData = node.getData()
    selectedTask.value = { ...taskData }
    rightDrawerCollapsed.value = false
  })

  // 监听画布点击（取消选择）
  graph.value.on('blank:click', () => {
    selectedTask.value = null
  })

  // 添加节点悬停效果
  graph.value.on('node:mouseenter', ({ node }) => {
    node.attr('body/stroke', '#40a9ff')
    node.attr('body/strokeWidth', 3)
    // 显示连接点
    const ports = node.getPorts()
    ports.forEach(port => {
      node.setPortProp(port.id!, 'attrs/circle/style/visibility', 'visible')
    })
  })

  graph.value.on('node:mouseleave', ({ node }) => {
    node.attr('body/stroke', '#1890ff')
    node.attr('body/strokeWidth', 2)
    // 隐藏连接点
    const ports = node.getPorts()
    ports.forEach(port => {
      node.setPortProp(port.id!, 'attrs/circle/style/visibility', 'hidden')
    })
  })

  // 监听连接点悬停
  graph.value.on('node:port:mouseenter', ({ node, port }) => {
    node.setPortProp(port!, 'attrs/circle/fill', '#31d0c6')
    node.setPortProp(port!, 'attrs/circle/r', 8)
  })

  graph.value.on('node:port:mouseleave', ({ node, port }) => {
    node.setPortProp(port!, 'attrs/circle/fill', '#fff')
    node.setPortProp(port!, 'attrs/circle/r', 6)
  })

  // 监听连接事件
  graph.value.on('edge:connected', ({ edge }) => {
    console.log('连接创建:', edge.getSourceCellId(), '->', edge.getTargetCellId())
  })

  // 监听连接断开事件
  graph.value.on('edge:removed', ({ edge }) => {
    console.log('连接删除:', edge.getSourceCellId(), '->', edge.getTargetCellId())
  })

  // 支持双击连线删除
  graph.value.on('edge:dblclick', ({ edge }) => {
    graph.value!.removeEdge(edge)
  })

  // 右键菜单
  graph.value.on('node:contextmenu', ({ node, e }) => {
    e.preventDefault()
    // 这里可以添加右键菜单逻辑
    console.log('右键节点:', node.id)
  })

  graph.value.on('edge:contextmenu', ({ edge, e }) => {
    e.preventDefault()
    // 删除连线
    if (confirm('确定要删除这条连线吗？')) {
      graph.value!.removeEdge(edge)
    }
  })

  // 画布右键菜单
  graph.value.on('blank:contextmenu', ({ e }) => {
    e.preventDefault()
    // 可以在此位置添加新节点
    const { x, y } = graph.value!.clientToGraph(e.clientX, e.clientY)
    console.log('右键画布位置:', x, y)
  })

  // 简化的键盘事件监听
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' && selectedTask.value) {
      if (confirm('确定要删除选中的任务吗？')) {
        const nodeToRemove = graph.value!.getCellById(selectedTask.value.id)
        if (nodeToRemove) {
          graph.value!.removeCell(nodeToRemove)
          // 从任务列表中移除
          const index = taskList.value.findIndex(t => t.id === selectedTask.value!.id)
          if (index > -1) {
            taskList.value.splice(index, 1)
          }
          selectedTask.value = null
        }
      }
    }
  })
}

// 添加任务
const addTask = () => {
  const newTask = {
    id: `task${Date.now()}`,
    name: '新任务',
    type: 'development',
    nodeType: 'task',
    assignee: '',
    taskStats: { up: 0, down: 0 },
    dateRange: null,
    executionDays: null,
    toolAssociation: '',
    x: Math.random() * 400 + 200,
    y: Math.random() * 200 + 200,
    expanded: false
  }
  
  taskList.value.push(newTask)
  createTaskNode(newTask)
  
  // 选中新创建的任务
  selectedTask.value = { ...newTask }
  rightDrawerCollapsed.value = false
  
  ElMessage.success('任务添加成功')
}

// 更新任务
const updateTask = () => {
  if (!selectedTask.value) return
  
  const taskIndex = taskList.value.findIndex(t => t.id === selectedTask.value.id)
  if (taskIndex !== -1) {
    taskList.value[taskIndex] = { ...selectedTask.value }
    updateTaskNode(selectedTask.value)
    ElMessage.success('任务更新成功')
  }
}

// 删除任务
const deleteTask = () => {
  if (!selectedTask.value) return
  
  const taskIndex = taskList.value.findIndex(t => t.id === selectedTask.value.id)
  if (taskIndex !== -1) {
    taskList.value.splice(taskIndex, 1)
    graph.value!.removeCell(selectedTask.value.id)
    selectedTask.value = null
    ElMessage.success('任务删除成功')
  }
}

// 保存流程
const saveFlow = () => {
  const flowData = {
    tasks: taskList.value,
    connections: graph.value!.getEdges().map(edge => ({
      source: edge.getSourceCellId(),
      target: edge.getTargetCellId()
    }))
  }
  
  console.log('保存流程数据:', flowData)
  ElMessage.success('流程保存成功')
}

// 组件挂载
onMounted(() => {
  setTimeout(() => {
    initFlowChart()
  }, 100)
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

// 组件卸载
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (graph.value) {
    graph.value.dispose()
  }
})

// 处理窗口大小变化
const handleResize = () => {
  if (graph.value && canvasRef.value) {
    graph.value.resize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)
  }
}

// 完成任务创建后的回调
const emit = defineEmits<{
  'task-created': [data: any]
}>()
</script>

<style lang="less" scoped>
.create-task-container {
  display: flex;
  height: 100vh;
  background: #f0f2f5;

  // 左侧项目信息抽屉
  .left-drawer {
    width: 300px;
    background: #fff;
    border-right: 1px solid #e8e8e8;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;

    &.collapsed {
      width: 48px;
    }

    .drawer-header {
      height: 48px;
      padding: 0 16px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fafafa;

      .drawer-title {
        font-size: 14px;
        font-weight: 500;
        color: #262626;
      }

      .toggle-btn {
        padding: 4px;
        color: #8c8c8c;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .drawer-content {
      flex: 1;
      padding: 16px;
      overflow-y: auto;

      .project-info {
        .info-item {
          margin-bottom: 16px;

          label {
            display: block;
            font-size: 12px;
            color: #8c8c8c;
            margin-bottom: 4px;
          }

          span {
            font-size: 14px;
            color: #262626;
          }

          .description-text {
            font-size: 14px;
            color: #262626;
            line-height: 1.5;
            word-break: break-word;
          }

          .attachment-list {
            .attachment-item {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px;
              background: #f5f5f5;
              border-radius: 4px;
              font-size: 12px;
              color: #595959;

              .el-icon {
                color: #1890ff;
              }
            }
          }
        }
      }
    }
  }

  // 中间流程图区域
  .center-flowchart {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #fff;
    margin: 0 1px;
    transition: all 0.3s ease;

    &.full-width {
      margin: 0;
    }

    .flowchart-header {
      height: 48px;
      padding: 0 16px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fafafa;

      h2 {
        font-size: 16px;
        font-weight: 500;
        color: #262626;
        margin: 0;
      }

      .toolbar {
        display: flex;
        gap: 8px;

        .el-button {
          font-size: 12px;
        }
      }
    }

    .flowchart-canvas {
      flex: 1;
      position: relative;
    }
  }

  // 右侧任务信息抽屉
  .right-drawer {
    width: 500px;
    background: #fff;
    border-left: 1px solid #e8e8e8;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;

    &.collapsed {
      width: 48px;
    }

    .drawer-header {
      height: 48px;
      padding: 0 16px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fafafa;

      .drawer-title {
        font-size: 14px;
        font-weight: 500;
        color: #262626;
      }

      .toggle-btn {
        padding: 4px;
        color: #8c8c8c;

        &:hover {
          color: #1890ff;
        }
      }
    }

    .drawer-content {
      flex: 1;
      padding: 16px;
      overflow-y: auto;

      .task-form {
        .el-form-item {
          margin-bottom: 16px;

          :deep(.el-form-item__label) {
            font-size: 12px;
            color: #8c8c8c;
          }
        }

        .task-label {
          font-weight: bold;
          color: #262626;
        }

        .execution-days {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #595959;
        }

        .task-stats {
          .stats-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .stats-label {
            color: #8c8c8c;
            font-size: 12px;
          }
        }

        .input-section, .output-section {
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          overflow: hidden;

          .section-title {
            padding: 8px 12px;
            background: #f5f5f5;
            border-bottom: 1px solid #d9d9d9;
            font-weight: 500;
            color: #262626;
          }
          
          .section-actions {
            padding: 8px 12px;
            background: #fafafa;
            border-bottom: 1px solid #d9d9d9;
            display: flex;
            gap: 8px;
            justify-content: flex-start;

            .el-button {
              padding: 0;
              font-size: 12px;
              color: #1890ff;
            }
          }

          .data-table {
            .table-header {
              display: grid;
              grid-template-columns: 2fr 1fr 1fr 2fr 1fr;
              padding: 8px 12px;
              background: #fafafa;
              border-bottom: 1px solid #d9d9d9;
              font-size: 12px;
              font-weight: 500;
              color: #595959;
            }

            .table-row {
              display: grid;
              grid-template-columns: 2fr 1fr 1fr 2fr 1fr;
              padding: 8px 12px;
              border-bottom: 1px solid #f0f0f0;
              font-size: 12px;
              color: #262626;

              &:last-child {
                border-bottom: none;
              }

              &:hover {
                background: #f5f5f5;
              }

              // 操作列样式
              span:last-child {
                display: flex;
                gap: 4px;
                justify-content: center;
                align-items: center;

                .el-button {
                  padding: 2px 6px;
                  font-size: 11px;
                  min-height: auto;
                  line-height: 1.2;
                }
              }
            }
          }
        }

        .form-actions {
          margin-top: 24px;
          display: flex;
          gap: 8px;

          .el-button {
            flex: 1;
          }
        }
      }

      .empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;
      }
    }
  }
}

// X6 连接点和连线样式
:deep(.x6-port) {
  opacity: 0;
  transition: opacity 0.2s ease;
}

:deep(.x6-node:hover .x6-port) {
  opacity: 1;
}

:deep(.x6-port-body) {
  fill: #fff;
  stroke: #31d0c6;
  stroke-width: 2;
  r: 6;
  cursor: crosshair;
  
  &:hover {
    fill: #31d0c6;
    r: 8;
    stroke-width: 3;
  }
}

:deep(.x6-port-magnet) {
  fill: transparent;
  stroke: transparent;
}

// 连线样式
:deep(.x6-edge) {
  cursor: pointer;
  
  &:hover .x6-edge-path {
    stroke: #1890ff;
    stroke-width: 3;
  }
  
  &.x6-edge-selected .x6-edge-path {
    stroke: #1890ff;
    stroke-width: 3;
  }
}

:deep(.x6-edge-path) {
  transition: all 0.2s ease;
}

:deep(.x6-edge-target-marker) {
  fill: #A2A2A2;
  stroke: #A2A2A2;
}

// 拖拽创建连线时的样式
:deep(.x6-graph-svg-stage) {
  .x6-edge.x6-edge-ghost {
    .x6-edge-path {
      stroke: #1890ff;
      stroke-width: 2;
      stroke-dasharray: 5, 5;
      animation: dash 1s linear infinite;
    }
  }
}

@keyframes dash {
  to {
    stroke-dashoffset: -10;
  }
}

// 连接点吸附效果
:deep(.x6-port.x6-port-highlighted) {
  .x6-port-body {
    fill: #52c41a;
    stroke: #52c41a;
    r: 10;
    stroke-width: 3;
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .create-task-container {
    .left-drawer {
      width: 250px;

      &.collapsed {
        width: 48px;
      }
    }

    .right-drawer {
      width: 280px;

      &.collapsed {
        width: 48px;
      }
    }
  }
}
</style>
