<template>
    <div class="mypanelContainer" :class="drawer ? '' : 'hidenPanelContainer'">
        <h1 class="lmtitle2">
            {{ nodeTitle([typeList1, typeList2, typeList3, typeList4]) }}
        </h1>

        <div>

            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="120px" status-icon>
                <template v-if="nodeBaseVisible(typeList1,nodeType)">
                    <el-form-item label="流程名称" prop="name">
                        <el-input v-model="ruleForm.name" />
                    </el-form-item>
                    <el-form-item label="模板类型" prop="flowTypeName">
                         <el-input v-model="ruleForm.flowTypeName" readonly/>
                    </el-form-item>
                </template>


                <template v-if="nodeBaseVisible(typeList2,nodeType)">
                    <el-form-item label="活动名称" prop="name">
                        <el-input v-model="ruleForm.name" />
                    </el-form-item>
                    <el-form-item label="任务负责人" prop="personRelaIdsList">
                        <el-select v-model="ruleForm.personRelaIdsList" multiple>
                            <el-option v-for="(item, index) in userListOption" :key="'person' + index" :label="item.name"
                        :value="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="planBeginDate">
                         <el-date-picker
                                v-model="ruleForm.planBeginDate"
                                type="date"
                                placeholder="Pick a day" 
                                />
                    </el-form-item>
                    <el-form-item label="结束时间" prop="planEndDate">
                                <el-date-picker
                                v-model="ruleForm.planEndDate"
                                type="date"
                                placeholder="Pick a day" 
                                />
                    </el-form-item>
                    <el-form-item label="所需天数" prop="timeday">
                         <el-input-number v-model="ruleForm.timeday" :min="1" :max="200" />
                    </el-form-item>
                    <el-form-item label="输入" prop="input">
                         <lazyCascadeGridDialog ref="chooseInput" dialogTitle="输入参数" list-module="planTask"
                            list-method="getInputData" list-load-key-field="inputDataId" list-load-value-field="id"
                            :list-query-param="{ type: 'TASK_INOUTPUT_CODE_OUTPUT' }" 
                            @updateData="updateInputData" />
                            
                        <el-input v-model="ruleForm.inputNames" style="max-width: 600px"
                            placeholder="请填写" readonly>
                            <template #suffix>
                                <el-icon class="pointer" v-if="ruleForm?.inputList.value?.dataTypeCode"
                                    @click="clearFormField(ruleForm.inputList, [])">
                                    <Close />
                                </el-icon>
                                <el-icon class="pointer" @click="showInputDialog">
                                    <Plus />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="输出" prop="output">
                         <lazyCascadeGridDialog ref="chooseOutput" dialogTitle="输出参数" list-module="planTask"
                            list-method="getOutputData" list-load-key-field="outputDataId" list-load-value-field="id"
                            :list-query-param="{ type: 'TASK_INOUTPUT_CODE_OUTPUT' }" 
                            @updateData="updateOutputData" />
                            
                        <el-input v-model="ruleForm.outputNames" style="max-width: 600px"
                            placeholder="请填写" readonly>
                            <template #suffix>
                                <el-icon class="pointer" v-if="ruleForm?.outputList.value?.dataTypeCode"
                                    @click="clearFormField(ruleForm.inputList, [])">
                                    <Close />
                                </el-icon>
                                <el-icon class="pointer" @click="showOutputDialog">
                                    <Plus />
                                </el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="执行工具" prop="tool">
                        <el-select v-model="ruleForm.tool">
                            <el-option v-for="(item, index) in toolListOption" :key="'tool' + index" :label="item.name"
                                :value="item.code" />
                        </el-select>
                    </el-form-item>     
                </template>

               
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineExpose, reactive, defineProps, watch, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'

import { clearFormField, getIcoByName } from '@/libs/utils'
import knowedgeDialog from '@/components/common/knowedgeDialog.vue'
import dicOptions from '@/libs/common/dicOptions'
import * as api from '@/api'
import _ from 'lodash'

import lazyCascadeGridDialog from '@/components/common/lazyCascadeGridDialog.vue'


const myChooseStructure = ref()
const myAppForm = ref()

const { secretLevelList } = dicOptions([
    { code: 'SECRET_LEVEL', businessCode: 'BUSINESS_CODE_COMMON' },
    { code: 'BUSINESS_TYPE', businessCode: 'BUSINESS_CODE_WORKFLOW' }
])

const userListOption = ref<any>();
const toolListOption = dicOptions([{ code: 'TOOL_TYPE', businessCode: 'BUSINESS_CODE_WORKFLOW' }]).toolTypeList
const inputList =  ref<any>([]);
const outputList = ref<any>([]);
const isRun = ref<any>('false');

interface RuleForm {
    id: string
    personRelaIdsList: []
    planBeginDate: string,
    planEndDate: string,
    timeday: string,
    tool: string,
    nodeTypeCode:  string,
    nodeTypeName:  string,
    inputList: any,
    outputList: any,
    nodeId?: string,
    aosActivityField: any
}

const myChooseDepartment = ref()
const drawer = ref<boolean>(false)
const nodeType = ref<string>('')
const nodeId = ref<string>('')
const props = defineProps({
    templateId: String,
    templateId1: String,
    lastArchiveId: String,
    flowId: String
})

const typeList1 = ref<string[]>(['bpmn:Process'])
const typeList2 = ref<string[]>(['bpmn:event5', 'bpmn:event11', 'bpmn:event12', 'bpmn:event13'])
const typeList3 = ref<string[]>(['bpmn:event1', 'bpmn:event2', 'bpmn:event4'])
const typeList4 = ref<string[]>(['bpmn:event9', 'bpmn:event10', 'bpmn:event14'])

// 节点属性展示
const nodeBaseVisible = (arr: string[], nodeType: string) => {
    let viewStatus = false
    arr.map((item: string) => {
        if (item === nodeType) {
            viewStatus = true
        }
    })
    return viewStatus
}

