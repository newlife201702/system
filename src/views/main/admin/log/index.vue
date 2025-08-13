<template>
  <div class="paddingContainer">
    <el-card shadow="never">
      <div class="ptpContainer">
        <div style="margin-left: 0px">
          <el-form
            ref="formRef"
            :model="form"
            label-width="100px"
            style="max-width: 100%; margin: 0 auto; margin-top: 20px"
          >
            <el-row :gutter="10">
              <el-col :span="8">
                <el-form-item label="操作者" prop="actionUserName">
                  <el-input
                    v-model="form.actionUserName"
                    placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="操作内容" prop="action">
                  <el-input v-model="form.action" placeholder="请输入" />
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="操作IP地址" prop="actionIp">
                  <el-input v-model="form.actionIp" placeholder="请输入" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="操作类型" prop="actionType">
                  <el-input v-model="form.actionType" placeholder="请输入" />
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="操作时间范围" prop="daterange">
                  <el-date-picker
                    v-model="form.daterange"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="YYYY/MM/DD"
                    value-format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item>
                  <el-button type="primary" @click="submitForm(formRef)"
                    >查询</el-button
                  >
                  <el-button @click="resetForm(formRef)">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-table :data="list" border style="width: 100%">
            <el-table-column label="操作内容">
              <template #default="scope">{{ scope.row.action }}</template>
            </el-table-column>
            <el-table-column property="actionIp" label="操作IP" />
            <el-table-column property="typeName" label="类型" />
            <el-table-column property="actionType" label="操作类型" />
            <el-table-column property="methodName" label="方法名" />
            <el-table-column property="actionStatus" label="操作状态" />
            <el-table-column property="actionUserName" label="操作人" />
            <el-table-column property="actionTime" label="操作时间" />
          </el-table>

          <el-pagination
            class="mtp1"
            v-model:current-page="page"
            v-model:page-size="limit"
            :page-sizes="[10, 20, 30, 40]"
            :small="false"
            :disabled="false"
            :background="false"
            layout="total, sizes, ->, prev, pager, next, jumper"
            :total="total"
            @size-change="changePageSize"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import dataList from '@/libs/common/dataList'
import { useRoute } from 'vue-router'
const route = useRoute()
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
  changePageSize,
} = dataList({ moduleName: 'baseLog', immediate: false })

const formRef = ref<FormInstance>()
const form = reactive({
  typeCode: '0', // 日志类型编码
  action: '', //      操作内容
  actionIp: '', //     操作IP
  actionType: '', // 操作类型
  actionUserName: '', // 操作人
  actionStartTime: '', //   操作开始日期
  actionEndTime: '', //  操作结束日期
  daterange: [],
})

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()

  submitForm(formRef.value)
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (form.daterange.length !== 0) {
        query.value = {
          ...form,
          actionStartTime: form.daterange[0], //   操作开始日期
          actionEndTime: form.daterange[1],
        }
      } else {
        query.value = form
      }
      search()
    } else {
      ElMessage({ message: '表单校验不通过', type: 'warning' })
    }
  })
}

const handleCurrentChange = (val: number) => {
  page.value = val
  loadList()
}
const init = () => {
  const currentPath = route.path
  if (currentPath === '/main/log/visit') {
    form.typeCode = '0'
  }

  if (currentPath === '/main/log/system') {
    form.typeCode = '1'
  }
  if (currentPath === '/main/log/operation') {
    form.typeCode = '2'
  }
  query.value = form
  loadList()
}
// onMounted(() => {})

watch(
  () => route.path,
  async (newVal, oldVal) => {
    if (newVal) {
      init()
    }
  },
  { immediate: true, deep: true }
)
</script>

<style scoped></style>
