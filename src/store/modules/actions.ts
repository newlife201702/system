const actions = {
  // handlerNavList({ commit }) {
  //   setTimeout(() => {
  //     const navList = ['a', 'b', 'c']
  //     commit('modifyNavList', navList)
  //   }, 600)
  // }
  increment (context:any) {
    context.commit('increment')
  },
  descment (context:any) {
    context.commit('descment')
  }
}
export default actions