const stepOptionList = ref<any>([])
// const getStepOptionList = async () => {
//     const result = await api.common.findAll({ code: 'BUSINESS_TYPE_PHASE', businessCode: 'BUSINESS_CODE_WORKFLOW' })
//     stepOptionList.value = (result?.data as any).map((item: any) => {
//         return { name: item.name, id: item.id }
//     })
// }
 
 
const nodeTitle = (arr: any) => {
    const arrTitle = ['基本信息', '活动属性', '事件', '流程']
    let i = 0
    arr.map((item: any, index: number) => {
        item.map((subItem: any) => {
            if (subItem === nodeType.value) {
                i = index
            }
        })
    })
    return arrTitle[i]
}

const ruleFormRef = ref<FormInstance>()
const emit = defineEmits(['setbpmnNodeProp'])

let ruleForm = reactive<any>({
    id: '',
    personRelaIdsList: [],
    planBeginDate:  '',
    planEndDate:  '',
    timeday: '',
    tool:   '',
    nodeTypeCode:   '',
    nodeTypeName:   '',
    inputList: [],
    inputNames: '',
    inputListArr: [],
    outputList: [],
    outputNames: '',
    outputListArr: []
})

const rules = reactive<any>({
    //name必填
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
})
 

const openDrawer = (data: any): void => {
    // 清空表单字段
    for (const key in ruleForm) {
        delete ruleForm[key]
        // console.log(key)
    }

    // console.log(ruleForm);
    ruleForm = Object.assign(ruleForm, {
        id: '',
        nodeId: '',       
        planBeginDate: '',
        planEndDate: '',
        timeday: '',
        tool: '',
        nodeTypeCode: '',
        nodeTypeName: '',
        inputList: [{
            name: '输入',
            dataTypeCode:'code',
            dataTypeName: 'name',
            securityLevelCode: 'nb',
            securityLevelName : '内部'
        }],
        outputList: [{
            name: '输出',
            dataTypeCode:'code',
            dataTypeName: 'name',
            securityLevelCode: 'nb',
            securityLevelName : '内部'
        }],
    })

    nodeType.value = data.nodeType
    nodeId.value = data.nodeId

    if (nodeType.value == 'bpmn:Process') {
        console.log("----+++")
        console.log(data)
        Object.assign(ruleForm, {
            ...data,
        })
    } else {

        Object.assign(ruleForm, {
            ...data,
        })

        // if (ruleForm.aosActivityField.executorId) {
        //     getDepartOptionList(ruleForm.aosActivityField.executorId)
        // }
    }

    drawer.value = true
}
const closeDrawer = (): void => {
    drawer.value = false
}

const submitForm = (formEl: FormInstance): void => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            confirmClick()
        } else {
            // ElMessage({ message: '表单校验不通过', type: 'warning' })
        }
    })
}

const goCheckForm = (): void => {
    let valid: boolean = true
    let messageString: string = ''

    const checkList1 = [
        { key: 'name', msg: '流程名称不能为空' },
        { key: 'about', msg: '流程描述不能为空' },
        { key: 'flowTarget', msg: '流程目标不能为空' },
        { key: 'ownerName', msg: '请选择流程所有者', obj: 'aosProcessFlowField' },
        { key: 'manageDepartName', msg: '请选择牵头责任部门', obj: 'aosProcessFlowField' },
        { key: 'leaderName', msg: '请选择分管领导', obj: 'aosProcessFlowField' },
        { key: 'partnerName', msg: '请选择流程参与者', obj: 'aosProcessFlowField' },
        { key: 'examinerName', msg: '请选择流程检查者', obj: 'aosProcessFlowField' },
        { key: 'occurance', msg: '发生频率不能为空' },
        { key: 'version', msg: '版本不能为空' },
        { key: 'processFlowKpiId', msg: '请选择流程KPI', obj: 'aosProcessFlowField' },
        { key: 'processOutput', msg: '请选择流程输出', obj: 'aosProcessFlowField' }
    ]
    const checkList2 = [
        { key: 'name', msg: '流程名称不能为空' },
        { key: 'about', msg: '流程描述不能为空' },
        { key: 'executor', msg: '请选择主要执行人', obj: 'aosActivityField' },
        { key: 'standard', msg: '请选择标准', obj: 'aosActivityField' },
        { key: 'responsibility', msg: '请选择权责分配', obj: 'aosActivityField' },
        { key: 'institution', msg: '请选择制度', obj: 'aosActivityField' },
        { key: 'timeLimitForCompletion', msg: '完成时限不能为空' }
    ]

    if (nodeBaseVisible(typeList1.value, nodeType.value)) {
        checkList1.map((item: any) => {
            if (item?.obj) {
                if (!ruleForm[item.obj][item.key]) {
                    // ElMessage({ message: item.msg, type: 'warning' })
                    messageString = messageString + '' + item.msg + '<br>'
                    valid = false
                }
            } else {
                if (!ruleForm[item.key]) {
                    // ElMessage({ message: item.msg, type: 'warning' })
                    messageString = messageString + '' + item.msg + '<br>'
                    valid = false
                }
            }
        })
    }
    if (nodeBaseVisible(typeList2.value, nodeType.value)) {
        checkList2.map((item: any) => {
            if (item?.obj) {
                if (!ruleForm[item.obj][item.key]) {
                    // ElMessage({ message: item.msg, type: 'warning' })
                    messageString = messageString + '' + item.msg + '<br>'
                    valid = false
                }
            } else {
                if (!ruleForm[item.key]) {
                    // ElMessage({ message: item.msg, type: 'warning' })
                    messageString = messageString + '' + item.msg + '<br>'
                    valid = false
                }
            }
        })
    }
    if (valid) {
        ElMessage({ message: '表单验证通过', type: 'success' })
    } else {
        ElNotification({
            title: '提示',
            customClass: 'myNotify',
            dangerouslyUseHTMLString: true,
            message: messageString,
            type: 'warning',
            duration: 0
        })
    }
}
function confirmClick() {
    console.log("confirmClient ")
    if ((nodeBaseVisible(typeList2.value, nodeType.value) && ruleForm.isWrokTemplate) || nodeType.value === 'bpmn:Process') {
        // 画布不需要参数 自定义的 templateTypeCode
        if (nodeType.value === 'bpmn:Process') {
            emit('setbpmnNodeProp', {
                ...ruleForm,

                nodeId: nodeId.value,
                nodeType: nodeType.value
            })
        } else {
            emit('setbpmnNodeProp', {
                ...ruleForm,
                nodeId: nodeId.value,
                nodeType: nodeType.value,
                templateTypeCode: nodeType.value
            })
        }
    } else {
        // delete ruleForm.personRelaListArr
        // delete ruleForm.personRelaList

        emit('setbpmnNodeProp', {
            ...ruleForm,
            nodeId: nodeId.value,
            nodeType: nodeType.value,
            templateTypeCode: nodeType.value
        })
    }

    // drawer.value = false
}

