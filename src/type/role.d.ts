interface ReqRoleFormData{
  businessTypeCode: string
  code: string
  createUserId: string
  createUserName: string
  dataTimestamp: string
  exclusive: string
  memo: string
  name: string
  openId: string
  statusCode: string
  statusName: string
  typeCode: string
  url: string 
  isSystem?:string
  id?: string
}

interface ReqRoleSearchData{
    businessTypeCode: string
    code: string
    exclusive: string
    name: string
    openId: string
    sortField: string
    sortType: string
    statusCode: string
    typeCode: string,
    isSystem:string,
    id?: string
}


interface ResRoleRowData{
  businessTypeCode: string
  code: string
  exclusive: string
  id: string
  memo: string
  name:string
  openId: string
  physical: null | string
  statusCode: string
  statusName: string
  typeCode: string
  url: string
}

interface ReqRoleRightsData{
  addResourceIds: string[]
  removeResourceIds: string[]
  targetId: string
  targetTableName: string
}

