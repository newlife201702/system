<template>
<div class="workPackageManageDetailsContainer">
    <div class="lmTitleContainer">

        <h1>{{infoData?.projectPhysical?.name}} <span>{{infoData?.projectPhysical?.statusName?infoData?.projectPhysical?.statusName:'未启动'}}</span></h1>
         <b>
            <el-dropdown ref="dropdown1" trigger="contextmenu" @command="handleCommand">
                <el-button type="primary" @click="getStep()" >
                    {{infoData?.projectPhysical?.statusName}}<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu>
                    <el-dropdown-item v-for="(item,index) in menuList" :key="index+'dropmenu'" :command="item.eventCode">{{item.eventName}}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </b>
        <span>编号： {{infoData?.projectPhysical?.code}}</span>
        <i>
            <!-- <span>查看详情</span> -->
            <el-icon><WarningFilled /></el-icon>
            {{infoData?.projectPhysical?.memo}}
        </i>
        <div>
            {{infoData?.projectPhysical?.about}}
        </div>
    </div>

    <el-tabs v-model="activeName" class="demo-tabs"  >
        <el-tab-pane label="基本信息" name="first">
            <my-base :id="id"/>
        </el-tab-pane>
        <el-tab-pane label="主计划" name="second">
            <my-plan :id="id"/>
        </el-tab-pane>
     
    </el-tabs>
    <dialog-form @loadList="init" ref="myChild"></dialog-form>
</div>
</template>

<script setup lang='ts'>
import {onMounted, ref, reactive } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import myBase from "./components/details/base.vue"
import myPlan from "./components/details/plan.vue"
import * as api from '@/api'
import type { DropdownInstance } from 'element-plus'
import { useRoute, useRouter } from 'vue-router';
import dialogForm from './components/dialogForm.vue'
const dropdown1 = ref<DropdownInstance>()
const route = useRoute()
const router = useRouter()
const infoData=ref<any>()
const menuList=ref<any>([])
const myChild=ref()
const activeName = ref('first')
const id=ref<string>()

const handleCommand = async(command: string) => {
    const params={ businessDataId: id.value as string,businessTable: "WF_PROJECT",eventCode:command}
    myChild.value.openDialog(params)
}
const getStep=async()=>{
  
    const result = await api.flow.WorkFlowStep({ businessDataId: id.value as string,businessTable: "WF_PROJECT",})
            if (result.resultCode === 0 && result.returnCode === 0) {
                menuList.value=result.data
                dropdown1.value?.handleOpen()
            }
}
const init=async()=>{
    const result = await api.packageManage.getInfo({ id:id.value as string })
            if (result.resultCode === 0 && result.returnCode === 0) {
                // console.log(result.data)
                infoData.value=result.data
            }
}
onMounted(()=>{
    id.value = route?.query?.id as string
    init()
})
</script>

<style lang="less">
.workPackageManageDetailsContainer{
    .lmTitleContainer{
        position: relative;
        &>b{
            top: 0;
            display: block;
            font-weight: normal;
          text-align: right;
          position: absolute;
          width: 100%;
        }
        &>h1{
            font-size: 24px;
            font-weight: normal;
            position: relative;
            color: #666;
            &>span{
                display: inline-block;
                color: #409eff;
                background-color: #ecf5ff;
                font-size: 12px;
                line-height: 1.6;
                border: 1px solid #409eff;
                padding-left: 10px;
                padding-right: 10px;
                border-radius: 5px;
                margin-left: 10px;
                position: absolute;
                top: 4px;
            }


        }

        &>span{
                display: block;
                color: #666;
                font-size: 14px;
                line-height: 2;
            }

        &>i{
                display: block;
                color: #999;
                font-size: 14px;
 
                background-color: #f2f2f2;
                padding: 10px;
                &>span{
                    float: right;
                    cursor: pointer;
                }
                margin-top: 10px;
                margin-bottom:10px;
                border-radius: 5px;
            }

        &>ul{
            display: block;
            margin-top: 10px;
            margin-bottom:20px;
            &>li{
                display: inline-block;
                color: #666;
                background-color: #f4f4f5;
                font-size: 14px;
                line-height: 1.6;
                border: 1px solid #ddd;
                padding-left: 10px;
                padding-right: 10px;
                border-radius: 5px;
                margin-right: 10px;
            }
        }
        &>div{
            line-height: 1.5;
            font-size: 15px;
            color: #333;
            margin-bottom: 10px;
            word-break:break-all;
            display:-webkit-box;
            -webkit-line-clamp:3;
            -webkit-box-orient:vertical;
            overflow:hidden;
        }
    }
}
</style>