function initData(info: any) {
    ruleForm.documentation.name = info.name
    ruleForm.documentation.about = info.about
}
onMounted(() => {
    // getStepOptionList()
    

    getUserList()

})
watch(
    () => ruleForm,
    async (newVal, oldVal) => {
        if (newVal) {
            submitForm(ruleFormRef.value)
        }
    },
    { immediate: true, deep: true }
)
//主动暴露组件属性
defineExpose({
    openDrawer,
    closeDrawer,
    initData
})

//************************选择表单**********************

const chooseProcessUseForm = ref()
const showProcessUseFormNameDialog = () => {
    let leaders: any[] = []
    if (ruleForm.aosProcessFlowField.processUseFormId) {
        let ids = ruleForm.aosProcessFlowField.processUseFormId.split(',')
        let names = ruleForm.aosProcessFlowField.processUseFormName.split(',')
        for (let i = 0, len = ids.length; i < len; i++) {
            leaders.push({ id: ids[i], name: names[i] })
        }
    }
    chooseProcessUseForm.value.openDialog(leaders, 'multiple')
}

// processUseFormName processUseFormId
const updateProcessUseForm = (arr: string[]) => {
    if (arr && arr.length > 0) {
        ruleForm.aosProcessFlowField.processUseFormId = ''
        ruleForm.aosProcessFlowField.processUseFormName = ''
        arr.map((item: any) => {
            ruleForm.aosProcessFlowField.processUseFormId += ',' + item.id
            ruleForm.aosProcessFlowField.processUseFormName += ',' + item.name
        })
        ruleForm.aosProcessFlowField.processUseFormId = ruleForm.aosProcessFlowField.processUseFormId.substring(1)
        ruleForm.aosProcessFlowField.processUseFormName = ruleForm.aosProcessFlowField.processUseFormName.substring(1)
    } else {
        clearFormField(ruleForm.aosProcessFlowField, ['processUseFormName', 'processUseFormId'])
    }
    chooseProcessUseForm.value.closeDialog()
}
//************************分管领导选框**********************

//************************分管领导选框**********************

// const chooseLeader = ref()
// const showLeaderDialog = () => {
//     let leaders: any[] = []
//     if (ruleForm.aosProcessFlowField.leaderId) {
//         let ids = ruleForm.aosProcessFlowField.leaderId.split(',')
//         let names = ruleForm.aosProcessFlowField.leaderName.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             leaders.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseLeader.value.openDialog(leaders, 'single')
// }
// const updateLeader = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosProcessFlowField.leaderId = ''
//         ruleForm.aosProcessFlowField.leaderName = ''
//         arr.map((item: any) => {
//             ruleForm.aosProcessFlowField.leaderId += ',' + item.id
//             ruleForm.aosProcessFlowField.leaderName += ',' + item.name
//         })
//         ruleForm.aosProcessFlowField.leaderId = ruleForm.aosProcessFlowField.leaderId.substring(1)
//         ruleForm.aosProcessFlowField.leaderName = ruleForm.aosProcessFlowField.leaderName.substring(1)
//     } else {
//         clearFormField(ruleForm.aosProcessFlowField, ['leaderName', 'leaderId'])
//     }
//     chooseLeader.value.closeDialog()
// }
// //************************分管领导选框**********************

// //************************所有者选框**********************
 const chooseInput = ref()
 const chooseOutput = ref()

 const showInputDialog = () => {
     let owners: any[] = []
     if (ruleForm.inputList) {
        //  let ids = ruleForm.aosProcessFlowField.ownerId.split(',')
        //  let names = ruleForm.aosProcessFlowField.ownerName.split(',')
        //  for (let i = 0, len = ids.length; i < len; i++) {
        //      owners.push({ id: ids[i], name: names[i] })
        //  }   
        // ruleForm.inputList.value.array.forEach(element => {
        //      owners.push({ name:element.name,dataTypeCode:element.dataTypeCode,dataTypeValue:element.dataTypeValue })
        // });
     }
     chooseInput.value.openDialog(owners, 'single')
 }

 const  showOutputDialog= () => {
     let owners: any[] = []
     if (ruleForm.outputList) {
        //  let ids = ruleForm.aosProcessFlowField.ownerId.split(',')
        //  let names = ruleForm.aosProcessFlowField.ownerName.split(',')
        //  for (let i = 0, len = ids.length; i < len; i++) {
        //      owners.push({ id: ids[i], name: names[i] })
        //  }   
        // ruleForm.inputList.value.array.forEach(element => {
        //      owners.push({ name:element.name,dataTypeCode:element.dataTypeCode,dataTypeValue:element.dataTypeValue })
        // });
     }
     chooseOutput.value.openDialog(owners, 'single')
 }
 




