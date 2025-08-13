<template>
    <div>

        <design-require :projectId="id"></design-require>

        <h1 class="subLmTitleContainer mtp1">
            <span> <el-button link type="primary" @click="openDepartDialog">设置</el-button></span> 参与部门
        </h1>

        <el-row :gutter="20" class="mtp1">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-for="(item, index) in departList" :key="index + 'departList'">
                <el-card shadow="hover">
                    <div class="departmentListContainer">
                        <h1>
                            {{ item.parentName }}
                        </h1>
                        <ul>
                            <li v-for="(subItem, subIndex) in item.childDepartmentList"
                                :key="index + '-' + subIndex + 'departList'">
                                <span>
                                    <el-icon>
                                        <Check />
                                    </el-icon>
                                </span>
                                {{ subItem.name }}
                            </li>
                        </ul>
                        <span>
                            查看全部
                             <i>
                                <el-tooltip placement="top" effect="light">
                                    <template #content>
                                        <div v-for="(subItem, subIndex)  in item.childDepartmentList"
                                            :key="index + '-' + subIndex + 'moreDepartList'">{{ subIndex + 1 }} . {{ subItem.name }}
                                        </div>
                                    </template>
                                    <i>{{ item.childDepartmentList?.length }}</i>
                                </el-tooltip>
                            </i>

                        </span>
                    </div>
                </el-card>
            </el-col>

        </el-row>


        <el-row :gutter="20" class="mtp2">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-card shadow="hover">
                        <flow-step  :lmTitle="'研制阶段'" :metaDataTable="'PHASE'" :projectId="id" ></flow-step>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-card shadow="hover">
                    <flow-step :lmTitle="'产品分解'" :metaDataTable="'BPS'" :projectId="id" ></flow-step>

                </el-card>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                <el-card shadow="hover">
                    <flow-step :lmTitle="'支付物分解结构'" :metaDataTable="'DBS'" :projectId="id" ></flow-step>

                </el-card>
            </el-col>
        </el-row>
        <tree-dialog ref='treeRef' @getOrgNode="getOrgNode"></tree-dialog>
       
    </div>
</template>

<script setup lang='ts'>
import { watch, ref, toRefs, defineProps } from "vue"
import * as api from '@/api'
import treeDialog from '@/components/treeDialog.vue'
import { ElMessage } from 'element-plus'
import flowStep from './components/flowStep.vue'
import designRequire from './components/designRequire.vue'


// 页面数据化数据挂载
const props = defineProps({ id: String })
const { id } = toRefs(props)
const treeRef = ref()  //注册响应数据  
const departList = ref<any>([])
const getDepartList = async (id: string) => {
    const params = {
        businessDataId: id,
        businessTable: 'WF_PROJECT',
        departmentTypeCode: 'PROJECT_DEPT_TYPE_PARTICIPATING'
    }
    const result = await api.commonWf.getJoinDepartment(params)
    if (result.resultCode === 0 && result.returnCode === 0) {
        console.log(result.data)

    }
}
const getOrgNode = async (data: any) => {
    // if (data.checkAll.length > 0) {
    //     ruleForm.departmentRelaName = data.checkAllName.join(',')
    //     ruleForm.departmentRelaIds = data.checkAll
    // }
    const params: ReqBatchAddFormData = {
        departmentIds: data.checkAll,
        departmentRela: {
            businessDataId: id?.value as string,
            businessTable: "WF_PROJECT",
            departmentTypeCode: "PROJECT_DEPT_TYPE_PARTICIPATING",
        }
    }
    await addOrg(params)
    await getParticiDepartment(id?.value as string)

}

const addOrg = async (params: ReqBatchAddFormData) => {

    const result = await api.commonWf.batchAddDepartment(params)
    if (result.resultCode === 0 && result.returnCode === 0) {
        ElMessage({ message: '部门设置完成', type: 'success' })
    }
}

const getParticiDepartment = async (id: string) => {

    const result = await api.packageManage.getParticiDepartment({ id: id })
    if (result.resultCode === 0 && result.returnCode === 0) {
        departList.value = result.data
    }
}



const openDepartDialog = () => {
    treeRef.value.openDialog([], 'add', 'multiple')
}



watch(
    () => props.id,
    (newVal, oldVal) => {
        getDepartList(newVal as string)
        getParticiDepartment(newVal as string)
        // query.value = { flowId: newVal }
        // loadList()
    }
)
</script>

<style lang="less">
.requireListContainer {
    &>div {
        &>h1 {
            font-weight: normal;

            &>div {
                margin-right: 50px;
                font-size: 20px;
                font-weight: bold;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                -o-text-overflow: ellipsis;
            }

            &>span {
                float: right;
                font-size: 16px;
                color: #999;

                &>i {
                    margin-left: 5px;
                    cursor: pointer;
                }
            }
        }
        &>i{
            height: 130px;
            overflow: auto;
            display: block;        
            &>div {
            height: 78px;
            padding-top: 10px;
            display: block;
            font-size: 14px;
            line-height: 1.6;
            color: #666;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        &>span {
            padding-top: 5px;
            height: 20px;
            display: block;
            font-size: 12px;
            line-height: 20px;
            color: #333;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            cursor: pointer;
            
        }
        }

    }
}

.buttonLmContainer {
    display: block;
    margin-top: 5px;
}
</style>
