<template>
    <div class="common-layout">
      <el-container>
        <el-aside width="240px">
          <el-button type="primary" @click="goUrl('')"><el-icon>
                            <Plus />
                        </el-icon> 推荐模板</el-button>
                        <el-button type="primary" @click="goUrl('')"><el-icon>
                            <Plus />
                        </el-icon> 新增模板</el-button>
              <el-col>
                <div style="display:flex; align-items: center; width:100%">
                  <el-row>
                      <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6">
                           <el-card style="width:450px">
                               <div class="workPackContainer">
                                    <div>
                                         <h1>体系研发协同项目设计模板</h1>
                                    </div>
                                    <div>
                                      <el-row :gutter="20">
                                          <el-col :span="6"><div class="grid-content ep-bg-purple" />6个任务</el-col>
                                          <el-col :span="10"><div class="grid-content ep-bg-purple" />由设计师创建</el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-card>
                      </el-col>
                   </el-row>
                </div>
              </el-col>
              <el-col>
                <div style="display:flex; align-items: center; width:100%">
                  <el-row>
                      <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="6">
                           <el-card style="width:450px">
                               <div class="workPackContainer">
                                    <div>
                                         <h1>体系研发协同项目设计模板</h1>
                                    </div>
                                    <div>
                                      <el-row :gutter="20">
                                          <el-col :span="6"><div class="grid-content ep-bg-purple" />6个任务</el-col>
                                          <el-col :span="10"><div class="grid-content ep-bg-purple" />由设计师创建</el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-card>
                      </el-col>
                   </el-row>
                </div>
              </el-col>
        </el-aside>
        <el-main>
              <div class="previewContainer" style="width:100%;height:100%;margin:0">
                 <flow></flow> 
              </div>
        </el-main>
      </el-container>
    </div>
  </template>


<script lang="ts" setup>

import { ref,reactive,onMounted } from 'vue'
import {formatNum} from '@/libs/utils'
import {useRouter} from 'vue-router'
import * as api from '@/api'
import { el } from 'element-plus/es/locale'
import { tagEmits } from 'element-plus'

import  flow  from '@/views/main/workPackageManagement/components/flow/flow.vue'                       
</script>


<style lang="less">
  .grid-content ep-bg-purple{
     font-size: 10px;
  }
</style>


