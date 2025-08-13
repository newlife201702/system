<template>

    <div class="viewDetailsContainer">
      <el-row :gutter="10">
      <el-col  :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card class="box-card">
          <h1>部门名称</h1>
          <div>{{currentNode.name}}</div>
        </el-card>
      </el-col>

       <el-col  :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card class="box-card">
          <h1>编码</h1>
          <div>{{currentNode.departmentCode}}</div>
        </el-card>
      </el-col>


      <el-col  :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card class="box-card">
          <h1>部门类型码</h1>
          <div>{{currentNode.departmentType}}</div>
        </el-card>
      </el-col>

      <el-col  :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card class="box-card">
          <h1>介绍</h1>
          <div>{{currentNode.about}}</div>
        </el-card>
      </el-col>

      <el-col  :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
        <el-card class="box-card">
          <h1>备注</h1>
          <div>{{currentNode.memo}}</div>
        </el-card>
      </el-col>

     

    </el-row>
    </div>


</template>

<script lang="ts" setup>
import { defineProps ,withDefaults } from 'vue'
type Props = {
  currentNode?:any,
}

// withDefaults 定义默认值
withDefaults(defineProps<Props>(), {
  currentNode:()=> ({
    about: "",
    code: "",
    departmentCode: "",
    departmentId: "",
    departmentType: "",
    levelCode: "",
    levelName: "",
    memo: "",
    name: "",
    openId: "",
    parentId: "",
    sortNo: "",
    statusCode: "",
    statusName: "",
    typeCode: ""
  })
    // num: () => [12,13,14] // 复杂数据类型使用函数方式
})


</script>
