<template>
    <el-dialog v-model="dialogFormVisible" title="部门选择" width="860px">

        <div class="flexBoxContainer">
            <div>
                <div style="margin-bottom: 15px;">
                    <el-input v-model="keywords" placeholder="请输入关键字..." >
                        <template #append>
                            <el-button type="primary"> 查询</el-button>
                        </template>
                    </el-input>
                </div>
                <el-checkbox-group v-model="checkAll" v-if="checkType === 'single'">
                    <el-tree :data="treeData" :show-checkbox="false" node-key="id" :default-expanded-keys="[2, 3]"
                        :default-checked-keys="[]" :props="defaultProps" :indent="treeIndent" :expand-on-click-node="false">
                        <template v-slot:default="{ node }">
                            <element-tree-line :node="node" :showLabelLine="false" :indent="treeIndent">
                                <template v-slot:node-label>
                                    <span style="font-size: 14px">
                                        <el-checkbox :key="node.id" @change='changeNode(node.data)' :label="node.id"> {{
                                            node.label }}</el-checkbox>
                                    </span>
                                </template>

                            </element-tree-line>
                        </template>
                    </el-tree>
                </el-checkbox-group>

                <el-tree ref="treeRef" :data="treeData" v-if="checkType === 'multiple'" :show-checkbox="true" node-key="id"
                    :default-expanded-keys="[2, 3]" :default-checked-keys="checkAll" :props="defaultProps"
                    :indent="treeIndent" :expand-on-click-node="false" @check-change="checkChange">
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
                                <el-icon><Close /></el-icon>
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

                {{ checkAllName }}
                <br>
                {{ checkAll }}
            </div>
        </div>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import type Node from 'element-plus/es/components/tree/src/model/node'
import { ElTree } from 'element-plus'
import { reactive, ref } from 'vue'

const checkType = ref<string>('multiple')
const checkAll = ref<string[]>([])
const checkAllName = ref<string[]>([])
// const currentCheck = ref()
const treeIndent = ref(30)
const keywords = ref<string>()
const defaultProps = ref({
    children: 'children',
    label: 'label',
})

const treeRef = ref<InstanceType<typeof ElTree>>()
const treeData = ref([
    {
        id: "1",
        label: '行政部',
        children: [
            {
                id: "411",
                label: 'hr人力资源',
                children: [],
            },
            {
                id: "4",
                label: '财务部',
                children: [],
            },
        ],
    },
    {
        id: "2",
        label: '产品研发部',
        children: [
            {
                id: "5",
                label: '软件事业部',
            },
            {
                id: "6",
                label: 'AI人工智能',
            },
        ],
    },
    {
        id: "3",
        label: '市场部',
        children: [
            {
                id: "7",
                label: '渠道部门',
            },
            {
                id: "8",
                label: '市场拓展部',
            },
        ],
    },
])

const checkChange = (data: any, node: any) => {

    let arrList = treeRef.value!.getCheckedNodes(false, false)
    checkAll.value = []
    checkAllName.value = []
    console.log(arrList)
    arrList.map((item) => {
        if(!item.children || item.children.length===0)
        {
            checkAll.value.push(item.id)
        checkAllName.value.push(item.label)
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
    console.log(node)
    // currentCheck.value = node.id
    if (checkAll.value.length > 1) {
        checkAll.value.shift()
    }
    if (checkAll.value.length === 0) {
        checkAllName.value = []
    }
    else {
        checkAllName.value = [node.label]
    }

}
const dialogFormVisible = ref(true)
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
