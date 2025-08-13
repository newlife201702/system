<template>
    <el-dialog v-model="dialogFormVisible" title="部门选择" width="860px">

        <div class="flexBoxContainer">
            <div>
                <div style="margin-bottom: 15px;">
                    <el-input v-model="keywords" placeholder="请输入关键字...">
                        <template #append>
                            <el-button type="primary"> 查询</el-button>
                        </template>
                    </el-input>
                </div>
                <el-checkbox-group v-model="checkAll" v-if="reloadTree && checkType === 'single'">
                    <el-tree :load="loadNode" lazy :show-checkbox="false" node-key="id"
                        :default-expanded-keys="defaultExpandedKeys" :props="defaultProps" :indent="treeIndent"
                        :expand-on-click-node="false">
                        <template v-slot:default="{ node }">
                            <element-tree-line :node="node" :showLabelLine="false" :indent="treeIndent">
                                <template v-slot:node-label>
                                    <span style="font-size: 14px">
                                        <el-checkbox :key="node.data.id" @change='changeNode(node.data)'
                                            :label="node.data.id">{{
                                                node.label }}</el-checkbox>
                                    </span>
                                </template>

                            </element-tree-line>
                        </template>
                    </el-tree>
                </el-checkbox-group>

                <el-tree ref="treeRef" v-if="reloadTree &&  checkType === 'multiple'" :show-checkbox="true" node-key="id"
                    :default-expanded-keys="defaultExpandedKeys" :default-checked-keys="checkAll" :props="defaultProps"
                    :indent="treeIndent" :expand-on-click-node="false" @check-change="checkChange" :load="loadNode" lazy>
                    <template v-slot:default="{ node }">
                        <element-tree-line :node="node" :showLabelLine="false" :indent="treeIndent">
                            <template v-slot:node-label>
                                <span style="font-size: 14px">
                                    {{ node.label }}
                                </span>
                            </template>
                        </element-tree-line>
                    </template>
                </el-tree>
            </div>
            <div><el-icon>
                    <DArrowRight />
                </el-icon></div>
            <div>
                <el-table :data="checkAllName" style="width: 100%">
                    <el-table-column type="index" width="60" label="序号" />
                    <el-table-column label="名称">
                        <template #default="scope">{{ scope.row }}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="80">
                        <template #default="scope">
                            <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)">
                                <el-icon>
                                    <Close />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- {{ checkAllName }}
                <br>
                {{ checkAll }} -->
            </div>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="sendData">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import type Node from 'element-plus/es/components/tree/src/model/node'
import { ElTree } from 'element-plus'
import { reactive, ref, nextTick,defineEmits } from 'vue'
import * as api from '@/api'
import { fa } from 'element-plus/es/locale'

interface Tree {
    id: string,
    label: string
    leaf?: boolean
}
//   multiple single
const checkType = ref<string>('single')
const checkAll = ref<string[]>([])
const checkAllName = ref<string[]>([])
const reloadTree=ref<boolean>(false)
const currentAction = ref('add')
const defaultExpandedKeys = ref<string[]>([])
// const currentCheck = ref()
const treeIndent = ref(30)
const keywords = ref<string>()
const defaultProps = ref({
    children: 'children',
    isLeaf: 'leaf',
    label: 'name'
})

const treeRef = ref<InstanceType<typeof ElTree>>()

const emit = defineEmits(["getOrgNode"]);



const getTreeList = async (parentId: string) => {
    let data: any = (await api.commonDepartment.list({ parentId: parentId, departmentTypes: ['DEPARTMENT_TYPE_CODE_STANDARD'] }))?.data
    return data || []
}

const loadNode = async (node: Node, resolve: (data: Tree[]) => void) => {
    if (node.level === 0) {
        const nodeList = await getTreeList('root')
        defaultExpandedKeys.value = []
        const arr = nodeList.map((item: any) => { return item.id })
        defaultExpandedKeys.value = arr
        const nodeArr=nodeList.map((item:any)=>{return {...item,leaf:item.isLeaf==='1'?true:false}})
        return resolve(nodeArr)
    }

    if (node.level >= 1) {
        const nodeList = await getTreeList(node.data.id)
        const nodeArr=nodeList.map((item:any)=>{return {...item,leaf:item.isLeaf==='1'?true:false}})
        return resolve(nodeArr || [])

    }
}
const checkChange = (data: any, node: any) => {

    let arrList = treeRef.value!.getCheckedNodes(false, false)
    checkAll.value = []
    checkAllName.value = []
    console.log(arrList,"+_+_")
    arrList.map((item) => {
        // if (!item.children || item.children.length === 0) {
        if (item?.leaf && item.leaf) {
            checkAll.value.push(item.id)
            checkAllName.value.push(item.name)
        }

    })



}
const deleteRow = (index: number) => {
    // console.log(index)
    checkAll.value.splice(index, 1)
    checkAllName.value.splice(index, 1)
    // 当状态为复选项目时
    if (checkType.value === 'multiple') {
        treeRef.value!.setCheckedKeys(checkAll.value, false)
    }
}
const changeNode = (node: any) => {
    if (checkAll.value.length > 1) {
        checkAll.value.shift()
    }
    if (checkAll.value.length === 0) {
        checkAllName.value = []
    }
    else {
        checkAllName.value = [node.name]
    }

}
const dialogFormVisible = ref(false)

const openDialog = (checkList: { id: string, name: string }[], actionType: string,actionCheckType:string): void => {

    dialogFormVisible.value = true
    checkType.value=actionCheckType
    nextTick(() => {
        //打开初始化选择的内容
         checkAll.value=[]
         checkAllName.value=[]
        
        if (actionType === 'edit') {
            checkAll.value = checkList.map(item => { return item.id })
            checkAllName.value = checkList.map(item => { return item.name })
        }
        currentAction.value = actionType
        reloadTree.value=false
        setTimeout(()=>{
            reloadTree.value=true
        },200)
    })

}


const closeDialog = (): void => {
    dialogFormVisible.value = false
}

const sendData=():void=>{
    emit('getOrgNode',{checkAll:checkAll.value,checkAllName:checkAllName.value})
    closeDialog()
}

//主动暴露组件属性
defineExpose({
    openDialog,
    closeDialog
})


</script>

<style lang="less">
.dialog-footer button:first-child {
    margin-right: 10px;
}

.flexBoxContainer {
    display: -webkit-flex;
    /* Safari */
    display: flex;
    flex-direction: row;
    height: 45vh;

    &>div {
        height: 100%;
        overflow: auto;
    }

    &>div:nth-child(1) {
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 5px;
        flex: 2
    }

    &>div:nth-child(2) {
        width: 40px;
        margin-left: 5px;
        margin-right: 5px;
        text-align: center;
        font-size: 16px;

        &>i {
            margin-top: 20vh;
            cursor: pointer;
            color: #999;
        }
    }

    &>div:nth-child(3) {
        border: 1px solid #ddd;
        padding: 10px;
        border-radius: 5px;
        flex: 2
    }

    .el-tree-node__content {
        padding-top: 5px;
        padding-bottom: 5px;
        height: auto;
    }
}
</style>