const updateInputData = (arr: string[]) => {
    console.log("updateInputData"  +  arr.length)
    
    if (arr && arr.length > 0) {
        ruleForm.inputList = [];
        arr.map((item: any) => {
            ruleForm.inputList.push({
                name:item.name,
                dataTypeCode:item.dataTypeCode,
                dataTypeValue:item.dataTypeValue,
                securityLevelCode:item.securityLevelCode
            });
            ruleForm.inputNames  += ","  + item.name
            // ruleForm.aosProcessFlowField.ownerId += ',' + item.id
            // ruleForm.aosProcessFlowField.ownerName += ',' + item.name
        })
        
        ruleForm.inputNames =   ruleForm.inputNames.substring(10)
        // ruleForm.aosProcessFlowField.ownerId = ruleForm.aosProcessFlowField.ownerId.substring(1)
        // ruleForm.aosProcessFlowField.ownerName = ruleForm.aosProcessFlowField.ownerName.substring(1)
    } else {
        clearFormField(ruleForm.inputList, [])
    }
    chooseInput.value.closeDialog()
}



const updateOutputData = (arr: string[]) => {
    if (arr && arr.length > 0) {
        console.log(arr)
        ruleForm.outputList = [];
        arr.map((item: any) => {
            ruleForm.outputList.push({
                name:item.name,
                dataTypeCode:item.dataTypeCode,
                dataTypeValue:item.dataTypeValue,
                securityLevelCode:item.securityLevelCode
            });
            ruleForm.outputNames  += ","  + item.name

            // ruleForm.aosProcessFlowField.ownerId += ',' + item.id
            // ruleForm.aosProcessFlowField.ownerName += ',' + item.name
        })

        ruleForm.outputNames =  ruleForm.outputNames.substring(10)
        // ruleForm.aosProcessFlowField.ownerId = ruleForm.aosProcessFlowField.ownerId.substring(1)
        // ruleForm.aosProcessFlowField.ownerName = ruleForm.aosProcessFlowField.ownerName.substring(1)
    } else {
        clearFormField(ruleForm.outputList, [])
    }
    chooseOutput.value.closeDialog()
}




// //************************所有者选框**********************

// //************************参与者选框**********************
// const choosePartner = ref()
// const showPartenerDialog = () => {
//     let partners: any[] = []
//     if (ruleForm.aosProcessFlowField.partnerId) {
//         let ids = ruleForm.aosProcessFlowField.partnerId.split(',')
//         let names = ruleForm.aosProcessFlowField.partnerName.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             partners.push({ id: ids[i], name: names[i] })
//         }
//     }
//     choosePartner.value.openDialog(partners, 'multiple')
// }
// const updatePartner = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosProcessFlowField.partnerId = ''
//         ruleForm.aosProcessFlowField.partnerName = ''
//         arr.map((item: any) => {
//             ruleForm.aosProcessFlowField.partnerId += ',' + item.id
//             ruleForm.aosProcessFlowField.partnerName += ',' + item.name
//         })
//         ruleForm.aosProcessFlowField.partnerId = ruleForm.aosProcessFlowField.partnerId.substring(1)
//         ruleForm.aosProcessFlowField.partnerName = ruleForm.aosProcessFlowField.partnerName.substring(1)
//     } else {
//         clearFormField(ruleForm.aosProcessFlowField, ['partnerName', 'partnerId'])
//     }
//     choosePartner.value.closeDialog()
// }
// //************************参与者选框**********************

// //************************检查者选框**********************
// const chooseExaminer = ref()
// const showExaminerDialog = () => {
//     let examiners: any[] = []
//     if (ruleForm.aosProcessFlowField.examinerId) {
//         let ids = ruleForm.aosProcessFlowField.examinerId.split(',')
//         let names = ruleForm.aosProcessFlowField.examinerName.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             examiners.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseExaminer.value.openDialog(examiners, 'multiple')
// }
// const updateExaminer = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosProcessFlowField.examinerId = ''
//         ruleForm.aosProcessFlowField.examinerName = ''
//         arr.map((item: any) => {
//             ruleForm.aosProcessFlowField.examinerId += ',' + item.id
//             ruleForm.aosProcessFlowField.examinerName += ',' + item.name
//         })
//         ruleForm.aosProcessFlowField.examinerId = ruleForm.aosProcessFlowField.examinerId.substring(1)
//         ruleForm.aosProcessFlowField.examinerName = ruleForm.aosProcessFlowField.examinerName.substring(1)
//     } else {
//         clearFormField(ruleForm.aosProcessFlowField, ['examinerName', 'examinerId'])
//     }
//     chooseExaminer.value.closeDialog()
// }
// //************************检查者选框**********************

// //************************活动执行人选框**********************
// const chooseExecutor = ref()

// const showExecutorDialog = () => {
//     let executors: any[] = []

//     if (ruleForm.aosActivityField.executorId) {
//         let ids = ruleForm.aosActivityField.executorId.split(',')
//         let names = ruleForm.aosActivityField.executor.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             executors.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseExecutor.value.openDialog(executors, 'single')
// }
// const updateExecutor = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosActivityField.executorId = ''
//         ruleForm.aosActivityField.executor = ''
//         arr.map((item: any) => {
//             ruleForm.aosActivityField.executorId += ',' + item.id
//             ruleForm.aosActivityField.executor += ',' + item.name
//         })
//         ruleForm.aosActivityField.executorId = ruleForm.aosActivityField.executorId.substring(1)
//         ruleForm.aosActivityField.executor = ruleForm.aosActivityField.executor.substring(1)

//         //注意 该处职能是单选生效
//         getDepartOptionList(ruleForm.aosActivityField.executorId)
//     } else {
//         clearFormField(ruleForm.aosActivityField, ['executor', 'executorId'])
//     }
//     chooseExecutor.value.closeDialog()
// }
// //************************活动执行人选框**********************

