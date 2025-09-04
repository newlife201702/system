<template>
  <el-drawer
    v-model="drawerVisible"
    title="新建项目"
    direction="rtl"
    size="60%"
    :before-close="handleClose"
    class="create-project-drawer"
  >
    <div class="drawer-content">
      <!-- 步骤指示器 -->
      <div class="steps-container">
        <el-steps :active="currentStep" align-center>
          <el-step title="基础信息" />
          <el-step title="任务流程" />
        </el-steps>
      </div>
      <!-- 表单内容 -->
      <div class="form-container">
        <el-form
          ref="projectFormRef"
          :model="projectForm"
          :rules="formRules"
          label-width="100px"
          label-position="left"
          class="project-form"
        >
                     <!-- 基础信息步骤 -->
           <div v-show="currentStep === 0" class="step-content">
             <div class="form-section">
               <!-- 项目名称 -->
              <el-form-item label="项目名称" prop="name" required>
                <el-input
                  v-model="projectForm.name"
                  placeholder="请输入项目名称"
                  class="form-input"
                />
              </el-form-item>

          <el-form-item label="作战方向" prop="direction" required>
                <el-select v-model="projectForm.direction"  placeholder="请选择" class="form-select">
                    <el-option v-for="(item, index) in directionTypeList " :key="'direction' + index" :label="item.name"
                        :value="item.code" >
                        </el-option>
                </el-select>
            </el-form-item>    


               <!-- 任务类型 -->
               <el-form-item label="任务类型" prop="taskType" required>
                <el-select v-model="projectForm.taskType" multiple placeholder="请选择" class="form-select">
                    <el-option v-for="(item, index) in taskTypeList" :key="'task' + index" :label="item.name"
                        :value="item.code" />
                </el-select>
               </el-form-item>   


              <!-- 起止时间 -->
              <el-form-item label="起止时间" prop="timeRange" required>
                <el-date-picker
                  v-model="projectForm.timeRange"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="YYYY.MM.DD"
                  value-format="YYYY-MM-DD"
                  class="form-date-picker"
                />
                <span class="time-duration">{{ timeDuration }}</span>
              </el-form-item>

              <!-- 团队成员 -->
           <el-form-item label="团队成员" prop="personRelaIds" required>
                <el-select v-model="projectForm.personRelaIds" multiple placeholder="请选择" class="form-select">
                    <el-option v-for="(item, index) in userListOption" :key="'person' + index" :label="item.name"
                        :value="item.id" />
                </el-select>
            </el-form-item>

           <el-form-item label="密级" prop="securityLevelCode" required>
                <el-radio-group v-model="projectForm.securityLevelCode">
                    <el-radio :label="item.code" v-for="(item, index) in secretLevelList" :key="'security' + index">
                        <img :src="getIcoByName(item.name)" alt="">
                   </el-radio>
                </el-radio-group>
            </el-form-item>
               <!-- 来源 -->
            <el-form-item label="来源" prop="region">
                 <el-input
                   v-model="projectForm.region"
                   placeholder="请输入来源"
                   class="form-input"
                 />
            </el-form-item>

               <!-- 军兵种 -->
            <el-form-item label="军兵种" prop="troops" required>
                    <el-select v-model="projectForm.troops"  multiple  filterable class="form-select">
                            <el-option v-for="(item, index) in toorsTypeList " :key="'t' + index" :label="item.name"
                                        :value="item.code" />
                    </el-select>
            </el-form-item>


             <!-- 项目模板 -->
              <el-form-item label="项目模板" prop="temProjectId">
                    <el-select v-model="projectForm.temProjectId" placeholder="请选择"  class="form-select">
                            <el-option v-for="(item, index) in templateProjectOption " :key="'t' + index" :label="item.projectName"
                                        :value="item.projectId" />
                    </el-select>
              </el-form-item>


               <!-- 场景描述 -->
               <el-form-item label="场景描述" prop="description">
                 <el-input
                   v-model="projectForm.description"
                   type="textarea"
                   :rows="4"
                   placeholder="请输入场景描述"
                   class="form-textarea"
                 />
               </el-form-item>

               <!-- 活动要求和附件 -->
               <div class="row-form-items">
                 <!-- 活动要求 -->
                 <el-form-item label="活动要求" prop="requirement" class="half-width">
                   <el-input
                     v-model="projectForm.requirement"
                     type="textarea"
                     :rows="4"
                     placeholder="请输入活动要求"
                     class="form-textarea"
                   />
                 </el-form-item>

                 <!-- 附件 -->
                 <el-form-item label="附件" prop="attachments" class="half-width">
                   <div class="file-upload-section">
                     <div class="upload-info">
                       <span class="file-types">支持：word、pdf、Excel、.RST</span>
                       <el-upload
                         ref="uploadRef"
                         :file-list="fileList"
                         :on-change="handleFileChange"
                         :on-remove="handleFileRemove"
                         :before-upload="beforeUpload"
                         :auto-upload="false"
                         :show-file-list="false"
                         multiple
                         class="upload-component"
                       >
                         <el-button type="primary" size="small" class="upload-btn">
                           <el-icon><Upload /></el-icon>
                         </el-button>
                       </el-upload>
                     </div>
                     <div class="uploaded-files" v-if="fileList.length > 0">
                       <div 
                         v-for="file in fileList" 
                         :key="file.uid" 
                         class="uploaded-file-item"
                       >
                         <el-icon class="file-icon"><Document /></el-icon>
                         <span class="file-name">{{ file.name }}</span>
                         <el-button 
                           type="text" 
                           size="small" 
                           class="delete-btn"
                           @click="removeFile(file)"
                         >
                           <el-icon><Close /></el-icon>
                         </el-button>
                       </div>
                     </div>
                   </div>
                 </el-form-item>
               </div>
            </div>
          </div>


        </el-form>
      </div>

             <!-- 底部操作按钮 -->
       <div class="drawer-footer">
         <el-button @click="handleClose" class="cancel-btn">取消</el-button>
         <el-button type="primary" @click="handleSave" class="save-btn">保存</el-button>
         <el-button 
           v-if="currentStep === 0" 
           type="primary" 
           @click="nextStep"
           class="next-btn"
           circle
         >
           <el-icon><ArrowRight /></el-icon>
         </el-button>
       </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as api from '@/api'
