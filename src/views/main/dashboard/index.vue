<template>

<div class="flowListContainer" style="height:800px">
 <grid-layout 
    :layout.sync="dataList"
    :col-num="12"
    :row-height="30"
    :is-draggable="true"
    :is-resizable="true"
    :is-mirrored="false"
    :vertical-compact="true"
    :margin="[10, 10]"
    :use-css-transforms="true" 
  >
        <grid-item   v-for="(item,index) in dataList"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :key="item.i">
            <div v-if="item.typeCode==='TABLE'" v-for="(i,index) in item.data">
                 <el-button type="primary" @click="goUrl('addWorkPackageManagement')"><el-icon>
                            <Plus />
                        </el-icon>创建体系研发任务
                  
                 </el-button>
                      <div style="display:flex; align-items: center; ">
                                    <el-row>
                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6">
                                            <el-card style="width:340px">
                                                <div class="workPackContainer">
                                                    <div>
                                                        <h1>
                                                            <img src="/images/ico/1.svg" alt="">
                                                            {{  i.name }}
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
                                                      <el-col>
                                                        负责人: XXX
                                                      </el-col>
                                                          <el-col>
                                                        项目成员：XXX,XXX,XXX
                                                      </el-col>
                                                    </span>
                                                    {{i.statusName }}
                                                    <i>
                                                        <el-button type="primary" size="small" @click="goUrl('addflow')">进入</el-button>
                                                      </i>
                                                </div>

                                            </el-card>
                                        </el-col>
                                    </el-row>
                                </div>   
            </div>
              
            <div v-if="item.typeCode==='TASK'" style="width:100%">
              <el-card>
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
                    <el-button type="primary" @click="goUrl('')" round>搜索</el-button>
                </span>
                &nbsp;
                <span>
                    <el-button type="primary" @click="goUrl('addWorkPackageManagement')" round>历史数据</el-button>
                </span>
                <el-table :data="item.data">
                  <template v-for="(subItem,subIndex) in item.column" :key="'column'+subIndex" >
                        <el-table-column :prop="subItem.engName" :label="subItem.pinyinName"  v-if="subItem.pinyinName !== '操作'"/>
                        <el-table-column fixed="right" label="操作" width="120" v-if="subItem.pinyinName === '操作'">
                          <template #default="scope">
                            <el-button link type="primary" size="small"  @click="goUrl(scope.row)"
                              >执行</el-button
                            >
                            <el-button link type="primary" size="small"  @click="goUrl(scope.row)"
                              >提交</el-button
                            >

                          </template>
                        </el-table-column>
                        <!-- <el-button type="primary" @click="goUrl('addWorkPackageManagement')" v-if="subItem.pinyinName === '操作'">执行</el-button> -->
                  </template>
                </el-table>  
                </el-card>
            </div>
            <div v-if="item.typeCode==='TASKSTEP'" style="width:100%">
              <el-steps
                  :active=item.active
                  finish-status="process"
                  class="steps custom-steps"
                  :align-center="true"
                >
                  <el-step
                        v-for="(i, index) in item.data"
                        :key="i.id"
                        :title="i.name"
                        :class="[
                          index == item.active ? 'active-step' : '',
                          index < item.active ? 'finish-step' : '',
                        ]"
                      >
                      <template #icon>
                        <img
                          :src="
                            item.active == index
                              ? item.selectedIcon
                              : item.active < index
                                ? item.noSelectedIcon
                                : item.pastIcon
                          "
                          alt=""
                          style="width: 60px; height: 60px"
                          @click="selectStep(index)"
                        >
                      </template>
                  </el-step>
                </el-steps>
            </div>
            <div v-if="item.typeCode==='LOGGER'" style="width: 100%">
              <el-card>
                      <span>消息</span>
                      <el-table :data="item.data">
                          <el-table-column :prop="subItem.engName" v-for="(subItem,subIndex) in item.column" :key="'column'+subIndex" :label="subItem.pinyinName"  />
                      </el-table>
              </el-card>
            </div>
            <div v-if="item.typeCode==='TOOL'" style="width: 100%" >
                   <div>
                    <el-card>
                   <span>常用系统</span>
                            <el-row>
                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6" align="center">
                                            <div class="demo-basic--circle">
                                                <div class="block">
                                                <el-avatar :size="50" :src="circleUrl" />
                                                </div>
                                                <div v-for="size in sizeList" :key="size" class="block">
                                                <el-avatar :size="size" :src="circleUrl" />
                                                </div>
                                            </div>
                                            <span class="sysfont">体系需求分析环境</span>
                                        </el-col>

                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6" align="center">
                                            <div class="demo-basic--circle">
                                                <div class="block">
                                                <el-avatar :size="50" :src="circleUrl" />
                                                </div>
                                                <div v-for="size in sizeList" :key="size" class="block">
                                                <el-avatar :size="size" :src="circleUrl" />
                                                </div>
                                            </div>
                                            <span class="sysfont">体系架构设计环境</span>
                                        </el-col>

                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6" align="center">
                                            <div class="demo-basic--circle">
                                                <div class="block">
                                                <el-avatar :size="50" :src="circleUrl" />
                                                </div>
                                                <div v-for="size in sizeList" :key="size" class="block">
                                                <el-avatar :size="size" :src="circleUrl" />
                                                </div>
                                            </div>
                                            <span class="sysfont">电磁大数据开发集成环境</span>
                                        </el-col>
                            </el-row>
                            <el-row>
                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6" align="center">
                                            <div class="demo-basic--circle">
                                                <div class="block">
                                                <el-avatar :size="50" :src="circleUrl" />
                                                </div>
                                                <div v-for="size in sizeList" :key="size" class="block">
                                                <el-avatar :size="size" :src="circleUrl" />
                                                </div>
                                            </div>
                                            <span class="sysfont">体系满足度评估</span>
                                        </el-col>
                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6" align="center">
                                            <div class="demo-basic--circle">
                                                <div class="block">
                                                <el-avatar :size="50" :src="circleUrl" />
                                                </div>
                                                <div v-for="size in sizeList" :key="size" class="block">
                                                <el-avatar :size="size" :src="circleUrl" />
                                                </div>
                                            </div>
                                            <span class="sysfont">体系对抗推演</span>
                                        </el-col>

                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6" align="center">
                                            <div class="demo-basic--circle">
                                                <div class="block">
                                                <el-avatar :size="50" :src="circleUrl" />
                                                </div>
                                                <div v-for="size in sizeList" :key="size" class="block">
                                                <el-avatar :size="size" :src="circleUrl" />
                                                </div>
                                            </div>
                                            <span class="sysfont">体系效能评估</span>
                                        </el-col>
                            </el-row>
                            </el-card>
                        </div>
            </div>  
            <div v-if="item.typeCode==='TASKDETAIL'" style="width: 100%">
                      <el-card>
                    <p>输入</p>
                        <el-button type="primary" @click="goUrl('')" round>添加</el-button>
                        <el-button type="primary" @click="goUrl('')" round>删除</el-button>
                        <el-button type="primary" @click="goUrl('')" round>预览</el-button>
                      <el-table :data="item.data1">
                        <template v-for="(subItem,subIndex) in item.column" :key="'column'+subIndex" >
                            <el-table-column :prop="subItem.engName" :label="subItem.pinyinName"  v-if="subItem.pinyinName !== '操作'"/>
                            <el-table-column fixed="right" label="操作" width="120" v-if="subItem.pinyinName === '操作'">
                              <template #default="scope">
                                <el-button link type="primary" size="small"  @click="goUrl(scope.row)"
                                  >上传</el-button
                                >
                                <el-button link type="primary" size="small"  @click="goUrl(scope.row)"
                                  >下载</el-button
                                >
                              </template>
                        </el-table-column>
                        <!-- <el-button type="primary" @click="goUrl('addWorkPackageManagement')" v-if="subItem.pinyinName === '操作'">执行</el-button> -->
                      </template>
                      </el-table>
                      </el-card>
                      <el-card>
                    <p>输出</p>
                        <el-button type="primary" @click="goUrl('')" round>添加</el-button>
                        <el-button type="primary" @click="goUrl('')" round>删除</el-button>
                        <el-button type="primary" @click="goUrl('')" round>预览</el-button>
                         <el-table :data="item.data2">
                                <template v-for="(subItem,subIndex) in item.column" :key="'column'+subIndex" >
                            <el-table-column :prop="subItem.engName" :label="subItem.pinyinName"  v-if="subItem.pinyinName !== '操作'"/>
                            <el-table-column fixed="right" label="操作" width="120" v-if="subItem.pinyinName === '操作'">
                              <template #default="scope">
                                <el-button link type="primary" size="small"  @click="goUrl(scope.row)"
                                  >上传</el-button
                                >
                                <el-button link type="primary" size="small"  @click="goUrl(scope.row)"
                                  >下载</el-button
                                >
                              </template>
                        </el-table-column>
                        <!-- <el-button type="primary" @click="goUrl('addWorkPackageManagement')" v-if="subItem.pinyinName === '操作'">执行</el-button> -->
                      </template>
                      </el-table>
                      </el-card>
            </div>  

                <!-- <div v-if="item.typeCode==='TABLE'" style="width: 100%">
                  <el-card>
                      <el-table :data="item.data">
                          <el-table-column :prop="subItem.engName" v-for="(subItem,subIndex) in item.column" :key="'column'+subIndex" :label="subItem.pinyinName"  />
                      </el-table>
                  </el-card>
                </div>
                <div v-if="item.typeCode==='PAGE'" style="width:100%">
                  <el-card>
                      <el-table :data="item.pageData">
                          <el-table-column :prop="subItem.engName" v-for="(subItem,subIndex) in item.column" :key="'column'+subIndex" :label="subItem.pinyinName"  />
                      </el-table>
                  </el-card>
                </div>
                <div v-if="item.typeCode==='INCLUDE'" style="width:100%;margin-bottom: 300px;">
                   <iframe  :id="item.i" :src="item.includeUrl" scrolling="auto" style="width:100%" />
               </div>  -->



        </grid-item>



            <!-- <grid-item   v-for="(item,index) in layout"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
              :key="item.i">
              <p>11111</p>
            
            
            </grid-item> -->



  </grid-layout>
