<template>
  <div class="tableListContainer">
    <el-table :data="list" style="width: 100%" border
      :header-cell-style="{ backgroundColor: '#f8f8f9', color: '#606266' }" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column label="名称">
        <template #default="scope">

        
          <el-button
      @click="handleView(scope.row)"
    
      type="primary"
      link
      >{{ scope.row.name }}</el-button
    >

        </template>
      </el-table-column>
      <el-table-column prop="openId" label="统一标识"></el-table-column>
      <!-- <el-table-column prop="businessTypeCode" label="业务场景码"></el-table-column> -->
      <el-table-column prop="statusName" label="状态"></el-table-column>
      <el-table-column prop="memo" label="备注"></el-table-column>

      <el-table-column label="操作" width="320" align="center">
        <template #default="scope">
            <el-button size="small" @click="handleUser(scope.row)">关联人员</el-button>
          <el-button size="small" @click="handleRight(scope.row)">角色授权</el-button>
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
const emit = defineEmits(["del", 'edit','view','openResource','addUser']);
// const router = useRouter();
// 设置接受的参数默认值为[]
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

const { list } = toRefs(props)

const multipleSelection = ref<ResRoleRowData[]>([])
const handleEdit = (index: number, row: ResRoleRowData) => {
  emit('edit', row)
  // console.log(index, row)
}
const handleUser = ( row: ResRoleRowData) => {
  emit('addUser', row)
}
const handleRight = ( row: ResRoleRowData) => {
  emit('openResource', row)
}
const handleView = ( row: ResRoleRowData) => {
  emit('view', row)
  // console.log(index, row)
}
const handleDelete = (index: number, row: ResRoleRowData) => {
  ElMessageBox.confirm(
    '请确认要删除该角色?',
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
const handleSelectionChange = (val: ResRoleRowData[]) => {
  multipleSelection.value = val
  console.log(val)
}

</script>
