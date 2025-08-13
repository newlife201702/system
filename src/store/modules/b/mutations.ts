const mutations = {
  // ADDCRUMBSARR: (state:any,view: any)=> {
  //     state.crumbsArr.push(view)
  // },
  // DELCRUMBSARR: (state: any, view: any)=> {
  //     let index = state.crumbsArr.indexOf(view)
  //     if (index > -1) {
  //         state.crumbsArr.splice(index, 1)
  //     }
  // }
  increment (state:any) {
    state.indexCount=state.indexCount+4
  },
  descment (state:any) {
    state.indexCount=state.indexCount-7
  }
}

export default mutations