<template>
  <el-dialog v-model="dialogVisible" :title="ruleForm.name" width="60%">
    <span >

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