// //************************活动协助人选框**********************
// const chooseHelper = ref()
// const showHelperDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosActivityField.helperId) {
//         let ids = ruleForm.aosActivityField.helperId.split(',')
//         let names = ruleForm.aosActivityField.helper.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseHelper.value.openDialog(objs, 'multiple')
// }
// const updateHelper = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosActivityField.helperId = ''
//         ruleForm.aosActivityField.helper = ''
//         arr.map((item: any) => {
//             ruleForm.aosActivityField.helperId += ',' + item.id
//             ruleForm.aosActivityField.helper += ',' + item.name
//         })
//         ruleForm.aosActivityField.helperId = ruleForm.aosActivityField.helperId.substring(1)
//         ruleForm.aosActivityField.helper = ruleForm.aosActivityField.helper.substring(1)
//     } else {
//         clearFormField(ruleForm.aosActivityField, ['helper', 'helperId'])
//     }
//     chooseHelper.value.closeDialog()
// }
// //************************活动协助人选框**********************

// //************************活动知会抄送人选框**********************
// const choosecarbonCopyMan = ref()
// const showcarbonCopyManDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosActivityField.carbonCopyManId) {
//         let ids = ruleForm.aosActivityField.carbonCopyManId.split(',')
//         let names = ruleForm.aosActivityField.carbonCopyMan.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }

//     choosecarbonCopyMan.value.openDialog(objs, 'multiple')
// }
// const updatecarbonCopyMan = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosActivityField.carbonCopyManId = ''
//         ruleForm.aosActivityField.carbonCopyMan = ''
//         arr.map((item: any) => {
//             ruleForm.aosActivityField.carbonCopyManId += ',' + item.id
//             ruleForm.aosActivityField.carbonCopyMan += ',' + item.name
//         })
//         ruleForm.aosActivityField.carbonCopyManId = ruleForm.aosActivityField.carbonCopyManId.substring(1)
//         ruleForm.aosActivityField.carbonCopyMan = ruleForm.aosActivityField.carbonCopyMan.substring(1)
//     } else {
//         clearFormField(ruleForm.aosActivityField, ['carbonCopyMan', 'carbonCopyManId'])
//     }

//     choosecarbonCopyMan.value.closeDialog()
// }
// //************************活动知会抄送人选框**********************
// //************************活动标准选框**********************
// const chooseStandard = ref()
// const showStandardDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosActivityField.standardId) {
//         let ids = ruleForm.aosActivityField.standardId.split(',')
//         let names = ruleForm.aosActivityField.standard.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseStandard.value.openDialog(objs, 'multiple')
// }
// const updateStandard = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosActivityField.standardId = ''
//         ruleForm.aosActivityField.standard = ''
//         arr.map((item: any) => {
//             ruleForm.aosActivityField.standardId += ',' + item.id
//             ruleForm.aosActivityField.standard += ',' + item.name
//         })
//         ruleForm.aosActivityField.standardId = ruleForm.aosActivityField.standardId.substring(1)
//         ruleForm.aosActivityField.standard = ruleForm.aosActivityField.standard.substring(1)
//     } else {
//         clearFormField(ruleForm.aosActivityField, ['standard', 'standardId'])
//     }
//     chooseStandard.value.closeDialog()
// }
// //************************活动标准选框**********************

// //************************活动制度选框**********************
// const chooseInstitution = ref()
// const showInstitutionDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosActivityField.institutionId) {
//         let ids = ruleForm.aosActivityField.institutionId.split(',')
//         let names = ruleForm.aosActivityField.institution.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseInstitution.value.openDialog(objs, 'multiple')
// }
// const updateInstitution = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosActivityField.institutionId = ''
//         ruleForm.aosActivityField.institution = ''
//         arr.map((item: any) => {
//             ruleForm.aosActivityField.institutionId += ',' + item.id
//             ruleForm.aosActivityField.institution += ',' + item.name
//         })
//         ruleForm.aosActivityField.institutionId = ruleForm.aosActivityField.institutionId.substring(1)
//         ruleForm.aosActivityField.institution = ruleForm.aosActivityField.institution.substring(1)
//     } else {
//         clearFormField(ruleForm.aosActivityField, ['institution', 'institutionId'])
//     }
//     chooseInstitution.value.closeDialog()
// }
// //************************活动制度选框**********************

// //************************活动作业指导选框**********************
// const chooseWorkInstructions = ref()
// const showWorkInstructionsDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosActivityField.workInstructionsId) {
//         let ids = ruleForm.aosActivityField.workInstructionsId.split(',')
//         let names = ruleForm.aosActivityField.workInstructions.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseWorkInstructions.value.openDialog(objs, 'multiple')
// }
// const updateWorkInstructions = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosActivityField.workInstructionsId = ''
//         ruleForm.aosActivityField.workInstructions = ''
//         arr.map((item: any) => {
//             ruleForm.aosActivityField.workInstructionsId += ',' + item.id
//             ruleForm.aosActivityField.workInstructions += ',' + item.name
//         })
//         ruleForm.aosActivityField.workInstructionsId = ruleForm.aosActivityField.workInstructionsId.substring(1)
//         ruleForm.aosActivityField.workInstructions = ruleForm.aosActivityField.workInstructions.substring(1)
//     } else {
//         clearFormField(ruleForm.aosActivityField, ['workInstructions', 'workInstructionsId'])
//     }
//     chooseWorkInstructions.value.closeDialog()
// }
// //************************活动作业指导选框**********************

