<template>
      <div class="wapMenuContainer">
        <span @click="switchFold=true"><el-icon ><Expand /></el-icon> Menu</span>
        <div @click="switchFold=false" v-if="switchFold">
          <div @click.stop="()=>{}">
            <template v-for="(item,index) in menuList" :key="index">
              <h1 @click="handleNav(item.key)"><el-icon><component :is="item.ico" /></el-icon> {{ item.title }}</h1>
              <ul v-if="item.children && item.children.length">
                <li v-for="(subItem,subIndex) in item.children" @click="handleNav(subItem.key)" :key=" 'subIndex'+subIndex">{{subItem.title}}</li>
              </ul>
          </template>
          </div>
        </div>
      </div>
</template>

<script setup lang="ts">

import {useRouter} from 'vue-router'

import { defineProps ,toRefs,ref} from 'vue'
const router = useRouter();
const props= defineProps({ menuList: Object })
const switchFold=ref(false)
const {menuList} = toRefs(props)

const handleNav = (key: string) => {

  router.push({path:key})
  switchFold.value=false
}
</script>

<style scoped>

</style>