import { getIcoByName } from '@/libs/utils'
import type { FormInstance, FormRules } from 'element-plus'
import { 
  Plus, 
  Upload, 
  Document, 
  ArrowRight, 
  ArrowLeft,
  Close 
} from '@element-plus/icons-vue'
import type { UploadFile, UploadFiles } from 'element-plus'
import dicOptions from '@/libs/common/dicOptions'
const id = ref<string>()
const pageType = ref<string>('listWorkPackageManagement')
const actionType = ref<string>('add')
const { secretLevelList } = dicOptions([{ code: 'SECRET_LEVEL', businessCode: 'BUSINESS_CODE_COMMON' }])
const userListOption = ref<any>()
const { directionTypeList } = dicOptions([{ code: 'DIRECTION_TYPE', businessCode: 'BUSINESS_CODE_TXZJXT' }])
const { taskTypeList } = dicOptions([{ code: 'TASK_TYPE', businessCode: 'BUSINESS_CODE_TXZJXT' }])
const { toorsTypeList } = dicOptions([{ code: 'TOOPRS_TYPE', businessCode: 'BUSINESS_CODE_TXZJXT' }])
const templateProjectOption = ref<any>()

// 定义组件的 props 和 emits
const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'project-created': [project: any]
}>()

// 路由
const router = useRouter()

// 抽屉显示状态
const drawerVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 当前步骤
const currentStep = ref(0)

// 表单引用
const projectFormRef = ref<FormInstance>()
const uploadRef = ref()

// 文件列表
const fileList = ref<UploadFile[]>([])

 // 项目表单数据
 const projectForm = reactive<ReqMyPackageAddFormData>({
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
    temProjectId:"",
    userListName:"",
    troopsName:"",
    taskTypeName:"",
    directionName:"",
    projLeader:"",
    graphId:"",
    businessCode: "BUSINESS_CODE_TXZJXT",
 })

 // 表单验证规则
