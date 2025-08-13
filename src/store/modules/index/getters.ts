const getters = {
  // crumbsArr: (state: any)=> state.crumbs.crumbsArr
  indexCount:(state: any)=> state.indexCount,
  getBreadList: (state: any) => {
    return state.breadList
  }
}
export default getters
