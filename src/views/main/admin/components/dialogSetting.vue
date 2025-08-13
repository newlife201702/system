<template>
    <el-dialog v-model="dialogVisible" title="参数设置" width="600">
        <span>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px" status-icon>
                <el-row class="dialogClassContainer">

                    <el-col :span="24">
                        <el-form-item label="登录时长" prop="loginLastTime">
                            <el-input v-model="ruleForm.loginLastTime" placeholder="请设置用户登录时长">
                                <template #append>分钟</template>
                                </el-input>
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

import { ref, reactive } from 'vue'
// import { defineEmits, onMounted } from 'vue'
import * as api from '@/api'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
let ruleForm = reactive<any>({
    loginLastTime: "0",
})

const rules = reactive<FormRules>({
    loginLastTime: [
        { required: true, message: '请设置用户登录时长', trigger: 'blur' }
    ],
})

const currentRow = ref<any>()
// const emit = defineEmits(["processPersonHandle"]);

const dialogVisible = ref(false)

 

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
                console.log(ruleForm)
                closeDialog()

        }

    })
}
/* 
重置表单数据
*/
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

// action edit add
const openDialog = (): void => {
   
    resetForm(ruleFormRef.value)
    dialogVisible.value = true

}
const closeDialog = (): void => {
    dialogVisible.value = false
}
// onMounted(() => {

// })
//主动暴露组件属性
defineExpose({
    openDialog,
    closeDialog
})

</script>
<style lang="less">
</style>
