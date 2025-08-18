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
              <el-input v-model="selectedTask.name" placeholder="请输入任务名称" />
            </el-form-item>
            
            <el-form-item label="任务类型">
              <el-select v-model="selectedTask.type" placeholder="请选择任务类型">
                <el-option label="开发任务" value="development" />
                <el-option label="测试任务" value="testing" />
                <el-option label="设计任务" value="design" />
                <el-option label="评审任务" value="review" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="负责人">
              <el-select v-model="selectedTask.assignee" placeholder="请选择负责人">
                <el-option label="张三" value="张三" />
                <el-option label="李四" value="李四" />
                <el-option label="王五" value="王五" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="优先级">
              <el-select v-model="selectedTask.priority" placeholder="请选择优先级">
                <el-option label="高" value="high" />
                <el-option label="中" value="medium" />
                <el-option label="低" value="low" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="预计工时">
              <el-input-number 
                v-model="selectedTask.estimatedHours" 
                :min="0" 
                :max="999"
                placeholder="小时"
              />
            </el-form-item>
            
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="selectedTask.startDate"
                type="date"
                placeholder="选择开始时间"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="selectedTask.endDate"
                type="date"
                placeholder="选择结束时间"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            
            <el-form-item label="任务描述">
              <el-input
                v-model="selectedTask.description"
                type="textarea"
                :rows="4"
                placeholder="请输入任务描述"
              />
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
  Document,
  CaretRight,
  CaretDown
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
    id: 'task1',
    name: '需求分析',
    type: 'design',
    assignee: '张三',
    priority: 'high',
    estimatedHours: 40,
    startDate: '2024-01-01',
    endDate: '2024-01-05',
    description: '进行项目需求分析和整理',
    dependencies: [],
    x: 100,
    y: 100,
    expanded: false
  },
  {
    id: 'task2',
    name: '系统设计',
    type: 'design',
    assignee: '李四',
    priority: 'high',
    estimatedHours: 60,
    startDate: '2024-01-06',
    endDate: '2024-01-12',
    description: '进行系统架构设计',
    dependencies: ['task1'],
    x: 300,
    y: 100,
    expanded: false
  },
  {
    id: 'task3',
    name: '开发实现',
    type: 'development',
    assignee: '王五',
    priority: 'medium',
    estimatedHours: 120,
    startDate: '2024-01-13',
    endDate: '2024-01-26',
    description: '进行功能开发实现',
    dependencies: ['task2'],
    x: 500,
    y: 100,
    expanded: false
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
  Graph.registerNode('task-node', {
    inherit: 'rect',
    width: 200,
    height: 80,
    attrs: {
      body: {
        strokeWidth: 2,
        stroke: '#1890ff',
        fill: '#f0f9ff',
        rx: 8,
        ry: 8
      },
      text: {
        fontSize: 14,
        fill: '#262626',
        textAnchor: 'start',
        textVerticalAnchor: 'top'
      }
    },
    markup: [
      {
        tagName: 'rect',
        selector: 'body'
      },
      {
        tagName: 'text',
        selector: 'title'
      },
      {
        tagName: 'text', 
        selector: 'subtitle'
      },
      {
        tagName: 'text',
        selector: 'detail'
      },
      {
        tagName: 'foreignObject',
        selector: 'expand-btn'
      }
    ]
  }, true)
}

// 创建任务节点
const createTaskNode = (task: any) => {
  const node = graph.value!.addNode({
    id: task.id,
    shape: 'task-node',
    x: task.x,
    y: task.y,
    data: task,
    attrs: {
      title: {
        text: task.name,
        x: 12,
        y: 12,
        fontSize: 14,
        fontWeight: 'bold',
        fill: '#262626'
      },
      subtitle: {
        text: `负责人: ${task.assignee}`,
        x: 12,
        y: 32,
        fontSize: 12,
        fill: '#8c8c8c'
      },
      'expand-btn': {
        x: 170,
        y: 8,
        width: 20,
        height: 20
      }
    }
  })

  // 添加展开/收起按钮
  const expandBtn = document.createElement('div')
  expandBtn.innerHTML = task.expanded ? '▼' : '▶'
  expandBtn.style.cssText = `
    width: 16px;
    height: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: #1890ff;
  `
  expandBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    toggleTaskExpansion(task.id)
  })

  const foreignObject = node.findOne('expand-btn') as any
  if (foreignObject) {
    foreignObject.appendChild(expandBtn)
  }

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
  if (node) {
    const height = task.expanded ? 120 : 80
    node.resize(200, height)
    
    // 更新展开按钮
    const expandBtn = node.findOne('expand-btn')?.firstChild as HTMLElement
    if (expandBtn) {
      expandBtn.innerHTML = task.expanded ? '▼' : '▶'
    }
    
    // 更新基本信息
    node.attr('title/text', task.name)
    node.attr('subtitle/text', `负责人: ${task.assignee || '未分配'}`)
    
    // 添加/移除详细信息
    if (task.expanded) {
      node.attr('detail', {
        text: `类型: ${task.type}\n预计: ${task.estimatedHours || 0}h\n时间: ${task.startDate || '未设置'}~${task.endDate || '未设置'}`,
        x: 12,
        y: 52,
        fontSize: 11,
        fill: '#595959'
      })
    } else {
      node.removeAttr('detail')
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
    selecting: {
      enabled: true,
      rubberband: true,
      movable: true
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
    resizing: true,
    rotating: false,
    keyboard: true,
    clipboard: true
  })

  // 注册自定义节点
  registerCustomNode()

  // 添加任务节点
  taskList.value.forEach(task => {
    createTaskNode(task)
  })

  // 添加连接线
  taskList.value.forEach(task => {
    if (task.dependencies && task.dependencies.length > 0) {
      task.dependencies.forEach((depId: string) => {
        graph.value!.addEdge({
          source: depId,
          target: task.id
        })
      })
    }
  })

  // 监听节点选择
  graph.value.on('node:click', ({ node }) => {
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
