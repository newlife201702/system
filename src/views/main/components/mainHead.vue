<template>
  <el-header>
    <b>
      <img :src="'./images/logo.png'" alt=""><span class="logo-divider"></span> 体系与系统整机协同服务 </b>
    <ul>
      <li :class="index === currentActive ? 'active' : ''" v-for="(item, index) in menuList" :key="'menuList' + index"
        @click="goUrl(item)"><el-icon>
          <component :is="item.icoUrl" />
        </el-icon>{{ item.title }}</li>

    </ul>
    <span>
      <el-badge class="item">
        <el-dropdown
          style="margin-right: 10px; margin-top: 5px"
          @command="handleCommand"
        >
          <span class="el-dropdown-link">
            主题
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="a"
                ><span
                  style="
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background-color: #1f76cb;
                  "
                ></span
              ></el-dropdown-item>
              <el-dropdown-item command="b"
                ><span
                  style="
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background-color: #f58428;
                  "
                ></span
              ></el-dropdown-item>
              <el-dropdown-item command="c"
                ><span
                  style="
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    background-color: #000;
                  "
                ></span
              ></el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <el-icon @click="screenfullClick">
          <component :is="isFullscreen ? 'Rank' : 'FullScreen'" />
        </el-icon>

        <el-icon @click="goSetting" style="margin-left: 15px"
          ><Setting
        /></el-icon>
      </el-badge>

      <el-popover placement="bottom" :width="400" trigger="click">
        <template #reference>
          <el-badge :value="4" class="item">
            <el-icon>
              <BellFilled />
            </el-icon>
          </el-badge>
        </template>
        <el-table :data="gridData" :show-header="false">
          <el-table-column property="name" label="标题">
            <template #default="scope">
              {{ scope.row.name }}
              <span style="font-size: 12px; color: rgb(183 183 183)">{{
                scope.row.date
              }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-popover>

      <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img :src="'./img/header/1.png'" alt="" /> {{ loginName }}({{
            trueName
          }})<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item icon="User" command="a"
              >个人中心</el-dropdown-item
            >
            <el-dropdown-item icon="EditPen" command="b"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item icon="SwitchButton" command="b"
              @click="logout">退出系统</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>

    <div>
      <el-dropdown trigger="click">
        <span style=" font-size: 22px;">
          <el-icon><Fold /></el-icon>
        
        </span>
        <template #dropdown>
          <el-dropdown-menu>

            <el-dropdown-item :icon="item.icoUrl" :command="index" v-for="(item, index) in menuList" :key="'menuList' + index">{{ item.title }}</el-dropdown-item>
            <el-dropdown-item icon="UserFilled" command="a"   >个人中心</el-dropdown-item>
            <el-dropdown-item icon="SwitchButton" command="c"   >退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>

      </el-dropdown>
    </div>
  </el-header>
  <dialog-setting  ref='childRef'/>

</template>

<script  lang="ts" setup>
import myscreenfull from 'screenfull'
import { defineProps, ref, reactive, onMounted, onUnmounted,defineEmits } from 'vue'
import { getCookie } from '@/libs/utils'
import dialogSetting from './dialogSetting.vue'
const props = defineProps({ isCollapse: Boolean })
const childRef = ref()  //注册响应数据  
const currentActive = ref(1)
const isFullscreen = ref<boolean>(false)
const loginName=ref<string>("")
const trueName=ref<string>("")
// const menuList = reactive<{title:string,icoUrl:string,link:string}[]>(
//   [
//     { title: "首页", icoUrl: "HomeFilled",link:"pm/#/main/dashboard" },
//     { title: "工作包管理", icoUrl: "Document",link:"pm/#/main/dashboard" },
//     { title: "任务执行", icoUrl: "HelpFilled",link:"" },
//     { title: "任务策划", icoUrl: "Monitor",link:"" },
//     // { title: "监控统计", icoUrl: "Setting",link:"" },
//   ]
// )
const gridData = [
  {
    date: '2016-05-02',
    name: '您的审核提交已经通过了',
    
  },
  {
    date: '2016-05-04',
    name: '向东已经发起了协同',
    
  },
  {
    date: '2016-05-01',
    name: '报销已经到账',
    
  },
  {
    date: '2016-05-03',
    name: '请假申请已经通过',
    
  },
]


const emit = defineEmits(["changeSwitch", "changeMenu"]);
const goUrl = (row: any) => {
    console.log(row.icoUrl)
//   currentActive.value = index
  // console.log(index)
//   emit('changeMenu', index)
}
const goSetting=()=>{
    childRef.value.openDialog()
}
const handleCommand = (command: string ) => {
 if(command==='a')
 {
    document.getElementsByTagName('body')[0].style.setProperty('--themeColor', '#1f76cb');
 }
 if(command==='b')
 {
    document.getElementsByTagName('body')[0].style.setProperty('--themeColor', '#F58428');
 }
 if(command==='c')
 {
    document.getElementsByTagName('body')[0].style.setProperty('--themeColor', '#000');
 }
}

onMounted(() => {
    const userInfo = JSON.parse(getCookie('userInfo') || '{}')
  loginName.value = userInfo.loginName
  trueName.value = userInfo.name
  window.addEventListener('resize', currentScreen)
})


onUnmounted(() => {
  window.removeEventListener('resize', currentScreen)
})

// 浏览器改变触发
const currentScreen = () => {
  if (myscreenfull.isFullscreen !== isFullscreen.value) isFullscreen.value = myscreenfull.isFullscreen
}
//  点击切换全屏
const screenfullClick = () => {
  if (myscreenfull.isEnabled) 
  {
    myscreenfull.toggle()
  }
}

const logout = () => {
  console.log('logout')
    goUrl('login')
}


</script>

<style lang="less" >
.el-header{
    .el-dropdown-link{
        outline:none;
        
}
    b{
        .logo-divider{
            display:inline-block;
            width:1px;
            height:24px;
            background: rgba(255,255,255,.6);
            margin: 0 12px;
            vertical-align: middle;
        }
        img{
            vertical-align: middle;
        }
}
}

</style>
