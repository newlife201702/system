<template>
    <div class="stepListContainer">
        <h1> <span> <el-button link type="primary" @click="setTree">设置</el-button></span> {{lmTitle}}</h1>
        <div class="treeContainer">
            <el-tree   v-if="reloadTree" :show-checkbox="false" node-key="id"
                :default-expanded-keys="defaultExpandedKeys" :props="defaultProps" :indent="treeIndent"
                :expand-on-click-node="false" :load="loadNode" lazy>
                <template v-slot:default="{ node }">
                    {{ node.label }}
                </template>
            </el-tree>
        </div>
    </div>
    <flow-tree-dialog :metaDataTable="metaDataTable" :projectId="projectId" ref="treeSetRef" @freshTree="freshTree"></flow-tree-dialog>
</template>

<script setup lang='ts'>
import type Node from 'element-plus/es/components/tree/src/model/node'
import { ElTree } from 'element-plus'
import { watch, reactive, ref, nextTick, defineEmits, toRefs } from 'vue'
import * as api from '@/api'
import flowTreeDialog from './flowTreeDialog.vue'
const treeSetRef = ref()

interface Tree {
    id: string,
    label: string
    leaf?: boolean
}
const treeIndent = ref(30)
const props = defineProps({ projectId: String,metaDataTable:String,lmTitle:String })
const reloadTree = ref<boolean>(false)
const { projectId,metaDataTable,lmTitle } = toRefs(props)


const defaultExpandedKeys = ref<string[]>([])
const defaultProps = ref({
    children: 'children',
    isLeaf: 'leaf',
    label: 'name'
})
const getTreeList = async (parentId: string) => {
    const params={
         parentId: parentId, 
        projectId: projectId?.value as string,
        metaDataTable:metaDataTable?.value as string 
    }
    // console.log(params)
    let data: any = (await api.commonWf.metaRelaList(params))?.data
    return data || []
}
const freshTree=async()=>{
    reloadTree.value=false
    setTimeout(()=>{
        reloadTree.value=true
    },200)
}
const setTree=()=>{
    treeSetRef.value?.openDialog()
}
const loadNode = async (node: Node, resolve: (data: Tree[]) => void) => {
    if (node.level === 0) {
        const nodeList = await getTreeList('root')
        defaultExpandedKeys.value = []
        let arr:string[]=[]
        nodeList.map((item: any) => { if(!item.leaf) arr.push(item.id) })

        defaultExpandedKeys.value = arr
        const nodeArr = nodeList.map((item: any) => { return { ...item, leaf: item.leaf } })
        return resolve(nodeArr)
    }

    if (node.level >= 1) {
        const nodeList = await getTreeList(node.data.id)
        const nodeArr = nodeList.map((item: any) => { return { ...item, leaf: item.leaf} })
        return resolve(nodeArr || [])

    }
}
watch(
    () => props.projectId,
    (newVal, oldVal) => {
        // query.value = { flowId: newVal }
        // loadList()
        if(newVal)
        {
            // console.log(newVal)
            reloadTree.value=true
        }
        
    }
)
</script>

<style lang="less">
</style>
