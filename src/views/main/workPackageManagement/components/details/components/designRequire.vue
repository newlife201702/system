<template>
        <h1 class="subLmTitleContainer">
            <!-- <span>全部</span> -->
            设计要求
        </h1>
        <div>
            <span class="buttonLmContainer"><el-button type="primary" @click="add">新建</el-button></span>
            <el-row :gutter="20" class="mtp1">
                <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-for="(item,index) in list" :key="index+'list'">
                    <el-card shadow="hover" class="requireListContainer">
                        <h1>
                            <span><el-icon @click="edit(item.targetRequirementPhysical.id)">
                                    <Edit />
                                </el-icon>
                                 <el-icon @click="del(item.targetRequirementPhysical.id)">
                                    <CloseBold />
                                </el-icon></span>
                            <div>{{item.targetRequirementPhysical.title}}</div>
                        </h1>
                        <i>
                           <div>{{item.targetRequirementPhysical.summary}}
                        </div>
                        <span v-for="(subItem,subIndex) in item.dataRelaPhysicalList" @click="fileDown(subItem.id)" :key="index+'-'+subIndex+'list'" :title="subItem.name">
                           {{ subIndex+1 +'. ' }} {{subItem.name}}
                        </span>
                        </i>

                    </el-card>
                </el-col>
            </el-row>
            <dialog-form-design-require   ref='designRequireRef'></dialog-form-design-require>
        </div>
</template>

<script setup lang='ts'>
import { ref, reactive,toRefs,watch } from 'vue'
import * as api from '@/api'
import dialogFormDesignRequire from './dialogFormDesignRequire.vue'
const props = defineProps({ projectId: String })
const list=ref<any>([])
const { projectId } = toRefs(props)

const designRequireRef=ref()

const getList=async(projectId:string)=>{
    const result = await api.designRequire.list({ projectId:projectId })
            if (result.resultCode === 0 && result.returnCode === 0) {
                list.value=result.data
            }
}
const fileDown=async(id:string)=>{
   
    return  await api.file.fileDown({ id:id })
}
const getDetails=async(id:string):Promise<any>=>{
    return  await api.designRequire.getInfo({ id:id })
}

const del=async(id:string)=>{
    const result = await api.designRequire.del({ id:id })
            if (result.resultCode === 0 && result.returnCode === 0) {
                getList(projectId?.value as string)
            }
}
const edit=async(id:string)=>{
    const result=await getDetails(id)
    if (result.resultCode === 0 && result.returnCode === 0) {
        designRequireRef.value?.openDialog(result.data,'edit')
       }

}

const add=()=>{
    designRequireRef.value?.openDialog({projectId:projectId?.value},'add')
}
watch(
    () => props.projectId,
    (newVal, oldVal) => {
        // query.value = { flowId: newVal }
       console.log(newVal)
       getList(newVal as string)
    }
)
</script>

<style lang="less">

</style>
