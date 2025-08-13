<template>
  <div class="userAdminContainer">
    <span>
      <depart-ment @getNodeInfo="getNodeInfo"></depart-ment >
    </span>
    <i>
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
          <el-button @click="add" v-if="formInline.departmentId"><el-icon>
              <Plus />
            </el-icon> 新增</el-button>
            <el-button @click="removeUserDepartmentBatch" v-if="formInline.departmentId"><el-icon><Minus /></el-icon>批量移除</el-button>
        </div>


        <div class="searchContainer">
          <ema-page-size @changePageSize="changePageSize"></ema-page-size>
          <i>
            <el-popover placement="bottom" :visible="visible" :width="400">
              <template #reference>
                <el-button type="primary" plain @click="visible = !visible"><el-icon>
                    <ArrowDown />
                  </el-icon>高级查询</el-button>
              </template>

              <el-form ref="ruleFormRef" :model="formInline" label-width="80px">
                <el-form-item label="用户名" prop="loginName">
                  <el-input v-model="formInline.loginName" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="formInline.name" placeholder="请输入用姓名" />
                </el-form-item>

                <el-form-item label="电话号码" prop="phone">
                  <el-input v-model="formInline.phone" placeholder="请输入电话号码" />
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="formInline.email" placeholder="请输入邮箱" />
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

        <table-list ref='tableListRef' :departmentId="formInline.departmentId" :list=list style="margin-bottom: 15px;" @del="del" @edit="edit" @view="view" @loadList="loadList"></table-list>


        <el-pagination v-model:current-page="page" v-model:page-size="limit" :page-sizes="[10, 20, 30, 40]"
          :small="small" :disabled="disabled" :background="background" layout="total, ->, prev, pager, next, jumper"
          :total="total" @current-change="handleCurrentChange" />

       
        <roles-dialog ref='rolesRef' @updateRoles="updateRoles" />
        <dialog-user-list ref='userRef' @addUser="addUser"   @loadList="loadList"></dialog-user-list> 
        <dialog-form ref='childRef' @loadList="loadList" @add="add" />
        <dialog-view  ref='childViewRef' />
      </div>
    </i>
  </div>
</template>

<script setup lang="ts">
import tableList from './components/tableList.vue';
import dialogForm from './components/dialogForm.vue';
import dialogView from './components/dialogView.vue';
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import dataList from '@/libs/common/dataList'
import emaPageSize from '@/components/common/emaPageSize.vue';
import rolesDialog from '@/components/common/rolesDialog.vue';
import departMent from '@/components/common/departMent.vue';
import dialogUserList from './components/dialogUserList.vue';
import * as api from '@/api'


const childRef = ref()  //注册响应数据  
const childViewRef = ref()  //注册响应数据  
const rolesRef = ref()  //注册响应数据  
const userRef = ref()  //注册响应数据  

const tableListRef=ref()  //注册响应数据  

const ruleFormRef = ref<FormInstance>()
const orderOptionList = ref(
  [
    { label: "日期", value: "create_time" },
    { label: "名称", value: "name" },
    { label: "状态", value: "status_code" }
  ]
)
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
} = dataList({ moduleName: 'user',immediate:false })

const currentRow = ref<ReqUserRowData>()

const formInline = reactive({
  scope:'all',
  code:"",
  dataSecurityLevelCode:"",
  departmentId:"",
  email:"",
  genderCode:"",
  id:"",
  isUnlock:"",
  loginName:"",
  name:"",
  openId:"",
  phone:"",
  postLevelCode:"",
  roleId:"",
  securityLevelCode:"",
  sortField:"",
  sortType:"",
  statusCode:"",
  isSystem:"1"
})
const visible = ref(false)
const small = ref(false)
const background = ref(false)
const disabled = ref(false)

const getNodeInfo=(node:any):void=>{
  console.log(node)
  formInline.departmentId=node.id
  formInline.scope='self'
  query.value=formInline
  search()
}

const resetForm = (formEl: FormInstance | undefined) => {

  if (!formEl) return
  formEl.resetFields()
  query.value=formInline
  search()
}
const updateRoles = async (roleArr: ReqUserRolesArrData[]) => {
  const roleParams: ReqUserRolesData = {
    roleList: roleArr,
    user: { id: currentRow.value?.id as string }
  }
  const result = await api.user.addUserRole(roleParams)
  if (result.returnCode === 0 && result.resultCode === 0) {
    ElMessage({ message: '角色设置成功', type: 'success' })
    rolesRef.value.closeDialog([])
    loadList()
  }
}

const addUser = (): void => {
  childRef.value.openDialog({}, 'add')
}
const removeUserDepartmentBatch=():void => {
  tableListRef.value.handleRemoveBatch()
}
const add = (): void => {
  userRef.value.openDialog(formInline.departmentId)
}
const edit = async (row: ReqUserRowData) => {
  childRef.value.openDialog(row, 'edit')
}
const view = async (row: ReqUserRowData) => {
  childViewRef.value.openDialog(row)
}
const del = async (row: ReqUserRowData) => {
  const result = await api.user.del({ id: row.id })
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
.userAdminContainer {

  position: relative;

  &>span {
    height: calc(100vh - 130px);
    border-right: 1px solid #e4e3e3;
    width: 320px;
    left: 0;
    top: 0;
    position: absolute;
    display: block;
    overflow: auto;

  }

  &>i {
    margin-left: 340px;
    display: block;
  }
}
</style>
