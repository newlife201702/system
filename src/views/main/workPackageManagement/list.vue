<template>
    <div class="flowListContainer">
        <div class="btnToolsContainer">
            <span>
                <el-button-group>
                    <el-button :type="item.value === sortField ? 'primary' : ''" v-for="(item, index) in orderOptionList"
                        @click="changeOrder(item)" :key="'orderList' + index">

                        <el-icon v-if="item.value === sortField && sortType === 'asc'">
                            <SortUp />
                        </el-icon>
                        <el-icon v-if="item.value === sortField && sortType === 'desc'">
                            <SortDown />
                        </el-icon>
                        {{ item.label }}

                    </el-button>
                </el-button-group>
            </span>
            <el-button type="primary" @click="goUrl('addWorkPackageManagement')"
                v-if="pageType === 'listWorkPackageManagement'">添加</el-button>
        </div>
        <div class="searchContainer">
            <my-page-size @changePageSize="changePageSize"></my-page-size>
        </div>

        <el-row :gutter="12" class="cardListContainer mtp1">
            <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="(item, index) in list" :key="'list' + index">
                <el-card>
                    <div class="workPackContainer">
                        <div>
                            <h1 @click="viewDetails(item)">
                                <img :src="getIcoByName(item.securityLevelName)" alt="">
                                {{ item.name }}
                            </h1>
                            <span>
                                <el-icon style="margin-top: 6px;margin-right: 3px;">
                                    <ArrowDown />
                                </el-icon>
                                <i>
                                    <el-tooltip placement="bottom" effect="light" :append-to-body="false">
                                        <template #content>
                                            <div v-for="(subItem, subIndex) in item.eventPhysicalList"
                                                :key="'template' + subIndex">
                                                <h1>{{ subItem.name }}</h1>
                                                计划：{{ subItem.planBeginDate ? subItem.planBeginDate : '-' }}
                                                <br />
                                                实际：{{ subItem.beginDate ? subItem.beginDate : '-' }}
                                            </div>
                                        </template>
                                        {{item.eventPhysicalList[0]?.endDate ? item.eventPhysicalList[0]?.endDate+'日前交付' : '待定'}}
                                    </el-tooltip>
                                </i>
                                {{ item.code }}
                            </span>
                        </div>
                        <el-row>
                                <el-col :span="12"><div class="grid-content ep-bg-purple" />
                                    <el-row>
                                        <el-col :span="12"><div class="grid-content ep-bg-purple" />负责人：{{ item.personName }}</el-col>
                                        <el-col :span="20"><div class="grid-content ep-bg-purple-light" />2025-04-01至2026-04-01</el-col>
                                        <el-col :span="12"><div class="grid-content ep-bg-purple" />总任务数：{{ item.taskNum }}</el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="12"><div class="grid-content ep-bg-purple-light" />
                                    <span style="width:5opx;height: 60%;">
                                        <el-progress type="dashboard" :percentage="50">
                                            <template #default="{ percentage }">
                                                <span class="percentage-value">{{ item.taskFinishPer }}</span>
                                                <span class="percentage-label">完成率</span>
                                            </template>
                                        </el-progress>  
                                    </span>
                                </el-col>
                            </el-row>

                        <i>
                            <el-button type="primary" v-if="item.statusCode==='PROJECT_STATUS_PENDING'" size="small" @click="del(item.id)">删除</el-button>
                            <el-button size="small" @click="edit(item.id)">修改</el-button>
                            <el-button>派发任务</el-button>
                            <!-- <el-button size="small" v-if="!item.statusCode" @click="workPackegeInit(item)">...</el-button> -->
                            <el-dropdown style="margin-left: 10px;" trigger="click"   @command="handleCommand">
                                <el-button type="primary" size="small" @click="getStep(item)" >
                                    {{item?.statusName}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu style="min-width: 80px;">
                                    <el-dropdown-item v-for="(subItem,subIndex) in item?.menuList" :key="index+'-'+subIndex+'dropmenu'" :command="subItem.eventCode">{{subItem.eventName}}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>

                        </i>
                    </div>

                </el-card>
            </el-col>
        </el-row>

        <el-pagination class="mtp1" v-model:current-page="page" v-model:page-size="limit" :page-sizes="[10, 20, 30, 40]"
            :small="small" :disabled="disabled" :background="background" layout="total, ->, prev, pager, next, jumper"
            :total="total" @current-change="handleCurrentChange" />
        <dialog-form @loadList="loadList" ref="myChild"></dialog-form>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import dataList from '@/libs/common/dataList'
import myPageSize from '@/components/common/pageSize.vue';
import { ElMessage } from 'element-plus'
import { getIcoByName } from '@/libs/utils'
import * as api from '@/api'
import { useRouter, useRoute } from 'vue-router'
import dialogForm from './components/dialogForm.vue'

const currentItem=ref<any>()
const router = useRouter();
const route = useRoute()
const myChild=ref()
const pageType = ref<string>('listWorkPackageManagement')
const {
    sortField,
    sortType,
    query, // 用于绑定查询表单
    page, // 用于绑定当前页
    limit, // 用于绑定查询条数
    total, // 记录列表总数
    list, // 当前列表
    loadList, // 获取列表数据
    search, // 用于搜索，更新列表数据
    changePageSize
} = dataList({ moduleName: 'packageManage', immediate: false })
const orderOptionList = ref(
    [
        { label: "日期", value: "create_time" },
        { label: "名称", value: "name" },
        { label: "等级", value: "level_code" }
    ]
)

const viewDetails= (row: any) => {
    router.push({ name: 'detailsWorkPackageManagement',query:{id:row.id} })
}
const goUrl = (urlName: string) => {
    router.push({ name: urlName })
}
// const visible = ref(false)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)


const handleCommand = async(command: string) => {
    const params={ businessDataId: currentItem.value.id as string,businessTable: "WF_PROJECT",eventCode:command}
    myChild.value.openDialog(params)
}
const getStep=async(row:any)=>{
    currentItem.value=row
    const result = await api.flow.WorkFlowStep({ businessDataId: row.id,businessTable: "WF_PROJECT",})
            if (result.resultCode === 0 && result.returnCode === 0) {
                row.menuList=result.data
               
            }
}

// 修改操作
const edit = async (id: string) => {
    router.push({ name: 'editWorkPackageManagement', query: { id: id, pageType: pageType.value } })
}
//项目启动
const startProject = async (row: any) => {
    const params = {
        businessDataId: row.id,
        businessTable: "WF_PROJECT",
        eventCode: row.eventPhysicalList.length > 0 ? row.eventPhysicalList[0].code : ''
    }
    const result = await api.flow.workPackegeEvent(params)
    if (result.resultCode === 0 && result.returnCode === 0) {
        ElMessage({
            message: "启动成功",
            type: 'success',
        })
        const params = {
            eventCode: result.data?.statusCode,
            projectId: row.id
        }
        await updateStatus(params)
        loadList()
    }


}
// 更新记录状态
const updateStatus = async (params:any) => {
    // const params = {
    //     eventCode: "string",
    //     projectId: "string"
    // }
    await api.packageManage.updateStatus(params)
   
}

 

// const viewDetails=(row:ReqFlowRowData)=>{

//     router.push({name:"flowDetails",query:{id:row.id}})

// }

// 排序操作
const changeOrder = (item: { label: string, value: string }) => {
    sortField.value = item.value
    sortType.value = sortType.value === 'desc' ? 'asc' : 'desc'
    loadList()
}
// 删除操作
const del = async (id: string) => {
    const result = await api.packageManage.del({ id: id })
    if (result.returnCode === 0 && result.resultCode === 0) {
        ElMessage({ message: '删除成功', type: 'success' })
        loadList()
    }
}
// 当前分页条数
const handleCurrentChange = (val: number) => {
    page.value = val
    loadList()
}

// 页面数据化数据挂载
watch(() => router.currentRoute.value.path, (toPath) => {
    //要执行的方法
    // console.log(toPath,"toPath");
    
    if (toPath === '/main/myWorkPackage/list') {
        pageType.value = 'listWorkPackageManagement'
        query.value = {
            "businessTable": "WF_PROJECT",
            "personId": "a2ac870a615a4cd98d98a03622500df6",
            "personTypeCode": ""
        }
    }
    if (toPath === '/main/myWorkPackage/attentionList') {
        pageType.value = 'attentionListWorkPackageManagement'
        query.value = {
            "businessTable": "WF_PROJECT",
            "personId": "a2ac870a615a4cd98d98a03622500df6",
            "personTypeCode": "PROJECT_PERSON_TYPE_SUBSCRIBE"
        }
    }

    if (toPath === '/main/myWorkPackage/pendingList') {
        pageType.value = 'userPendingWorkPackageManagement'
        query.value = {
            "businessTable": "WF_PROJECT",
            "userPending": true
        }
    }

    query.value.businessCode='BUSINESS_CODE_TXZJXT'
    loadList()

}, { immediate: true, deep: true })




</script>
  
<style lang="less">
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}

.custom-progress .el-progress-bar__outer {
    height: 20px; /* 调整高度 */
}

</style>
  