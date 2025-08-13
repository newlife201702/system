<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    status-icon
    label-width="120px"
  >
      <el-form-item label="功能来源" prop="region">
      <el-radio-group v-model="ruleForm.regionCode" placeholder="please select">
        <el-radio label="内部" :value="1" v-model="checked"/>
        <el-radio label="外部" :value="2" />
      </el-radio-group>
    </el-form-item>
    <el-form-item label="系统名称" prop="about">
      <el-input v-model="ruleForm.about" />
    </el-form-item>
    <el-form-item label="功能名称" prop="name">
      <el-input v-model="ruleForm.name" />
    </el-form-item>
    <el-form-item label="展现形式" prop="typeCode">
      <el-select v-model="ruleForm.typeCode" placeholder="please select">
        <el-option label="列表" value="TABLE" />
        <el-option label="分页" value="PAGE" />
        <el-option label="嵌入" value="INCLUDE" />
        <el-option lable="集成工具" value="TOOL"/>
        <el-option label="活动步骤" value="TASKSTEP"/>
      </el-select>
    </el-form-item>
    <el-form-item label="URL" prop="url">
      <el-input v-model="ruleForm.url" />
    </el-form-item>
    <el-form-item label="业务模型代码"  prop="businessCode">
         <el-input v-model="ruleForm.businessCode" />
    </el-form-item>
    <el-form-item label="顺序号" prop="sortNo">
      <el-input v-model="ruleForm.sortNo" />
    </el-form-item>
    <el-form-item label="数据库表名称" prop="tableName">
      <el-input v-model="ruleForm.tableName" />
    </el-form-item>
    <el-form-item label="渲染字段">
           <input type="file" @change="handleFileChange">
          <el-button type="primary" @click="importFile()">
            导入
          </el-button>
          <el-button type="primary" @click="exportFile()">
              模板下载
          </el-button>

         <el-table :data="columnList" style="width: 100%">
            <el-table-column prop="engName" label="数据字段" width="180" />
            <el-table-column prop="pinyinName" label="数据显示名称" width="180" />
            <el-table-column prop="method" label="方法" width="180" />
        </el-table>
    </el-form-item>



    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)"
        >保存</el-button
      >
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      
       <el-button
         @click.prevent="deleteRow()">删除  
        </el-button>
    
    </el-form-item>
  </el-form>


    <el-table 
        ref="tableRef" 
        row-key="name" 
        :data="list" 
        style="width: 100%"
        @selection-change="handleSelectionChange">
         <el-table-column type="selection" :reserve-selection="true" width="55" />
        <el-table-column
      prop="name"
      label="功能名称"
      sortable
      width="180"
    />
    <el-table-column prop="typeCode" label="展现形式" width="180" />
    <el-table-column prop="region" label="来源" width="180" />

    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click.prevent="deleteRow(scope.$index)">
          修改
        </el-button>
      </template>
    </el-table-column>
  </el-table>
                  <!-- <el-pagination class="mtp1" v-model:current-page="page" v-model:page-size="limit" :page-sizes="[10, 20, 30, 40]"
            :small="small" :disabled="disabled" :background="background" layout="total, ->, prev, pager, next, jumper"
            :total="total" @current-change="handleCurrentChange" /> -->
</template>

<script lang="ts" setup>
import * as api from '@/api'
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, valueEquals } from 'element-plus'
import dataList from '@/libs/common/dataList'
import { column } from 'element-plus/es/components/table-v2/src/common';
import { data } from 'jquery';


const actionType = ref<string>('add')
const route = useRoute()
const router = useRouter()
const id = ref<string>()
const ruleFormRef = ref<FormInstance>()
const checked = ref<true>();
const files = ref([]);
const columnList = ref([]);
const small = ref(false)
const background = ref(false)
const disabled = ref(false)


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
} = dataList({ moduleName: 'config', immediate: false })


onMounted(async () => {  
    actionType.value = 'add'

    //  let arr: any[] = []
    //  arr.push({ pinyinName: 'system1', engName: '系统' })
    //  funcData.value = arr;
    
        query.value.businessCode = 'BUSINESS_CODE_TXZJXT'
        loadList()
})

const ruleForm = reactive<FuncData>({
  resourceColmnList:[],
  resource:{},
  businessCode: 'BUSINESS_CODE_TXZJXT',
  region: '',
  regionCode:'',
  about: 'txzjxt',
  name: '',
  typeCode: '',
  typeName: '',
  url: '',
  sortNo: '',
  tableName: '',
})

const rules = reactive<FormRules<ruleForm>>({
  regionCode: [ 
    {
      required: true,
      message: 'Please select data',
      trigger: 'blur',
    },
  ],
  name: [ 
     {
      required: true,
      message: 'Please input data',
      trigger: 'blur',
    },
  ],
  typeCode: [
     {
      required: true,
      message: 'Please select data',
      trigger: 'blur',
    },
  ],
  url : [
     {
      required: true,
      message: 'Please input data',
      trigger: 'blur',
    },
  ],
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log(actionType.value)
      if(actionType.value === 'add'){
          add()
      }else{
          edit()
      }
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const getColumnDataList = () => {
    let arr: any[] = []
    console.log(columnList.value)
    columnList.value.map((item:any)=>{
       arr.push({ pinyinName: item.pinyinName,engName:item.engName  })
    })

    // funcData.value.map((item: Record<string, unknown>) => {
    //     arr.push({ pinyinName: item.pinyinName,engName:item.engName  })
    // })
    return arr
}


const add = async () => {
    
    const result = await api.config.funcInsert({  ...ruleForm, resourceColmnList:getColumnDataList(),resource:ruleForm })
    if (result.resultCode === 0 && result.returnCode === 0) {
        ElMessage({
            message: "添加成功",
            type: 'success',
        })
        
         query.value.businessCode = 'BUSINESS_CODE_TXZJXT'
        loadList()

    }
}


const edit = async () => {
    const result = await api.config.funcEdit(
        {
            model: { ...ruleForm,  resourceColmnList:getColumnDataList() },
            id: ruleForm.id as string
        }
    )
    if (result.resultCode === 0 && result.returnCode === 0) {
        ElMessage({
            message: "修改成功",
            type: 'success',
        })
        query.value.businessCode = 'BUSINESS_CODE_TXZJXT'
          loadList()
    }
}

const chooseList = ref<any>([])
const handleSelectionChange = (val: any[]) => {
    chooseList.value = val
}

const deleteRow = () => {
     let arr: any[] = []
     chooseList.value.map(v => {
        arr.push(v.id);
     });
  console.log("deleteRow" + JSON.stringify(arr))
  api.config.del({ ids: arr});

   loadList()
}

const handleFileChange = (event) => {
    files.value = event.target.files;
};

//导入模板
const importFile = async () => {
    if (!files.value.length) return;
    const formData = new FormData();
    for (let i = 0; i < files.value.length; i++) {
        formData.append('file', files.value[i]);
    }

    try {
        const result = await api.config.importResourceColumn(formData)
        if (result.returnCode === 0 && result.resultCode === 0) {
            columnList.value =  result.data as any;
            console.log("import success" + JSON.stringify(result.data))
        }
    } catch (error) {
        console.error('Upload error:', error);
    }
};

const exportFile = async () => {
    const a = document.createElement('a')
    a.setAttribute('href', "/api/common/web/file/downloadFile.do")
    a.setAttribute('target', '_blank')
    a.setAttribute('id', 'myflie-link-temp')
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(document.getElementById('myflie-link-temp') as HTMLElement)
}


// 当前分页条数
const handleCurrentChange = (val: number) => {
    page.value = val
    loadList()
}


</script>
