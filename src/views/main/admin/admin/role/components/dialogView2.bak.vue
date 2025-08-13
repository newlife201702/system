<template>
  <el-dialog v-model="dialogVisible" :title="ruleForm.name" width="60%">
    <span class="viewDetailsContainer">
      <el-row :gutter="10">
      <el-col  :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
        <el-card class="box-card">
          <h1>角色名称</h1>
          <div>{{ruleForm.name}}</div>
        </el-card>
      </el-col>

      <el-col  :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
        <el-card class="box-card">
          <h1>标识</h1>
          <div>{{ruleForm.code}}</div>
        </el-card>
      </el-col>


      <el-col  :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
        <el-card class="box-card">
          <h1>互斥类型代码</h1>
          <div>{{ruleForm.exclusive}}</div>
        </el-card>
      </el-col>

      <el-col  :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
        <el-card class="box-card">
          <h1>业务场景</h1>
          <div>{{ruleForm.businessTypeCode}}</div>
        </el-card>
      </el-col>

      <el-col  :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
        <el-card class="box-card">
          <h1>状态名称</h1>
          <div>{{ruleForm.statusName}}</div>
        </el-card>
      </el-col>

      <el-col  :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
        <el-card class="box-card">
          <h1>类型代码</h1>
          <div>{{ruleForm.typeCode}}</div>
        </el-card>
      </el-col>

      <el-col  :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
        <el-card class="box-card">
          <h1>备注</h1>
          <div>{{ruleForm.memo}}</div>
        </el-card>
      </el-col>

    </el-row>
    </span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>

import { ref } from 'vue'

import {  reactive } from 'vue'




const dialogVisible = ref(false)

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
