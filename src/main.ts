import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import mitt from 'mitt'

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import './less/main.less'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import { h } from 'vue';
import { getElementLabelLine } from 'element-tree-line';
// css
import 'element-tree-line/dist/style.css';

import VueGridLayout  from  'vue-grid-layout'

const Mit = mitt()

//TypeScript注册
// 由于必须要拓展ComponentCustomProperties类型才能获得类型提示
declare module 'vue' {
  export interface ComponentCustomProperties {
    $Bus: typeof Mit
  }
}
console.log("环境变量",process.env)
//vue3挂载全局API
const app = createApp(App)
//导入element-ui图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.config.globalProperties.$Bus = Mit
app.use(ElementPlus,{ size: 'default', zIndex: 3000, locale: zhCn })
const ElementLabelLine:any = getElementLabelLine(h);
app.component(ElementLabelLine?.name, ElementLabelLine);


//自定义指定
app.directive('focus',{
  mounted(el){
   el.focus()
  }
 })

app.use(store).use(router).mount('#app')
app.use(VueGridLayout)