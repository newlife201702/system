<template>
  <el-dialog v-model="dialogVisible" :title="currentAction==='edit'?'编辑':'添加'" width="800">
    <span>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" status-icon>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="ruleForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务场景码" prop="businessTypeCode">
              <el-input v-model="ruleForm.businessTypeCode" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标识" prop="code">
              <el-input v-model="ruleForm.code" />
            </el-form-item>
          </el-col>
          <el-col :span="12">

            <el-form-item label="互斥类型代码" prop="exclusive">
              <el-switch
                v-model="ruleForm.exclusive"
                active-value="1"
                inactive-value="0"
                />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="统一标识" prop="openId">
              <el-input v-model="ruleForm.openId" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码类型" prop="typeCode">
              <el-input v-model="ruleForm.typeCode" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="代码状态" prop="statusCode">
               <el-radio-group v-model="ruleForm.statusCode"  >
                <el-radio v-for="(item,index) in statusList" :key="'type'+index" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资源URL" prop="url">
              <el-input v-model="ruleForm.url" />
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
import {statusList} from '@/dic'

const emit = defineEmits(["loadList"]);
const currentAction = ref('add')
const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()

let ruleForm = reactive<ReqRoleFormData>({
  businessTypeCode: '',
  code: '',
  createUserId: '',
  createUserName: '',
  dataTimestamp: '',
  exclusive: '0',
  memo: '',
  name: '',
  openId: '',
  statusCode: '',
  statusName: '',
  typeCode: '',
  url: '',
  isSystem:"1"
})


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
  const result: any = await api.role.add(ruleForm)
  if (result.returnCode === 0 && result.resultCode === 0) {
    ElMessage({ message: '角色添加成功', type: 'success' })
    closeDialog()
    emit('loadList')
  }
}

const goEdit = async () => {
  const result: any = await api.role.update({id:ruleForm.id,model:ruleForm})
  if (result.returnCode === 0 && result.resultCode === 0) {
    ElMessage({ message: '角色修改成功', type: 'success' })
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

const openDialog = (row: ReqRoleFormData, actionType: string): void => {

  dialogVisible.value = true
  nextTick(() => {
    resetForm(ruleFormRef.value)
    if (actionType === 'edit') {
      ruleForm = Object.assign(ruleForm, row)
    }
    currentAction.value = actionType
  })

}
const closeDialog = (): void => {
  dialogVisible.value = false
}
//主动暴露组件属性
defineExpose({
  openDialog,
  closeDialog
})

</script>
