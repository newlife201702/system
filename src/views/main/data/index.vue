<template>
    
    <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <el-select>
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
        </el-select>
        <el-tree
      ref="treeRef"
      :data="data"
      show-checkbox
      default-expand-all
      node-key="id"
      highlight-current
      :props="defaultProps"
    />
  
    <!-- <div class="buttons">
      <el-button @click="getCheckedNodes">get by node</el-button>
      <el-button @click="getCheckedKeys">get by key</el-button>
      <el-button @click="setCheckedNodes">set by node</el-button>
      <el-button @click="setCheckedKeys">set by key</el-button>
      <el-button @click="resetChecked">reset</el-button>
    </div> -->

      </el-aside>
      <el-main>
        <el-container>
        <el-aside width="100px"></el-aside>
        <el-aside width="350px" style="font-size: 25px">体系需求</el-aside>        
        </el-container>
  <el-descriptions
    class="margin-top"
    title=""
    :column="3"
    :size="size"
    border
  >
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <user />
          </el-icon>
          张国强
        </div>
      </template>
    </el-descriptions-item>

    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <iphone />
          </el-icon>
          待审核
        </div>
      </template>
      
    </el-descriptions-item>
    <el-descriptions-item>
        <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <iphone />
          </el-icon>
          2025-06-28
        </div>
      </template>
    </el-descriptions-item>
    <el-descriptions-item>

      <template #label>
        <div>
          <el-icon :style="iconStyle">
            <tickets />
          </el-icon>
          负责人
        </div>
      </template>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div>
          <el-icon :style="iconStyle">
            <office-building />
          </el-icon>
          当前状态
        </div>
      </template>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div>
          <el-icon :style="iconStyle">
            <office-building />
          </el-icon>
          截止时间
        </div>
      </template>
    </el-descriptions-item>
  </el-descriptions>

  <el-row :gutter="10">
    <el-col :xs="8" :sm="6" :md="4" :lg="3" :xl="1"
      ><div class="grid-content ep-bg-purple"
    /></el-col>
    <el-col :xs="8" :sm="6" :md="4" :lg="5" :xl="1"
      ><div class="grid-content ep-bg-purple-light"
    />项目：体系协同研发项目</el-col>
    <el-col :xs="8" :sm="6" :md="4" :lg="5" :xl="1"
      ><div class="grid-content ep-bg-purple"
    />创建人：陈磊</el-col>
    <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1"
      ><div class="grid-content ep-bg-purple-light"
    />创建时间：2025-06-04</el-col>
  </el-row>



  <el-table :data="modelData">
                    <el-table-column label="序号" prop="id"/>
                    <el-table-column label="名称" prop="name" />
                    <el-table-column label="描述" prop="description" />
                    <el-table-column label="来源" prop="region" />
    </el-table>

    </el-main>
    </el-container>
   </div>
  </template>


<script lang="ts" setup>
import { ref } from 'vue'
import { ElTree } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'

interface Tree {
  id: number
  label: string
  children?: Tree[]
}

const treeRef = ref<InstanceType<typeof ElTree>>()

const getCheckedNodes = () => {
  console.log(treeRef.value!.getCheckedNodes(false, false))
}
const getCheckedKeys = () => {
  console.log(treeRef.value!.getCheckedKeys(false))
}
const setCheckedNodes = () => {
  treeRef.value!.setCheckedNodes(
    [
      {
        id: 5,
        label: 'Level two 2-1',
      },
      {
        id: 9,
        label: 'Level three 1-1-1',
      },
    ] as Node[],
    false
  )
}
const setCheckedKeys = () => {
  treeRef.value!.setCheckedKeys([3], false)
}
const resetChecked = () => {
  treeRef.value!.setCheckedKeys([], false)
}

const defaultProps = {
  children: 'children',
  label: 'label',
}

const data: Tree[] = [
  {
    id: 1,
    label: '体系需求分析',
  },
  {
    id: 2,
    label: '体系架构设计',
  },
  {
    id: 3,
    label: '体系需求满足度评估',
  },
  {
    id: 5,
    label: '体系对抗仿真',
  },
  {
    id: 4,
    label: '体系效能评估',
  },
]

interface model {
    id: string
    name:  string
    description: string
    region: string
}

const modelData: model[] = [
  {
    id: '1',
    name: '需求1',
    description: '',
    region: '需求管理系统' 
  },
  {
    id: '2',
    name: '需求2',
    description: '',
    region: '需求管理系统' 
  },
  {
    id: '3',
    name: '需求3',
    description: '',
    region: '需求管理系统' 
  },
  {
    id: '4',
    name: '需求4',
    description: '',
    region: '需求管理系统' 
  },
  {
    id: '5',
    name: '需求5',
    description: '',
    region: '需求管理系统' 
  },
]  



</script>

<style lang="less">
    .cell-item {
        font-size: 16px
    }
</style>
