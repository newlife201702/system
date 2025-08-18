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
              <span class="task-label">{{ selectedTask.name }}</span>
            </el-form-item>
            
            <el-form-item label="执行天数">
              <div class="execution-days">
                <span>2025.07.5</span>
                <span> ~ </span>
                <span>2025.07.15</span>
              </div>
            </el-form-item>
            
            <el-form-item label="责任人">
              <el-input v-model="selectedTask.assignee" placeholder="李强" />
            </el-form-item>
            
            <el-form-item label="工期关键">
              <div class="task-stats">
                <div class="stats-item">
                  <el-input-number v-model="selectedTask.taskStats.up" :min="0" size="small" />
                  <span class="stats-label">项</span>
                </div>
              </div>
            </el-form-item>
            
            <el-form-item label="输入">
              <div class="input-section">
                <div class="section-header">
                  <span>输入 2项</span>
                  <div class="section-actions">
                    <el-button size="small" text>新增</el-button>
                    <el-button size="small" text>删除</el-button>
                    <el-button size="small" text>编辑</el-button>
                    <el-button size="small" text>模板下载</el-button>
                    <el-button size="small" text>上传</el-button>
                  </div>
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
                    <span>✓ ↓</span>
                  </div>
                </div>
              </div>
            </el-form-item>
            
            <el-form-item label="输出">
              <div class="output-section">
                <div class="section-header">
                  <span>输出 2项</span>
                  <div class="section-actions">
                    <el-button size="small" text>新增</el-button>
                    <el-button size="small" text>删除</el-button>
                    <el-button size="small" text>编辑</el-button>
                    <el-button size="small" text>模板下载</el-button>
                    <el-button size="small" text>上传</el-button>
                  </div>
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
                    <span>✓ ↓</span>
                  </div>
                  <div class="table-row">
                    <span>新的需求</span>
                    <span>图标</span>
                    <span>附件</span>
                    <span>类型</span>
                    <span>操作</span>
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
    taskDays: '12.06 - 2024.01.16',
    taskStats: { up: 3, down: 2 },
    description: '体系需求调研基线',
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
    taskDays: '',
    taskStats: { up: 0, down: 0 },
    description: '',
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
    taskDays: '12.06 - 2024.01.16',
    taskStats: { up: 7, down: 4 },
    description: '体系需求满足度评估基线',
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
    taskDays: '12.06 - 2024.01.16',
    taskStats: { up: 3, down: 2 },
    description: '体系对抗仿真基线',
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
    taskDays: '12.06 - 2024.01.16',
    taskStats: { up: 2, down: 4 },
    description: '体系效能评估基线',
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
  setTimeout(() => {
    if (graph.value) {
      graph.value.resize()
    }
  }, 300)
}

// 切换右侧抽屉
const toggleRightDrawer = () => {
  rightDrawerCollapsed.value = !rightDrawerCollapsed.value
  setTimeout(() => {
    if (graph.value) {
      graph.value.resize()
    }
  }, 300)
}

// 自定义任务节点
const registerCustomNode = () => {
  // 注册任务节点
  Graph.registerNode('task-node', {
    inherit: 'html',
    width: 220,
    height: 100,
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
      { tagName: 'text', selector: 'description' },
      { tagName: 'text', selector: 'expand-indicator' }
    ]
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
        strokeWidth: 2
      },
      // 负责人姓名
      assignee: {
        text: task.assignee || '未分配',
        x: 28,
        y: 54,
        fontSize: 11,
        fill: '#595959'
      },
      // 任务时间
      'task-days': {
        text: task.taskDays || '',
        x: 28,
        y: 70,
        fontSize: 10,
        fill: '#8c8c8c'
      },
      // 上箭头统计
      'stats-up': {
        text: task.taskStats?.up ? `▲ ${task.taskStats.up}` : '',
        x: 150,
        y: 54,
        fontSize: 11,
        fill: '#52c41a'
      },
      // 下箭头统计  
      'stats-down': {
        text: task.taskStats?.down ? `▼ ${task.taskStats.down}` : '',
        x: 180,
        y: 54,
        fontSize: 11,
        fill: '#ff4d4f'
      },
      // 描述信息
      description: {
        text: task.description || '',
        x: 12,
        y: 88,
        fontSize: 10,
        fill: '#8c8c8c'
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
    }
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
    const height = task.expanded ? 140 : 100
    node.resize(220, height)
    
    // 更新展开指示符
    node.attr('expand-indicator/text', task.expanded ? '▼' : '▶')
    
    // 更新基本信息
    node.attr('title/text', task.name)
    node.attr('assignee/text', task.assignee || '未分配')
    node.attr('task-days/text', task.taskDays || '')
    node.attr('stats-up/text', task.taskStats?.up ? `▲ ${task.taskStats.up}` : '')
    node.attr('stats-down/text', task.taskStats?.down ? `▼ ${task.taskStats.down}` : '')
    
    // 更新详细信息
    if (task.expanded) {
      node.attr('description', {
        text: task.description || '',
        x: 12,
        y: 120,
        fontSize: 10,
        fill: '#8c8c8c'
      })
    } else {
      node.attr('description', null)
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
    // 检查是否点击了展开指示符区域
    const target = e.target as SVGElement
    if (target && target.getAttribute('selector') === 'expand-indicator') {
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
  })

  graph.value.on('node:mouseleave', ({ node }) => {
    node.attr('body/stroke', '#1890ff')
    node.attr('body/strokeWidth', 2)
  })
}

// 添加任务
const addTask = () => {
  const newTask = {
    id: `task${Date.now()}`,
    name: '新任务',
    type: 'development',
    assignee: '',
    priority: 'medium',
    estimatedHours: 8,
    startDate: '',
    endDate: '',
    description: '',
    dependencies: [],
    x: Math.random() * 400 + 100,
    y: Math.random() * 200 + 100,
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
    width: 320px;
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

          .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: #f5f5f5;
            border-bottom: 1px solid #d9d9d9;
            font-weight: 500;

            .section-actions {
              display: flex;
              gap: 8px;

              .el-button {
                padding: 0;
                font-size: 12px;
                color: #1890ff;
              }
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
