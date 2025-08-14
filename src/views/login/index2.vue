<template>
  <div class="loginContainer">
    <img :src="'./images/login/3.png'" id="pic1" alt=""  style="width: 100%; height: 100%;"/>
    <div class="formContainer">
      <h3>
        <img :src="'./images/logo.png'" alt="" />
        体系与整机协同服务平台
        <span>
            <span>v1.0</span>
        </span>
      </h3>
      <el-card>
        <h1>统一身份登录</h1>
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="80px"
          label-position="top"
          :size="formSize"
          status-icon
        >
          <el-form-item label="登录名" prop="loginName">
            <el-input
              placeholder="请输入登录名"
              v-model="ruleForm.loginName"
              clearable
            />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              placeholder="请输入密码"
              type="password"
              v-model="ruleForm.password"
              clearable
            />
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm(ruleFormRef)"
              style="width: 100%"
            >
              登 录
            </el-button>
            <!-- <el-button @click="resetForm(ruleFormRef)"
            ><el-icon>
              <Refresh />
            </el-icon>
            重置</el-button
          > -->
          </el-form-item>
        </el-form>
        <span class="forget">技术支持:010-67867630</span>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import * as api from '@/api'
const router = useRouter()
const formSize = ref('large')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  loginName: '',
  password: '',
})

const rules = reactive<FormRules>({
  loginName: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 1, max: 20, message: '账号长度1-20个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 1, max: 20, message: '密码长度1-20个字符', trigger: 'blur' },
  ],
})

const getUserInfo = async (access_token: string) => {
  const params = { access_token: access_token }
  const result = await api.sso.getUserInfo(params)
  const { resultCode, resultMessage, returnCode, returnMessage } = result
  if (resultCode === 0 && returnCode === 0) {
    // localStorage.setItem('departmentInfo', JSON.stringify(result.data.zhuyunSecurityDepartment))
    // localStorage.setItem('zhuyunUserInfo', JSON.stringify(result.data.user))
    // localStorage.setItem('departmentInfo', JSON.stringify(result.data?.department))
    // localStorage.setItem('userInfo', JSON.stringify(result.data?.user))
    // document.cookie = "departmentInfo=" + encodeURIComponent(JSON.stringify(result.data?.department));
    // document.cookie = "userInfo=" + encodeURIComponent(JSON.stringify(result.data?.user));
  }
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const result = await api.sso.login(ruleForm)
      const { resultCode, resultMessage, returnCode, returnMessage } = result
      if (resultCode === 0 && returnCode === 0) {
        document.cookie = 'access_token=' + result.data?.access_token
        // config.headers["token"]

        localStorage.setItem('ticketProxy', result.data?.access_token as string)
        await getUserInfo(result.data?.access_token as string)
        goUrl('main')
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

onMounted(() => {
  document.body.style.backgroundColor = '#3679e7'
})

onBeforeUnmount(() => {
  document.body.style.backgroundColor = ''
})

const goUrl = (urlName: string) => {
    router.push({ name: urlName })
}

</script>

<style lang="less">
.loginContainer {
  .formContainer {
    position: absolute;
    width: 400px;
    right: 10%;
    top: 20%;
    & > h3 {
        padding: auto;
        margin: 0;
      font-size: 26px;
      color: #fff;
      line-height: 40px;
      height: 40px;
      letter-spacing: 2px;
      & > img {
        margin-top: -5px;
        width: 44px;
      }
      margin-bottom: 40px;
      &>span{
        position: relative;
        &>span{
            letter-spacing: 0px;
            position: absolute;
            right: -30px;
            top: -10px;
            font-size: 12px;
            color: #ff0;
            font-weight: 400;
        };
      }
    }
    h1 {
      font-size: 18px;
      line-height: 2;

      & > span {
        color: #3679e7;
        font-size: 24px;
      }

      margin-bottom: 20px;
    }

    .forget {
      font-size: 12px;
      line-height: 1.5;
      text-align: center;
      color: #999;
      display: block;
      width: 100%;
    }
  }

  width: 100%;
  height: 100vh;
  position: relative;

  & > #pic1 {
    height: 100vh;
    position: absolute;
    left: 0px;
    top: 0px;
  }
}
</style>