const formRules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入项目名称', trigger: 'blur' }
  ],
  direction: [
    { required: true, message: '请输入作业方向', trigger: 'blur' }
  ],
  taskType: [
    { required: true, message: '请选择任务类型', trigger: 'change' }
  ],
  timeRange: [
    { required: true, message: '请选择起止时间', trigger: 'change' }
  ],
  personRelaIds: [
    { required: true, message: '请选择团队成员', trigger: 'change' }
  ],
  troops: [
    { required: true, message: '请选择军兵种', trigger: 'change' }
  ]
})

// 计算时间跨度
const timeDuration = computed(() => {
  if (projectForm.timeRange && projectForm.timeRange.length === 2) {
    const start = new Date(projectForm.timeRange[0])
    const end = new Date(projectForm.timeRange[1])
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30))
    return `${diffMonths}个月`
  }
  return ''
})



// 下一步
const nextStep = async () => {
  if (!projectFormRef.value) return
  
  // 验证当前步骤的表单
  const isValid = await projectFormRef.value.validate()
  if (isValid) {
    currentStep.value = 1
    // 跳转到创建任务页面，传递项目数据
    const projectData = { ...projectForm }
    const projectId = Date.now().toString() // 生成临时项目ID，实际应用中应该是保存后的真实ID
    
    router.push({
      name: 'createTask',
      params: {
        projectId: projectId
      },
      query: {
        //projectData: JSON.stringify(projectData)
        projectId:projectData.id
      }
    })
  }
}

// 上一步
const prevStep = () => {
  currentStep.value = 0
}

// 文件上传相关方法
const handleFileChange = (file: UploadFile, uploadFiles: UploadFiles) => {
  fileList.value = uploadFiles
}

const handleFileRemove = (file: UploadFile, uploadFiles: UploadFiles) => {
  fileList.value = uploadFiles
}

const beforeUpload = (file: File) => {
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword', // .doc
    'application/pdf', // .pdf
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.ms-powerpoint' // .ppt
  ]
  
  const isAllowedType = allowedTypes.includes(file.type)
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isAllowedType) {
    ElMessage.error('只支持上传 word、pdf、Excel、ppt 格式的文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('上传文件大小不能超过 10MB!')
    return false
  }
  return true
}

const removeFile = (file: UploadFile) => {
  const index = fileList.value.findIndex(item => item.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
  }
}

// 关闭抽屉
const handleClose = () => {
  // 重置表单
  if (projectFormRef.value) {
    projectFormRef.value.resetFields()
  }
  currentStep.value = 0
  // 清空文件列表
  fileList.value = []
  drawerVisible.value = false

   sessionStorage.removeItem("manprojflag");
   sessionStorage.removeItem('projectId');

}

