<template>
    <div class="common-layout">
      <el-container>
        <el-aside width="200px"></el-aside>
        <el-aside width="350px">我的任务</el-aside>
        <el-aside width="350px">待接收</el-aside>
       <el-aside width="350px">进行中</el-aside>
       <el-aside width="350px">审核通过</el-aside>
      </el-container>
    </div>
    <div class="common-layout">
      <el-container>
        <el-aside width="200px" style="margin-right: 20px;"></el-aside>
        <el-aside width="350px">2</el-aside>
        <el-aside width="350px">3</el-aside>
       <el-aside width="350px">5</el-aside>
       <el-aside width="350px">8</el-aside>
      </el-container>
    </div>
    <div style="height:30px">
         我的任务
    </div>
    <div>
        <el-table :data="planData">
                    <el-table-column label="序号" prop="id"/>
                    <el-table-column label="任务名称" prop="name" />
                    <el-table-column label="任务负责人" prop="personname" />
                    <el-table-column label="归属项目" prop="project" />
                    <el-table-column label="状态" prop="status" />
                    <el-table-column label="计划所需天数" prop="plantime" />
                    <el-table-column label="计划开始时间" prop="startTime" />
                    <el-table-column label="计划结束时间" prop="endTime" />
                    <el-table-column label="操作" align="left" width="200px">
                        <el-button type="primary" :icon="Edit">启动工具</el-button>
                        <!-- <el-button size="small" @click="goUrl(scope.$index)">
                        移交
                        </el-button>
                        <el-button
                        size="small"
                        type="danger"
                        @click="goUrl(scope.$index)"
                        >
                        提交
                        </el-button>
                        <el-button
                        size="small"
                        type="danger"
                        @click="goUrl(scope.$index)"
                        >
                        启动工具
                        </el-button> -->
                    </el-table-column>
          </el-table>  
    </div>

    <div class="common-layout">
      <el-container>
        <el-aside width="350px">输入</el-aside>
        <el-aside width="210px"></el-aside>
        <el-aside width="350px">输出</el-aside>
        <el-aside width="210px"></el-aside>
        <el-aside width="350px">数据</el-aside>
      </el-container>
    </div>


    <div class="common-layout">
      <el-container>
        <el-aside width="350px">
          <el-table :data="paramData">
                    <el-table-column label="序号" prop="id"/>
                    <el-table-column label="名称" prop="name" />
                    <el-table-column label="类型" prop="type" />
                    <el-table-column label="值" prop="value" />
          </el-table>
        </el-aside>
        <el-aside width="210px"></el-aside>
        <el-aside width="350px">
          <el-table :data="paramData">
                    <el-table-column label="序号" prop="id"/>
                    <el-table-column label="名称" prop="name" />
                    <el-table-column label="类型" prop="type" />
                    <el-table-column label="值" prop="value" />
          </el-table>
        </el-aside>
        <el-aside width="210px"></el-aside>
        <el-aside width="350px">
          <img :src="'./images/data.jpg'" alt="">
        </el-aside>
      </el-container>
    </div>


   

  </template>



  
<script setup lang="ts">
    import { onMounted, ref, watch } from "vue"
    import dataList from '@/libs/common/dataList'
    import myPageSize from '@/components/common/pageSize.vue';
    import { ElMessage } from 'element-plus'
    import { getIcoByName } from '@/libs/utils'
    import * as api from '@/api'
    import { useRouter, useRoute } from 'vue-router'
    
interface plan {
  id: string
  name: string
  personname: string
  project : string
  status  : string
  plantime : string
  startTime: string
  endTime:  string
}

const planData: plan[] = [
  {
    id: '1',
    name: '体系需求设计',
    personname : '张强',
    project : '体系协同研发项目',
    status : '执行中',
    plantime : '40',
    startTime : '2025-04-28',
    endTime  :'2025-06-28'
  },
  {
    id: '2',
    name: '体系架构设计',
    personname : '周周',
    project : '体系协同研发项目',
    status : '执行中',
    plantime : '40',
    startTime : '2025-04-28',
    endTime  :'2025-06-28'
  },
  {
    id: '3',
    name: '体系仿真推演',
    personname : '林杨',
    project : '体系协同研发项目',
    status : '执行中',
    plantime : '40',
    startTime : '2025-04-28',
    endTime  :'2025-06-28'
  }
]

interface param{
  id: string
  name: string
  type: string
  value: string
}


const paramData: param[] = [
  {
    id: '1',
    name: '作战场景集',
    type : '字符',
    value : 'AV1',
  },
  {
    id: '2',
    name: '作战场景集',
    type : '字符',
    value : 'AV2',
  },
  {
    id: '3',
    name: '作战活动',
    type : '字符',
    value : 'OV5a',
  },
  {
    id: '4',
    name: '作战活动',
    type : '字符',
    value : 'OV5b',
  },
  {
    id: '5',
    name: '作战活动',
    type : '字符',
    value : 'OV6a',
  },
  {
    id: '6',
    name: '作战活动',
    type : '字符',
    value : 'OV6b',
  },

]

</script>
  

<style lang="less">

  .el-aside{
    display: right;
    margin-top: 10px;
    font-size: 20px;
  }

  .img{
    display: block;
  }



</style>