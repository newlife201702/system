<template>
    <el-dialog v-model=dialogVisible  width='500'>
        <span class=dialogProcessContainer>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px">
                <el-form-item label="实际开始日期" prop="beginDate"  >
                <el-date-picker v-model="ruleForm.beginDate" type="date" placeholder="请选择日期" format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD" />
            </el-form-item>

            <el-form-item label="实际完成日期" prop="endDate"  >
                <el-date-picker v-model="ruleForm.endDate" type="date" placeholder="请选择日期" format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD" />
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
    
</template>
  
<script lang=ts setup>

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { nextTick, reactive, defineEmits } from 'vue'
import * as api from '@/api'

const emit = defineEmits(['loadList']);

const currentRow=ref<any>({})
 

const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()


let ruleForm = reactive<any>({
    beginDate:"",
    endDate:""
})


 


const rules = reactive<FormRules>({
    beginDate: [
        { required: true, message: '实际开始日期', trigger: 'change' },

    ],
    endDate: [
        { required: true, message: '实际完成日期', trigger: 'change' },
    ],

})
/* 
重置表单数据
*/
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

const goSave = async () => {
    const result = await api.flow.WorkFlowEvent({...currentRow.value,...ruleForm,"appCode": "workflow", "businessCode": 'pm' })
            if (result.resultCode === 0 && result.returnCode === 0) {
                ElMessage({ message: "操作成功",type: 'success',})
                closeDialog()
                emit('loadList')
            }
}

 


const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            
                goSave()
           

        } else {
            console.log('error submit!', fields)
        }
    })
}
 
const openDialog = (data: any): void => {

    dialogVisible.value = true
    nextTick(() => {
        resetForm(ruleFormRef.value)
        currentRow.value = data 
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
<style lang="less">
.dialogProcessContainer
{
        .el-input,
    .el-select {
        width: 100%;
    }
}

</style>
