<template>
  <el-dialog v-model="dialogVisible" title="用户列表" width="80%">
    <span>
      <el-form ref="ruleFormRef" :inline="true" :model="formInline" label-width="60px">
        <el-form-item label="用户名" prop="loginName">
          <el-input v-model="formInline.loginName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formInline.name" placeholder="请输入用姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)"><el-icon>
              <Search />
            </el-icon> 查询</el-button>
          <el-button @click="resetForm(ruleFormRef)"><el-icon>
              <Refresh />
            </el-icon> 重置</el-button>
        <el-button @click="addUser()"><el-icon><Plus /></el-icon>添加</el-button>
        </el-form-item>
      </el-form>
      <div class="dialogUserList">

        <el-row :gutter="10" style="    margin-left: 0px;    margin-right: 0px;">
          <el-col v-for="(item, index) in list" :key="'list' + index" :xs="24" :sm="12" :md="8" :lg="8" :xl="6"
            @click="addCheck(item)">
            <el-card class="box-card">
              <i>{{ item.name.slice(0, 1) }}</i>
              <div>
                <h1>{{ item.name }}({{ item.loginName }})</h1>
                <span> <el-tag>{{ item.postLevelName }}</el-tag> <el-tag>{{ item.dataSecurityLevelName }}</el-tag></span>
                <div>电话：{{ item.phone }}</div>
              </div>
              <span v-if="isCheck(item)"><el-icon>
                  <CircleCheck />
                </el-icon></span>
            </el-card>
          </el-col>
        </el-row>


      </div>

      <el-pagination v-model:current-page="page" style="margin-top:10px" v-model:page-size="limit"
        :page-sizes="[10, 20, 30, 40]" :small="small" :background="background"
        layout="total,sizes, ->, prev, pager, next, jumper" :total="total" @current-change="handleCurrentChange"
        @size-change="changePageSize" />

    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitData()">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>

import { ref } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { nextTick, reactive, defineEmits } from 'vue'

import dataList from '@/libs/common/dataList'
import * as api from '@/api'
const ruleFormRef = ref<FormInstance>()

const small = ref(false)
const background = ref(false)
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
} = dataList({ moduleName: 'user' ,immediate:false})

const emit = defineEmits(["loadList","addUser"]);
const currentRowList = ref<ReqUserRowData[]>([])
const dialogVisible = ref(false)

let formInline = reactive<ReqUserSearchFormData>({
  scope:'other',
  code:"",
  dataSecurityLevelCode:"",
  departmentId:"",
  email:"",
  genderCode:"",
  id:"",
  isSystem:"1",
  isUnlock:"",
  loginName:"",
  name:"",
  openId:"",
  phone:"",
  postLevelCode:"",
  roleId:"",
  securityLevelCode:"",
  sortField:"",
  sortType:"",
  statusCode:"",
})
const addUser=():void=>{
  emit("addUser")
  dialogVisible.value=false
}
const resetForm = (formEl: FormInstance | undefined) => {

  if (!formEl) return
  formEl.resetFields()
  query.value = formInline
  search()
}
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 30, message: '长度2-30', trigger: 'blur' },
  ]
})
const isCheck = (row: ReqUserRowData): boolean => {
  let hasCheck: boolean = false
  currentRowList.value.map((item: ReqUserRowData, index: number) => {
    if (item.id === row.id) {
      hasCheck = true
    }
  })
  return hasCheck
}
/* 
重置表单数据
*/
const addCheck = (row: ReqUserRowData) => {
  let hasCheck: boolean = false
  let currentIndex: number = 0
  currentRowList.value.map((item: ReqUserRowData, index: number) => {
    if (item.id === row.id) {
      hasCheck = true
      currentIndex = index
    }
  })
  if (hasCheck) {
    currentRowList.value.splice(currentIndex, 1)
  }
  else {
    currentRowList.value.push(row)
  }


}

const submitData=async()=>{
  const paramsData:ReqAddUserDepartmentFormData=  {
    departmentId:formInline.departmentId,
    userList:currentRowList.value
  }
  const result =await api.user.addUserDepartment(paramsData)
  if (result.returnCode === 0 && result.resultCode === 0) {
    ElMessageBox.confirm(
    '用户分配部门成功，还要继续添加吗？',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '返回',
      type: 'warning',
    }
  )
    .then(() => {
      emit("loadList")
      currentRowList.value=[]
      loadList()
    })
    .catch(() => {
      emit("loadList")
      currentRowList.value=[]
      dialogVisible.value=false
    })
  }
  
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      query.value = formInline
      search()
    } else {
      console.log('error submit!', fields)
    }
  })
}
const openDialog = (departmentId:string): void => {
  formInline.departmentId=departmentId
  query.value = formInline
  loadList()
  dialogVisible.value = true


}
const closeDialog = (): void => {
  dialogVisible.value = false
}
//设置数据权限名称
const handleCurrentChange = (val: number) => {
  limit.value=12
  page.value = val
  loadList()
}
//主动暴露组件属性
defineExpose({
  openDialog,
  closeDialog
})

</script>
<style lang="less">
.dialogUserList {
  height: 46vh;
  overflow: auto;



  .box-card {
    margin-bottom: 10px;

    .el-card__body {
      position: relative;
      height: 100px;
      cursor: pointer;

      &>i {
        position: absolute;
        text-align: center;
        font-size: 30px;
        line-height: 60px;
        border-radius: 30px;
        height: 60px;
        width: 60px;
        background-color: #eee;
        left: 10px;
        top: 10px;
        display: inline-block;
      }

      &>div {
        position: absolute;
        left: 90px;
        top: 10px;

        &>h1 {
          font-size: 15px;
          margin-bottom: 10px;
        }

        &>div {
          font-size: 14px;
          color: #666;
          line-height: 2;
        }
      }

      &>span {
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 16px;
        color: green;
      }
    }

  }
}
</style>