// //************************牵头责任部门选框**********************
// const chooseManageDepart = ref()
// const showManageDepartDialog = () => {
//     let manageDeparts: any[] = []
//     if (ruleForm.aosProcessFlowField.manageDepartId) {
//         let ids = ruleForm.aosProcessFlowField.manageDepartId.split(',')
//         let names = ruleForm.aosProcessFlowField.manageDepartName.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             manageDeparts.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseManageDepart.value.openDialog(manageDeparts, 'single')
// }
// const updateManageDepart = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosProcessFlowField.manageDepartId = ''
//         ruleForm.aosProcessFlowField.manageDepartName = ''
//         arr.map((item: any) => {
//             ruleForm.aosProcessFlowField.manageDepartId += ',' + item.id
//             ruleForm.aosProcessFlowField.manageDepartName += ',' + item.name
//         })
//         ruleForm.aosProcessFlowField.manageDepartId = ruleForm.aosProcessFlowField.manageDepartId.substring(1)
//         ruleForm.aosProcessFlowField.manageDepartName = ruleForm.aosProcessFlowField.manageDepartName.substring(1)
//     } else {
//         clearFormField(ruleForm.aosProcessFlowField, ['manageDepartName', 'manageDepartId'])
//     }
//     chooseManageDepart.value.closeDialog()
// }
// //************************牵头责任部门选框**********************

// //************************相关文件选框**********************
// const chooseManageFileName = ref()
// const showManageFileDialog = () => {
//     let manageDeparts: any[] = []

//     if (ruleForm.aosProcessFlowField.manageFileId) {
//         let ids = ruleForm.aosProcessFlowField.manageFileId.split(',')
//         let names = ruleForm.aosProcessFlowField.manageFileName.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             manageDeparts.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseManageFileName.value.openDialog(manageDeparts, 'multiple')
// }
// const updateManageFile = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosProcessFlowField.manageFileId = ''
//         ruleForm.aosProcessFlowField.manageFileName = ''
//         arr.map((item: any) => {
//             ruleForm.aosProcessFlowField.manageFileId += ',' + item.id
//             ruleForm.aosProcessFlowField.manageFileName += ',' + item.name
//         })
//         ruleForm.aosProcessFlowField.manageFileId = ruleForm.aosProcessFlowField.manageFileId.substring(1)
//         ruleForm.aosProcessFlowField.manageFileName = ruleForm.aosProcessFlowField.manageFileName.substring(1)
//     } else {
//         clearFormField(ruleForm.aosProcessFlowField, ['manageFileName', 'manageFileId'])
//     }
//     chooseManageFileName.value.closeDialog()
// }
// //************************相关文件选框**********************

// //************************KPI选框**********************
// const chooseProcessFlowKpi = ref()
// const showProcessFlowKpiDialog = () => {
//     let manageDeparts: any[] = []
//     if (ruleForm.aosProcessFlowField.processFlowKpiId) {
//         let ids = ruleForm.aosProcessFlowField.processFlowKpiId.split(',')
//         let names = ruleForm.aosProcessFlowField.processFlowKpiName.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             manageDeparts.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseProcessFlowKpi.value.openDialog(manageDeparts, 'multiple')
//     // multiple single
// }
// const updateProcessFlowKpi = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosProcessFlowField.processFlowKpiId = ''
//         ruleForm.aosProcessFlowField.processFlowKpiName = ''
//         arr.map((item: any) => {
//             ruleForm.aosProcessFlowField.processFlowKpiId += ',' + item.id
//             ruleForm.aosProcessFlowField.processFlowKpiName += ',' + item.name
//         })
//         ruleForm.aosProcessFlowField.processFlowKpiId = ruleForm.aosProcessFlowField.processFlowKpiId.substring(1)
//         ruleForm.aosProcessFlowField.processFlowKpiName = ruleForm.aosProcessFlowField.processFlowKpiName.substring(1)
//     } else {
//         clearFormField(ruleForm.aosProcessFlowField, ['processFlowKpiName', 'processFlowKpiId'])
//     }
//     chooseProcessFlowKpi.value.closeDialog()
// }
// //************************KPI选框**********************

// //************************输入选框**********************
// const chooseProcessInput = ref()
// const showProcessInputDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosProcessFlowField.processInputId) {
//         let ids = ruleForm.aosProcessFlowField.processInputId.split(',')
//         let names = ruleForm.aosProcessFlowField.processInput.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseProcessInput.value.openDialog(objs, 'multiple')
// }
// const updateProcessInput = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosProcessFlowField.processInputId = ''
//         ruleForm.aosProcessFlowField.processInput = ''
//         arr.map((item: any) => {
//             ruleForm.aosProcessFlowField.processInputId += ',' + item.id
//             ruleForm.aosProcessFlowField.processInput += ',' + item.name
//         })
//         ruleForm.aosProcessFlowField.processInputId = ruleForm.aosProcessFlowField.processInputId.substring(1)
//         ruleForm.aosProcessFlowField.processInput = ruleForm.aosProcessFlowField.processInput.substring(1)
//     } else {
//         clearFormField(ruleForm.aosProcessFlowField, ['processInput', 'processInputId'])
//     }
//     chooseProcessInput.value.closeDialog()
// }
// //************************输入选框**********************

// //************************输出选框**********************
// const chooseProcessOutput = ref()
// const showProcessOutputDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosProcessFlowField.processOutputId) {
//         let ids = ruleForm.aosProcessFlowField.processOutputId.split(',')
//         let names = ruleForm.aosProcessFlowField.processOutput.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseProcessOutput.value.openDialog(objs, 'multiple')
// }
// const updateProcessOutput = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosProcessFlowField.processOutputId = ''
//         ruleForm.aosProcessFlowField.processOutput = ''
//         arr.map((item: any) => {
//             ruleForm.aosProcessFlowField.processOutputId += ',' + item.id
//             ruleForm.aosProcessFlowField.processOutput += ',' + item.name
//         })
//         ruleForm.aosProcessFlowField.processOutputId = ruleForm.aosProcessFlowField.processOutputId.substring(1)
//         ruleForm.aosProcessFlowField.processOutput = ruleForm.aosProcessFlowField.processOutput.substring(1)
//     } else {
//         clearFormField(ruleForm.aosProcessFlowField, ['processOutput', 'processOutputId'])
//     }
//     chooseProcessOutput.value.closeDialog()
// }
// //************************输出选框**********************

