import { createStore } from 'vuex'
import state from './modules/state'
import mutations from './modules/mutations'
import actions from './modules/actions'
import getters from './modules/getters'
import index from './modules/index'
import b from './modules/b'
// import state from './modules/state'
export default createStore({
  state,
  mutations,
  getters,
  actions,
  modules:{
    index,
     b// 带了命名空间了 和其他的同名就没有影响了
  }
  // state: {
  // },
  // mutations: {
  // },
  // actions: {
  // },
  // modules: {
  // }
})
