interface ReqResourceFormData {
  sortField: string
  sortType: string
  levelParentId: string
  idParam?: {id:string}
}


interface ReqResourceTreeSearchData {
  parentIdParam: {
    parentId: string,
    withLeaf: boolean
  } 
  idParam?: {id:string}
}


interface resourceItem {
  id: string
  openId: string
  name: string
  code: string
  about: string
  physical: any
}


