const mutations = {
   increment (state:any) {
    state.indexCount=state.indexCount+5
  },
  descment (state:any) {
    state.indexCount=state.indexCount-3
  },
  // object类型又Record<string, unknown>代替
  setBreadList (state:any, amount:Record<string, unknown>) {
    state.breadList = amount
  },
  setNavList: function (state:any, payload:any) {
    let index = -1
    for (let i:number = 0; i < state.navList.length; i++) {
      state.navList[i].currentActive = false
      if (state.navList[i].url === payload.data.url) {
        index = i
      }
    }

    if (index === -1) { state.navList.push(payload.data) } else { state.navList[index].currentActive = true }
  },
  removeNav: function (state:any, index:number) {
    for (let i:number = 0; i < state.navList.length; i++) {
      state.navList[i].currentActive = false
    }
    // index导航的索引，起始点为0 state.navList.length为导航个数，起始值为1 统一就需要length减一
    if (state.navList.length - 1 > index) {
      window.location.href = '#' + state.navList[index + 1].url
      state.navList[index + 1].currentActive = true
    } else {
      // console.log(index)
      window.location.href = '#' + state.navList[index - 1].url
      state.navList[index - 1].currentActive = true
    }
    state.navList.splice(index, 1)
  },
  cleanNav: function (state:any) {
    // console.log("清空nav")
    state.navList = []
  }
}

export default mutations
