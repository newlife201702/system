<template>

<div >
    <div v-for="(item,index) in dataList" :key="'list'+index">
        <el-table :data="item.data" style="width: 100%" v-if="item.typeCode==='TABLE'"  >
            <el-table-column :prop="subItem.engName" v-for="(subItem,subIndex) in item.column" :key="'column'+subIndex" :label="subItem.pinyinName"  />
            
    </el-table>
        <div v-if="item.typeCode==='INCLUDE'" >
             <iframe :src="item.includeUrl" style="width: 100%;"/>
        </div>
    </div>

</div>
</template>


<script lang="ts" setup>
import * as api from '@/api'
import { reactive, ref, onMounted, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, valueEquals } from 'element-plus'


const dataList = ref<any>();
const query = ref<any>();  

async function loadList() {
    const result = await (api['config' as keyof typeof api] as any).getConfigHtml(payload.value)
    dataList.value = result?.data as any
}

onMounted(async () => {  
    loadList()
    console.log("dataList" +  JSON.stringify(dataList.value))
})

    const payload = computed(() => {
    const _query = query.value
    return Object.assign({}, {data:_query}, {
    })
  })


// const dataList=ref<any>([
//         {
//             "id": null,
//             "name": "项目列表",
//             "typeCode": "TABLE",
//             "column": [
//                 {
//                     "id": "04940b953cdb44cc92771a52a2efd301",
//                     "pinyinName": "项目名称",
//                     "engName": "name",
//                     "resourceId": "84b652ce4f004de4ac7ec04b572ffb07",
//                     "physical": null
//                 },
//                 {
//                     "id": "73c73b3e29ac45a6b9651c32249efeaa",
//                     "pinyinName": "状态",
//                     "engName": "statusName",
//                     "resourceId": "84b652ce4f004de4ac7ec04b572ffb07",
//                     "physical": null
//                 }
//             ],
//             "data": [
//                 {name:"sdfsdfs",statusName:"正常"}
//             ]
//         }
//     ])


</script>