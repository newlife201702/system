<template>
    <el-header>

        <b>
            <img :src="'./images/logo.svg'" alt="" />
            研发过程管理系统
            <span>v1.0</span>
        </b>
        <el-icon @click="emit('changeSwitch')">
            <Fold v-if="!props.isCollapse" />
            <Expand v-if="props.isCollapse" />
        </el-icon>
        <ul>
            <li :class="index === currentActive ? 'active' : ''" v-for="(item, index) in menuList" :key="'menuList' + index"
                @click="goUrl(index, item)">
                <!-- <el-icon>
            <component :is="item.icoUrl" /> </el-icon> -->
                {{ item.title }}
            </li>
        </ul>
        <span>
            <el-badge class="item">
                <el-dropdown style="margin-right: 10px; margin-top: 5px" @command="handleCommand">
                    <span class="el-dropdown-link">
                        主题
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="a"><span style="
                      display: inline-block;
                      width: 16px;
                      height: 16px;
                      background-color: #1f76cb;
                    "></span></el-dropdown-item>
                            <el-dropdown-item command="b"><span style="
                      display: inline-block;
                      width: 16px;
                      height: 16px;
                      background-color: #f58428;
                    "></span></el-dropdown-item>
                            <el-dropdown-item command="c"><span style="
                      display: inline-block;
                      width: 16px;
                      height: 16px;
                      background-color: #000;
                    "></span></el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>

                <el-icon @click="screenfullClick">
                    <component :is="isFullscreen ? 'Rank' : 'FullScreen'" />
                </el-icon>

                <!-- <el-icon @click="goSetting" style="margin-left: 15px"
            ><Setting
          /></el-icon> -->
            </el-badge>

            <!-- <el-popover placement="bottom" :width="400" trigger="click">
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
            </el-popover> -->

            <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                    <img :src="'./img/header/1.png'" alt="" /> {{ loginName }}({{
                        trueName
                    }})<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item icon="User" command="a">个人中心</el-dropdown-item>
                        <el-dropdown-item icon="EditPen" command="b">修改密码</el-dropdown-item>
                        <el-dropdown-item icon="SwitchButton" command="b">退出323</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>

    </el-header>
    <dialog-setting ref="childRef" />
</template>
  
<script lang="ts" setup>
import screenfull from 'screenfull'
import { defineProps, ref, reactive, onMounted, onUnmounted } from 'vue'
import dialogSetting from './dialogSetting.vue'
import { getCookie } from '@/libs/utils'
import { useRouter } from 'vue-router'
const router = useRouter();

const childRef = ref() //注册响应数据
const props = defineProps({ isCollapse: Boolean })
const currentActive = ref(0)
const isFullscreen = ref(false)
const loginName = ref<string>('')
const trueName = ref<string>('')
// const menuList = reactive([
//     { title: "身份管理", icoUrl: "Monitor" },
// ])
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
const goSetting = () => {
    childRef.value.openDialog()
}
// const changeSwitch=defineEmits<{(event:"changeSwitch"):void}>()
const handleCommand = (command: string) => {
    if (command === 'a') {
        document
            .getElementsByTagName('body')[0]
            .style.setProperty('--themeColor', '#1f76cb')
    }
    if (command === 'b') {
        document
            .getElementsByTagName('body')[0]
            .style.setProperty('--themeColor', '#F58428')
    }
    if (command === 'c') {
        document
            .getElementsByTagName('body')[0]
            .style.setProperty('--themeColor', '#000')
    }
}
const emit = defineEmits(['changeSwitch', 'changeMenu'])
// const emit=defineEmits<{(event:"changeSwitch"):void}>()
const goUrl = (index: number, item: any) => {
    currentActive.value = index
    router.push({ path: item.path })
    // console.log(index)
    //   emit('changeMenu', index)

}

onMounted(() => {
    const userInfo = JSON.parse(getCookie('userInfo') || '{}')
  
    loginName.value = userInfo.loginName
    trueName.value = userInfo.name
    localStorage.setItem('currentUserName', userInfo.loginName)
    window.addEventListener('resize', currentScreen)
})

onUnmounted(() => {
    window.removeEventListener('resize', currentScreen)
})

// 浏览器改变触发
const currentScreen = () => {
    if (screenfull.isFullscreen !== isFullscreen.value)
        isFullscreen.value = screenfull.isFullscreen
}
//  点击切换全屏
const screenfullClick = () => {
    if (screenfull.isEnabled) {
        screenfull.toggle()
    }
}
</script>
  
<style lang="less">
.el-header {
    .el-dropdown-link {
        outline: none;
    }
}
</style>
  