<template>
  <div class="formContainer">

    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px">
      <h1>
        <el-icon>
          <Avatar />
        </el-icon> 基本信息
      </h1>

      <el-form-item label="姓名" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="部门" prop="region">
            <el-cascader :options="optionsList" v-model="ruleForm.region" :show-all-levels="false" placeholder="请选择部门"
              clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="有效时间" prop="date1">
            <el-date-picker v-model="ruleForm.date1" type="datetime"  format="YYYY/MM/DD HH-mm-ss"  value-format="YYYY/MM/DD HH-mm-ss" placeholder="请选择有效时间"   />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="开启账户" prop="delivery">
        <el-switch v-model="ruleForm.delivery" />
      </el-form-item>
      <el-form-item label="管理员角色" prop="type">

        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox label="pt" name="type">普通员工</el-checkbox>
          <el-checkbox label="kz" name="type">科长</el-checkbox>
          <el-checkbox label="wy" name="type">文员</el-checkbox>
          <el-checkbox label="ywry" name="type">运维人员</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="ruleForm.sex">
          <el-radio label="男" />
          <el-radio label="女" />
        </el-radio-group>
      </el-form-item>
      <h1>
        <el-icon>
          <Histogram />
        </el-icon> 联系信息
      </h1>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contactor">
            <el-input v-model="ruleForm.contactor" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="ruleForm.phone" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" />
          </el-form-item>
        </el-col>
      </el-row>
      <h1>
        <el-icon>
          <TrendCharts />
        </el-icon> 其它
      </h1>
      <el-form-item label="备注" prop="desc">
        <el-input v-model="ruleForm.desc" type="textarea" />
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="submitForm(ruleFormRef)">提交保存</el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import * as api from '@/api'
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { validateEmail, checkPhone } from '@/libs/ruleForm'

import { useRoute } from 'vue-router';
const route = useRoute()
const optionsList = [
  {
    value: 'guide',
    label: '航空研究九所',
    children: [
      {
        value: 'disciplines',
        label: '超硬材料研究所',
        children: [
          {
            value: 'consistency',
            label: '轻型材料部',
          },
          {
            value: 'feedback',
            label: '结构分析研发部',
          },
          {
            value: 'efficiency',
            label: '材料管理部',
          },
          {
            value: 'controllability',
            label: '资料信息部',
          },
        ],
      },
      {
        value: 'navigation',
        label: '分子机构',
        children: [
          {
            value: 'side nav',
            label: '纳米分子',
          },
          {
            value: 'top nav',
            label: '螺旋分子分析',
          },
        ],
      },
    ],
  }]
const ruleFormRef = ref<FormInstance>()
let ruleForm = reactive({
  name: '',
  region: '',
  date1: '',
  delivery: false,
  type: [],
  sex: '男',
  desc: '',
  contactor: "",
  phone: "",
  email: ""
})


onMounted(() => {
  console.log(route.query)
  console.log(route?.query?.id)
  if(route?.query?.action==='edit')
  {
    Object.assign(ruleForm, {
      id:123,
      name: 'AA',
      region:  [ "guide", "navigation", "side nav" ],
      date1: '2023-06-15 04-03-06',
      delivery: false,
      type: ['pt'],
      sex: '女',
      desc: '暂无',
      contactor: "刘强东", 
      phone: "13618096943", 
      email: "286527501@qq.com" 
    })
  }

})
const rules = reactive<FormRules>({
  name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, max: 5, message: '用户名长度 1 到 5', trigger: 'blur' },
  ],
  region: [
    {
      required: true,
      message: '请选择部门',
      trigger: 'change',
    },
  ],

  date1: [
    {
      // type: 'date',
      required: true,
      message: '请选择时间',
      trigger: 'change',
    },
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: '请选择角色',
      trigger: 'change',
    },
  ],
  sex: [
    {
      required: true,
      message: 'Please select activity sex',
      trigger: 'change',
    },
  ],
  contactor: [
    { required: true, message: '请输入联系人', trigger: 'blur' },
    { min: 3, max: 5, message: '内容3-5个字符', trigger: 'blur' },
  ],

  email: [{ required: true, validator: validateEmail, trigger: "blur" }],
  phone: [{ required: true, validator: checkPhone, trigger: "blur" }],


  desc: [
    { required: true, message: 'Please input activity form', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(ruleForm)
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}


</script>

<style lang="less" scoped>
.formContainer {


  &>form {
    &>h1 {
      font-size: 16px;
      color: #666;
      line-height: 2.5;
      border-bottom: 1px solid rgb(236, 231, 236);
      margin-bottom: 20px;

      &>i {
        color: #409eff;
        top: 2px;
        margin-right: 5px;
      }
    }

    max-width: 1000px;
  }
}
</style>
