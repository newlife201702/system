<template>
    <el-container style="display: block;">
        <main-head :isCollapse="isCollapse" @changeSwitch="changeSwitch" @changeMenu="changeMenu"></main-head>
        <el-container style="background-color: #fffbfb;">
            <el-aside :width="!isCollapse ? '200px' : '66px'">
                <main-side :isCollapse="isCollapse" :menuList="menuList" @changeSwitch="changeSwitch"></main-side>
            </el-aside>
            <wap-side :menuList="menuList"></wap-side>
            
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
import { ref } from 'vue'
import type { Ref } from 'vue'
const nav1 = [
    {
        title: "门户", ico: "HomeFilled", key: "/main/dashboard",
        // children: [
        //     {  title:"门户配置",ico:"HomeFilled",key:"/main/mainconfig" },
        //     {  title:"门户设置",ico:"Historgram",key:"/main/mainset" },
        //     {  title:'态势',icon:"Historgram",key:"/main/taishi"}
        // ]
    },
    {
        title: "个人中心", ico: "Histogram", key: "/main/persondata",
    },
    {
        title: "项目", ico: "TrendCharts", key: "/main/project",
    },
    {
        title:"模板",ico:"HomeFilled",key:"/main/taskTemplate",
    },
    {
        title: "数据",ico: "HomeFilled", key: "/main/data",
    }
    ,
    {
        title: "配置",ico: "HomeFilled", key: "/main/user",
    },
    {
        title: "模型管理",ico: "HomeFilled", key: "/main/manage",
    },

]

const isCollapse: Ref<boolean> = ref(true)
const menuList = ref(nav1)


const changeMenu = (index: number) => {
    console.log(index, "父组件========")
    // if (index === 0) { menuList.value = nav1 }
    // else { menuList.value = nav2 }

}
const changeSwitch = () => {
    isCollapse.value = !isCollapse.value
}
</script>

<style lang="less">
.wapMenuContainer {
    display: none;
}

.el-main {
    height: calc(100vh - 80px);
    background-color: #fff;
    margin:10px;
    box-shadow: 0 0 12px rgba(0,0,0,.12);
}

.el-header {
    color: #fff;
    position: relative;
    background-color: var(--themeColor);

    &>div {
        display: none;
    }

    &>ul {
        position: absolute;
        left: 220px;
        top: 0px;
        width: 620px;
        display: inline-block;

        &>li {
            line-height: 60px;
            font-size: 14px;
            padding-left: 20px;
            padding-right: 20px;
            display: inline-block;
            text-align: center;
            cursor: pointer;
            color: #fff;
            margin-left: 1px;

            &>i {
                margin-right: 10px;
                top: 2px;
            }
        }

        &>li:hover,
        .active {
            color: #000;
            background-color: #e9eaed;
        }
    }

    &>b {
        display: inline-block;

        &>img {
            width: 28px;
            margin-top: -2px;
            margin-right: 24px;
        }

        line-height: 30px;
        font-size: 18px;
        position: absolute;
        top: 15px;
        left: 10px;
    }

    &>i {
        margin-left: 160px;
        cursor: pointer;
        font-size: 24px;
        color: #fff;
        margin-top: 18px;
    }

    &>span {
        color: #606266;

        &>.item {
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

            &>img {
                width: 30px;
                height: 30px;
                border-radius: 15px;
                margin-right: 4px;
            }
        }
    }
}

.el-aside {
    &>ul {
        height: calc(100vh - 60px);
    }
}

@media (max-width: 768px) {
    .el-header {
        position: relative;
        height: 0;
        height: 40px;
        background-color: var(--themeColor);
        border-bottom: 1px solid #e7e6e6;

        &>span {
            display: none;
        }

        &>i {
            display: none;
        }

        &>b {
            font-size: 14px;
            position: absolute;
            top: 0px;
            left: 8px;
        }

        &>ul {
            display: none;
        }

        &>div {
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

            &>span {
                &>i {
                    top: 2px;
                }
            }

            border-bottom: 1px solid #e7e6e6;

            &>div {
                z-index: 666;
                top: 0;
                position: fixed;
                right: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.3);

                &>div {
                    padding: 20px;
                    background-color: #fff;
                    width: 80%;
                    height: 100%;

                    &>h1 {
                        cursor: pointer;
                    }

                    &>ul {
                        margin-left: 20px;
                        margin-bottom: 10px;

                        &>li {
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
