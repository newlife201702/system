<template>
  <el-menu
    default-active="2"
    :collapse="isCollapse"
    :collapse-transition="false"
    @select="handleNav"
  >
    <template v-for="(item, index) in menuList" :key="'nav' + index">
      <el-menu-item
        :key="'nav' + index"
        :index="item.key"
        v-if="!item.children || (item.children && item.children.length === 0)"
      >
        <el-icon>
          <component :is="item.ico" />
        </el-icon>
        <template #title>{{ item.title }}</template>
      </el-menu-item>

      <el-sub-menu
        :index="item.key"
        :key="'nav' + index"
        v-if="item.children && item.children.length > 0"
      >
        <template #title>
          <el-icon v-if="item.ico">
            <component :is="item.ico" />
          </el-icon>
          <span>{{ item.title }}</span>
        </template>
        <template
          v-for="(subItem, subIndex) in item.children"
          index="subItem.key"
          :key="'subNav' + subIndex"
        >
          <el-menu-item
            :index="subItem.key"
            v-if="
              !subItem.children ||
              (subItem.children && subItem.children.length === 0)
            "
            >{{ subItem.title }}</el-menu-item
          >

          <el-sub-menu
            :index="subItem.key"
            v-if="subItem.children && subItem.children.length > 0"
          >
            <template #title
              ><span>{{ subItem.title }}</span></template
            >
            <el-menu-item
              v-for="(secondItem, secondIndex) in subItem.children"
              :index="secondItem.key"
              :key="'subNav' + secondIndex"
              >{{ secondItem.title }}</el-menu-item
            >
          </el-sub-menu>
        </template>
      </el-sub-menu>
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { defineProps, toRefs } from 'vue'
const router = useRouter()
const props = defineProps({ isCollapse: Boolean, menuList: Object })

const { isCollapse, menuList } = toRefs(props)

const handleNav = (key: string, keyPath: string[]) => {
  //   console.log("----")
  //   console.log(key, keyPath)
  //   console.log("====")
  router.push({ path: key })
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
</style>