// //************************IT所在系统选框**********************
// const chooseItLocation = ref()
// const showItLocationDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosProcessFlowField.itLocationId) {
//         let ids = ruleForm.aosProcessFlowField.itLocationId.split(',')
//         let names = ruleForm.aosProcessFlowField.itLocationName.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseItLocation.value.openDialog(objs, 'multiple')
// }
// const updateItLocation = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosProcessFlowField.itLocationId = ''
//         ruleForm.aosProcessFlowField.itLocationName = ''
//         arr.map((item: any) => {
//             ruleForm.aosProcessFlowField.itLocationId += ',' + item.id
//             ruleForm.aosProcessFlowField.itLocationName += ',' + item.name
//         })
//         ruleForm.aosProcessFlowField.itLocationId = ruleForm.aosProcessFlowField.itLocationId.substring(1)
//         ruleForm.aosProcessFlowField.itLocationName = ruleForm.aosProcessFlowField.itLocationName.substring(1)
//     } else {
//         clearFormField(ruleForm.aosProcessFlowField, ['itLocationName', 'itLocationId'])
//     }
//     chooseItLocation.value.closeDialog()
// }
// //************************IT所在系统选框**********************

// //************************启动角色选框**********************
// const chooseStartRole = ref()
// const showStartRoleDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosEventField.startRoleId) {
//         let ids = ruleForm.aosEventField.startRoleId.split(',')
//         let names = ruleForm.aosEventField.startRole.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseStartRole.value.openDialog(objs, 'multiple')
// }
// const updateStartRole = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosEventField.startRoleId = ''
//         ruleForm.aosEventField.startRole = ''
//         arr.map((item: any) => {
//             ruleForm.aosEventField.startRoleId += ',' + item.id
//             ruleForm.aosEventField.startRole += ',' + item.name
//         })
//         ruleForm.aosEventField.startRoleId = ruleForm.aosEventField.startRoleId.substring(1)
//         ruleForm.aosEventField.startRole = ruleForm.aosEventField.startRole.substring(1)
//     } else {
//         clearFormField(ruleForm.aosEventField, ['startRole', 'startRoleId'])
//     }
//     chooseStartRole.value.closeDialog()
// }
// //************************启动角色选框**********************

// //************************事件授权选框**********************
// const chooseEventAuthorization = ref()
// const showEventAuthorizationDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosEventField.eventAuthorizationId) {
//         let ids = ruleForm.aosEventField.eventAuthorizationId.split(',')
//         let names = ruleForm.aosEventField.eventAuthorization.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseEventAuthorization.value.openDialog(objs, 'multiple')
// }
// const updateEventAuthorization = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosEventField.eventAuthorizationId = ''
//         ruleForm.aosEventField.eventAuthorization = ''
//         arr.map((item: any) => {
//             ruleForm.aosEventField.eventAuthorizationId += ',' + item.id
//             ruleForm.aosEventField.eventAuthorization += ',' + item.name
//         })
//         ruleForm.aosEventField.eventAuthorizationId = ruleForm.aosEventField.eventAuthorizationId.substring(1)
//         ruleForm.aosEventField.eventAuthorization = ruleForm.aosEventField.eventAuthorization.substring(1)
//     } else {
//         clearFormField(ruleForm.aosEventField, ['eventAuthorization', 'eventAuthorizationId'])
//     }
//     chooseEventAuthorization.value.closeDialog()
// }
// //************************事件授权选框**********************

// //************************活动权责分配选框**********************
// const chooseResponsibility = ref()
// const showResponsibilityDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosActivityField.responsibilityId) {
//         let ids = ruleForm.aosActivityField.responsibilityId.split(',')
//         let names = ruleForm.aosActivityField.responsibility.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseResponsibility.value.openDialog(objs, 'multiple')
// }
// const updateResponsibility = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosActivityField.responsibilityId = ''
//         ruleForm.aosActivityField.responsibility = ''
//         arr.map((item: any) => {
//             ruleForm.aosActivityField.responsibilityId += ',' + item.id
//             ruleForm.aosActivityField.responsibility += ',' + item.name
//         })
//         ruleForm.aosActivityField.responsibilityId = ruleForm.aosActivityField.responsibilityId.substring(1)
//         ruleForm.aosActivityField.responsibility = ruleForm.aosActivityField.responsibility.substring(1)
//     } else {
//         clearFormField(ruleForm.aosActivityField, ['responsibility', 'responsibilityId'])
//     }
//     chooseResponsibility.value.closeDialog()
// }
// //************************活动权责分配选框**********************

// //************************活动输入选框**********************
// const chooseActivityProcessInput = ref()
// const showActivityProcessInputDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosActivityField.processInputId) {
//         let ids = ruleForm.aosActivityField.processInputId.split(',')
//         let names = ruleForm.aosActivityField.processInput.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseActivityProcessInput.value.openDialog(objs, 'multiple')
// }
// const updateActivityProcessInput = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosActivityField.processInputId = ''
//         ruleForm.aosActivityField.processInput = ''
//         arr.map((item: any) => {
//             ruleForm.aosActivityField.processInputId += ',' + item.id
//             ruleForm.aosActivityField.processInput += ',' + item.name
//         })
//         ruleForm.aosActivityField.processInputId = ruleForm.aosActivityField.processInputId.substring(1)
//         ruleForm.aosActivityField.processInput = ruleForm.aosActivityField.processInput.substring(1)
//     } else {
//         clearFormField(ruleForm.aosActivityField, ['processInput', 'processInputId'])
//     }
//     chooseActivityProcessInput.value.closeDialog()
// }
// //************************活动输入选框**********************

