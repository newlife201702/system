<template>
    <div class="workPackageFormContainer">
        <h1>
            <el-icon>
                <Platform />
            </el-icon>
            {{ actionType === 'add' ? '创建任务' : '编辑任务' }}

        </h1>

        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px">
            <el-form-item label="项目名称" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="作战方向" prop="direction">
                <el-select v-model="ruleForm.direction" placeholder="请选择">
                    <el-option v-for="(item, index) in directionTypeList " :key="'direction' + index" :label="item.name"
                        :value="item.id" >
                        </el-option>
                </el-select>
            </el-form-item>    
            <el-form-item label="任务类型" prop="taskType">
                <el-select v-model="ruleForm.taskType" placeholder="请选择">
                    <el-option v-for="(item, index) in taskTypeList" :key="'task' + index" :label="item.name"
                        :value="item.id" />
                </el-select>
            </el-form-item>   
            <el-form-item label="来源" prop="region">
                <el-input v-model="ruleForm.region" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="计划开始时间" prop="planBeginDate" v-if="actionType !== 'edit'">
                <el-date-picker v-model="ruleForm.planBeginDate" type="date" placeholder="请选择日期" format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item label="计划结束时间" prop="planEndDate" v-if="actionType !== 'edit'">
                <el-date-picker v-model="ruleForm.planEndDate" type="date" placeholder="请选择日期" format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD" />
            </el-form-item>


    
            <el-form-item label="密级" prop="securityLevelCode">
                <el-radio-group v-model="ruleForm.securityLevelCode">
                    <el-radio :label="item.code" v-for="(item, index) in secretLevelList" :key="'security' + index">
                        <img :src="getIcoByName(item.name)" alt="">
                   </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="团队成员" prop="personRelaIds">
                <el-select v-model="ruleForm.personRelaIds" multiple placeholder="请选择">
                    <el-option v-for="(item, index) in userListOption" :key="'person' + index" :label="item.name"
                        :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="军兵种" prop="troops">
                    <el-select v-model="ruleForm.troops"  filterable>
                            <el-option v-for="(item, index) in toorsTypeList " :key="'t' + index" :label="item.name"
                                        :value="item.id" />
                    </el-select>
            </el-form-item>
            <el-form-item label="场景描述" prop="requirement">
                <el-input v-model="ruleForm.requirement"  />
            </el-form-item>        
            <el-form-item label="活动要求" prop="about">
                <el-input v-model="ruleForm.about" type="textarea" :rows="4" />
            </el-form-item>
            <el-form-item label="附件" prop="memo">
                <el-input v-model="ruleForm.memo" type="textarea" :rows="4" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)">提交保存</el-button>
                <el-button type="primary" @click="addPlan(ruleFormRef)">定义任务</el-button>
                <el-button @click="resetForm(ruleFormRef)">重置</el-button>
            </el-form-item>
        </el-form>

        <tree-dialog ref='treeRef' @getOrgNode="getOrgNode"></tree-dialog>
    </div>
</template>
  
<script lang="ts" setup>
import * as api from '@/api'
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

import { ElMessage } from 'element-plus'
import { getIcoByName } from '@/libs/utils'
import { useRoute, useRouter } from 'vue-router';
import dicOptions from '@/libs/common/dicOptions'
import treeDialog from '@/components/treeDialog.vue'
import { flow } from 'lodash'

const treeRef = ref()  //注册响应数据  
const route = useRoute()
const router = useRouter()
const id = ref<string>()
const pageType = ref<string>('listWorkPackageManagement')
const actionType = ref<string>('add')
const { secretLevelList } = dicOptions([{ code: 'SECRET_LEVEL', businessCode: 'BUSINESS_CODE_COMMON' }])
const userListOption = ref<any>()
const { directionTypeList } = dicOptions([{ code: 'DIRECTION_TYPE', businessCode: 'BUSINESS_CODE_TXZJXT' }])
const { taskTypeList } = dicOptions([{ code: 'TASK_TYPE', businessCode: 'BUSINESS_CODE_TXZJXT' }])
const { toorsTypeList } = dicOptions([{ code: 'TOOPRS_TYPE', businessCode: 'BUSINESS_CODE_TXZJXT' }])


const projectFlowId = ref<string>();
const flowListOption = ref<any>()

const ruleFormRef = ref<FormInstance>()
let ruleForm = reactive<ReqMyPackageAddFormData>({
    id: "",
    flowId: "",
    about: "",
    code: "",
    departmentRelaName: '研究所',
    departmentRelaIds: ['CA37C82FC62649A7A9D407072C6B9321'],
    departmentTypeCode: "PROJECT_DEPT_TYPE_RESPONSIBLE",
    levelCode: "levelCode",
    levelName: "levelName",
    memo: "",
    name: "",
    personTypeCode: "PROJECT_PERSON_TYPE_RESPONSIBLE",
    personRelaIds: [],
    personRelaList: [],
    extendProjectParam: [],
    region: "",
    direction : "",
    taskType: "",
    troops: "",
    securityLevelCode: "",
    planBeginDate: "",
    planEndDate: "",
    businessCode: "BUSINESS_CODE_TXZJXT",
})

