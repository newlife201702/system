<template>
    <el-dialog v-model=dialogVisible :title="currentAction === 'edit' ? '编辑工作包' : '添加工作包'" width=840>
        <span class=dialogFormContainer>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入名称" />
                </el-form-item>
                <el-form-item label="编号" prop="code">
                    <el-input v-model="ruleForm.code" placeholder="请输入编号" />
                </el-form-item>
                <el-form-item label="密级" prop="securityLevelCode">
                    <el-radio-group v-model="ruleForm.securityLevelCode">
                        <el-radio :label="item.code" v-for="(item, index) in secretLevelList" :key="'security' + index"> <img :src="getIcoByName(item.name)" alt=""></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="责任部门" prop="departmentRelaName">
                    <el-input v-model="ruleForm.departmentRelaName" placeholder="请选择添加部门" disabled>
                        <template #append>
                            <el-button type="primary" @click="openDepartDialog()">选择部门</el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="责任人" prop="personRelaId">
                    <el-select v-model="ruleForm.personRelaId" placeholder="请选择">
                        <el-option v-for="(item, index) in userListOption" :key="'person' + index" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="说明" prop="about">
                    <el-input v-model="ruleForm.about" type="textarea" :rows="4" />
                </el-form-item>
                <el-form-item label="备注" prop="memo">
                    <el-input v-model="ruleForm.memo" type="textarea" :rows="4" />
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
    <tree-dialog ref='treeRef' @getOrgNode="getOrgNode"></tree-dialog>
</template>
  
<script lang=ts setup>

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { nextTick, reactive, defineEmits } from 'vue'
import * as api from '@/api'
import treeDialog from '@/components/treeDialog.vue'
import dicOptions from '@/libs/common/dicOptions'
import { getIcoByName } from '@/libs/utils'
const emit = defineEmits(['reloadTree']);
const treeRef = ref()  //注册响应数据  
const { secretLevelList } = dicOptions([{ code: 'SECRET_LEVEL', businessCode: 'BUSINESS_CODE_COMMON' }])
const currentAction = ref('add')
const userListOption = ref<any>()
const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
const id = ref<string>("")
const parentId = ref<string>("")

let ruleForm = reactive<ReqPlanManageAddFormData>({
    about: '', //说明
    code: '', //编号
    departmentRelaName: '',//回显用的
    departmentRelaIds: [], //部门id
    departmentTypeCode: '', //部门类型
    levelCode: '', //层级代码
    levelName: '', //层级名称
    memo: '', //备注
    name: '', //任务包名
    parentId: '', //任务包上级id
    personRelaId: '',
    personRelaList: [], //关联人员
    securityLevelCode: '', //任务包密级
    sortNo: 0, //顺序编号
    statusCode: '', //状态码
    statusName: '', //状态名
    templateWorkItemId: '', //模板标识
    templateWorkItemName: '', //模板名称
})
const getPersonRelaList = () => {
    let arr: any[] = []
    userListOption.value.map((item: Record<string, unknown>) => {
        if (ruleForm.personRelaId === item.id) {
            arr.push({ personId: item.id, personTypeCode: 'PROJECT_PERSON_TYPE_RESPONSIBLE' })
        }
    })
    return arr
}
const openDepartDialog = () => {
    treeRef.value.openDialog([], 'add', 'single')
}
const getOrgNode = (data: any) => {
    if (data.checkAll.length > 0) {
        ruleForm.departmentRelaName = data.checkAllName.join(',')
        ruleForm.departmentRelaIds = data.checkAll
    }

}


const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },

    ],
    code: [
        { required: true, message: '请输入编码', trigger: 'blur' },
    ],

    securityLevelCode: [
        {
            // type: 'date',
            required: true,
            message: '请选择密级',
            trigger: 'change',
        },
    ],
    departmentRelaName: [
        {
            // type: 'date',
            required: true,
            message: '请选择部门',
            trigger: 'change',
        },
    ],
    personRelaId:[
        {
            required: true,
            message: '人员',
            trigger: 'change',
        },
    ]
})
/* 
重置表单数据
*/
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

const goSave = async () => {
    const result: any = await api.planManage.add({ ...ruleForm, personRelaList: getPersonRelaList() })
    if (result.returnCode === 0 && result.resultCode === 0) {
        ElMessage({ message: '添加成功', type: 'success' })
        emit('reloadTree',parentId.value)  
        closeDialog()
    }
}

const goEdit = async () => {
    const result: any = await api.planManage.update({ id: id.value, model: { ...ruleForm, personRelaList: getPersonRelaList() } })
    if (result.returnCode === 0 && result.resultCode === 0) {
        ElMessage({ message: '修改成功', type: 'success' })
        emit('reloadTree',parentId.value)
        closeDialog()
    }
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
const getUserList = async () => {
    const result = await api.commonUser.list()
    userListOption.value = result.data
}
const openDialog = (row: any, actionType: string): void => {

    dialogVisible.value = true
    nextTick(() => {
        resetForm(ruleFormRef.value)
        if (actionType === 'edit') {
            ruleForm = Object.assign(ruleForm, row)
            id.value = row.id as string
            if(ruleForm.personRelaId.length>0)
            {
                ruleForm.personRelaId=row.personRelaList[0].personId
            }
            else
            {
                ruleForm.personRelaId=""
            }
            
            ruleForm.departmentRelaName=row.departmentRelaList[0].name
            ruleForm.departmentTypeCode=row.departmentRelaList[0].departmentTypeCode
            ruleForm.departmentRelaIds=[]
            row.departmentRelaList.map((item:any)=>{ruleForm.departmentRelaIds.push(item.id)})

        }
        else {
            ruleForm = Object.assign(ruleForm, row)
        }
        currentAction.value = actionType 
        parentId.value=ruleForm.parentId
    })
   
    getUserList()
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
  