</div>
</template>


<script setup lang="ts">

import { reactive, ref, onMounted, computed } from 'vue'

import {formatNum} from '@/libs/utils'
import {useRouter} from 'vue-router'
import * as api from '@/api'
import { el } from 'element-plus/es/locale'
import { tagEmits } from 'element-plus'
import { styleType } from 'element-plus/es/components/table-v2/src/common'


const layout = [
//    {'showTitle' : 'true', 'name': '我的戴安1','x':'0','y': '0','w' : '2','h' : '2','i': '0'},
//    {'showTitle' : 'true', 'name': '我的戴安2','x':'2','y': '0','w' : '2','h' : '4','i': '1'},
//    {'showTitle' : 'true', 'name': '我的戴安3','x':'4','y': '0','w' : '2','h' : '5','i': '2' },
//    {'showTitle' : 'true', 'name': '我的戴安4','x':'6','y': '0','w' : '2','h' : '3','i': '3' },
//    {'showTitle' : 'true', 'name': '我的戴安5','x':'8','y': '0','w' : '2','h' : '3','i': '4' },
                // { "x": 0, "y": 0, "w": 2, "h": 2, "i": "0" },
                // { "x": 2, "y": 0, "w": 2, "h": 4, "i": "1" },
                // { "x": 4, "y": 0, "w": 2, "h": 5, "i": "2" },
                // { "x": 6, "y": 0, "w": 2, "h": 3, "i": "3" },
                // { "x": 8, "y": 0, "w": 2, "h": 3, "i": "4" },
                // { "x": 10, "y": 0, "w": 2,"h": 3, "i": "5" },
                // { "x": 0, "y": 5, "w": 2, "h": 5, "i": "6" },
                //  { "x": 2, "y": 5, "w": 2, "h": 5, "i": "7" },
                // { "x": 4, "y": 5, "w": 2, "h": 5, "i": "8" },
                // { "x": 6, "y": 3, "w": 2, "h": 4, "i": "9" },
                // { "x": 8, "y": 4, "w": 2, "h": 4, "i": "10" },
                // { "x": 10, "y": 4, "w": 2, "h": 4, "i": "11" },
                // { "x": 0, "y": 10, "w": 2, "h": 5, "i": "12" },
                // { "x": 2, "y": 10, "w": 2, "h": 5, "i": "13" },
                // { "x": 4, "y": 8, "w": 2, "h": 4, "i": "14" },
                // { "x": 6, "y": 8, "w": 2, "h": 4, "i": "15" },
                // { "x": 8, "y": 10, "w": 2, "h": 5, "i": "16" },
                // { "x": 10, "y": 4, "w": 2, "h": 2, "i": "17" },
                // { "x": 0, "y": 9, "w": 2, "h": 3, "i": "18" },
                // { "x": 2, "y": 6, "w": 2, "h": 2, "i": "19" },



                { "x": 0, "y": 0, "w": 2, "h": 2, "i": "1" },
                { "x": 2, "y": 0, "w": 4, "h": 2, "i": "2" },
                { "x": 0, "y": 0, "w": 6, "h": 2, "i": "3" },
                { "x": 2, "y": 0, "w": 8, "h": 2, "i": "4" },

];
const loading = ref();

 const payload = computed(() => {
    const _query = query.value
    return Object.assign({}, {data:_query}, {
    })
  })



