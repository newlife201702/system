<template>
  <div class="create-task-container">
    <!-- 左侧项目基础信息抽屉 -->
    <div class="left-drawer" :class="{ collapsed: leftDrawerCollapsed }">
      <div class="drawer-header">
        <span class="drawer-title">{{ isTemplateMode ? '任务模板库' : '项目基础信息' }}</span>
        <el-button 
          v-if="isTemplateMode"
          type="primary" 
          size="small"
          @click="createTemplate"
          class="create-template-btn"
        >
          <el-icon><Plus /></el-icon>
        </el-button>
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
        <!-- 任务模板库内容 -->
        <div v-if="isTemplateMode" class="template-content">
          <!-- 搜索区域 -->
          <div class="template-search">
            <el-input
              v-model="templateSearchForm.keyword"
              placeholder="搜索"
              size="small"
              clearable
            >
              <template #suffix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
          
          <!-- 筛选区域 -->
          <div class="template-filters">
            <div class="filter-item">
              <label>创建人:</label>
              <el-select
                v-model="templateSearchForm.creator"
                size="small"
              >
                <el-option
                  v-for="option in creatorOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </div>
            
            <div class="filter-item">
              <label>状态:</label>
              <el-select
                v-model="templateSearchForm.status"
                size="small"
              >
                <el-option
                  v-for="option in statusOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </div>
          </div>
          
          <!-- 模板列表 -->
          <div class="template-list">
            <div
              v-for="template in filteredTemplateList"
              :key="template.id"
              class="template-card"
            >
              <div class="template-header">
                <h4 class="template-name">{{ template.name }}</h4>
                <span class="template-version">版本: {{ template.version }}</span>
              </div>
              
              <div class="template-details">
                <div class="detail-row">
                  <span class="label">{{ template.taskCount }}个任务</span>
                  <span class="creator">由 {{ template.creator }} 创建</span>
                </div>
                <div class="detail-row">
                  <span class="adopt-count">被采用{{ template.adoptCount }}次</span>
                </div>
              </div>
              
              <div class="template-footer">
                <div class="template-status">
                  <el-switch
                    v-model="template.status"
                    active-value="published"
                    inactive-value="unpublished"
                    @change="toggleTemplateStatus(template)"
                  />
                </div>
                <div class="template-version-manage">版本管理</div>
                <div class="template-actions">
                  <el-button
                    type="text"
                    size="small"
                    @click="copyTemplate(template)"
                  >
                    <el-icon><CopyDocument /></el-icon>
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click="deleteTemplate(template)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 项目基础信息内容 -->
        <div v-else class="project-info">
          <div class="info-item">
            <label>项目名称：</label>
            <span>{{ projectInfo.name || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>作战方向：</label>
            <span>{{ projectInfo.directionName || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>任务类型：</label>
            <span>{{ projectInfo.taskTypeName || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>起止时间：</label>
            <span>{{ formatTimeRange(projectInfo.timeRange) || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>团队成员：</label>
            <span>{{ projectInfo.userListName || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>来源：</label>
            <span>{{ projectInfo.region || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>项目负责人：</label>
            <span>{{ projectInfo.projLeader || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>军兵种：</label>
            <span>{{ projectInfo.troopsName || '-' }}</span>
          </div>
          
          <div class="info-item">
            <label>场景描述：</label>
            <div class="description-text">{{ projectInfo.description || '-' }}</div>
          </div>
          
          <div class="info-item">
            <label>活动要求：</label>
            <div class="description-text">{{ projectInfo.requirement || '-' }}</div>
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
    <div class="center-flowchart" :class="{ 
      'full-width': leftDrawerCollapsed && rightDrawerCollapsed,
      'split-view': isTaskDetailMode
    }">
             <div class="flowchart-header">
         <h2>任务流程设计</h2>
         <div class="toolbar">
                       <div class="flow-toggle">
              <!-- <div class="toggle-buttons">
               <el-button 
                 :type="isTaskFlow ? 'primary' : 'default'"
                 size="small"
                 @click="switchToTaskFlow"
                 class="toggle-btn"
               >
                 任务流
               </el-button>
               <el-button 
                 :type="!isTaskFlow ? 'primary' : 'default'"
                 size="small"
                 @click="switchToParameterFlow"
                 class="toggle-btn"
               >
                 参数流
               </el-button>
             </div> -->
             </div>
                       <el-button size="small" @click="addTask('analysis')">
             <el-icon><Plus /></el-icon>
              需求分析
            </el-button>
            <el-button size="small" @click="addTask('design')">
              <el-icon><Plus /></el-icon>
              架构设计
            </el-button>
            <el-button size="small" @click="addTask('simulation')">
              <el-icon><Plus /></el-icon>
              仿真验证
            </el-button>
            <el-button size="small" @click="addTask('evaluation')">
              <el-icon><Plus /></el-icon>
              需求评估
            </el-button>
            <el-button size="small" @click="addTask('performance')">
              <el-icon><Plus /></el-icon>
              效能评估
           </el-button>
           <el-button size="small" @click="saveFlow">
             <el-icon><Document /></el-icon>
             保存流程
           </el-button>
           <el-button size="small" @click="batchPublish">
             <el-icon><Upload /></el-icon>
             批量发布
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
      
      <div v-show="isTaskFlow" class="flowchart-canvas" ref="canvasRef" :class="{ 'half-height': isTaskDetailMode }"></div>
      <div v-show="!isTaskFlow" class="er-canvas" ref="erCanvasRef" :class="{ 'half-height': isTaskDetailMode }"></div>
      
      <!-- 任务详细信息区域 -->
      <div v-if="isTaskDetailMode && selectedTask" class="task-detail-section">
        <div class="task-detail-header">
          <h3>{{ selectedTask.name }}任务详细信息</h3>
          <div class="task-detail-info">
            <div class="info-row">
              <div class="info-item">
                <el-icon><User /></el-icon>
                <span class="label">负责人：</span>
                <span class="value">{{ getAssigneeName(selectedTask.assignee) }}</span>
              </div>
              <div class="info-item">
                <el-icon><Setting /></el-icon>
                <span class="label">截止日期：</span>
                <span class="value">{{ getEndDate(selectedTask.dateRange) }}</span>
                <span class="remaining-days" :class="getRemainingDaysClass(selectedTask.dateRange)">
                  {{ getRemainingDays(selectedTask.dateRange) }}
                </span>
              </div>
              <div class="info-item">
                <el-icon><Flag /></el-icon>
                <span class="label">创建人：</span>
                <span class="value">王治军</span>
              </div>
              <div class="info-item">
                <el-icon><Calendar /></el-icon>
                <span class="label">发布时间：</span>
                <span class="value">2025-06-26</span>
              </div>
            </div>
            <div class="action-buttons">
              <el-button type="primary" size="small">上传电磁大数据</el-button>
              <el-button type="primary" size="small">从基于模型的设计与管理系统下载</el-button>
              <el-button type="primary" size="small">从模型库下载模型</el-button>
            </div>
          </div>
        </div>
        
        <div class="task-detail-content">
          <div class="input-output-container">
            <!-- 输入区域 -->
            <div class="input-section">
              <div class="section-title">
                <span>输入 {{ selectedTask.inputs ? selectedTask.inputs.length : 0 }}项</span>
              </div>
              <div class="section-actions">
                <el-button type="primary" size="small">获取体系需求</el-button>
              </div>
              
              <div class="data-table">
                <div class="table-header">
                  <span>名称</span>
                  <span>密级</span>
                  <span>类型</span>
                  <span>附件</span>
                  <span>版本</span>
                  <span>更新时间</span>
                  <span>操作</span>
                </div>
                
                <div class="table-body">
                  <div class="table-row input-row" v-for="(input, index) in selectedTask.inputs" :key="index">
                    <!-- 任务详细信息模式下输入始终不可编辑 -->
                    <span :title="input.name">{{ input.name }}</span>
                    <span :title="input.securityLevelName">{{ input.securityLevelName }}</span>
                    <span :title="input.dataTypeCode">{{ input.dataTypeCode }}</span>
                    <span :title="input.dataTypeValue ? input.dataTypeValue.name : '无'">{{ input.dataTypeValue ? input.dataTypeValue.name : '无' }}</span>
                    <span>1.0</span>
                    <span>2025-06-25</span>
                    <span>
                      <el-button size="small" text type="danger" @click="deleteInput(index)">删除</el-button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 输出区域 -->
            <div class="output-section">
              <div class="section-title">
                <span>输出 {{ selectedTask.outputs ? selectedTask.outputs.length : 0 }}项</span>
              </div>
              <div class="section-actions">
                <el-button type="success" size="small">获取体系模型</el-button>
                <el-button type="primary" size="small">提交审批</el-button>
              </div>
              
              <div class="data-table">
                <div class="table-header">
                  <span>选择</span>
                  <span>名称</span>
                  <span>密级</span>
                  <span>类型</span>
                  <span>附件</span>
                  <span>状态</span>
                  <span>版本</span>
                  <span>更新时间</span>
                  <span>操作</span>
                </div>
                
                <div class="table-body">
                  <div class="table-row output-row" v-for="(output, index) in selectedTask.outputs" :key="index">
                    <!-- 编辑态 -->
                    <template v-if="output.isEditing">
                      <span>
                        <el-checkbox />
                      </span>
                      <span>
                        <el-input v-model="output.name" size="small" placeholder="请输入名称" />
                      </span>
                      <span>
                        <el-select v-model="output.securityLevelCode" size="small" @change="updateOutputSecurityLevelName(output)">
                          <el-option label="公开" value="SECRET_LEVEL_OPEN" />
                          <el-option label="内部" value="SECRET_LEVEL_INTERNAL" />
                          <el-option label="普通商密" value="SECRET_LEVEL_NORMAL_COMMERCIAL" />
                          <el-option label="秘密" value="SECRET_LEVEL_SECRET" />
                          <el-option label="机密" value="SECRET_LEVEL_CONFIDENTIALITY" />
                          <el-option label="核心商密" value="SECRET_LEVEL_CORE_COMMERCIAL" />
                        </el-select>
                      </span>
                      <span>
                        <el-select v-model="output.dataTypeCode" size="small">
                          <el-option label="文件" value="文件" />
                          <el-option label="模型" value="模型" />
                          <el-option label="数据" value="数据" />
                        </el-select>
                      </span>
                      <span>
                        <div class="file-upload-wrapper">
                          <span @click="uploada(index)">
                            上传
                          </span>
                          <div v-if="output.dataTypeValue" class="file-info">
                            <span class="file-name">{{ output.dataTypeValue.name }}</span>
                            <el-button size="small" type="danger" text @click="handleOutputFileRemove(index)">
                              删除
                            </el-button>
                          </div>
                          <span v-else class="no-file">无文件</span>
                        </div>
                      </span>
                      <span>
                        <el-tag :type="getStatusType(output.status || 'draft')" size="small">
                          {{ getStatusText(output.status || 'draft') }}
                        </el-tag>
                      </span>
                      <span>{{ output.version || '1.0' }}</span>
                      <span>{{ output.updateTime || '2025-06-26' }}</span>
                      <span>
                        <el-button size="small" text type="primary" @click="confirmOutputEdit(index)">确定</el-button>
                        <el-button size="small" text type="danger" @click="deleteOutput(index)">删除</el-button>
                      </span>
                    </template>
                    <!-- 非编辑态 -->
                    <template v-else>
                      <span>
                        <el-checkbox />
                      </span>
                      <span :title="output.name">{{ output.name }}</span>
                      <span :title="output.securityLevelName">{{ output.securityLevelName }}</span>
                      <span :title="output.dataTypeCode">{{ output.dataTypeCode }}</span>
                      <span :title="output.dataTypeValue ? output.dataTypeValue.name : '无'">{{ output.dataTypeValue ? output.dataTypeValue.name : '无' }}</span>
                      <span>
                        <el-tag :type="getStatusType(output.status || 'published')" size="small">
                          {{ getStatusText(output.status || 'published') }}
                        </el-tag>
                      </span>
                      <span>{{ output.version || '1.0' }}</span>
                      <span>{{ output.updateTime || '2025-06-26' }}</span>
                      <span>
                        <!-- 已发布状态不显示编辑按钮 -->
                        <el-button 
                          v-if="output.status !== 'published'" 
                          size="small" 
                          text 
                          type="primary" 
                          @click="editOutput(index)"
                        >
                          编辑
                        </el-button>
                        <el-button size="small" text type="danger" @click="deleteOutput(index)">删除</el-button>
                      </span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 底部操作按钮 -->
        <div class="task-detail-footer">
          <el-button>任务接收</el-button>
          <el-button>拒绝接收任务</el-button>
          <el-button type="success">任务提交</el-button>
          <el-button>变更申请</el-button>
          <el-button>更新进度</el-button>
          <el-button type="warning">启动工具</el-button>
          <el-button type="primary">提交任务</el-button>
        </div>
      </div>
    </div>

    <!-- 右侧任务基础信息抽屉 -->
    <div v-if="!isTaskDetailMode" class="right-drawer" :class="{ collapsed: rightDrawerCollapsed }">
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
            
            <el-form-item label="起止时间" v-if="systemType !== 'efficiency'">
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
            
            <el-form-item label="执行天数" v-if="systemType !== 'efficiency'">
              <el-input-number 
                v-model="selectedTask.executionDays" 
                :min="1" 
                :max="365"
                placeholder="天数"
              />
            </el-form-item>
                        
            <!-- 体系需求满足度评估系统特有字段 -->
            <template v-if="systemType === 'satisfaction'">
              <el-form-item label="任务类型">
                <el-select v-model="selectedTask.satisfactionTaskType" placeholder="请选择任务类型">
                  <el-option label="类型1" value="type1" />
                  <el-option label="类型2" value="type2" />
                  <el-option label="类型3" value="type3" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="任务类别">
                <el-select v-model="selectedTask.satisfactionTaskCategory" placeholder="请选择任务类别">
                  <el-option label="类别1" value="category1" />
                  <el-option label="类别2" value="category2" />
                  <el-option label="类别3" value="category3" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="作战方向">
                <el-select v-model="selectedTask.satisfactionDirection" placeholder="请选择作战方向">
                  <el-option label="南海" value="nanhai" />
                  <el-option label="东海" value="donghai" />
                  <el-option label="黄海" value="huanghai" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="场景描述">
                <el-input 
                  v-model="selectedTask.satisfactionScenario" 
                  type="textarea" 
                  placeholder="请输入场景描述"
                  :rows="3"
                />
              </el-form-item>
              
              <el-form-item label="来源">
                <el-input v-model="selectedTask.satisfactionSource" placeholder="请输入来源" />
              </el-form-item>
              
              <el-form-item label="任务要求">
                <el-input 
                  v-model="selectedTask.satisfactionRequirement" 
                  type="textarea" 
                  placeholder="请输入任务要求"
                  :rows="3"
                />
              </el-form-item>
              
              <el-form-item label="描述">
                <el-input 
                  v-model="selectedTask.satisfactionDescription" 
                  type="textarea" 
                  placeholder="请输入描述"
                  :rows="3"
                />
              </el-form-item>
            </template>

            <!-- 体系效能评估系统特有字段 -->
            <template v-if="systemType === 'efficiency'">
              <el-form-item label="评估时间">
                <el-date-picker
                  v-model="selectedTask.efficiencyEvalTime"
                  type="daterange"
                  range-separator=" - "
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="YYYY.MM.DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
              
              <el-form-item label="评估人员">
                <el-select v-model="selectedTask.efficiencyEvaluator" multiple placeholder="请选择评估人员" class="form-select">
                  <el-option v-for="(item, index) in userListOption" :key="'evaluator' + index" :label="item.name" :value="item.id" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="评估条件">
                <el-input 
                  v-model="selectedTask.efficiencyCondition" 
                  type="textarea" 
                  placeholder="请输入评估条件"
                  :rows="3"
                />
              </el-form-item>
              
              <el-form-item label="评估类型">
                <el-input v-model="selectedTask.efficiencyType" placeholder="请输入评估类型" />
              </el-form-item>
              
              <el-form-item label="评估目标">
                <el-input 
                  v-model="selectedTask.efficiencyTarget" 
                  type="textarea" 
                  placeholder="请输入评估目标"
                  :rows="3"
                />
              </el-form-item>
              
              <el-form-item label="评估对象">
                <el-input 
                  v-model="selectedTask.efficiencyObject" 
                  type="textarea" 
                  placeholder="请输入评估对象"
                  :rows="3"
                />
              </el-form-item>
              
              <el-form-item label="评估范围">
                <el-input 
                  v-model="selectedTask.efficiencyScope" 
                  type="textarea" 
                  placeholder="请输入评估范围"
                  :rows="3"
                />
              </el-form-item>
            </template>
                        
          <el-form-item label="责任人" prop="assignee" required v-if="systemType !== 'efficiency'">
                <el-select v-model="selectedTask.assignee" multiple placeholder="请选择" class="form-select">
                    <el-option v-for="(item, index) in userListOption" :key="'person' + index" :label="item.name"
                        :value="item.id" />
                </el-select>
            </el-form-item>


            <el-form-item prop="toolAssociation" label="工具关联">
              <!-- <el-select v-model="selectedTask." placeholder="">
                <el-option label="需求管理工具" value="requirement-tool" />
                <el-option label="设计工具" value="design-tool" />
                <el-option label="仿真工具" value="simulation-tool" />
                <el-option label="测试工具" value="test-tool" />
                <el-option label="项目管理工具" value="project-tool" />
              </el-select> -->
                <el-select v-model="selectedTask.toolAssociation" placeholder="请选择关联工具">
                    <el-option v-for="(item, index) in toolListOption" :key="'tool' + index" :label="item.name"
                        :value="item.id" />
                </el-select>
              
            </el-form-item>
            
            <el-form-item label="▲">
              <div class="input-section">
                <div class="section-title">
                  <span>输入 {{ selectedTask.inputs ? selectedTask.inputs.length : 0 }}项</span>
                </div>
                <div class="section-actions">
                  <el-button size="small" text @click="addInput">新增</el-button>
                  <el-button size="small" text>模型下载</el-button>
                </div>
                                       <div class="data-table">
                         <div class="table-header">
                           <span>名称</span>
                           <span>密级</span>
                           <span>类型</span>
                           <span>附件</span>
                           <span>操作</span>
                         </div>
                         <div class="table-row" v-for="(input, index) in selectedTask.inputs" :key="index">
                           <!-- 编辑态 -->
                           <template v-if="input.isEditing">
                             <span>
                               <el-input v-model="input.name" size="small" placeholder="请输入名称" />
                             </span>
                             <span>
                               <el-select v-model="input.securityLevelCode" size="small" placeholder="请选择密级" @change="updateInputSecurityLevelName(input)">
                                 <el-option label="公开" value="SECRET_LEVEL_OPEN" />
                                 <el-option label="内部" value="SECRET_LEVEL_INTERNAL" />
                                 <el-option label="普通商密" value="SECRET_LEVEL_NORMAL_COMMERCIAL" />
                                 <el-option label="秘密" value="SECRET_LEVEL_SECRET" />
                                 <el-option label="机密" value="SECRET_LEVEL_CONFIDENTIALITY" />
                                 <el-option label="核心商密" value="SECRET_LEVEL_CORE_COMMERCIAL" />
                               </el-select>
                             </span>
                             <span>
                               <el-select v-model="input.dataTypeCode" size="small" placeholder="请选择类型">
                                  <el-option label="文件" value="TASK_INOUTPUT_DATA_TYPE_CODE_FILE" />
                                 <el-option label="数据" value="TASK_INOUTPUT_DATA_TYPE_CODE_DATA" />
                                 <el-option label="文本" value="TASK_INOUTPUT_DATA_TYPE_CODE_TEXT" />
                               </el-select>
                             </span>
                             <span>
                               <div class="file-upload-wrapper">
                                 <!-- <el-upload
                                   :file-list="[]"
                                   :on-change="(file: any) => handleInputFileChange(file, index)"
                                   :before-upload="() => false"
                                   :show-file-list="false"
                                   accept="*"
                                 >
                                   <el-button size="small" type="primary" text>
                                     选择文件
                                   </el-button>
                                 </el-upload> -->
                                 <span @click="uploada(index)">
                                    上传
                                 </span>
                                 <div v-if="input.dataTypeValue" class="file-info">

                                   <span class="file-name">{{ input.dataTypeValue.name }}</span>
                                   <el-button size="small" type="danger" text @click="handleInputFileRemove(index)">
                                     删除
                                   </el-button>
                                 </div>
                                 <span v-else class="no-file">无文件</span>
                               </div>
                             </span>
                             <span>
                               <el-button size="small" text type="primary" @click="confirmInputEdit(index)">确定</el-button>
                               <el-button size="small" text type="danger" @click="deleteInput(index)">删除</el-button>
                             </span>
                           </template>
                           <!-- 非编辑态 -->
                           <template v-else>
                            <span :title="input.name">{{ input.name }}</span>
                            <span :title="input.securityLevelName">{{ input.securityLevelName }}</span>
                            <span :title="input.dataTypeCode">{{ input.dataTypeCode }}</span>
                            <span :title="input.dataTypeValue ? input.dataTypeValue.name : '无'">{{ input.dataTypeValue ? input.dataTypeValue.name : '无' }}</span>
                             <span>
                               <el-button size="small" text type="primary" @click="editInput(index)">编辑</el-button>
                               <el-button size="small" text type="danger" @click="deleteInput(index)">删除</el-button>
                             </span>
                           </template>
                         </div>
                         <div class="table-row" v-if="!selectedTask.inputs || selectedTask.inputs.length === 0">
                           <span colspan="5" style="text-align: center; color: #999;">暂无数据</span>
                         </div>
                       </div>
              </div>
            </el-form-item>
            
            <el-form-item label="▼">
              <div class="output-section">
                <div class="section-title">
                  <span>输出 {{ selectedTask.outputs ? selectedTask.outputs.length : 0 }}项</span>
                </div>
                <div class="section-actions">
                  <el-button size="small" text @click="addOutput">新增</el-button>
                  <el-button size="small" text>上传至模型库</el-button>
                  <el-button size="small" text>解析模型</el-button>
                </div>
                                       <div class="data-table">
                         <div class="table-header">
                           <span>名称</span>
                           <span>密级</span>
                           <span>类型</span>
                           <span>附件</span>
                           <span>操作</span>
                         </div>
                         <div class="table-row" v-for="(output, index) in selectedTask.outputs" :key="index">
                           <!-- 编辑态 -->
                           <template v-if="output.isEditing">
                             <span>
                               <el-input v-model="output.name" size="small" placeholder="请输入名称" />
                             </span>
                             <span>
                               <el-select v-model="output.securityLevelCode" size="small" placeholder="请选择密级" @change="updateOutputSecurityLevelName(output)">
                                 <el-option label="公开" value="SECRET_LEVEL_OPEN" />
                                 <el-option label="内部" value="SECRET_LEVEL_INTERNAL" />
                                 <el-option label="普通商密" value="SECRET_LEVEL_NORMAL_COMMERCIAL" />
                                 <el-option label="秘密" value="SECRET_LEVEL_SECRET" />
                                 <el-option label="机密" value="SECRET_LEVEL_CONFIDENTIALITY" />
                                 <el-option label="核心商密" value="SECRET_LEVEL_CORE_COMMERCIAL" />
                               </el-select>
                             </span>
                             <span>
                               <el-select v-model="output.dataTypeCode" size="small" placeholder="请选择类型">
                                 <el-option label="文件" value="TASK_INOUTPUT_DATA_TYPE_CODE_FILE" />
                                 <el-option label="数据" value="TASK_INOUTPUT_DATA_TYPE_CODE_DATA" />
                                 <el-option label="文本" value="TASK_INOUTPUT_DATA_TYPE_CODE_TEXT" />
                               </el-select>
                             </span>
                             <span>
                               <div class="file-upload-wrapper">
                                 <!-- <el-upload
                                   :file-list="[]"
                                   :on-change="(file: any) => handleOutputFileChange(file, index)"
                                   :before-upload="() => false"
                                   :show-file-list="false"
                                   accept="*"
                                 >
                                   <el-button size="small" type="primary" text>
                                     选择文件
                                   </el-button>
                                 </el-upload>  -->

                                <span @click="uploada(index)">
                                    上传
                                 </span>
                                 <div v-if="output.dataTypeValue" class="file-info">
                                   <span class="file-name">{{ output.dataTypeValue.name }}</span>
                                   <el-button size="small" type="danger" text @click="handleOutputFileRemove(index)">
                                     删除
                                   </el-button>
                                 </div>
                                 <span v-else class="no-file">无文件</span>
                               </div>
                             </span>
                             <span>
                               <el-button size="small" text type="primary" @click="confirmOutputEdit(index)">确定</el-button>
                               <el-button size="small" text type="danger" @click="deleteOutput(index)">删除</el-button>
                             </span>
                           </template>
                           <!-- 非编辑态 -->
                           <template v-else>
                            <span :title="output.name">{{ output.name }}</span>
                            <span :title="output.securityLevelName">{{ output.securityLevelName }}</span>
                            <span :title="output.dataTypeCode">{{ output.dataTypeCode }}</span>
                            <span :title="output.dataTypeValue ? output.dataTypeValue.name : '无'">{{ output.dataTypeValue ? output.dataTypeValue.name : '无' }}</span>
                             <span>
                               <el-button size="small" text type="primary" @click="editOutput(index)">编辑</el-button>
                               <el-button size="small" text type="danger" @click="deleteOutput(index)">删除</el-button>
                             </span>
                           </template>
                         </div>
                         <div class="table-row" v-if="!selectedTask.outputs || selectedTask.outputs.length === 0">
                           <span colspan="5" style="text-align: center; color: #999;">暂无数据</span>
                         </div>
                       </div>
              </div>
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
       <file-upload-dialog @setFileList="afterUpload" ref='uploadRef'></file-upload-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import * as api from '@/api'
import fileUploadDialog from '@/components/fileUploadDialog.vue'
import { Graph, Node, Edge, Shape } from '@antv/x6'
import { ElMessage } from 'element-plus'
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Document,
  Search,
  CopyDocument,
  Delete,
  User,
  Setting,
  Flag,
  Calendar,
  Upload
} from '@element-plus/icons-vue'
import { number } from 'echarts'
import { uuid } from '@/libs/utils'

// 定义组件的 props
const props = defineProps<{
  projectId?: string
  taskId?: string
  projectData?: any
  isTemplateMode?: boolean
  isTaskDetailMode?: boolean
}>()

// 路由相关
const route = useRoute()

// 判断是否为模板管理模式
const isTemplateMode = computed(() => {
  return props.isTemplateMode || route.name === 'taskTemplate'
})

// 判断是否为任务详细信息模式
const isTaskDetailMode = computed(() => {
  return props.isTaskDetailMode || route.name === 'taskDetail'
})

// 响应式数据
const leftDrawerCollapsed = ref(false)
const rightDrawerCollapsed = ref(false)
const canvasRef = ref<HTMLElement>()
const erCanvasRef = ref<HTMLElement>()
const graph = ref<Graph>()
const erGraph = ref<Graph>()
const selectedTask = ref<any>(null)
const isTaskFlow = ref(true) // 默认显示任务流
const uploadRef = ref()
const userListOption = ref<any>()
const toolListOption =  ref<any>()
// 项目信息
const projectId =  route?.query?.projectId as string

// 任务模板相关数据
const templateSearchForm = reactive({
  keyword: '',
  creator: 'all',
  status: 'all'
})

const templateList = ref([
  {
    id: 'template1',
    name: 'XXX-001体系研发任务',
    version: 'v1.0',
    taskCount: 2,
    creator: '全慧宇',
    adoptCount: 200,
    status: 'published', // published | unpublished
    createTime: '2024-01-01',
    // 模板节点数据 - 与taskList结构一致
    taskList: [
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
        id: 'template1-task1',
        name: '需求分析任务',
        type: 'analysis',
        nodeType: 'task',
        assignee: [],
        taskStats: { up: 0, down: 0 },
        dateRange: null,
        executionDays: null,
        toolAssociation: '',
        x: 200,
        y: 80,
        expanded: false,
        inputs: [],
        outputs: [],
        satisfactionTaskType: '',
        satisfactionTaskCategory: '',
        satisfactionDirection: '',
        satisfactionScenario: '',
        satisfactionSource: '',
        satisfactionRequirement: '',
        satisfactionDescription: '',
        efficiencyEvalTime: null,
        efficiencyEvaluator: [],
        efficiencyCondition: '',
        efficiencyType: '',
        efficiencyTarget: '',
        efficiencyObject: '',
        efficiencyScope: ''
      },
      {
        id: 'template1-task2',
        name: '架构设计任务',
        type: 'design',
        nodeType: 'task',
        assignee: [],
        taskStats: { up: 0, down: 0 },
        dateRange: null,
        executionDays: null,
        toolAssociation: '',
        x: 400,
        y: 80,
        expanded: false,
        inputs: [],
        outputs: [],
        satisfactionTaskType: '',
        satisfactionTaskCategory: '',
        satisfactionDirection: '',
        satisfactionScenario: '',
        satisfactionSource: '',
        satisfactionRequirement: '',
        satisfactionDescription: '',
        efficiencyEvalTime: null,
        efficiencyEvaluator: [],
        efficiencyCondition: '',
        efficiencyType: '',
        efficiencyTarget: '',
        efficiencyObject: '',
        efficiencyScope: ''
      },
      {
        id: 'end',
        name: '结束',
        type: 'end',
        nodeType: 'end',
        x: 600,
        y: 150,
        shape: 'circle'
      }
    ],
    // 模板连线数据 - 与taskConnections结构一致
    taskConnections: [
      {
        id: 'start-to-template1-task1',
        source: 'start',
        target: 'template1-task1',
        sourceAnchor: 'bottom',
        targetAnchor: 'top'
      },
      {
        id: 'template1-task1-to-template1-task2',
        source: 'template1-task1',
        target: 'template1-task2',
        sourceAnchor: 'bottom',
        targetAnchor: 'top'
      },
      {
        id: 'template1-task2-to-end',
        source: 'template1-task2',
        target: 'end',
        sourceAnchor: 'bottom',
        targetAnchor: 'top'
      }
    ]
  },
  {
    id: 'template2', 
    name: 'XXX-002体系研发任务',
    version: 'v1.0',
    taskCount: 25,
    creator: '章宇',
    adoptCount: 10,
    status: 'published',
    createTime: '2024-01-02'
  },
  {
    id: 'template3',
    name: 'XXX-003体系研发任务', 
    version: 'v1.0',
    taskCount: 25,
    creator: '胡林杰',
    adoptCount: 10,
    status: 'published',
    createTime: '2024-01-03'
  },
  {
    id: 'template4',
    name: 'XXX-004体系研发任务',
    version: 'v1.0', 
    taskCount: 25,
    creator: '章宇',
    adoptCount: 10,
    status: 'published',
    createTime: '2024-01-04'
  },
  {
    id: 'template5',
    name: 'XXX-005体系研发任务',
    version: 'v1.0',
    taskCount: 25,
    creator: '章宇', 
    adoptCount: 10,
    status: 'unpublished',
    createTime: '2024-01-05'
  },
  {
    id: 'template6',
    name: 'XXX-006体系研发任务',
    version: 'v2.0',
    taskCount: 20,
    creator: '章宇',
    adoptCount: 10, 
    status: 'unpublished',
    createTime: '2024-01-06'
  }
])

// 创建人选项
const creatorOptions = [
  { label: '全部', value: 'all' },
  { label: '自己', value: 'self' }
]

// 状态选项 
const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '未发布', value: 'unpublished' },
  { label: '已发布', value: 'published' }
]

// 过滤后的模板列表
const filteredTemplateList = computed(() => {
  return templateList.value.filter(template => {
    // 关键字搜索
    const keywordMatch = !templateSearchForm.keyword || 
      template.name.toLowerCase().includes(templateSearchForm.keyword.toLowerCase())
    
    // 创建人搜索
    const creatorMatch = templateSearchForm.creator === 'all' || 
      (templateSearchForm.creator === 'self' && template.creator === '自己') // 这里应该与当前用户匹配
    
    // 状态搜索
    const statusMatch = templateSearchForm.status === 'all' || 
      template.status === templateSearchForm.status
    
    return keywordMatch && creatorMatch && statusMatch
  })
})

// 系统类型识别
const systemType = computed(() => {
  // 根据选中任务的type来判断系统类型
  if (!selectedTask.value) {
    return "requirement" // 默认返回需求管理系统
  }
  
  const taskType = selectedTask.value.type
  if (['analysis', 'design', 'simulation'].includes(taskType)) {
    return "requirement" // 体系需求管理系统
  } else if (taskType === 'evaluation') {
    return "satisfaction" // 体系需求满足度评估系统
  } else if (taskType === 'performance') {
    return "efficiency" // 体系效能评估系统
  }
  
  return "requirement" // 默认为需求管理系统
})

const projectInfo = reactive<ReqMyPackageAddFormData>({
    id: "",
    flowId: "",
    about: "",
    code: "",
    departmentRelaName: '研究所',
    departmentRelaIds: ['CA37C82FC62649A7A9D407072C6B9321'],
    departmentTypeCode: "PROJECT_DEPT_TYPE_RESPONSIBLE",
    levelCode: "",
    levelName: "",
    memo: "",
    name: "",
    personTypeCode: "PROJECT_PERSON_TYPE_RESPONSIBLE",
    personRelaIds: [],
    personRelaList: [],
    extendProjectParam: [],
    region: "",
    direction : "",
    taskType: [],
    troops: [],
    securityLevelCode: "",
    planBeginDate: "",
    planEndDate: "",
    description:"",
    attachments:"",
    timeRange:[],
    requirement:"",
    userListName:"",
    troopsName:"",
    taskTypeName:"",
    directionName:"",
    projLeader:"",
    temProjectId:"",
    businessCode: "BUSINESS_CODE_TXZJXT",
 })

// ER图数据
const erData = ref({
  entities: [
    {
      id: 'user',
      name: '用户',
      x: 100,
      y: 100,
      attributes: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'varchar(50)' },
        { name: 'email', type: 'varchar(100)' },
        { name: 'created_at', type: 'datetime' }
      ]
    },
    {
      id: 'order',
      name: '订单',
      x: 400,
      y: 100,
      attributes: [
        { name: 'id', type: 'int' },
        { name: 'user_id', type: 'int' },
        { name: 'amount', type: 'decimal(10,2)' },
        { name: 'status', type: 'varchar(20)' },
        { name: 'created_at', type: 'datetime' }
      ]
    },
    {
      id: 'product',
      name: '产品',
      x: 700,
      y: 100,
      attributes: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'varchar(100)' },
        { name: 'price', type: 'decimal(8,2)' },
        { name: 'category_id', type: 'int' },
        { name: 'created_at', type: 'datetime' }
      ]
    },
    {
      id: 'order_item',
      name: '订单项',
      x: 400,
      y: 300,
      attributes: [
        { name: 'id', type: 'int' },
        { name: 'order_id', type: 'int' },
        { name: 'product_id', type: 'int' },
        { name: 'quantity', type: 'int' },
        { name: 'price', type: 'decimal(8,2)' }
      ]
    }
  ],
  relations: [
    {
      id: 'user_id_relation',
      sourceEntity: 'user',
      sourceAttribute: 'id',
      targetEntity: 'order',
      targetAttribute: 'user_id'
    },
    {
      id: 'order_id_relation',
      sourceEntity: 'order',
      sourceAttribute: 'id',
      targetEntity: 'order_item',
      targetAttribute: 'order_id'
    },
    {
      id: 'product_id_relation',
      sourceEntity: 'product',
      sourceAttribute: 'id',
      targetEntity: 'order_item',
      targetAttribute: 'product_id'
    },
    {
      id: 'name_relation',
      sourceEntity: 'user',
      sourceAttribute: 'name',
      targetEntity: 'product',
      targetAttribute: 'name'
    }
  ]
})

// 任务列表
const taskList = ref<any>([
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
    name: '体系需求管理系统任务',
    type: 'analysis',
    nodeType: 'task',
    assignee: ['8c0e1a26402c49278031861ebb8d28bb'],
    taskStats: { up: 1, down: 1 },
    dateRange: ['2024-01-06', '2024-01-16'],
    executionDays: 10,
    toolAssociation:"1",
    x: 200,
    y: 80,
    expanded: false,
    // 输入输出数据
    inputs: [
      {
         id: '',
        name: '体系需求',
         taskId: 'task1',
        securityLevelCode: 'SECRET_LEVEL_INTERNAL',
        securityLevelName: '内部',
        dataTypeCode: 'TASK_INOUTPUT_DATA_TYPE_CODE_FILE',
        dataTypeValue: 'xxx需求.Req',
        isEditing: false
      }
    ],
    outputs: [
      {
         id: '',
        name: '体系需求Req',
         taskId: 'task1',
        securityLevelCode: 'SECRET_LEVEL_INTERNAL',
        securityLevelName: '内部',
        dataTypeCode: 'TASK_INOUTPUT_DATA_TYPE_CODE_FILE',
        dataTypeValue: 'xxx需求.Req',
        isEditing: false
      }
     ],
    // 体系需求满足度评估系统特有字段
    satisfactionTaskType: '',
    satisfactionTaskCategory: '',
    satisfactionDirection: '',
    satisfactionScenario: '',
    satisfactionSource: '',
    satisfactionRequirement: '',
    satisfactionDescription: '',
    // 体系效能评估系统特有字段
    efficiencyEvalTime: null,
    efficiencyEvaluator: [],
    efficiencyCondition: '',
    efficiencyType: '',
    efficiencyTarget: '',
    efficiencyObject: '',
    efficiencyScope: ''
  },
  {
    id: 'task2',
    name: '体系架构设计任务',
    type: 'design',
    nodeType: 'task',
    assignee: ['8c0e1a26402c49278031861ebb8d28bb'],
    taskStats: { up: 0, down: 0 },
    dateRange: ['2024-01-06', '2024-01-16'],
    executionDays: 10,
    toolAssociation:"2",
    x: 420,
    y: 180,
    expanded: false,
    inputs: [
      {
         id: '',
        name: '体系需求Req',
         taskId: 'task2',
        securityLevelCode: 'SECRET_LEVEL_INTERNAL',
        securityLevelName: '内部',
        dataTypeCode: 'TASK_INOUTPUT_DATA_TYPE_CODE_FILE',
        dataTypeValue: 'xxx需求.Req',
        isEditing: false
      }
    ],
    outputs: [
      {
         id: '',
        name: '体系模型',
         taskId: 'task2',
        securityLevelCode: 'SECRET_LEVEL_INTERNAL',
        securityLevelName: '内部',
        dataTypeCode: 'TASK_INOUTPUT_DATA_TYPE_CODE_FILE',
        dataTypeValue: 'dodaf',
        isEditing: false
      }
     ],
    // 体系需求满足度评估系统特有字段
    satisfactionTaskType: '',
    satisfactionTaskCategory: '',
    satisfactionDirection: '',
    satisfactionScenario: '',
    satisfactionSource: '',
    satisfactionRequirement: '',
    satisfactionDescription: '',
    // 体系效能评估系统特有字段
    efficiencyEvalTime: null,
    efficiencyEvaluator: [],
    efficiencyCondition: '',
    efficiencyType: '',
    efficiencyTarget: '',
    efficiencyObject: '',
    efficiencyScope: ''
  },
  {
    id: 'task3',
    name: '体系需求满足度评估任务',
    type: 'evaluation',
    nodeType: 'task',
    assignee: ['8c0e1a26402c49278031861ebb8d28bb'],
    taskStats: { up: 1, down: 2 },
    dateRange: ['2024-01-06', '2024-01-16'],
    executionDays: 10,
    toolAssociation: "3",
    x: 220,
    y: 320,
    expanded: false,
    inputs: [
      {
         id: '',
        name: '体系模型',
         taskId: 'task3',
        securityLevelCode: 'SECRET_LEVEL_INTERNAL',
        securityLevelName: '内部',
        dataTypeCode: 'TASK_INOUTPUT_DATA_TYPE_CODE_FILE',
        dataTypeValue: 'dodaf',
        isEditing: false
      }
    ],
    outputs: [
      {
         id: '',
        name: '体系需求满足度评估报告',
         taskId: 'task3',
        securityLevelCode: 'SECRET_LEVEL_INTERNAL',
        securityLevelName: '内部',
        dataTypeCode: 'TASK_INOUTPUT_DATA_TYPE_CODE_FILE',
        dataTypeValue: '评估报告',
        isEditing: false
      }
     ],
    // 体系需求满足度评估系统特有字段
    satisfactionTaskType: '',
    satisfactionTaskCategory: '',
    satisfactionDirection: '',
    satisfactionScenario: '',
    satisfactionSource: '',
    satisfactionRequirement: '',
    satisfactionDescription: '',
    // 体系效能评估系统特有字段
    efficiencyEvalTime: null,
    efficiencyEvaluator: [],
    efficiencyCondition: '',
    efficiencyType: '',
    efficiencyTarget: '',
    efficiencyObject: '',
    efficiencyScope: ''
  },
  {
    id: 'task4',
    name: '体系对抗仿真任务',
    type: 'simulation',
    nodeType: 'task',
    assignee: ['8c0e1a26402c49278031861ebb8d28bb'],
    taskStats: { up: 1, down: 1 },
    dateRange: ['2024-01-06', '2024-01-16'],
    executionDays: 10,
    toolAssociation: "4",
    x: 590,
    y: 320,
    expanded: false,
    inputs: [
       {
         id: '',
        name: '想定文件',
         taskId: 'task4',
        securityLevelCode: 'SECRET_LEVEL_INTERNAL',
        securityLevelName: '内部',
        dataTypeCode: 'TASK_INOUTPUT_DATA_TYPE_CODE_FILE',
        dataTypeValue: '想定文件',
        isEditing: false
      }
    ],
    outputs: [
      {
         id: '',
        name: '仿真场景截图',
         taskId: 'task4',
        securityLevelCode: 'SECRET_LEVEL_INTERNAL',
        securityLevelName: '内部',
        dataTypeCode: 'TASK_INOUTPUT_DATA_TYPE_CODE_FILE',
        dataTypeValue: '仿真场景截图',
        isEditing: false
      }
     ],
    // 体系需求满足度评估系统特有字段
    satisfactionTaskType: '',
    satisfactionTaskCategory: '',
    satisfactionDirection: '',
    satisfactionScenario: '',
    satisfactionSource: '',
    satisfactionRequirement: '',
    satisfactionDescription: '',
    // 体系效能评估系统特有字段
    efficiencyEvalTime: null,
    efficiencyEvaluator: [],
    efficiencyCondition: '',
    efficiencyType: '',
    efficiencyTarget: '',
    efficiencyObject: '',
    efficiencyScope: ''
  },
  {
    id: 'task5',
    name: '体系效能评估任务',
    type: 'performance',
    nodeType: 'task',
    assignee: ['8c0e1a26402c49278031861ebb8d28bb'],
    taskStats: { up: 1, down: 1 },
    dateRange: ['2024-01-06', '2024-01-16'],
    executionDays: 10,
    toolAssociation: "5",
    x: 590,
    y: 450,
    expanded: false,
    inputs: [
      {
         id: '',
        name: '体系模型',
         taskId: 'task5',
        securityLevelCode: 'SECRET_LEVEL_INTERNAL',
        securityLevelName: '内部',
        dataTypeCode: 'TASK_INOUTPUT_DATA_TYPE_CODE_FILE',
        dataTypeValue: 'dodaf',
        isEditing: false
      }
    ],
    outputs: [
      {
         id: '',
        name: '效能评估报告',
         taskId: 'task5',
        securityLevelCode: 'SECRET_LEVEL_INTERNAL',
        securityLevelName: '内部',
        dataTypeCode: 'TASK_INOUTPUT_DATA_TYPE_CODE_FILE',
        dataTypeValue: '效能评估报告',
        isEditing: false
      }
     ],
    // 体系需求满足度评估系统特有字段
    satisfactionTaskType: '',
    satisfactionTaskCategory: '',
    satisfactionDirection: '',
    satisfactionScenario: '',
    satisfactionSource: '',
    satisfactionRequirement: '',
    satisfactionDescription: '',
    // 体系效能评估系统特有字段
    efficiencyEvalTime: null,
    efficiencyEvaluator: [],
    efficiencyCondition: '',
    efficiencyType: '',
    efficiencyTarget: '',
    efficiencyObject: '',
    efficiencyScope: ''
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

// 任务连线数据
const taskConnections = ref([
  {
    id: 'start-to-task1',
    source: 'start',
    target: 'task1',
    sourceAnchor: 'bottom',
    targetAnchor: 'top'
  },
  {
    id: 'task1-to-task2',
    source: 'task1',
    target: 'task2',
    sourceAnchor: 'bottom',
    targetAnchor: 'top'
  },
  {
    id: 'task1-to-task3',
    source: 'task1',
    target: 'task3',
    sourceAnchor: 'bottom',
    targetAnchor: 'top'
  },
  {
    id: 'task2-to-task4',
    source: 'task2',
    target: 'task4',
    sourceAnchor: 'bottom',
    targetAnchor: 'top'
  },
  {
    id: 'task3-to-task5',
    source: 'task3',
    target: 'task5',
    sourceAnchor: 'bottom',
    targetAnchor: 'top'
  },
  {
    id: 'task4-to-end',
    source: 'task4',
    target: 'end',
    sourceAnchor: 'bottom',
    targetAnchor: 'top'
  },
  {
    id: 'task5-to-end',
    source: 'task5',
    target: 'end',
    sourceAnchor: 'bottom',
    targetAnchor: 'top'
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
         text: (() => {
           if (!task.expanded) return ''
           const inputCount = task.inputs ? task.inputs.length : 0
           return inputCount > 0 ? `▲ ${inputCount}` : ''
         })(),
         x: 150,
         y: 54,
         fontSize: 11,
         fill: '#52c41a'
       },
       // 下箭头统计  
       'stats-down': {
         text: (() => {
           if (!task.expanded) return ''
           const outputCount = task.outputs ? task.outputs.length : 0
           return outputCount > 0 ? `▼ ${outputCount}` : ''
         })(),
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

// 添加任务连线
const addTaskConnections = () => {
  if (!graph.value) return
  
  const edgeStyle = {
    attrs: {
      line: {
        stroke: '#A2A2A2',
        strokeWidth: 2,
        targetMarker: 'classic'
      }
    }
  }
  
  // 遍历连线数据并添加连线
  taskConnections.value.forEach(connection => {
    try {
      graph.value!.addEdge({
        id: connection.id,
        source: { 
          cell: connection.source, 
          anchor: { 
            name: connection.sourceAnchor,
            args: {
              offset: 10
            }
          }
        },
        target: { 
          cell: connection.target, 
          anchor: { 
            name: connection.targetAnchor,
            args: {
              offset: 10
            }
          }
        },
        ...edgeStyle
      })
    } catch (error) {
      console.warn(`Failed to add connection: ${connection.id}`, error)
    }
  })
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
    
    // 确保taskStats存在且正确
    const inputCount = task.inputs ? task.inputs.length : 0
    const outputCount = task.outputs ? task.outputs.length : 0
    
    // 根据展开状态显示或隐藏内容
    if (task.expanded) {
      // 展开状态：显示所有内容
      node.attr('assignee/text', task.assignee ? `参与者：${task.assignee}` : '参与者：未分配')
      node.attr('task-days/text', taskPeriod)
      node.attr('stats-up/text', inputCount > 0 ? `▲ ${inputCount}` : '')
      node.attr('stats-down/text', outputCount > 0 ? `▼ ${outputCount}` : '')
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
      router: {
        name: 'manhattan',
        args: {
          padding: 10
        }
      },
      connector: {
        name: 'rounded',
        args: {
          radius: 10
        }
      },
      anchor: {
        name: 'rect',
        args: {
          padding: 10
        }
      },
      connectionPoint: {
        name: 'rect',
        args: {
          offset: 10
        }
      },
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
    addTaskConnections()
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

// 初始化ER图
const initERGraph = () => {
  if (!erCanvasRef.value) return

  erGraph.value = new Graph({
    container: erCanvasRef.value,
    width: erCanvasRef.value.clientWidth,
    height: erCanvasRef.value.clientHeight,
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
    interacting: {
      nodeMovable: true,
      edgeMovable: false
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
      allowMulti: true,
      allowLoop: false,
      highlight: true,
      createEdge() {
        return erGraph.value!.createEdge({
          attrs: {
            line: {
              stroke: '#A2A2A2',
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
      },
      validateConnection({ sourceMagnet, targetMagnet }) {
        // 只允许在不同节点的属性之间建立连接
        const sourceAttr = sourceMagnet?.getAttribute('data-attr')
        const targetAttr = targetMagnet?.getAttribute('data-attr')
        const sourceSide = sourceMagnet?.getAttribute('data-side')
        const targetSide = targetMagnet?.getAttribute('data-side')
        
        // 必须有属性信息，且不能是同一侧的连接点
        return !!(sourceAttr && targetAttr && sourceSide !== targetSide)
      }
    },
    highlighting: {
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {
            fill: '#31d0c6',
            stroke: '#31d0c6'
          }
        }
      }
    }
  })

  // 注册ER节点
  registerERNode()
  
  // 添加事件监听
  setupEREventListeners()
  
  // 渲染ER图
  renderERGraph()
}

// 设置ER图事件监听
const setupEREventListeners = () => {
  if (!erGraph.value) return
  
  // 鼠标进入节点显示连接点
  erGraph.value.on('node:mouseenter', ({ node }) => {
    const ports = node.getPorts()
    ports.forEach(port => {
      node.setPortProp(port.id!, 'attrs/circle/style/visibility', 'visible')
    })
  })
  
  // 鼠标离开节点隐藏连接点
  erGraph.value.on('node:mouseleave', ({ node }) => {
    const ports = node.getPorts()
    ports.forEach(port => {
      node.setPortProp(port.id!, 'attrs/circle/style/visibility', 'hidden')
    })
  })
  
  // 端口鼠标进入高亮
  erGraph.value.on('node:port:mouseenter', ({ node, port }) => {
    if (port) {
      node.setPortProp(port, 'attrs/circle/fill', '#31d0c6')
      node.setPortProp(port, 'attrs/circle/r', 6)
    }
  })
  
  // 端口鼠标离开取消高亮
  erGraph.value.on('node:port:mouseleave', ({ node, port }) => {
    if (port) {
      node.setPortProp(port, 'attrs/circle/fill', '#ffffff')
      node.setPortProp(port, 'attrs/circle/r', 4)
    }
  })
}

// 注册ER节点
const registerERNode = () => {
  Graph.registerNode('er-entity', {
    inherit: 'html',
    width: 200,
    height: 150,
    attrs: {
      body: {
        strokeWidth: 2,
        stroke: '#5F95FF',
        fill: '#ffffff',
        rx: 8,
        ry: 8
      }
    },
    markup: [
      { tagName: 'rect', selector: 'body' },
      { tagName: 'rect', selector: 'header' },
      { tagName: 'text', selector: 'title' },
      { tagName: 'foreignObject', selector: 'attrs-container' }
    ],
    ports: {
      groups: {
        'attr-port': {
          position: {
            name: 'absolute'
          },
          attrs: {
            circle: {
              r: 4,
              magnet: true,
              stroke: '#31d0c6',
              strokeWidth: 2,
              fill: '#ffffff',
              style: {
                visibility: 'hidden'
              }
            }
          },
          markup: [
            {
              tagName: 'circle',
              selector: 'circle'
            }
          ]
        }
      }
    }
  }, true)
}

// 渲染ER图
const renderERGraph = () => {
  if (!erGraph.value) return
  
  // 清空画布
  erGraph.value.clearCells()
  
  // 添加实体节点
  erData.value.entities.forEach(entity => {
    createEREntity(entity)
  })
  
  // 添加属性间的连线
  setTimeout(() => {
    erData.value.relations.forEach(relation => {
      createAttributeRelation(relation)
    })
  }, 100)
}

// 创建ER实体
const createEREntity = (entity: any) => {
  // 动态计算节点高度：头部30px + 属性行数*20px + 底部边距10px
  const attrCount = entity.attributes.length
  const nodeHeight = Math.max(120, 30 + attrCount * 20 + 10)
  
  // 创建节点
  const node = erGraph.value!.addNode({
    id: entity.id,
    shape: 'er-entity',
    x: entity.x,
    y: entity.y,
    size: { width: 200, height: nodeHeight },
    attrs: {
      body: {
        width: 200,
        height: nodeHeight,
        fill: '#ffffff',
        stroke: '#5F95FF'
      },
      header: {
        width: 200,
        height: 30,
        x: 0,
        y: 0,
        fill: '#5F95FF',
        stroke: 'none',
        rx: 8,
        ry: 8
      },
      title: {
        text: entity.name,
        x: 100,
        y: 20,
        fontSize: 14,
        fontWeight: 'bold',
        textAnchor: 'middle',
        fill: '#ffffff'
      },
      'attrs-container': {
        width: 200,
        height: nodeHeight - 30,
        x: 0,
        y: 30,
        html: createAttributesHTML(entity.attributes)
      }
    }
  })
  
  // 为每个属性添加连接点
  entity.attributes.forEach((attr: any, index: number) => {
    const portY = 40 + index * 20
    
    // 左侧连接点（输入）
    node.addPort({
      id: `${entity.id}-${attr.name}-left`,
      group: 'attr-port',
      args: {
        x: -4,
        y: portY
      },
      attrs: {
        circle: {
          'data-attr': attr.name,
          'data-side': 'left'
        }
      }
    })
    
    // 右侧连接点（输出）
    node.addPort({
      id: `${entity.id}-${attr.name}-right`,
      group: 'attr-port',
      args: {
        x: 204,
        y: portY
      },
      attrs: {
        circle: {
          'data-attr': attr.name,
          'data-side': 'right'
        }
      }
    })
  })
  
  return node
}

// 创建属性HTML
const createAttributesHTML = (attributes: any[]) => {
  return `
    <div style="padding: 10px; font-family: monospace; font-size: 11px; line-height: 20px;">
      ${attributes.map((attr: any) => {
        return `<div style="position: relative; padding: 0 8px;">${attr.name}: ${attr.type}</div>`
      }).join('')}
    </div>
  `
}

// 创建属性间的关系连线
const createAttributeRelation = (relation: any) => {
  if (!erGraph.value) return
  
  const sourcePortId = `${relation.sourceEntity}-${relation.sourceAttribute}-right`
  const targetPortId = `${relation.targetEntity}-${relation.targetAttribute}-left`
  
  // 检查源端口和目标端口是否存在
  const sourceCell = erGraph.value.getCellById(relation.sourceEntity)
  const targetCell = erGraph.value.getCellById(relation.targetEntity)
  
  if (!sourceCell || !targetCell) {
    console.warn(`节点不存在: ${relation.sourceEntity} 或 ${relation.targetEntity}`)
    return
  }
  
  // 将Cell转换为Node类型
  const sourceNode = sourceCell as Node
  const targetNode = targetCell as Node
  
  // 检查端口是否存在
  const sourcePorts = sourceNode.getPorts()
  const targetPorts = targetNode.getPorts()
  
  const sourcePortExists = sourcePorts.some((port: any) => port.id === sourcePortId)
  const targetPortExists = targetPorts.some((port: any) => port.id === targetPortId)
  
  if (!sourcePortExists || !targetPortExists) {
    console.warn(`端口不存在: ${sourcePortId} 或 ${targetPortId}`)
    return
  }
  
  // 创建连线
  try {
    erGraph.value.addEdge({
      id: relation.id,
      source: {
        cell: relation.sourceEntity,
        port: sourcePortId
      },
      target: {
        cell: relation.targetEntity,
        port: targetPortId
      },
      attrs: {
        line: {
          stroke: '#A2A2A2',
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
  } catch (error) {
    console.error('创建连线失败:', error)
  }
}



// 添加任务
const addTask = (taskType: string) => {
  const newTaskId = uuid(32, 62)
  
  // 根据任务类型设置默认名称
  const getTaskName = (type: string) => {
    const nameMap: Record<string, string> = {
      'analysis': '需求分析任务',
      'design': '架构设计任务',
      'evaluation': '需求评估任务',
      'simulation': '仿真验证任务',
      'performance': '效能评估任务'
    }
    return nameMap[type] || '新任务'
  }
  
  const newTask = {
    id: newTaskId,
    name: getTaskName(taskType),
    type: taskType,
    nodeType: 'task',
    assignee: '',
    taskStats: { up: 0, down: 0 },
    dateRange: null,
    executionDays: null,
    toolAssociation: '',
    x: Math.random() * 400 + 200,
    y: Math.random() * 200 + 200,
    expanded: false,
    inputs: [],
    outputs: [],
    // 体系需求满足度评估系统特有字段
    satisfactionTaskType: '',
    satisfactionTaskCategory: '',
    satisfactionDirection: '',
    satisfactionScenario: '',
    satisfactionSource: '',
    satisfactionRequirement: '',
    satisfactionDescription: '',
    // 体系效能评估系统特有字段
    efficiencyEvalTime: null,
    efficiencyEvaluator: [],
    efficiencyCondition: '',
    efficiencyType: '',
    efficiencyTarget: '',
    efficiencyObject: '',
    efficiencyScope: ''
  }
  
  taskList.value.push(newTask)
  createTaskNode(newTask)
  
  // 选中新创建的任务
  selectedTask.value = { ...newTask }
  rightDrawerCollapsed.value = false
  
  ElMessage.success('任务添加成功')
}

// 模板相关方法
// 新建任务模板
const createTemplate = () => {
  console.log('创建新模板')
  
  // 清空当前画布
  clearCanvas()
  
  // 添加开始节点和结束节点
  addStartAndEndNodes()
  
  ElMessage.success('新建模板成功，已添加开始和结束节点')
}

// 复制模板
const copyTemplate = (template: any) => {
  console.log('复制模板:', template.name)
  
  // 清空当前画布
  clearCanvas()
  
  // 加载模板的节点和连线
  loadTemplateToCanvas(template)
  
  ElMessage.success(`模板 "${template.name}" 复制成功`)
}

// 删除模板
const deleteTemplate = (template: any) => {
  console.log('删除模板:', template.name)
  const index = templateList.value.findIndex(t => t.id === template.id)
  if (index !== -1) {
    templateList.value.splice(index, 1)
    ElMessage.success(`模板 "${template.name}" 删除成功`)
  }
}

// 切换模板状态
const toggleTemplateStatus = (template: any) => {
  // v-model已经自动更新了template.status，这里只需要显示消息
  const statusText = template.status === 'published' ? '已发布' : '未发布'
  ElMessage.success(`模板 "${template.name}" 状态已更新为${statusText}`)
}

// 任务详细信息相关方法
const getAssigneeName = (assignee: any) => {
  if (!assignee) return '未分配'
  if (Array.isArray(assignee)) {
    return assignee.length > 0 ? assignee.join(',') : '未分配'
  }
  return '未分配'
}

const getEndDate = (dateRange: any) => {
  if (!dateRange || !Array.isArray(dateRange) || dateRange.length < 2) {
    return '未设置'
  }
  return dateRange[1] || '未设置'
}

const getRemainingDays = (dateRange: any) => {
  if (!dateRange || !Array.isArray(dateRange) || dateRange.length < 2) {
    return ''
  }
  const endDate = new Date(dateRange[1])
  const currentDate = new Date()
  const diffTime = endDate.getTime() - currentDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays > 0) {
    return `剩${diffDays}天`
  } else if (diffDays === 0) {
    return '今天截止'
  } else {
    return `超期${Math.abs(diffDays)}天`
  }
}

const getRemainingDaysClass = (dateRange: any) => {
  if (!dateRange || !Array.isArray(dateRange) || dateRange.length < 2) {
    return ''
  }
  const endDate = new Date(dateRange[1])
  const currentDate = new Date()
  const diffTime = endDate.getTime() - currentDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays > 7) {
    return 'normal'
  } else if (diffDays > 0) {
    return 'warning'
  } else {
    return 'danger'
  }
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'published': '已发布',
    'draft': '编辑中',
    'pending': '待审核'
  }
  return statusMap[status] || '已发布'
}

const getStatusType = (status: string) => {
  const typeMap: Record<string, string> = {
    'published': 'success',
    'draft': 'warning',
    'pending': 'info'
  }
  return typeMap[status] || 'success'
}

// 清空画布
const clearCanvas = () => {
  if (!graph.value) return
  
  // 清空任务列表
  taskList.value = []
  
  // 清空连线数据
  taskConnections.value = []
  
  // 清空选中的任务
  selectedTask.value = null
  
  // 清空画布中的所有节点和连线
  graph.value.clearCells()
}

// 添加开始节点和结束节点
const addStartAndEndNodes = () => {
  if (!graph.value) return
  
  // 添加开始节点 - 与taskList结构一致
  const startNode = {
    id: 'start',
    name: '开始',
    type: 'start',
    nodeType: 'start',
    x: 50,
    y: 150,
    shape: 'circle'
  }
  
  // 添加结束节点 - 与taskList结构一致
  const endNode = {
    id: 'end', 
    name: '结束',
    type: 'end',
    nodeType: 'end',
    x: 400,
    y: 150,
    shape: 'circle'
  }
  
  // 使用createTaskNode创建开始节点
  createTaskNode(startNode)
  
  // 使用createTaskNode创建结束节点
  createTaskNode(endNode)
  
  // 更新taskList
  taskList.value = [startNode, endNode]
}

// 加载模板到画布
const loadTemplateToCanvas = (template: any) => {
  if (!graph.value) return
  
  // 使用模板的taskList数据，如果没有则使用默认数据
  const templateTaskList = template.taskList || [
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
      id: `template-task-${Date.now()}`,
      name: `${template.name}-任务1`,
      type: 'analysis',
      nodeType: 'task',
      assignee: [],
      taskStats: { up: 0, down: 0 },
      dateRange: null,
      executionDays: null,
      toolAssociation: '',
      x: 200,
      y: 80,
      expanded: false,
      inputs: [],
      outputs: [],
      satisfactionTaskType: '',
      satisfactionTaskCategory: '',
      satisfactionDirection: '',
      satisfactionScenario: '',
      satisfactionSource: '',
      satisfactionRequirement: '',
      satisfactionDescription: '',
      efficiencyEvalTime: null,
      efficiencyEvaluator: [],
      efficiencyCondition: '',
      efficiencyType: '',
      efficiencyTarget: '',
      efficiencyObject: '',
      efficiencyScope: ''
    },
    {
      id: 'end',
      name: '结束',
      type: 'end',
      nodeType: 'end',
      x: 400,
      y: 150,
      shape: 'circle'
    }
  ]
  
  // 更新任务列表 - 包含所有节点（开始、任务、结束）
  taskList.value = [...templateTaskList]
  
  // 使用createTaskNode创建所有节点
  templateTaskList.forEach(node => {
    createTaskNode(node)
  })
  
  // 直接将模板连线数据赋值给taskConnections
  const templateConnections = template.taskConnections || []
  taskConnections.value = [...templateConnections]
  
  // 调用addTaskConnections来添加任务连线
  setTimeout(() => {
    addTaskConnections()
  }, 100)
}

// 更新任务
const updateTask = () => {
  if (!selectedTask.value) return
  
  const taskIndex = taskList.value.findIndex(t => t.id === selectedTask.value.id)
  if (taskIndex !== -1) {
    // 更新taskStats以反映输入输出的实际数量
    selectedTask.value.taskStats = {
      up: selectedTask.value.inputs ? selectedTask.value.inputs.length : 0,
      down: selectedTask.value.outputs ? selectedTask.value.outputs.length : 0
    }
    
    taskList.value[taskIndex] = { ...selectedTask.value }
    updateTaskNode(selectedTask.value)
    //ElMessage.success('任务更新成功')
  }
}

// 添加输入项
const addInput = () => {
  if (!selectedTask.value) return
  
  if (!selectedTask.value.inputs) {
    selectedTask.value.inputs = []
  }
  
  selectedTask.value.inputs.push({
     id: '',
    name: '',
     taskId: selectedTask.value.id,
    securityLevelCode: 'SECRET_LEVEL_INTERNAL',
    securityLevelName: '内部',
    dataTypeCode: '文件',
    dataTypeValue: null,
    isEditing: true
  })
  
  // 自动更新taskStats
  selectedTask.value.taskStats.up = selectedTask.value.inputs.length
}

// 编辑输入项
const editInput = (index: number) => {
  if (!selectedTask.value || !selectedTask.value.inputs) return
  selectedTask.value.inputs[index].isEditing = true
}

// 确认输入项编辑
const confirmInputEdit = (index: number) => {
  if (!selectedTask.value || !selectedTask.value.inputs) return
  const input = selectedTask.value.inputs[index]
  if (!input.name.trim()) {
    ElMessage.warning('请输入名称')
    return
  }
  input.isEditing = false
  updateTask()
}

// 删除输入项
const deleteInput = (index: number) => {
  if (!selectedTask.value || !selectedTask.value.inputs) return
  
  selectedTask.value.inputs.splice(index, 1)
  
  // 自动更新taskStats
  selectedTask.value.taskStats.up = selectedTask.value.inputs.length
  updateTask()
}

// 处理输入文件变化
const handleInputFileChange = (file: File | any, index: number) => {
  if (!selectedTask.value || !selectedTask.value.inputs) return
  // 确保文件对象包含name属性
  const fileObj = {
    name: file.name || file.raw?.name || '未知文件',
    size: file.size || file.raw?.size || 0,
    type: file.type || file.raw?.type || '',
    raw: file.raw || file
  }
  selectedTask.value.inputs[index].dataTypeValue = fileObj
}

// 移除输入文件
const handleInputFileRemove = (index: number) => {
  if (!selectedTask.value || !selectedTask.value.inputs) return
  selectedTask.value.inputs[index].dataTypeValue = null
}

// 更新输入项密级名称
const updateInputSecurityLevelName = (input: any) => {
  const securityLevelMap: Record<string, string> = {
    'SECRET_LEVEL_OPEN': '公开',
    'SECRET_LEVEL_INTERNAL': '内部',
    'SECRET_LEVEL_NORMAL_COMMERCIAL': '普通商密',
    'SECRET_LEVEL_SECRET': '秘密',
    'SECRET_LEVEL_CONFIDENTIALITY': '机密',
    'SECRET_LEVEL_CORE_COMMERCIAL': '核心商密'
  }
  input.securityLevelName = securityLevelMap[input.securityLevelCode] || input.securityLevelCode
}

// 添加输出项
const addOutput = () => {
  if (!selectedTask.value) return
  
  if (!selectedTask.value.outputs) {
    selectedTask.value.outputs = []
  }
  
  selectedTask.value.outputs.push({
     id: '',
    name: '',
     taskId: selectedTask.value.id,
    securityLevelCode: 'SECRET_LEVEL_INTERNAL',
    securityLevelName: '内部',
    dataTypeCode: '文件',
    dataTypeValue: null,
    isEditing: true
  })
  
  // 自动更新taskStats
  selectedTask.value.taskStats.down = selectedTask.value.outputs.length
}

// 编辑输出项
const editOutput = (index: number) => {
  if (!selectedTask.value || !selectedTask.value.outputs) return
  selectedTask.value.outputs[index].isEditing = true
}

// 确认输出项编辑
const confirmOutputEdit = (index: number) => {
  if (!selectedTask.value || !selectedTask.value.outputs) return
  const output = selectedTask.value.outputs[index]
  if (!output.name.trim()) {
    ElMessage.warning('请输入名称')
    return
  }
  output.isEditing = false
  updateTask()
}





// 删除输出项
const deleteOutput = (index: number) => {
  if (!selectedTask.value || !selectedTask.value.outputs) return
  
  selectedTask.value.outputs.splice(index, 1)
  
  // 自动更新taskStats
  selectedTask.value.taskStats.down = selectedTask.value.outputs.length
  updateTask()
}

// 处理输出文件变化
const handleOutputFileChange = (file: File | any, index: number) => {
  console.log("uploadFile")
  if (!selectedTask.value || !selectedTask.value.outputs) return
  // 确保文件对象包含name属性
  const fileObj = {
    name: file.name || file.raw?.name || '未知文件',
    size: file.size || file.raw?.size || 0,
    type: file.type || file.raw?.type || '',
    raw: file.raw || file
  }
  selectedTask.value.outputs[index].dataTypeValue = fileObj
}

// 移除输出文件
const handleOutputFileRemove = (index: number) => {
  if (!selectedTask.value || !selectedTask.value.outputs) return
  selectedTask.value.outputs[index].dataTypeValue = null
}

// 更新输出项密级名称
const updateOutputSecurityLevelName = (output: any) => {
  const securityLevelMap: Record<string, string> = {
    'SECRET_LEVEL_OPEN': '公开',
    'SECRET_LEVEL_INTERNAL': '内部',
    'SECRET_LEVEL_NORMAL_COMMERCIAL': '普通商密',
    'SECRET_LEVEL_SECRET': '秘密',
    'SECRET_LEVEL_CONFIDENTIALITY': '机密',
    'SECRET_LEVEL_CORE_COMMERCIAL': '核心商密'
  }
  output.securityLevelName = securityLevelMap[output.securityLevelCode] || output.securityLevelCode
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


const taskForm =  reactive<planFormAdd>({
  projectId: "",
  flowId: "",
  businessCode: "",
  autoNodeSortNo: false,
  generBackLine: false,
  workItemParams: [],
  connections:[],
  x6NodeJson: "",
  cells: []
})

// 保存流程
const saveFlow  =  () => {
  // const flowData = {
  //   projectId: projectInfo.id,
  //   flowId: projectInfo.flowId,
  //   businessCode:"",
  //   autoNodeSortNo:false,
  //   generBackLine:false,
  //   workItemParams: taskList.value,
  //   connections: graph.value!.getEdges().map(edge => ({
  //     source: edge.getSourceCellId(),
  //     target: edge.getTargetCellId()
  //   })),
  //   x6NodeJson: graph.value!.toJSON()
  // }

  taskForm.projectId = projectId;
//taskForm.flowId = projectInfo.flowId;
  taskForm.businessCode = "";
  taskForm.workItemParams = taskList.value;
  // taskForm.connections = taskConnections.value.map(conn => ({
  //   source: conn.source,
  //   target: conn.target
  // }));
  taskForm.cells = graph.value!.toJSON()
  taskForm.x6NodeJson =  JSON.stringify(taskForm.cells)  
  api.planTask.addTask(taskForm)
    
  console.log('保存流程数据:', taskForm)
  ElMessage.success('流程保存成功')
}

// 批量发布
const batchPublish = () => {
}

// 组件挂载
onMounted(async() => {
  setTimeout(() => {
    initFlowChart()
  }, 100)
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
    
    console.log("projectId"  + projectId)
    const userresult = await api.commonUser.list({ businessCode : "BUSINESS_CODE_WORKFLOW"})
    userListOption.value = userresult.data

    const toolList =  await api.planTask.getToolList({isSys:"true"})
    toolListOption.value =  toolList.data;

    const projectreslt = await await api.packageManage.getInfo({ id: projectId })
    Object.assign(projectInfo, projectreslt.data)

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

// 切换到任务流
const switchToTaskFlow = () => {
  isTaskFlow.value = true
  console.log('切换到任务流')
  selectedTask.value = null // 清空选中状态
}

// 切换到参数流
const switchToParameterFlow = () => {
  isTaskFlow.value = false
  console.log('切换到参数流')
  selectedTask.value = null // 清空选中状态
  
  // 初始化ER图（如果还没有初始化）
  if (!erGraph.value) {
    nextTick(() => {
      initERGraph()
    })
  }
}

// 完成任务创建后的回调
const emit = defineEmits<{
  'task-created': [data: any]
}>()


function afterUpload(obj: any) {
    if (obj.id == null) {
        ElMessage({ message: '文件上传失败', type: 'info' })
        console.log(obj)
    }
    else {

        // ruleForm.fileId = obj.id
        // ruleForm.fileName = obj.name
    }
}
const currentIndex = ref();
function uploada(index: number){
  currentIndex.value = index;
  uploadRef.value.openDialog()  
}


</script>

<style lang="less" scoped>
.create-task-container {
  display: flex;
  height: 100vh;
  background: #f0f2f5;

  // 左侧项目信息抽屉
  .left-drawer {
    width: 500px;
    height: 100vh;
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
      height: 0; // 确保flex子元素正确计算高度

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
         align-items: center;
 
                   .flow-toggle {
            display: flex;
            align-items: center;
            margin-right: 16px;
            
            .toggle-buttons {
             display: flex;
             
             .toggle-btn {
               border-radius: 0;
               margin: 0;
               border: 1px solid #d9d9d9;
               
               &:first-child {
                 border-top-left-radius: 4px;
                 border-bottom-left-radius: 4px;
                 border-right: none;
               }
               
               &:last-child {
                 border-top-right-radius: 4px;
                 border-bottom-right-radius: 4px;
                 border-left: none;
               }
               
               &:not(:first-child):not(:last-child) {
                 border-left: none;
                 border-right: none;
               }
               
               &.el-button--primary {
                 background-color: #1890ff;
                 border-color: #1890ff;
                 color: #fff;
                 z-index: 1;
               }
               
               &.el-button--default {
                 background-color: #fff;
                 border-color: #d9d9d9;
                 color: #595959;
                 
                 &:hover {
                   background-color: #f5f5f5;
                   border-color: #d9d9d9;
                   color: #595959;
                 }
               }
             }
           }
         }
 
         .el-button {
           font-size: 12px;
         }
       }
    }

    .flowchart-canvas, .er-canvas {
      flex: 1;
      position: relative;
    }
  }

  // 右侧任务信息抽屉
  .right-drawer {
    width: 700px;
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
                   grid-template-columns: 2fr 1fr 1.5fr 1.5fr 1.5fr;
                   padding: 8px 12px;
                   background: #fafafa;
                   border-bottom: 1px solid #d9d9d9;
                   font-size: 12px;
                   font-weight: 500;
                   color: #595959;
                 }

                 .table-row {
                   display: grid;
                   grid-template-columns: 2fr 1fr 1.5fr 1.5fr 1.5fr;
                   padding: 8px 12px;
                   border-bottom: 1px solid #f0f0f0;
                   font-size: 12px;
                   color: #262626;
                   align-items: center;

                   &:last-child {
                     border-bottom: none;
                   }

                   &:hover {
                     background: #f5f5f5;
                   }

                   // 每个单元格样式
                   span {
                     display: flex;
                     align-items: center;
                     min-height: 32px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    padding: 0 4px;
                     
                     .el-input, .el-select {
                       width: 100%;
                       
                       :deep(.el-input__wrapper) {
                         padding: 4px 8px;
                       }
                       
                       :deep(.el-select__wrapper) {
                         padding: 4px 8px;
                       }
                     }
                     
                     .file-upload-wrapper {
                       width: 100%;
                      overflow: hidden;
                       
                       .file-info {
                         display: flex;
                         align-items: center;
                         justify-content: space-between;
                         margin-top: 4px;
                         padding: 4px 8px;
                         background: #f5f5f5;
                         border-radius: 4px;
                         font-size: 11px;
                        overflow: hidden;
                         
                         .file-name {
                           flex: 1;
                           color: #262626;
                           white-space: nowrap;
                           overflow: hidden;
                           text-overflow: ellipsis;
                           margin-right: 8px;
                         }
                       }
                       
                       .no-file {
                         color: #8c8c8c;
                         font-size: 11px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                       }
                     }
                   }

                   // 操作列样式
                   span:last-child {
                     display: flex;
                     gap: 4px;
                     justify-content: center;
                     align-items: center;
                    white-space: nowrap;
                    overflow: visible;

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

// 任务模板相关样式
.template-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  
  .template-search {
    margin-bottom: 16px;
    flex-shrink: 0;
    
    .el-input {
      width: 100%;
    }
  }
  
  .template-filters {
    margin-bottom: 16px;
    flex-shrink: 0;
    
    .filter-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      
      label {
        width: 50px;
        font-size: 12px;
        color: #666;
        margin-right: 8px;
      }
      
      .el-select {
        flex: 1;
      }
    }
  }
  
  .template-list {
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
      
      &:hover {
        background: #a8a8a8;
      }
    }
    
    .template-card {
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 12px;
      transition: all 0.3s ease;
      
      &:last-child {
        margin-bottom: 20px; // 确保最后一个卡片底部有足够空间
      }
      
      &:hover {
        border-color: #1890ff;
        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
      }
      
      .template-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
        
        .template-name {
          font-size: 14px;
          font-weight: 600;
          color: #262626;
          margin: 0;
          line-height: 1.4;
          flex: 1;
          margin-right: 8px;
        }
        
        .template-version {
          font-size: 12px;
          color: #666;
          white-space: nowrap;
        }
      }
      
      .template-details {
        margin-bottom: 12px;
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          font-size: 12px;
          
          .label {
            color: #1890ff;
            font-weight: 500;
          }
          
          .creator {
            color: #666;
          }
          
          .adopt-count {
            color: #666;
          }
        }
      }
      
      .template-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        
        .template-status {
          flex-shrink: 0;
        }
        
        .template-version-manage {
          font-size: 12px;
          color: #1890ff;
          cursor: pointer;
          flex: 1;
          text-align: center;
          margin: 0 8px;
          
          &:hover {
            text-decoration: underline;
          }
        }
        
        .template-actions {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
          
          .el-button {
            padding: 4px;
            width: 24px;
            height: 24px;
            
            .el-icon {
              font-size: 12px;
            }
            
            &:hover {
              background-color: #f5f5f5;
            }
          }
        }
      }
    }
  }
}

// 头部样式调整
.drawer-header {
  .create-template-btn {
    margin-right: 8px;
    padding: 4px 8px;
    height: 24px;
    
    .el-icon {
      font-size: 12px;
    }
  }
}

// 任务详细信息样式
.center-flowchart {
  &.split-view {
    display: flex;
    flex-direction: column;
    
    .flowchart-canvas,
    .er-canvas {
      &.half-height {
        height: 50% !important;
        flex-shrink: 0;
      }
    }
  }
}

.task-detail-section {
  flex: 2;
  background: #fff;
  border-top: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  .task-detail-header {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;
    
    h3 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      color: #262626;
    }
    
    .task-detail-info {
      .info-row {
        display: flex;
        gap: 24px;
        margin-bottom: 12px;
        flex-wrap: wrap;
        
        .info-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 14px;
          
          .el-icon {
            font-size: 14px;
            color: #666;
          }
          
          .label {
            color: #666;
            font-weight: 500;
          }
          
          .value {
            color: #262626;
          }
          
          .remaining-days {
            margin-left: 8px;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            
            &.normal {
              background: #f6ffed;
              color: #52c41a;
            }
            
            &.warning {
              background: #fff7e6;
              color: #fa8c16;
            }
            
            &.danger {
              background: #fff2f0;
              color: #ff4d4f;
            }
          }
        }
      }
      
      .action-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
    }
  }
  
  .task-detail-content {
    flex: 1;
    padding: 16px 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    
    .input-output-container {
      display: flex;
      gap: 20px;
      flex: 1;
      min-height: 0;
      
      .input-section, .output-section {
        flex: 1;
        min-width: 0; // 防止内容溢出
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
    }
    
    // 复用原始的输入输出样式
    .input-section, .output-section {
      margin-bottom: 0; // 左右布局时不需要下边距
      border: 1px solid #d9d9d9;
      border-radius: 6px;

      .section-title {
        padding: 8px 12px;
        background: #f5f5f5;
        border-bottom: 1px solid #d9d9d9;
        font-weight: 500;
        color: #262626;
        flex-shrink: 0;
      }
      
      .section-actions {
        padding: 8px 12px;
        background: #fafafa;
        border-bottom: 1px solid #d9d9d9;
        display: flex;
        gap: 8px;
        justify-content: flex-start;
        flex-shrink: 0;

        .el-button {
          padding: 0;
          font-size: 12px;
          color: #1890ff;
        }
      }

      .data-table {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        
        .table-header {
          display: grid;
          padding: 8px 12px;
          background: #fafafa;
          border-bottom: 1px solid #d9d9d9;
          font-size: 12px;
          font-weight: 500;
          color: #595959;
          flex-shrink: 0;
        }

        .table-body {
          flex: 1;
          overflow-y: auto;
          padding-right: 4px;
          
          // 自定义滚动条样式
          &::-webkit-scrollbar {
            width: 6px;
          }
          
          &::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          
          &::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
            
            &:hover {
              background: #a8a8a8;
            }
          }
        }

        .table-row {
          display: grid;
          padding: 8px 12px;
          border-bottom: 1px solid #f0f0f0;
          font-size: 12px;
          color: #262626;
          align-items: center;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background: #f5f5f5;
          }

          // 输入表格列配置（没有状态列）
          &.input-row {
            grid-template-columns: 2fr 1fr 1fr 1.5fr 0.8fr 0.8fr 1fr;
          }

          // 输出表格列配置（有状态列）
          &.output-row {
            grid-template-columns: 0.8fr 2fr 1fr 1fr 1.5fr 1fr 0.8fr 0.8fr 1fr;
          }

          // 每个单元格样式
          span {
            display: flex;
            align-items: center;
            min-height: 32px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 0 4px;
            
            .el-input, .el-select {
              width: 100%;
            }
            
            .el-button {
              margin: 0 2px;
              padding: 2px 4px;
              
              .el-icon {
                font-size: 12px;
              }
            }
          }

          // 操作列样式
          span:last-child {
            display: flex;
            gap: 4px;
            justify-content: center;
            align-items: center;
            white-space: nowrap;
            overflow: visible;
          }
        }
      }
    }

    // 输入表格特殊样式（左右布局优化）
    .input-section .data-table {
      .table-header {
        grid-template-columns: 2fr 1fr 1fr 1.5fr 0.8fr 0.8fr 1fr;
      }
    }

    // 输出表格特殊样式（左右布局优化）
    .output-section .data-table {
      .table-header {
        grid-template-columns: 0.8fr 2fr 1fr 1fr 1.5fr 1fr 0.8fr 0.8fr 1fr;
      }
    }
  }
  
  .task-detail-footer {
    padding: 16px 20px;
    border-top: 1px solid #e8e8e8;
    background: #fafafa;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    flex-shrink: 0;
  }
}

// 输出表格样式调整
.input-output-section:last-child .data-table {
  .table-header {
    grid-template-columns: 60px 1fr 80px 120px 80px 80px 80px 100px 100px;
  }
  
  .table-row {
    grid-template-columns: 60px 1fr 80px 120px 80px 80px 80px 100px 100px;
  }
}
</style>