// 保存项目
const handleSave = async () => {
  if (!projectFormRef.value) return
  try {
    const isValid = await projectFormRef.value.validate()
    if (isValid) {
      // 这里可以调用API保存项目
      console.log('保存项目数据:', projectForm)
      
      if(actionType.value ===  'add'){
          add()
      }else{
          edit()
      } 

      emit('project-created', { ...projectForm })
      handleClose()
      window.location.reload()
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}


const add = async () => {
    const result = await api.packageManage.add({ ...projectForm, personRelaList: getPersonRelaList(),
        extendProjectParam:getextendProjectParam()})
    if (result.resultCode === 0 && result.returnCode === 0) {
        ElMessage({
            message: "添加成功",
            type: 'success',
        })

        //ElMessage.success('项目创建成功！')
        sessionStorage.removeItem("manprojflag");
        sessionStorage.removeItem('projectId');

    }else{
            ElMessage.success('项目创建失败！')
    }
}

const getPersonRelaList = () => {

    let arr: any[] = []
    userListOption.value.map((item: Record<string, unknown>) => {
        projectForm.personRelaIds.map((items:any)=>{
            if(items === item.id){
                arr.push({ personId: item.id, personTypeCode: 'PROJECT_PERSON_TYPE_RESPONSIBLE' })
            }
        })
    })
    return arr
}

const getextendProjectParam = () =>{
    console.log("getextendProjectParam" + projectForm.temProjectId)
    let arr: any[] = []
    arr.push({ propertyField: 'direction' , propertyValue: projectForm.direction})
    arr.push({ propertyField: 'type' , propertyValue: projectForm.taskType.join(',')})
    arr.push({ propertyField: 'region' , propertyValue: projectForm.region})
    arr.push({ propertyField: 'troops' , propertyValue: projectForm.troops.join(',')})
    arr.push({ propertyField: 'description' , propertyValue: projectForm.description})
    arr.push({ propertyField: 'requirement' , propertyValue: projectForm.requirement})
    arr.push({ propertyField: 'attachment' , propertyValue: projectForm.attachments})
    arr.push({ propertyField: 'temProjectId' , propertyValue: projectForm.temProjectId})
    return arr;
}


const edit = async () => {
    sessionStorage.removeItem("manprojflag");
    sessionStorage.removeItem('projectId');
    const result = await api.packageManage.edit(
        {
            model: { ...projectForm, personRelaList: getPersonRelaList(),extendProjectParam:getextendProjectParam() },
            id: projectForm.id as string
        }
    )
    if (result.resultCode === 0 && result.returnCode === 0) {
        ElMessage({
            message: "修改成功",
            type: 'success',
        })
    }
}



// 监听抽屉显示状态，重置表单
watch(drawerVisible, (newVal) => {
  if (newVal) {
    currentStep.value = 0
    if (projectFormRef.value) {
      projectFormRef.value.clearValidate()
    }
    fileList.value = []
  }

   getDictionaryList()
   initdata() 

   sessionStorage.removeItem("manprojflag");
   sessionStorage.removeItem('projectId');
})


const initdata = async () => {

  if(sessionStorage.getItem("manprojflag") === 'update'){
      actionType.value = 'update';
      const projectId = sessionStorage.getItem("projectId");
      const result = await api.packageManage.getInfo({ id: projectId })
            const resultData = result.data
            const editFromData = {
                ...(resultData as Record<string, unknown>),
            }

        Object.assign(projectForm,editFromData)
   }else{
      actionType.value = 'add';
   }
}


const getDictionaryList = async () => {
    
    const userresult = await api.commonUser.list({ businessCode : "BUSINESS_CODE_WORKFLOW"})
    userListOption.value = userresult.data
    
    const templateProjecetResult =  await api.planTask.getTemplateProjectList({ alias: "architecture"});
    templateProjectOption.value =  templateProjecetResult.data;

    console.log("getDictionaryList" +  templateProjecetResult)

}


</script>

<style lang="less" scoped>
.create-project-drawer {
  :deep(.el-drawer__header) {
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
    
    .el-drawer__title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }

  :deep(.el-drawer__body) {
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;

  // 步骤指示器
  .steps-container {
    padding: 24px;
    border-bottom: 1px solid #f0f0f0;
    background: #fafafa;

    :deep(.el-steps) {
      .el-step__title {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }

  // 表单容器
  .form-container {
    flex: 1;
    padding: 24px;
    overflow-y: auto;

    .project-form {
      max-width: 600px;

      .step-content {
        .form-section {
          .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 24px;
            padding-bottom: 8px;
            border-bottom: 2px solid #409eff;
          }

          .el-form-item {
            margin-bottom: 24px;

            :deep(.el-form-item__label) {
              font-weight: 500;
              color: #606266;
            }

            .form-input,
            .form-select,
            .form-date-picker {
              width: 100%;
            }

            .form-textarea {
              width: 100%;
            }

            // 时间选择器特殊样式
            .time-duration {
              margin-left: 12px;
              font-size: 14px;
              color: #909399;
            }

            // 团队成员容器
            .team-members-container {
              .members-tags {
                margin-bottom: 12px;
                min-height: 32px;
                
                .member-tag {
                  margin-right: 8px;
                  margin-bottom: 8px;
                }
              }

              .member-select {
                width: 200px;
              }
            }

                         // 行内表单项
             .row-form-items {
               display: flex;
               gap: 16px;

               .half-width {
                 flex: 1;
               }
             }
          }

          // 模板区域
          .template-section {
            margin-bottom: 24px;

            .template-card {
              border: 1px solid #e4e7ed;
              border-radius: 8px;
              padding: 16px;
              background: #fff;

              .template-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 12px;

                .template-info {
                  .template-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #303133;
                    margin-bottom: 4px;
                  }

                  .template-type {
                    font-size: 12px;
                    color: #909399;
                  }
                }

                .template-colors {
                  display: flex;
                  gap: 4px;

                  .color-dot {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    display: inline-block;
                  }
                }
              }

              .template-description {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #409eff;
                font-size: 14px;
                margin-bottom: 8px;
                cursor: pointer;

                &:hover {
                  color: #66b1ff;
                }
              }

              .template-source {
                font-size: 12px;
                color: #909399;
              }
            }
          }

                     // 文件上传区域
           .file-upload-section {
             .upload-info {
               display: flex;
               align-items: center;
               gap: 12px;
               margin-bottom: 12px;

               .file-types {
                 font-size: 12px;
                 color: #909399;
               }

               .upload-component {
                 :deep(.el-upload) {
                   .upload-btn {
                     font-size: 12px;
                     height: 24px;
                     padding: 4px 8px;
                   }
                 }
               }
             }

             .uploaded-files {
               .uploaded-file-item {
                 display: flex;
                 align-items: center;
                 gap: 8px;
                 padding: 8px 12px;
                 background: #f5f7fa;
                 border-radius: 4px;
                 color: #606266;
                 font-size: 14px;
                 margin-bottom: 8px;

                 &:last-child {
                   margin-bottom: 0;
                 }

                 .file-icon {
                   color: #1890ff;
                   font-size: 16px;
                 }

                 .file-name {
                   flex: 1;
                   overflow: hidden;
                   text-overflow: ellipsis;
                   white-space: nowrap;
                 }

                 .delete-btn {
                   color: #ff4d4f;
                   padding: 0;
                   min-width: auto;
                   
                   &:hover {
                     color: #ff7875;
                     background: transparent;
                   }

                   .el-icon {
                     font-size: 12px;
                   }
                 }
               }
             }
           }
        }
      }
    }
  }

     // 底部操作区域
   .drawer-footer {
     padding: 16px 24px;
     border-top: 1px solid #f0f0f0;
     background: #fff;
     display: flex;
     justify-content: center;
     align-items: center;
     gap: 16px;

     .cancel-btn {
       background: #fff;
       border: 1px solid #d9d9d9;
       color: rgba(0, 0, 0, 0.85);
       padding: 4px 15px;
       height: 32px;
       font-size: 14px;
       border-radius: 6px;

       &:hover {
         border-color: #40a9ff;
         color: #40a9ff;
       }

       &:focus {
         border-color: #40a9ff;
         color: #40a9ff;
       }
     }

     .save-btn {
       background: #1890ff;
       border: 1px solid #1890ff;
       color: #fff;
       padding: 4px 15px;
       height: 32px;
       font-size: 14px;
       border-radius: 6px;

       &:hover {
         background: #40a9ff;
         border-color: #40a9ff;
       }

       &:focus {
         background: #40a9ff;
         border-color: #40a9ff;
       }
     }

     .next-btn {
       background: #1890ff;
       border: 1px solid #1890ff;
       color: #fff;
       width: 32px;
       height: 32px;
       padding: 0;
       border-radius: 50%;
       display: flex;
       align-items: center;
       justify-content: center;

       &:hover {
         background: #40a9ff;
         border-color: #40a9ff;
       }

       &:focus {
         background: #40a9ff;
         border-color: #40a9ff;
       }

       .el-icon {
         font-size: 14px;
       }
     }
   }
}

// 响应式设计
@media (max-width: 768px) {
  .create-project-drawer {
    :deep(.el-drawer) {
      width: 90% !important;
    }
  }
}
</style>
