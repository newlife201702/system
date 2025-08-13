<template>
  <el-dialog v-model="dialogVisible" title="文件上传" width="840">
    <span class="dialogFormContainer">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="密级" prop="secretGradeCode">
          <el-radio-group
            v-model="ruleForm.secretGradeCode"
            @change="getSecretGradeName"
          >
            <el-radio
              :label="item.code"
              v-for="(item, index) in secretLevelList"
              :key="'security' + index"
            >
              <img :src="getIcoByName(item.name)" alt="" />
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="备注" prop="remark">
                    <el-input v-model="ruleForm.remark" type="textarea" :rows="5" />
                </el-form-item> -->
        <el-form-item>
          <el-upload
            style="width: 100%"
            v-model:file-list="fileList"
            :data="ruleForm"
            :action="uploadUrl"
            :on-change="handleChange"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :before-upload="handleUpload"
            :limit="1"
          >
            <el-button type="primary" :disabled="!hasFile">选择附件</el-button>
            <!-- <template #tip>
                        <div class="el-upload__tip">
                            文件格式jpg/png files with a size less than 500kb
                        </div>
                        </template> -->
          </el-upload>
        </el-form-item>
        <div style="text-align:right">
            <el-button type="primary" :disabled="hasFile" @click="setFileInfo">确定上传</el-button>
        </div>
      </el-form>
    </span>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { nextTick, reactive, defineEmits } from 'vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'
import dicOptions from '@/libs/common/dicOptions'
import { getCookie, getIcoByName } from '@/libs/utils'
import {  ElMessage } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
const { secretLevelList } = dicOptions([
  { code: 'SECRET_LEVEL', businessCode: 'BUSINESS_CODE_COMMON' },
])
const hasFile=ref<boolean>(true)
const uploadUrl = ref<string>()
const fileList = ref<any[]>([])
const upload = ref<UploadInstance>()
const fileInfo=ref<any>({id: "", name: ""})

const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  fileList.value = fileList.value.slice(-3)
}

const setFileInfo=()=>{
    emit('setFileList', fileInfo.value)
    closeDialog()
}
const handleUpload: UploadProps['beforeUpload'] = async (rawFile) => {
  // 检测表单数据是否通过验证，如果没有通过 则停止下一步 返回值是true执行下一步 false 终止
  return await submitForm(ruleFormRef.value)
}

const handleExceed: UploadProps['onExceed'] = (files) => {


    const fileNum=files.length+fileList.value.length
    if(fileNum>=1)
    {
        ElMessage({ message: '只能选择1个文件导入', type: 'warning' })
        return false
    }
      

  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
  
}

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
    hasFile.value=true
}

const handleSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
    fileInfo.value={ id: response.data, name: uploadFile.name }
    hasFile.value=false
//   emit('setFileList', { id: response.data, name: uploadFile.name })
//   closeDialog()
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  return await formEl.validate(async (valid, fields) => {
    if (valid) {
      return true
    } else {
      return false
    }
  })
}

const getSecretGradeName = (val: any) => {
  secretLevelList.value.map((item) => {
    if (item.code === val) {
      ruleForm.secretGradeName = item.name
    }
  })
}

const emit = defineEmits(['setFileList'])

const dialogVisible = ref(false)

const id = ref<string>('')

// 表单参数
let ruleForm = reactive<any>({
  secretGradeCode: '',
  ticketProxy: localStorage.getItem('ticketProxy') || getCookie('ticket-erm'),
  secretGradeName: '',
  remark: '暂无',
})

const rules = reactive<FormRules>({
  secretGradeCode: [
    { required: true, message: '请选择涉密等级', trigger: 'change' },
  ],
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
})
/* 
重置表单数据
*/
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const openDialog = (): void => {
  dialogVisible.value = true
  nextTick(() => {
    fileList.value = []
    hasFile.value=true
    resetForm(ruleFormRef.value)
  })
}
const closeDialog = (): void => {
  dialogVisible.value = false
}
onMounted(() => {
  const baseURL = process.env.NODE_ENV === 'development' ? '/api' : ''
  uploadUrl.value = baseURL + '/common/web/file/upload2Mongodb.do'
})
//主动暴露组件属性
defineExpose({
  openDialog,
  closeDialog,
})
</script>
