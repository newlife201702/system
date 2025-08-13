<template>
  <el-dialog v-model="dialogVisible" :title="currentAction === 'edit' ? '编辑' : '添加'" width="840">
    <span class="dialogFormContainer">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" status-icon>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应用名称" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="APP应用标识" prop="appId">
              <el-input v-model="ruleForm.appId" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="currentAction !== 'edit'">
            <el-form-item label="接入凭据" prop="appSecret">
              <el-input v-model="ruleForm.appSecret" type="password" />
            </el-form-item>
          </el-col>
          <el-col :span="12"  v-if="currentAction === 'edit'">
            <el-form-item label="接入凭据" >
              <el-input v-model="ruleForm.appSecret" type="password" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="技术联系人" prop="contact">
              <el-input v-model="ruleForm.contact" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="ruleForm.phone" />
            </el-form-item>
          </el-col>
         
          <el-col :span="24">
            <el-form-item label="描述" prop="about">
              <el-input type="textarea" v-model="ruleForm.about" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { nextTick, reactive, defineEmits } from 'vue'
import * as api from '@/api'
import dicOptions from '@/libs/common/dicOptions'

const emit = defineEmits(["loadList"]);
const currentAction = ref('add')
const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
let ruleForm = reactive<ReqAppFormData>({
    about: "",
    appId: "",
    appSecret: "",
    contact: "",
    name: "",
    phone: "",
    statusCode: "",
    statusName: ""
})


const {
  postLevelCodeList,
  securityLevelCodeList,
  dataSecurityLevelCodeList,
  genderCodeList
} = dicOptions([
    {
        code:"POST_LEVEL_CODE",businessCode:"BUSINESS_CODE_DESIGNFLOW"
    },
    {
        code:"SECURITY_LEVEL_CODE",businessCode:"BUSINESS_CODE_COMMON"
    },
    {
        code:"DATA_SECURITY_LEVEL_CODE",businessCode:"BUSINESS_CODE_COMMON"
    },
    {
        code:"GENDER_CODE",businessCode:"BUSINESS_CODE_COMMON"
    }
])
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输应用名称', trigger: 'blur' },
    { min: 1, max: 30, message: '长度1-30', trigger: 'blur' },
  ],
  appId: [
    { required: true, message: '请输APP应用标识', trigger: 'blur' },
    { min: 1, max: 80, message: '长度1-80', trigger: 'blur' },
  ],
  appSecret: [
    { required: true, message: '请输入接入凭据', trigger: 'blur' },
    { min: 1, max: 80, message: '长度1-80', trigger: 'blur' },
  ],
})
/* 
重置表单数据
*/
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const goSave = async () => {
  const result: any = await api.app.add(ruleForm)
  if (result.returnCode === 0 && result.resultCode === 0) {
    ElMessage({ message: '用户添加成功', type: 'success' })
    closeDialog()
    emit('loadList')
  }
}

const goEdit = async () => {
  const result: any = await api.app.update({ id: ruleForm.id, model: ruleForm })
  if (result.returnCode === 0 && result.resultCode === 0) {
    ElMessage({ message: '用户修改成功', type: 'success' })
    closeDialog()
    emit('loadList')
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (currentAction.value === 'add') {
        goSave()
      }
      else {
        goEdit()
      }

    } else {
      console.log('error submit!', fields)
    }
  })
}

const openDialog = (row: appRowItem, actionType: string): void => {

  dialogVisible.value = true
  nextTick(() => {
    resetForm(ruleFormRef.value)
    if (actionType === 'edit') {
      ruleForm = Object.assign(ruleForm, row)
      ruleForm.appSecret=""
    }
    currentAction.value = actionType
  })

}
const closeDialog = (): void => {
  dialogVisible.value = false
}
//设置数据权限名称
const setDataSecurityLevelName=(val:string):void=>{
  dataSecurityLevelCodeList.value.map((item:ReqDicFormData)=>{
    if(item.code===val)
    {
      ruleForm.dataSecurityLevelName=item.name
    }
  })
}
//设置职务级别名称
const setPostLevelName=(val:string):void=>{
  postLevelCodeList.value.map((item:ReqDicFormData)=>{
    if(item.code===val)
    {
      ruleForm.postLevelName=item.name
    }
  })
}

//设置职务级别名称
const setGenderName=(val:string):void=>{
  genderCodeList.value.map((item:ReqDicFormData)=>{
    if(item.code===val)
    {
      ruleForm.genderName=item.name
    }
  })
}
//主动暴露组件属性
defineExpose({
  openDialog,
  closeDialog
})

</script>
