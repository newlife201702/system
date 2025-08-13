<template>
      <el-row>
            <el-col :span="7.5">
            <div class="grid-content ep-bg-purple" />
            <div class="btnToolsContainer" style="border-bottom:0px">
                <el-col>
                </el-col>
                <el-col>
                    <el-input
                        v-model="search"
                        style="width: 240px"
                        autosize
                        type="textarea"
                        placeholder="请输入检索信息"
                    />
                 <span>
                    &nbsp;
                    <el-button type="primary"><el-icon>
                            <Plus />
                        </el-icon> 搜索</el-button>
                </span>
               
                </el-col>
                <el-col v-for="item in tableData" :key="item">
                    <div style="display:flex; align-items: center; width:100%">
                                    <el-row>
                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6">
                                            <el-card style="width:450px">
                                                <div class="workPackContainer">
                                                    <div>
                                                        <h1>
                                                            <img src="/images/ico/1.svg" alt="">
                                                            {{ item.name }}
                                                        </h1>
                                                        <span>
                                                            <el-icon style="margin-top: 6px;margin-right: 3px;"><ArrowDown /></el-icon>
                                                            <i>
                                                                <el-tooltip placement="bottom" effect="light" :append-to-body="false">
                                                                    <template #content>
                                                                        <h1>启动</h1>
                                                                        计划：2023-08-01
                                                                        <br />
                                                                        实际：2023-08-03
                                                                        <h1>关闭</h1>
                                                                        计划：2023-08-04
                                                                        <br />
                                                                        实际：-
                                                                        </template>
                                                                    2024年1月31日前交付                                    
                                                                </el-tooltip>
                                                            </i>
                                                        </span>
                                                    </div>
                                                    <span>
                                                        {{ item.statusName}}
                                                    </span>
                                                    <i>
                                                        <el-button type="primary" size="small" @click="goUrl('addflow')">进入</el-button>
                                                        <el-button size="small">修改</el-button> <el-button size="small">...</el-button>
                                                    </i>
                                                </div>

                                            </el-card>
                                        </el-col>
                                    </el-row>
                                </div>                   
                </el-col>
            </div>
            </el-col>
            <el-col :span="11">
                <el-col>
                   <span></span>
                </el-col>
                项目名称
                    <el-input
                        v-model="search"
                        style="width: 240px"
                        autosize
                        type="textarea"
                        placeholder="请输入检索信息"
                    />
                 <span>
                    &nbsp;
                    <el-button type="primary" @click="goUrl('addWorkPackageManagement')"><el-icon>
                            <Plus />
                        </el-icon> 搜索</el-button>
                </span>
                &nbsp;
                <span>
                    <el-button type="primary" @click="goUrl('addWorkPackageManagement')"><el-icon>
                            <Plus />
                        </el-icon> 历史数据</el-button>
                </span>
                <span>
                    &nbsp;
                    <el-button type="primary" @click="goUrl('addWorkPackageManagement')">创建项目</el-button>
                </span>
                <el-table :data="planData">
                    <el-table-column label="序号" prop="id"/>
                    <el-table-column label="任务名称" prop="name" />
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


            </el-col>
            <el-col :span="4">
            <div class="grid-content ep-bg-purple" />
                <el-col>
                   <span>常用系统</span>
                            <el-row>
                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6">
                                            <div class="demo-basic--circle">
                                                <div class="block">
                                                <el-avatar :size="50" :src="circleUrl" />
                                                </div>
                                                <div v-for="size in sizeList" :key="size" class="block">
                                                <el-avatar :size="size" :src="circleUrl" />
                                                </div>
                                            </div>
                                            <span>体系需求分析环境</span>
                                        </el-col>

                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6">
                                            <div class="demo-basic--circle">
                                                <div class="block">
                                                <el-avatar :size="50" :src="circleUrl" />
                                                </div>
                                                <div v-for="size in sizeList" :key="size" class="block">
                                                <el-avatar :size="size" :src="circleUrl" />
                                                </div>
                                            </div>
                                            <span>体系架构设计环境</span>
                                        </el-col>

                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6">
                                            <div class="demo-basic--circle">
                                                <div class="block">
                                                <el-avatar :size="50" :src="circleUrl" />
                                                </div>
                                                <div v-for="size in sizeList" :key="size" class="block">
                                                <el-avatar :size="size" :src="circleUrl" />
                                                </div>
                                            </div>
                                            <span>电磁大数据开发集成环境</span>
                                        </el-col>
                            </el-row>
                            <el-row>
                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6">
                                            <div class="demo-basic--circle">
                                                <div class="block">
                                                <el-avatar :size="50" :src="circleUrl" />
                                                </div>
                                                <div v-for="size in sizeList" :key="size" class="block">
                                                <el-avatar :size="size" :src="circleUrl" />
                                                </div>
                                            </div>
                                            <span>体系满足度评估</span>
                                        </el-col>
                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6">
                                            <div class="demo-basic--circle">
                                                <div class="block">
                                                <el-avatar :size="50" :src="circleUrl" />
                                                </div>
                                                <div v-for="size in sizeList" :key="size" class="block">
                                                <el-avatar :size="size" :src="circleUrl" />
                                                </div>
                                            </div>
                                            <span>体系对抗推演</span>
                                        </el-col>

                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6">
                                            <div class="demo-basic--circle">
                                                <div class="block">
                                                <el-avatar :size="50" :src="circleUrl" />
                                                </div>
                                                <div v-for="size in sizeList" :key="size" class="block">
                                                <el-avatar :size="size" :src="circleUrl" />
                                                </div>
                                            </div>
                                            <span>体系效能评估</span>
                                        </el-col>
                            </el-row>
                </el-col>
                

            </el-col>
        </el-row>
