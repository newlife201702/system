<template>
    <el-dialog v-model=dialogVisible :title="currentAction === 'edit' ? '编辑设计要求' : '添加设计要求'" width=840>
        <span class=dialogFormContainer>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px">
                <el-form-item label="名称" prop="title">
                    <el-input v-model="ruleForm.title" placeholder="请输入名称" />
                </el-form-item>
                <el-form-item label="摘要" prop="summary">
                    <el-input v-model="ruleForm.summary" type="textarea" />
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input v-model="ruleForm.content" type="textarea" :rows="8" />
                </el-form-item>
                <el-form-item label="备注" prop="memo">
                    <el-input v-model="ruleForm.memo"  />
                </el-form-item>
                <el-form-item label="附件">
                    <el-button @click=openUpload>添加附件</el-button>
                    <ul v-if="fileListArr.length>0" class="annexListContainer">
                        <li v-for="(item,index) in fileListArr" @click="fileDown(item.id)" :key="index+'fileList'">
                            <span @click="del(index)"><el-icon><Close /></el-icon></span>
                            <i>{{(index+1) + '.'}} {{ item.name }}</i>
                        </li>
                    </ul>
                </el-form-item>

            </el-form>

        </span>
        <template #footer>
            <span class=dialog-footer>
                <el-button @click=closeDialog>取消</el-button>
                <el-button type=primary @click=submitForm(ruleFormRef)>确认</el-button>
            </span>
        </template>
    </el-dialog>
    <file-upload-dialog @setFileList="setFileList"  ref='uploadRef'></file-upload-dialog>
</template>
  
<script lang=ts setup>

import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { nextTick, reactive, defineEmits } from 'vue'
import * as api from '@/api'
import fileUploadDialog from '@/components/fileUploadDialog.vue'
const uploadUrl=ref<string>()

const uploadRef=ref()
const emit = defineEmits(['getList']);

const currentAction = ref('add')

const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()


// 表单参数
let ruleForm = reactive<any>({
        summary:"",
        content: '',
        memo: '',
        projectId: '',
        title: '',
})
const fileListArr=ref<any>([]) //上传文件列表


const rules = reactive<FormRules>({
    title: [
        { required: true, message: '请输入名称', trigger: 'blur' },

    ],
    content: [
        { required: true, message: '请输入内容', trigger: 'blur' },
    ],

})
/* 
重置表单数据
*/
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

const del=(index:number)=>{
    fileListArr.value.splice(index,1)
}
const goSave = async () => {
    const result: any = await api.designRequire.add({dataIds:fileListArr.value.map((item:any)=>{return item.id}), targetRequirement:ruleForm})
    if (result.returnCode === 0 && result.resultCode === 0) {
        ElMessage({ message: '添加成功', type: 'success' })
        emit('getList')  
        closeDialog()
    }
}

const fileDown=async(id:string)=>{
   return  await api.file.fileDown({ id:id })
}

const goEdit = async () => {
    const result: any = await api.designRequire.update({ id: ruleForm.id, model: {dataIds:fileListArr.value.map((item:any)=>{return item.id}), targetRequirement:ruleForm} })
    if (result.returnCode === 0 && result.resultCode === 0) {
        ElMessage({ message: '修改成功', type: 'success' })
        emit('getList')
        closeDialog()
    }
}

const setFileList=(obj:any)=>{
    fileListArr.value.push(obj)
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

const openDialog = (row: any, actionType: string): void => {

    dialogVisible.value = true
    nextTick(() => {
        resetForm(ruleFormRef.value)
        if (actionType === 'edit') {
            ruleForm = Object.assign(ruleForm, row.targetRequirementPhysical)
            fileListArr.value= row.dataRelaPhysicalList
        }
        else {
            ruleForm.projectId = row.projectId
        }
        currentAction.value = actionType 
        
    })
   
}
const closeDialog = (): void => {
    dialogVisible.value = false
}

const openUpload=()=>{
    uploadRef.value.openDialog()
}
onMounted(()=>{
   
    const baseURL=process.env.NODE_ENV==="development"?"/api":""
    uploadUrl.value=baseURL+'/common/file/upload2Mongodb.do'
})
//主动暴露组件属性
defineExpose({
    openDialog,
    closeDialog
})

</script>
  