const totalInfo=reactive({
    "userInterestPackageNum": 0,
    "userPackageNum": 0,
    "userPendingPackageNum": 0,
    "userResponsiblePackageNum": 0,
    "historyRecordNum":0
})
const list=ref<any>()
const dataList=ref<any>([])
const query = ref<any>();  
const router = useRouter()

onMounted(async () => {  
    loadList()
    console.log("dataList" +  JSON.stringify(dataList.value))
})

async function loadList() {
    const result = await (api['config' as keyof typeof api] as any).getConfigHtml({id: "cbb2b6ec03194cd9a883dedc49ff4c07"})
    dataList.value = result?.data as any
}


const goUrl=(urlName:string)=>{
    router.push({name: urlName})
}


</script>

<style lang="less">
.vue-grid-layout {
  background: transparent;
  margin: -10px -10px 0px -10px;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  background: transparent;
  border: 1px solid transparent;
}

.vue-grid-item {
  //min-height: 110px;
  min-width: 220px;
  display: inline-flex;
  :deep(.vue-resizable-handle){
    display: none;
  }
  &:hover{
    :deep(.vue-resizable-handle){
      display: inherit;
    }
  }
}

.vue-grid-item .resizing {
  opacity: 0.9;
}

.vue-grid-item .static {
  background: #cce;
}

.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}

.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}

.vue-grid-item .minMax {
  font-size: 10px;
}

.vue-grid-item .add {
  cursor: pointer;
}

.flowListContainer{
   font-size: 16px;
}

.el-table{
   font-size: 13px; 
}

.sysfont{
  font-size: 14px;
}


</style>
