<template>
  <el-dialog v-model="dialogVisible" :title="'查看'+ruleForm.name"  width="800">
    <span>
        <el-form ref="ruleFormRef" :model="ruleForm" disabled :rules="rules" label-width="120px" status-icon>
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
