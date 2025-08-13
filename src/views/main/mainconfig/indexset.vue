<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
  >
    <el-form-item label="*功能别名" prop="remark">
      <el-input v-model="ruleForm.remark" />
    </el-form-item>
    <el-form-item label="*功能" prop="resourceId">
      <el-select v-model="ruleForm.resourceId"  filterable placeholder="please select data">
            <el-option v-for="(item, index) in resourceListOption" :key="'res' + index" :label="item.name"
                        :value="item.id" />
             </el-select>
    </el-form-item>
    <el-form-item label="方位" prop="memo">
      <el-select v-model="ruleForm.memo" placeholder="please select data">
        <el-option label="1" value="LAYOUT_TYPE_LEFT1" />
        <el-option label="2" value="LAYOUT_TYPE_LEFT2" />
        <el-option label="3" value="LAYOUT_TYPE_LEFT3" />
        <el-option label="4" value="LAYOUT_TYPE_LEFT4" />
        <el-option label="5" value="LAYOUT_TYPE_LEFT5" />
        <el-option label="6" value="LAYOUT_TYPE_LEFT6" />
      </el-select>
    </el-form-item>

    <el-form-item label="顺序号" prop="sortNo">
      <el-input v-model="ruleForm.sortNo" />
    </el-form-item>



    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)"
        >保存</el-button
      >
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>

<el-table ref="tableRef" row-key="funcName" :data="list" style="width: 100%">
    <el-table-column
      prop="funcName"
      label="功能名称"
      sortable
      width="180"
      column-key="funcName"
    />
    <el-table-column prop="memo" label="方位" width="180" />
    <el-table-column prop="sortNo" label="顺序号" width="180" />

    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click.prevent="deleteRow(scope.$index)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>


</template>


<script lang="ts" setup>
import * as api from '@/api'
import { reactive, ref, onMounted, computed } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, valueEquals } from 'element-plus'
import dataList from '@/libs/common/dataList'
import { number } from 'echarts';

const actionType = ref<string>('add')
const route = useRoute()
const router = useRouter()
const id = ref<string>()
const ruleFormRef = ref<FormInstance>()

  const list:any = ref([])
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const query = ref<any>({})
  const sortField = ref('create_time')
  const sortType = ref('desc')

const params = {
  businessCode: "BUSINESS_CODE_TXZJXT"
}


const resourceListOption = ref<any>()

const ruleForm = reactive<UserRelaFuncData>({
  resourceId: '',
  remark: '',
  memo: '',
  sortNo : ''
})

const rules = reactive<FormRules<ruleForm>>({
  resourceId: [ 
    {
      required: true,
      message: 'Please select data',
      trigger: 'blur',
    },
  ],
  remark: [ 
     {
      required: true,
      message: 'Please input data',
      trigger: 'blur',
    },
  ],
  memo: [
     {
      required: true,
      message: 'Please select data',
      trigger: 'blur',
    },
  ],
})

onMounted(async () => {  
    actionType.value = 'add'

    loadList()

    getResourceList()


})


const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log(actionType.value)
      if(actionType.value === 'add'){
          add()
      }
      //console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}



const add = async () => {
    
    const result = await api.config.addUserRelaFunc({  ...ruleForm })
    if (result.resultCode === 0 && result.returnCode === 0) {
        ElMessage({
            message: "添加成功",
            type: 'success',
        })

         loadList()
    }
}



const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

  async function loadList() {
    const result = await (api['config' as keyof typeof api] as any).getRelaList(payload.value)
    list.value = result?.items as any
    total.value = result?.total as number || 0
  }

    const payload = computed(() => {
    const _query = query.value
    return Object.assign({}, {data:_query}, {
      pageIndex: page.value, // 请求的当前页字段
      pageSize: limit.value, // 请求的条数字段
      sortField:sortField.value,
      sortType:sortType.value
    })
  })


const getResourceList = async () => {
    console.log("getResourceList");
    const result = await api.config.getResourceList(params);
    resourceListOption.value = result.data;
}

const deleteRow = (index: number) => {
    const seldata =  list.value[index];
    api.config.deleteUserRelaResource({ id: seldata.id as string })
    console.log("deleteRow" +  seldata.id)
    list.value.splice(index,1)
}

</script>
