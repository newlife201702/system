<template>
    <div>
        <span class="buttonLmContainer"><el-button type="primary" @click="add(id as string)">新建</el-button>
            <!-- <el-button>批量删除</el-button>  -->
        </span>

        <el-table class="mtp1-5" ref="lazyTableRef" :data="tableData" style="width: 100%" row-key="id" border lazy
            :load="load" :tree-props="{ children: 'children', hasChildren: 'leaf' }">
            <el-table-column label="名称"> 
                <template #default="scope">
                    {{ scope.row.name }}
                    <el-tag  size="small" :type="scope.row.type==='taskPackage'?'success':'warning'">{{scope.row.type==='taskPackage'?'P':'T'}}</el-tag>
                </template>

            </el-table-column> 
            <el-table-column prop="code" label="编码" />
            <el-table-column label="责任部门"> 
                <template #default="scope">
                    {{ scope.row.departmentRelaList && scope.row.departmentRelaList.length>0 ?scope.row.departmentRelaList[0].name:'-' }}
                   
                </template>

            </el-table-column> 
            <el-table-column label="责任人"> 
                <template #default="scope">
                    {{ scope.row.personRelaList && scope.row.personRelaList.length>0 ?scope.row.personRelaList[0].name:'-' }}
                </template>

            </el-table-column> 
            <el-table-column prop="statusName" label="状态" />

           
            <el-table-column fixed="right" label="操作" width="260">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="addItem(scope.row,'task')">新增任务</el-button>
                    <el-button link type="primary" size="small" @click="addItem(scope.row)" v-if="scope.row.type==='taskPackage'">新增任务包</el-button>
                    <el-button link type="primary" size="small" @click="edit(scope.row.id,scope.row.type)">编辑</el-button>
                    <el-button link type="primary" size="small" @click="del(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <dialog-form ref='planNodeRef' @reloadTree="reloadTree"></dialog-form>
        <dialog-task-form ref='planTaskNodeRef' @reloadTree="reloadTree"></dialog-task-form>
    </div>
</template>

<script setup lang='ts'>
import { watch, ref, toRefs, defineProps } from "vue"
import * as api from '@/api'
import { ElMessage } from 'element-plus'
import dialogForm from './components/dialogForm.vue'
import dialogTaskForm from './components/dialogTaskForm.vue'
// 页面数据化数据挂载


const loadMap = new Map();
const lazyTableRef = ref();

const tableData = ref<any[]>([])
const props = defineProps({ id: String })
const { id } = toRefs(props)
const planNodeRef = ref()  //注册响应数据  
const planTaskNodeRef = ref()  //注册响应数据  
const currentItem = ref<any>()

// const handleSelectionChange = (val: any[]) => {
//     console.log(val)
// }
// const expandChange = (val: any) => {
//     val.expended = !val?.expended
//     console.log(val)
// }



const addItem = (row: any,type='taskPackage') => {
    if(type==='taskPackage')
    {
        add(row.id)
    }
    if(type==='task')
    {
        addTask(row.id)
    }
   
    currentItem.value = row
}
const add = (parentId: string): void => {
    resetData()
    planNodeRef.value.openDialog({
        about: '', //说明
        code: '', //编号
        departmentRelaName: '',//回显用的
        departmentRelaIds: [], //部门id
        departmentTypeCode: 'PROJECT_DEPT_TYPE_RESPONSIBLE', //部门类型
        levelCode: '', //层级代码
        levelName: '', //层级名称
        memo: '', //备注
        name: '', //任务包名
        parentId: parentId, //任务包上级id
        personRelaId: '',
        personRelaList: [], //关联人员
        securityLevelCode: '', //任务包密级
        sortNo: 0, //顺序编号
        statusCode: '', //状态码
        statusName: '', //状态名
        templateWorkItemId: '', //模板标识
        templateWorkItemName: '', //模板名称
    }, 'add')
}
const addTask = (parentId: string): void => {
    resetData()
    planTaskNodeRef.value.openDialog({
        about: '', //说明
        code: '', //编号
        departmentRelaName: '',//回显用的
        departmentRelaIds: [], //部门id
        departmentTypeCode: 'PROJECT_DEPT_TYPE_RESPONSIBLE', //部门类型
        levelCode: '', //层级代码
        levelName: '', //层级名称
        memo: '', //备注
        name: '', //任务包名
        parentId: parentId, //任务包上级id
        personRelaId: '',
        personRelaList: [], //关联人员
        securityLevelCode: '', //任务包密级
        sortNo: 0, //顺序编号
        statusCode: '', //状态码
        statusName: '', //状态名
        templateWorkItemId: '', //模板标识
        templateWorkItemName: '', //模板名称
        businessCode: '',
        businessId: '',
        contentId: '',
        pmStructureId: '',
    }, 'add')
}
// 修改操作
const edit = async (rowId: string,type:string) => {
    resetData()
    let result:any
    if(type==='taskPackage')
    {
        result = await api.planManage.getInfo({ id: rowId })
        if (result.returnCode === 0 && result.resultCode === 0) {
        planNodeRef.value.openDialog(result.data, 'edit')
    }
    }
    else
    {
        result = await api.planTask.getInfo({ id: rowId }) 
        if (result.returnCode === 0 && result.resultCode === 0) {
            planTaskNodeRef.value.openDialog(result.data, 'edit')
          }
    }
    
    
}


const load = async (
    row: ResPlanManageRowData,
    treeNode: unknown,
    resolve: (date: ResPlanManageRowData[]) => void
) => {
    //将获取到的节点数据添加到loadMap变量中
    loadMap.set(row.id, { row, treeNode, resolve });

    const result = await api.planManage.findByPid({ parentId: row.id })
    if (result.resultCode === 0 && result.returnCode === 0) {
        resolve(result.data as any)
    }
}


const getTableList = async (parentId: string) => {
    const result = await api.planManage.findByPid({ parentId: parentId })
    if (result.resultCode === 0 && result.returnCode === 0) {
        // console.log(result.data)
        tableData.value = result.data as any
    }
}
const resetData=():void=>{
     currentItem.value =''
}
// 删除操作
const del = async (item: any) => {
    resetData()
    let result:any
    if(item.type==='taskPackage')
    {
        result= await api.planManage.del({ id: item.id as string })
    }
    else
    {
         result = await api.planTask.del({ id: item.id as string })
    }
    
    if (result.returnCode === 0 && result.resultCode === 0) {
        ElMessage({ message: '删除成功', type: 'success' })
        reloadTree(item.parentId)
    }
}
// 刷新tree
const reloadTree = (parentId: any) => {
    parentId = parentId ? parentId : 0;
    // 当添加的状态是子选项 且是没有子节点的时候 刷新自身的父节点
    if(currentItem.value!=='')
    {
       if (!currentItem.value.leaf) {
        parentId = currentItem.value.parentId
        }
    }

    const parentInfo = loadMap.get(parentId)
    if (loadMap.get(parentId)) {
        const { row, treeNode, resolve } = parentInfo
        // 清空节点数据 为重新赋值做准备
        lazyTableRef.value.store.states.lazyTreeNodeMap.value[parentId] = [];

        load(row, treeNode, resolve);
    }
    else {
        getTableList(id?.value as string)
    }


};


watch(
    () => props.id,
    (newVal, oldVal) => {
        // console.log(newVal)
        getTableList(newVal as string)
    }
)
</script>

<style scoped>
</style>