// //************************活动输出选框**********************
// const chooseActivityProcessOutput = ref()
// const showActivityProcessOutputDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosActivityField.processOutputId) {
//         let ids = ruleForm.aosActivityField.processOutputId.split(',')
//         let names = ruleForm.aosActivityField.processOutput.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseActivityProcessOutput.value.openDialog(objs, 'multiple')
// }
// const updateActivityProcessOutput = (arr: string[]) => {
//     // console.log(arr)
//     if (arr && arr.length > 0) {
//         ruleForm.aosActivityField.processOutputId = ''
//         ruleForm.aosActivityField.processOutput = ''
//         const matrixName: any = []
//         const matrixId: any = []
//         arr.map((item: any) => {
//             ruleForm.aosActivityField.processOutputId += ',' + item.id
//             ruleForm.aosActivityField.processOutput += ',' + item.name
//             if (item?.isMatrix) {
//                 matrixName.push(item.name)
//                 matrixId.push(item.id)
//             }
//         })
//         ruleForm.aosActivityField.processOutputId = ruleForm.aosActivityField.processOutputId.substring(1)
//         ruleForm.aosActivityField.processOutput = ruleForm.aosActivityField.processOutput.substring(1)

//         ruleForm.aosActivityField.processOutputDeliverables = matrixName.join(',')
//         ruleForm.aosActivityField.processOutputDeliverablesId = matrixId.join(',')
//     } else {
//         clearFormField(ruleForm.aosActivityField, ['processOutput', 'processOutputId'])
//     }
//     chooseActivityProcessOutput.value.closeDialog()
// }
// //************************活动输出选框**********************

// //************************活动风险选框**********************
// const chooseActivityRisk = ref()
// const showActivityRiskDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosActivityField.riskId) {
//         let ids = ruleForm.aosActivityField.riskId.split(',')
//         let names = ruleForm.aosActivityField.risk.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseActivityRisk.value.openDialog(objs, 'multiple')
// }
// const updateActivityRisk = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosActivityField.riskId = ''
//         ruleForm.aosActivityField.risk = ''
//         arr.map((item: any) => {
//             ruleForm.aosActivityField.riskId += ',' + item.id
//             ruleForm.aosActivityField.risk += ',' + item.name
//         })
//         ruleForm.aosActivityField.riskId = ruleForm.aosActivityField.riskId.substring(1)
//         ruleForm.aosActivityField.risk = ruleForm.aosActivityField.risk.substring(1)
//     } else {
//         clearFormField(ruleForm.aosActivityField, ['risk', 'riskId'])
//     }
//     chooseActivityRisk.value.closeDialog()
// }
// //************************活动风险选框**********************

// //************************活动应对措施选框**********************
// const chooseActivityResponseMeasures = ref()
// const showActivityResponseMeasuresDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosActivityField.responseMeasuresId) {
//         let ids = ruleForm.aosActivityField.responseMeasuresId.split(',')
//         let names = ruleForm.aosActivityField.responseMeasures.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseActivityResponseMeasures.value.openDialog(objs, 'multiple')
// }
// const updateActivityResponseMeasures = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosActivityField.responseMeasuresId = ''
//         ruleForm.aosActivityField.responseMeasures = ''
//         arr.map((item: any) => {
//             ruleForm.aosActivityField.responseMeasuresId += ',' + item.id
//             ruleForm.aosActivityField.responseMeasures += ',' + item.name
//         })
//         ruleForm.aosActivityField.responseMeasuresId = ruleForm.aosActivityField.responseMeasuresId.substring(1)
//         ruleForm.aosActivityField.responseMeasures = ruleForm.aosActivityField.responseMeasures.substring(1)
//     } else {
//         clearFormField(ruleForm.aosActivityField, ['responseMeasures', 'responseMeasuresId'])
//     }
//     chooseActivityResponseMeasures.value.closeDialog()
// }
// //************************活动应对措施选框**********************

// //************************活动场景选框**********************
// const chooseActivityScene = ref()
// const showActivitySceneDialog = () => {
//     let objs: any[] = []

//     if (ruleForm.aosActivityField.sceneId) {
//         let ids = ruleForm.aosActivityField.sceneId.split(',')
//         let names = ruleForm.aosActivityField.scene.split(',')
//         for (let i = 0, len = ids.length; i < len; i++) {
//             objs.push({ id: ids[i], name: names[i] })
//         }
//     }
//     chooseActivityScene.value.openDialog(objs, 'multiple')
// }
// const updateActivityScene = (arr: string[]) => {
//     if (arr && arr.length > 0) {
//         ruleForm.aosActivityField.sceneId = ''
//         ruleForm.aosActivityField.scene = ''
//         arr.map((item: any) => {
//             ruleForm.aosActivityField.sceneId += ',' + item.id
//             ruleForm.aosActivityField.scene += ',' + item.name
//         })
//         ruleForm.aosActivityField.sceneId = ruleForm.aosActivityField.sceneId.substring(1)
//         ruleForm.aosActivityField.scene = ruleForm.aosActivityField.scene.substring(1)
//     } else {
//         clearFormField(ruleForm.aosActivityField, ['scene', 'sceneId'])
//     }
//     chooseActivityScene.value.closeDialog()
// }
//************************活动场景选框**********************
 

const getUserList = async () => {
    const result = await api.commonUser.list({ businessCode : "BUSINESS_CODE_WORKFLOW"})
    userListOption.value = result.data
}

const addInputData = () => {
    inputList.value.push({
        name: '',
        typeCode: '',
        about: '',
        unit: ''
    })
}
 
const addOutputData = () =>{
    outputList.value.push({
        name: '',
        typeCode: '',
        about: '',
        unit: ''
    })
}



</script>