</template>

<script setup lang="ts">

import { ref,reactive,onMounted } from 'vue'
import {formatNum} from '@/libs/utils'
import {useRouter} from 'vue-router'
import * as api from '@/api'
import { el } from 'element-plus/es/locale'
import { tagEmits } from 'element-plus'
const totalInfo=reactive({
    "userInterestPackageNum": 0,
    "userPackageNum": 0,
    "userPendingPackageNum": 0,
    "userResponsiblePackageNum": 0,
    "historyRecordNum":0
})
const list=ref<any>()
const router = useRouter()
const getTotalInof=async()=>{
    const result = await api.packageManage.userPackageTotal({id:"123"})
    Object.assign(totalInfo,result.data)
}

const getPendingList=async()=>{
    let searchJson={
        "code": "",
        "id": "123",
        "levelCode": "",
        "name": "",
        "parentId": "",
        "securityLevelCode": "",
        "sortField": "",
        "sortType": ""
    }
    const result = await api.packageManage.userPendingList(searchJson)
    list.value=result.data
}

const goUrl=(urlName:string)=>{
    router.push({name: urlName})
}

onMounted(()=>{
    getTotalInof()
    getPendingList()
})

interface project {
  name: string
  succrate: string,
  statusName: string
}

const tableData: project[] = [
  {
    name: 'XXX体系研发协同项目1',
    succrate: '60%',
    statusName: '未执行',
  },
  {
    name: 'XXX体系研发协同项目2',
    succrate: '60%',
    statusName: '进行中',
  },
  {
    name: 'XXX体系研发协同项目3',
    succrate: '60%',
    statusName: '进行中',
  },{
    name: 'XXX体系研发协同项目4',
    succrate: '60%',
    statusName: '已完成',
  },
]


interface plan {
  id: string
  name: string
  startTime: string
  endTime:  string
}

const planData: plan[] = [
  {
    id: '1',
    name: '体系需求设计任务',
    startTime : '2025-04-28',
    endTime  :'2025-06-28'
  },
  {
    id: '2',
    name: '体系架构设计任务',
    startTime : '2025-04-28',
    endTime  :'2025-06-28'
  },
  {
    id: '3',
    name: '体系仿真推演任务',
    startTime : '2025-04-28',
    endTime  :'2025-06-28'
  }
]



</script>

<style lang="less">
.cardPacketBoxContainer {

    &>h1 {
        font-size: 16px;
        color: #666;
        line-height: 30px;

        &>span {
            float: right;
            font-size: 14px;
            font-weight: normal;
            color: #000;
        }

        margin-bottom: 10px;
    }

    &>span {
        display: block;
        line-height: 2;
        font-size: 14px;
        padding-bottom: 10px;
    }
}
</style>
