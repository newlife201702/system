<template>
  <el-dialog v-model="dialogVisible" :title="'查看'+ruleForm.name"  width="800">
    <span>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" disabled label-width="120px" status-icon>
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
  </el-dialog>
</template>

<script lang="ts" setup>

import { ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive } from 'vue'

import {statusList} from '@/dic'


const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()

let ruleForm = reactive<ReqRoleFormData>({
  businessTypeCode: '',
  code: '',
  createUserId: '',
  createUserName: '',
  dataTimestamp: '',
  exclusive: '',
  memo: '',
  name: '',
  openId: '',
  statusCode: '',
  statusName: '',
  typeCode: '',
  url: ''
})


const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 30, message: '长度2-30', trigger: 'blur' },
  ]
})



const openDialog = (row: ReqRoleFormData): void => {
  dialogVisible.value = true
  ruleForm = Object.assign(ruleForm, row)

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
