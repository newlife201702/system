<template>
  <el-container style="display: block">
    <div class="headerSubTitle">样机设计/仿真APP集成工作台模块</div>
    <main-head
      :isCollapse="isCollapse"
      @changeSwitch="changeSwitch"
      @changeMenu="changeMenu"
    ></main-head>
    <el-container style="background-color: #fffbfb">
      <el-aside :width="!isCollapse ? '200px' : '66px'">
        <main-side :isCollapse="isCollapse" :menuList="menuList"></main-side>
      </el-aside>
      <wap-side :isCollapse="isCollapse" :menuList="menuList"></wap-side>
      <el-main>
        <bread-crumb></bread-crumb>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script lang="ts" setup>
import mainSide from './components/mainSide.vue'
import mainHead from './components/mainHead.vue'
import wapSide from './components/wapSide.vue'
import breadCrumb from '@/components/breadCrumb.vue'
import { convertToTree, getFirstLeaf } from '@/libs/utils'
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import * as api from '@/api'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const nav1 = [
  {
    title: 'dashboard展板',
    ico: 'HomeFilled',
    key: '/main/dashboard',
  },
  {
    title: '用户中心',
    ico: 'Avatar',
    key: '/main/admin/user',
    children: [
      {
        title: '人员管理',
        key: '/main/admin/user/index',
        children: [],
      },
      { title: '角色管理', key: '/main/admin/role/list' },
      {
        title: '部门人员管理',
        key: '/main/admin/user/list',
        children: [],
      },
    ],
  },
  {
    title: '接入管理',
    ico: 'Histogram',
    key: '/main/admin/app',
    children: [],
  },
  { title: '部门管理', ico: 'SuitcaseLine', key: '/main/depart' },
]

const isCollapse: Ref<boolean> = ref(true)
const menuList = ref([])

const changeMenu = (index: number) => {
  //   console.log(index, "父组件========")
  //   if(index===0)
  //   {menuList.value=nav1}
  //   else
  //   {menuList.value=nav2}
}
const changeSwitch = () => {
  isCollapse.value = !isCollapse.value
}

const getUserMenuList = async () => {
  const result = await api.user.getUserMenuList()
  if (result.resultCode === 0 && result.returnCode === 0) {
    // console.log(convertToTree(result.data || [],''))
    let myNav: any[] = []
    let hasPath: boolean = false
    const myResult: any = result.data as any
    myResult.map((item: any) => {
      // console.log(item, '===')
      if (item.about !== 'fjsjlc') {
        if (item.url === route.path) {
          hasPath = true
        }
        myNav.push({
          title: item.name,
          ico: item.ico,
          key: item.url,
          parentId: item.parentId,
          id: item.id,
        })
      }
    })
    // console.log(myNav)
    menuList.value = convertToTree(myNav, '')
    // console.log( menuList.value)
    if (!hasPath) {
      const myUrl = getFirstLeaf(menuList.value).key
      router.push({ path: myUrl })
    }
  }
}

onMounted(() => {
  getUserMenuList()
})
</script>

<style lang="less">
.wapMenuContainer {
  display: none;
}

.el-main {
  height: calc(100vh - 110px);
  margin: 10px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
}
.headerSubTitle {
  color: #709ecb;
  font-size: 12px;
  line-height: 30px;
  text-indent: 20px;
  background-color: #022b53;
}
.el-header {
  color: #fff;
  position: relative;
  background-color: var(--themeColor);

  & > div {
    display: none;
    // color:#709ecb;
    // font-size:12px;
    // line-height:20px;
    // text-indent:20px;
    // background-color:#022b53;
  }

  & > ul {
    position: absolute;
    left: 260px;
    top: 8px;
    width: 620px;
    display: inline-block;

    & > li {
      line-height: 40px;
      font-size: 16px;
      margin-left: 30px;
      margin-right: 30px;
      display: inline-block;
      text-align: center;
      cursor: pointer;
      color: #fff;

      & > i {
        margin-right: 10px;
        top: 2px;
      }
    }

    & > li:hover,
    .active {
      color: #fff;
      // background-color: #e9eaed;
      border-bottom: 2px solid #fff;
    }
  }

  & > b {
    display: inline-block;
    position: relative;
    & > img {
      width: 28px;
      margin-top: -2px;
    }
    & > span {
      position: absolute;
      right: -30px;
      top: -10px;
      color: #fff;
      font-size: 12px;
      color: yellow;
      font-weight: normal;
    }
    line-height: 30px;
    font-size: 18px;
    position: absolute;
    top: 15px;
    left: 10px;
  }

  & > i {
    margin-left: 240px;
    cursor: pointer;
    font-size: 24px;
    color: #fff;
    margin-top: 18px;
  }

  & > span {
    color: #606266;

    & > .item {
      margin-right: 20px;
      font-size: 26px;
      color: #fff;
      cursor: pointer;
    }

    float: right;
    margin-top: 14px;

    .el-dropdown-link {
      cursor: pointer;
      color: #fff;

      & > img {
        width: 30px;
        height: 30px;
        border-radius: 15px;
        margin-right: 4px;
      }
    }
  }
}

.el-aside {
  & > ul {
    height: calc(100vh - 90px);
  }
}

@media (max-width: 768px) {
  .el-header {
    position: relative;
    height: 0;
    height: 40px;
    background-color: var(--themeColor);
    border-bottom: 1px solid #e7e6e6;

    & > span {
      display: none;
    }

    & > i {
      display: none;
    }

    & > b {
      font-size: 14px;
      position: absolute;
      top: 0px;
      left: 8px;
    }

    & > ul {
      display: none;
    }

    & > div {
      display: inline-block;
      top: 10px;
      right: 20px;
      position: absolute;
    }
  }

  .el-aside {
    display: none;
  }

  .el-container {
    line-height: 40px;
    display: block;

    .wapMenuContainer {
      display: block;
      text-indent: 10px;
      color: #606266;
      font-size: 16px;

      & > span {
        & > i {
          top: 2px;
        }
      }

      border-bottom: 1px solid #e7e6e6;

      & > div {
        z-index: 666;
        top: 0;
        position: fixed;
        right: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);

        & > div {
          padding: 20px;
          background-color: #fff;
          width: 80%;
          height: 100%;

          & > h1 {
            cursor: pointer;
          }

          & > ul {
            margin-left: 20px;
            margin-bottom: 10px;

            & > li {
              cursor: pointer;
            }
          }
        }
      }
    }
  }

  .el-main {
    height: calc(100vh - 82px);
    padding: 10px;
  }

  .btnToolsContainer {
    .el-dropdown {
      margin-top: 5px;
    }
  }

  .searchContainer {
    i {
      display: none;
    }
  }
}
</style>
