<template>
  <el-dialog v-model="dialogVisible"  :title="currentAction === 'edit' ? '编辑' : '添加'" width="840">
    <span class="dialogFormContainer">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" status-icon>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="loginName" >
              <el-input v-model="ruleForm.loginName" :disabled="currentAction === 'edit'"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="ruleForm.password"  type="password" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期" prop="birth">
              <el-date-picker v-model="ruleForm.birth" type="date" placeholder="请选择出生日期" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据权限名称" prop="dataSecurityLevelCode">

              <el-select v-model="ruleForm.dataSecurityLevelCode" @change="setDataSecurityLevelName($event)" class="m-2" placeholder="请选择">
                <el-option v-for="item in dataSecurityLevelCodeList" :key="item.code" :label="item.name"
                  :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">

            <el-form-item label="性别" prop="genderCode">
              <el-select v-model="ruleForm.genderCode" @change="setGenderName($event)" class="m-2" placeholder="请选择">
                <el-option v-for="item in genderCodeList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="ruleForm.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职务级别名称" prop="postLevelCode">

              <el-select v-model="ruleForm.postLevelCode" class="m-2" @change="setPostLevelName($event)" placeholder="请选择">
                <el-option v-for="item in postLevelCodeList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="ruleForm.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编号" prop="code">
              <el-input v-model="ruleForm.code" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="涉密等级" prop="securityLevelCode">

              <el-select v-model="ruleForm.securityLevelCode" class="m-2" placeholder="请选择">
                <el-option v-for="item in securityLevelCodeList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="memo">
              <el-input type="textarea" v-model="ruleForm.memo" />
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

const emit = defineEmits(["loadList","add"]);
const currentAction = ref('add')
const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
let ruleForm = reactive<ReqUserFormData>({
  birth: "",
  code: "",
  dataSecurityLevelCode: "",
  dataSecurityLevelName: "",
  email: "",
  genderCode: "",
  genderName: "",
  lockStatus: "",
  loginName: "",
  memo: "",
  name: "",
  openId: "",
  password: "",
  phone: "",
  postLevelCode: "",
  postLevelName: "",
  securityLevelCode: "",
  isSystem:"1"
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
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 30, message: '长度2-30', trigger: 'blur' },
  ]
})
/* 
重置表单数据
*/
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const goSave = async () => {
  const result: any = await api.user.add(ruleForm)
  if (result.returnCode === 0 && result.resultCode === 0) {
    ElMessage({ message: '用户添加成功', type: 'success' })
    closeDialog()
    emit('add')
  }
}

const goEdit = async () => {
  const result: any = await api.user.update({ id: ruleForm.id, model: ruleForm })
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

const openDialog = (row: ReqUserRowData, actionType: string): void => {

  dialogVisible.value = true
  nextTick(() => {
    resetForm(ruleFormRef.value)
    if (actionType === 'edit') {
      ruleForm = Object.assign(ruleForm, row)
      ruleForm.password=""
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