const getOrgNode = (data: any) => {
    if (data.checkAll.length > 0) {
        ruleForm.departmentRelaName = data.checkAllName.join(',')
        ruleForm.departmentRelaIds = data.checkAll
    }
}


onMounted(async () => {
    // console.log(route.query)
    // console.log(route?.query?.id)
    // console.log(route.path)    // console.log(route?.params.actinType,"======")
    if (route.path === '/main/myWorkPackage/edit') {
        if (route?.query?.id) {
            id.value = route?.query?.id as string
            pageType.value = route?.query?.pageType as string
            const result = await api.packageManage.getInfo({ id: id.value })
            const resultData = result.data
            const editFromData = {
                ...(resultData?.projectPhysical as Record<string, unknown>),
                departmentRelaIds: (resultData?.departmentRelaList as Record<string, unknown>[]).map(item => { return item.departmentId }),
                personRelaIds: (resultData?.personRelaList as Record<string, unknown>[]).map(item => { return item.personId }),
                personRelaId: (resultData?.personRelaList as []).length > 0 ? (resultData?.personRelaList as Record<string, unknown>[])[0].personId : '',
                departmentRelaName: (resultData?.departmentRelaList as Record<string, unknown>[]).length === 0 ? '' : (resultData?.departmentRelaList as Record<string, unknown>[])[0].name,
            }

            //projectFlowId.value = editFromData.flowId;
            Object.assign(ruleForm, editFromData)
        }
        else {
            ElMessage({ message: "ID参数缺失错误", type: 'warning', })
        }
        actionType.value = 'edit'
    }
    else {
        actionType.value = 'add'
    }
    
    getDictionaryList()
    console.log("onmouted")
    getFlowList()

})
const rules = reactive<FormRules>({
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },

    ],
    securityLevelCode: [
        {
            // type: 'date',
            required: true,
            message: '请选择密级',
            trigger: 'change',
        },
    ],
    personRelaId: [
        {
            // type: 'date',
            required: true,
            message: '请选择团队成员',
            trigger: 'change',
        },
    ],
    planBeginDate: [
        {
            // type: 'date',
            required: true,
            message: '请选择计划开始时间',
            trigger: 'change',
        },
    ],
    planEndDate: [
        {
            // type: 'date',
            required: true,
            message: '请选择计划完成时间',
            trigger: 'change',
        },
    ],
    region: [
        { required: true, message: '请输入来源', trigger: 'blur' },
    ],
    requirement: [
        { required: true, message: '请输入活动要求', trigger: 'blur' },
    ],

})
const goUrl = (urlName: string) => {
    router.push({ name: urlName })
}

const goUrlParam =  (urlName: string) => {
    router.push({ name:urlName, query:{ flowId:projectFlowId.value ,projectId:route?.query?.id as string } })
}

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            if (actionType.value === 'add') {
                add()
            }
            else {
                edit()
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}

//add bpmn page
const addPlan = async (formE1: FormInstance | undefined) => {
    goUrlParam('addflow')
}



const add = async () => {
    const result = await api.packageManage.add({ ...ruleForm, personRelaList: getPersonRelaList(),
        extendProjectParam:getextendProjectParam()})
    if (result.resultCode === 0 && result.returnCode === 0) {
        ElMessage({
            message: "添加成功",
            type: 'success',
        })
        goUrl('listWorkPackageManagement')
    }
}
const getPersonRelaList = () => {
    console.log("getPersonRelaList")
    let arr: any[] = []
    userListOption.value.map((item: Record<string, unknown>) => {
        ruleForm.personRelaIds.map((items:any)=>{
            if(items === item.id){
                arr.push({ personId: item.id, personTypeCode: 'PROJECT_PERSON_TYPE_RESPONSIBLE' })
            }
        })
    })
    return arr
}

const getextendProjectParam = () =>{
    let arr: any[] = []
    arr.push({ propertyField: 'direction' , propertyValue: ruleForm.direction})
    arr.push({ propertyField: 'type' , propertyValue: ruleForm.taskType})
    arr.push({ propertyField: 'troops' , propertyValue: ruleForm.troops})
    return arr;
}

const edit = async () => {
    const result = await api.packageManage.edit(
        {
            model: { ...ruleForm, personRelaList: getPersonRelaList() },
            id: ruleForm.id as string
        }
    )
    if (result.resultCode === 0 && result.returnCode === 0) {
        ElMessage({
            message: "修改成功",
            type: 'success',
        })
        goUrl(pageType.value)
    }
}


const getDictionaryList = async () => {
    console.log("getDictionaryList")

    const userresult = await api.commonUser.list({ businessCode : "BUSINESS_CODE_WORKFLOW"})
    userListOption.value = userresult.data
    
}


const getFlowList = async () => {
    console.log("getFlowList")
    //const result =  await api.flow.flowList({ businessCode : "BUSINESS_CODE_TXZJXT"})
    //flowListOption.value = result.data
}






const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

const openDepartDialog = () => {
    treeRef.value.openDialog([], 'add', 'single')
}

</script>
  
<style lang="less" >
.workPackageFormContainer {

    .el-input,
    .el-select {
        width: 100%;
    }
}
</style>
  