<template>
  <div class="side-menu-container">
    <el-menu default-active="2"  :collapse="isCollapse" :collapse-transition="false" @select="handleNav">
      <template v-for="(item, index) in menuList" :key="'nav'+index">
        <el-menu-item :index="item.key" v-if="!item.children || (item.children && item.children.length === 0)">
          <el-icon>
            <component :is="item.ico" />
          </el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>

        <el-sub-menu :index="item.key" v-if="item.children && item.children.length > 0">
          <template #title>
            <el-icon v-if="item.ico">
              <component :is="item.ico" />
            </el-icon>
            <span>{{ item.title }}</span>
          </template>
          <template v-for="(subItem, subIndex) in item.children" index="subItem.key" :key="'subNav'+subIndex">
            <el-menu-item :index="subItem.key"
               :class="route.path === subItem.key ? 'is-active' : ''"
              v-if="!subItem.children || (subItem.children && item.children.length === 0)">{{ subItem.title }}</el-menu-item>

            <el-sub-menu :index="subItem.key" v-if="subItem.children && subItem.children.length > 0">
              <template #title><span>{{ subItem.title }}</span></template>
              <el-menu-item v-for="(secondItem, secondIndex) in subItem.children" :index="secondItem.key"
                :key="'subNav' + secondIndex">{{ secondItem.title }}</el-menu-item>
            </el-sub-menu>

          </template>
        </el-sub-menu>
      </template>
    </el-menu>
    
    <!-- 展开收起按钮 -->
    <div class="collapse-button" @click="emit('changeSwitch')">
      <el-icon>
        <Fold v-if="!isCollapse" />
        <Expand v-if="isCollapse" />
      </el-icon>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {useRouter,useRoute} from 'vue-router'
import { defineProps ,toRefs,ref,computed,defineEmits} from 'vue'
import type {ComputedRef} from 'vue'
import { Fold, Expand } from '@element-plus/icons-vue'

const router = useRouter();
const props= defineProps({ isCollapse: Boolean, menuList: Object })
const emit = defineEmits(["changeSwitch"])

// const defaultOpeneds=ref<string[]>([ "/main/dashboard", "/main/admin/user", "/main/admin/user/cardList", "/main/admin/user/tableList2", "/main/admin/user/tableList3", "2", "/main/form/index" ])
const {isCollapse, menuList} = toRefs(props)
const route = useRoute()
const handleNav = (key: string, keyPath: string[]) => {
//   console.log("----")
//   console.log(key, keyPath)
//   console.log("====")
  router.push({path:key})
}




</script>

<style lang="less">
.el-aside {
  overflow-x: hidden;
  transition: width 0.15s;
  -webkit-transition: width 0.15s;
  -moz-transition: width 0.15s;
  -webkit-transition: width 0.15s;
  -o-transition: width 0.15s;
}

.side-menu-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.collapse-button {
  position: absolute;
  bottom: 20px;
  left: 35px;
  transform: translateX(-50%);
  background-color: #f5f7fa;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ebeef5;
  }
}
</style>
