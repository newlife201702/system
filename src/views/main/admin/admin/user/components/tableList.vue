<template>
  <div class="tableListContainer">
    <el-table :data="list" style="width: 100%" border
      :header-cell-style="{ backgroundColor: '#f8f8f9', color: '#606266' }" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="loginName" label="用户名"></el-table-column>
      <el-table-column label="姓名">
        <template #default="scope">
          <el-button @click="handleView(scope.row)" type="primary" link>{{ scope.row.name }}</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="code" label="编码"></el-table-column> -->
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="genderName" label="性别"></el-table-column>
      <el-table-column  label="是否锁定">
        <template #default="scope">
          {{ scope.row.lockStatus?'否':'是'}}
        </template>
      </el-table-column>

      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="postLevelName" label="职务级别"></el-table-column>
      <el-table-column prop="dataSecurityLevelName" label="数据权限"></el-table-column>
      <el-table-column prop="memo" label="备注"></el-table-column>
      <el-table-column label="操作" width="300" align="center">
        <template #default="scope">
          <el-button size="small" @click="handleStatus(scope.$index, scope.row)">{{scope.row.statusCode==='USER_STATUS_ENABLE'?'禁用':'启用' }}</el-button>
          <el-button size="small" @click="handleLock(scope.$index, scope.row)" v-if="!scope.row.lockStatus">解锁</el-button>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" v-if="departmentId" type="danger" @click="handleRemove(scope.$index, scope.row)">移除部门</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style lang="less" scoped>
.tableListContainer {
  .el-table--border {
    height: calc(100vh - 320px);
  }
}
</style>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineProps, defineEmits, toRefs, ref ,defineExpose} from 'vue'
import * as api from '@/api'
const emit = defineEmits(["del", 'edit', 'view','loadList','openRolesDialog']);
// const router = useRouter();
// 设置接受的参数默认值为[]
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  departmentId:String
})

const { list } = toRefs(props)

const multipleSelection = ref<ReqUserRowData[]>([])
const handleEdit = (index: number, row: ReqUserRowData) => {
  emit('edit', row)
  // console.log(index, row)
}
const handleView = (row: ReqUserRowData) => {
  emit('view', row)
  // console.log(index, row)
}

const handleStatus = (index: number, row: ReqUserRowData) => {
  ElMessageBox.confirm(
    '请确认要修改用户状态?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      const result =await api.user.updateStatus({id:row.id as string,model:{statusCode:(row.statusCode==='USER_STATUS_ENABLE'?'USER_STATUS_DISABLE':'USER_STATUS_ENABLE')}})
      if (result.returnCode === 0 && result.resultCode === 0) {
        ElMessage({ message: '状态修改成功', type: 'success' })
        emit('loadList')
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消',
      })
    })
}
const handleRemove = (index: number, row: ReqUserRowData) => {
  ElMessageBox.confirm(
    '确认要移除关系',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      const result =await api.user.removeUserDepartment({removeDepartmentId:props.departmentId as string ,removeDepartmentUserId:[row.id]})
      if (result.returnCode === 0 && result.resultCode === 0) {
        ElMessage({ message: '移除成功', type: 'success' })
        emit('loadList')
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消',
      })
    })
}

const handleRemoveBatch = (index: number, row: ReqUserRowData) => {
  if(multipleSelection.value.length===0)
  {
    ElMessage({
        type: 'warning',
        message: '请选择至少一条你要移除的记录',
      })
    return false
  }
  ElMessageBox.confirm(
    '确认要移除关系',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      const result =await api.user.removeUserDepartment({removeDepartmentId:props.departmentId as string ,removeDepartmentUserId:multipleSelection.value.map(item=>{return item.id})})
      if (result.returnCode === 0 && result.resultCode === 0) {
        ElMessage({ message: '移除成功', type: 'success' })
        emit('loadList')
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消',
      })
    })
}
const handleLock = (index: number, row: ReqUserRowData) => {
  ElMessageBox.confirm(
    '请确认要解锁该用户?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      const result =await api.user.unlock({id:row.id as string,model:{lockStatus:'UNLOCK'}})
      if (result.returnCode === 0 && result.resultCode === 0) {
        ElMessage({ message: '解锁成功', type: 'success' })
        emit('loadList')
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消',
      })
    })
}

const handleSelectionChange = (val: ReqUserRowData[]) => {
  multipleSelection.value = val
  console.log(val)
}

//主动暴露组件属性
defineExpose({
  handleRemoveBatch
})
</script>
