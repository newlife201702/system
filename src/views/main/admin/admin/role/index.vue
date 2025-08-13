<template>
  <div>
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
      <el-button @click="add"><el-icon>
          <Plus />
        </el-icon> 新增</el-button>
      <!-- <el-button><el-icon>
          <Edit />
        </el-icon> 编辑</el-button>
      <el-button><el-icon>
          <CopyDocument />
        </el-icon>导出</el-button>

      <el-dropdown style="margin-left:10px">
        <span style="outline:none">
          <el-button type="primary" plain><el-icon>
              <ArrowDown />
            </el-icon> 更多</el-button>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>批量删除</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown> -->
    </div>


    <div @click.stop="() => { }" class="searchContainer">
      <ema-page-size @changePageSize="changePageSize"></ema-page-size>
      <i>
        <el-popover placement="bottom" :visible="visible" :width="400">
          <template #reference>
            <el-button type="primary" plain @click="visible = !visible"><el-icon>
                <ArrowDown />
              </el-icon>高级查询</el-button>
          </template>

          <el-form ref="ruleFormRef" :model="formInline" label-width="80px">
            <el-form-item label="名称" prop="name">
              <el-input v-model="formInline.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="状态" prop="statusCode">
              <el-radio-group v-model="formInline.statusCode"  >
                <el-radio v-for="(item,index) in statusList" :key="'type'+index" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm(ruleFormRef)"><el-icon>
                  <Search />
                </el-icon> 查询</el-button>
              <el-button @click="resetForm(ruleFormRef)"><el-icon>
                  <Refresh />
                </el-icon> 重置</el-button>
            </el-form-item>
          </el-form>
        </el-popover>
      </i>
    </div>

    <table-list :list=list style="margin-bottom: 15px;" @del="del" @edit="edit" @view="view"
      @openResource="openResource" @addUser="addUser"></table-list>


    <el-pagination v-model:current-page="page" v-model:page-size="limit" :page-sizes="[1, 10, 20, 30, 40]" :small="small"
      :disabled="disabled" :background="background" layout="total, ->, prev, pager, next, jumper" :total="total"
      @current-change="handleCurrentChange" />

    <dialog-form ref='childRef' @loadList="loadList" />
    <dialog-view ref='childViewRef' />
    <source-dialog ref='childSourceRef' @updateResource="updateResource" />
    <dialog-user-list ref='userRef' @addUser="addUser"   @loadList="loadList"></dialog-user-list> 
  </div>
</template>

<script setup lang="ts">
import tableList from './components/tableList.vue';
import dialogForm from './components/dialogForm.vue';
import dialogView from './components/dialogView.vue';
import emaPageSize from '@/components/common/emaPageSize.vue';
import sourceDialog from '@/components/common/sourceDialog.vue'
import dialogUserList from './components/dialogUserList.vue';

import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import dataList from '@/libs/common/dataList'
import * as api from '@/api'
import { compare } from '@/libs/utils'
import {statusList} from '@/dic'
const childRef = ref()  //注册响应数据  
const childViewRef = ref()  //注册响应数据  
const childSourceRef = ref()  //注册响应数据  
const userRef = ref()  //注册响应数据  
 
const ruleFormRef = ref<FormInstance>()
const orderOptionList = ref(
  [
    { label: "日期", value: "create_time" },
    { label: "名称", value: "name" },
    { label: "状态", value: "status_code" }
  ]
)
// 当前资源选中的ID
const checkResourceIdRowArr=ref<string[]>([])
const currentRow = ref<any>()
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
  changePageSize //设置显示条数
} = dataList({ moduleName: 'role' ,immediate:false } )

const addUser = (row:any): void => {

    userRef.value.openDialog(row)
}
const formInline = reactive<ReqRoleSearchData>({
    businessTypeCode: "",
    code: "",
    exclusive: "",
    id: "",
    name: "",
    openId: "",
    sortField: "",
    sortType: "",
    statusCode: "",
    typeCode: "",
    isSystem:"1"
})
const visible = ref(false)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

/* 
获取数据信息
打开窗口并将已经选择的记录回填
*/
const openResource = async (row: ResRoleRowData) => {
  const result = await api.role.getInfo({ id: row?.id as string })
  if (result.returnCode === 0 && result.resultCode === 0) {
    currentRow.value = result.data
    checkResourceIdRowArr.value=(result.data?.rolePermissonList as any || [] ).map((item:any)=>{return item.resourceId})
    childSourceRef.value.openDialog(checkResourceIdRowArr.value)
  }
}
/* 
更新保存角色授权信息
成功关闭资源列表框
 */
const updateResource = async (arr: string[]) => {
  const obj: any = compare(checkResourceIdRowArr.value, arr)
  const paramsData: ReqRoleRightsData = {
    addResourceIds: obj.add,
    removeResourceIds: obj.del,
    targetId:currentRow.value.id,
    targetTableName: 'ROLE'
  }
  const result = await api.role.setRole(paramsData)
  if (result.returnCode === 0 && result.resultCode === 0) {
    currentRow.value = result.data
    ElMessage({ message: '角色授权成功', type: 'success' })
    childSourceRef.value.closeDialog()
  }
}
// 重置查询跳单
const resetForm = (formEl: FormInstance | undefined) => {

  if (!formEl) return
 {
  formEl.resetFields()
  query.value=formInline
  search()
 } 
}
// 打开角色添加窗口
const add = (row:any): void => {
  childRef.value.openDialog(row, 'add')
}
// 打开角色修改窗口
const edit = async (row: ResRoleRowData) => {
  childRef.value.openDialog(row, 'edit')
}
const view = async (row: ResRoleRowData) => {
  const result = await api.role.getInfo({ id: row?.id as string })
  if (result.returnCode === 0 && result.resultCode === 0) {
    childViewRef.value.openDialog(result.data)
  }

  childViewRef.value.openDialog(row)
}
// 删除角色
const del = async (row: ResRoleRowData) => {
  const result = await api.role.del({ id: row.id as string })
  if (result.returnCode === 0 && result.resultCode === 0) {
    ElMessage({ message: '删除成功', type: 'success' })
    loadList()
  }
}
const changeOrder = (item: { label: string, value: string }) => {
  sortField.value = item.value
  sortType.value = sortType.value === 'desc' ? 'asc' : 'desc'
  loadList()
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      query.value=formInline
      search()
    } else {
      console.log('error submit!', fields)
    }
  })
}

const handleCurrentChange = (val: number) => {
  page.value = val
  loadList()
}
onMounted(() => {
    query.value=formInline
    loadList()
  });
</script>

<style lang="less" scoped>
</style>
