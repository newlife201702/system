import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Blank from '@/components/blank.vue'
import store from '@/store'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: "/login"
  },
  {
    path: '/login',
    name: 'login',
    meta:{
      title:"EMA UI登录"
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/login/index.vue')
  },
  {
    path: '/login2',
    name: 'login2',
    meta:{
      title:"EMA UI登录"
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/login/index2.vue')
  },
  {
    path: '/x6',
    name: 'x6',
    meta:{
      title:"x6"
    },
    component: () => import(/* webpackChunkName: "login" */ '../views/main/x6//index.vue')
  },
  {
    path: '/main',
    name: 'main',
    component: () => import(/* webpackChunkName: "about" */ '../views/main/index.vue'),
    redirect: "/main/dashboard",
    meta:{
      title:"主页"
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboardIndex" */ '../views/main/dashboard/index.vue'),
        meta: {
          title: '门户',
          keepAlive: false
        },
      },
      {
        path: 'dashboard1',
        name: 'dashboard1',
        component: () => import(/* webpackChunkName: "dashboardIndex" */ '../views/main/dashboard/indexHis.vue'),
        meta: {
          title: '门户',
          keepAlive: false
        },
      }
      ,
      {
        path: 'project',
        name: 'project',
        component: () => import(/* webpackChunkName: "workPackageManagementlist" */ '../views/main/workPackageManagement/list.vue'),
        meta: {
          title: '项目',
          keepAlive: false
        },
      },
      {
        path: 'persondata',
        name: 'persondata',
        component: () => import(/* webpackChunkName: "personlist" */ '../views/main/person/index.vue'),
        meta: {
          title: '个人中心',
          keepAlive: false
        },
      },
       {
        path: 'data',
        name: 'data',
        component: () => import(/* webpackChunkName: "datatree" */ '../views/main/data/index.vue'),
        meta: {
          title: '数据',
          keepAlive: false
        },
      },
    {
        path: 'config',
        name: 'config',
        component: () => import(/* webpackChunkName: "datatree" */ '../views/main/model/index.vue'),
        meta: {
          title: '配置中心',
          keepAlive: false
        },
      },
    {
        path: 'mainconfig',
        name: 'mainconfig',
        component: () => import(/* webpackChunkName: "mainconfig" */ '../views/main/mainconfig/index.vue'),
        meta: {
          title: '功能定义',
          keepAlive: false
        },
      },
      {
        path: 'mainset',
        name: 'mainset',
        component: () => import(/* webpackChunkName: "mainset" */ '../views/main/mainconfig/indexset.vue'),
        meta: {
          title: '功能设置',
          keepAlive: false
        },
      },
      {
        path: 'mark',
        name: 'mark',
        component: () => import(/* webpackChunkName: "datatree" */ '../views/main/imgmark/index.vue'),
        meta: {
          title: 'add mark',
          keepAlive: false
        },
      },
       {
        path: 'taishi',
        name: 'taishi',
        component: () => import(/* webpackChunkName: "dashboardIndex" */ '../views/main/ts/index.vue'),
        meta: {
          title: '态势',
          keepAlive: false
        },
      },  
      {
        path: 'myWorkPackage',
        name: 'myWorkPackage',
        component: Blank,
        meta: {
          title: '体系任务',
          keepAlive: false,
        }, 
        redirect: "/main/myWorkPackage/list",
        children: [
            {
                path: 'list',
                name: 'listWorkPackageManagement',
                component: () => import(/* webpackChunkName: "workPackageManagementlist" */ '../views/main/workPackageManagement/list.vue'),
                meta: {
                  title: '我的项目',
                  keepAlive: false
                },
            },
            {
                path: 'list2',
                name: 'listWorkPackageManagement2',
                component: () => import(/* webpackChunkName: "workPackageManagementlist" */ '../views/main/workPackageManagement/projectList.vue'),
                meta: {
                  title: '我的项目',
                  keepAlive: false
                },
            },
            {
              path: 'add',
              name: 'addWorkPackageManagement',
              component: () => import(/* webpackChunkName: "workPackageManagementAdd" */ '../views/main/workPackageManagement/add.vue'),
              meta: {
                title: '创建',
                keepAlive: false
              },
            },
            {
              path: 'add2',
              name: 'addWorkPackageManagement2',
              component: () => import(/* webpackChunkName: "workPackageManagementAdd" */ '../views/main/workPackageManagement/createProject.vue'),
              meta: {
                title: '创建',
                keepAlive: false
              },
            },
            {
                path: 'edit',
                name: 'editWorkPackageManagement',
                component: () => import(/* webpackChunkName: "workPackageManagementEdit" */ '../views/main/workPackageManagement/add.vue'),
                meta: {
                  title: '编辑项目',
                  keepAlive: false
                },
              },
            {
                path: 'details',
                name: 'detailsWorkPackageManagement',
                component: () => import(/* webpackChunkName: "workPackageManagementDetails" */ '../views/main/workPackageManagement/details.vue'),
                meta: {
                  title: '项目详情',
                  keepAlive: false
                },
              },
              {
                path: 'addflow',
                name: 'addflow',
                component: () => import(/* webpackChunkName: "addflow" */ '../views/main/workPackageManagement/components/flow/flow.vue'),
                meta: {
                  title: '定义流程',
                  keepAlive: false
                },
              },
              {
                path: 'createTask/:projectId?',
                name: 'createTask',
                component: () => import(/* webpackChunkName: "createTask" */ '../views/main/workPackageManagement/components/flow/createTask.vue'),
                meta: {
                  title: '创建任务',
                  keepAlive: false
                },
                props: route => ({
                  projectId: route.params.projectId,
                  projectData: route.query.projectData ? JSON.parse(route.query.projectData as string) : null
                })
              },
              {
                 path: 'demo1',
                name: 'demo1',
                component: () => import(/* webpackChunkName: "demo1" */ '../views/demo/demo1.vue'),
                meta: {
                  title: 'demo1',
                  keepAlive: false
                }, 
              }
        ]
      }
    ]
  }, 
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '../components/404.vue'),
    meta:{
      title:"页面走失了"
    }
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/404"
  }
 
 
 
 
 

]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL), //createWebHistory
  history:createWebHashHistory(),
  routes
})

// 全局前置守卫，这里可以加入用户登录判断
// router.beforeEach((to, from, next) => {
//   // 继续前进 next()
//   // 返回 false 以取消导航
//   next()
// })

// 全局后置钩子，这里可以加入改变页面标题等操作
router.afterEach((to, from) => {
  store.commit('setBreadList', to.matched)
  const webTitle = to.meta.title
  if (webTitle) {
      window.document.title = String(webTitle)
  }
})
export default router
