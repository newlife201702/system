<template>
  <div class="tableListContainer">
    <el-table :data="list" style="width: 100%" border
      :header-cell-style="{ backgroundColor: '#f8f8f9', color: '#606266' }" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column prop="name" label="应用名称"></el-table-column>
      <el-table-column prop="appId" label="应用标识"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="contact" label="联系人"></el-table-column>

      <el-table-column label="操作" width="320" align="center">
        <template #default="scope">
          <el-button size="small" @click="handleRight(scope.$index, scope.row)">分配权限</el-button>
          <el-button size="small" @click="handleStatus(scope.$index, scope.row)">{{scope.row.statusCode==='USER_STATUS_ENABLE'?'禁用':'启用' }}</el-button>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style lang="less" scoped>
.tableListContainer {
  .el-table--border {
    height: calc(100vh - 280px);
  }
}
</style>
<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineProps, defineEmits, toRefs, ref } from 'vue'
import * as api from '@/api'
const emit = defineEmits(["del", 'edit', 'view','loadList','openResource']);
// const router = useRouter();
// 设置接受的参数默认值为[]
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const { list } = toRefs(props)

const multipleSelection = ref<appRowItem[]>([])
const handleEdit = (index: number, row: appRowItem) => {
  emit('edit', row)
  // console.log(index, row)
}
const handleView = (row: appRowItem) => {
  emit('view', row)
  // console.log(index, row)
}
const handleRight= (index: number, row: appRowItem) =>{
  emit('openResource',row)
}
const handleStatus = (index: number, row: appRowItem) => {
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
      const result =await api.app.updateStatus({id:row.id as string,model:{statusCode:(row.statusCode==='USER_STATUS_ENABLE'?'USER_STATUS_DISABLE':'USER_STATUS_ENABLE')}})
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

const handleDelete = (index: number, row: appRowItem) => {
  ElMessageBox.confirm(
    '请确认要删除该记录吗?',
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      emit('del', row)
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
const handleSelectionChange = (val: appRowItem[]) => {
  multipleSelection.value = val
  console.log(val)
}

</script>
