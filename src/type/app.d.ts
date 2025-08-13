//提交表单
interface ReqAppFormData{
  about: string
  appId: string
  appSecret: string
  contact: string
  name: string
  phone: string
  statusCode: string
  statusName: string
  id?: string
}
// 行记录数据
interface appRowItem{
  about: string
  appId: string
  appSecret: string
  contact: string
  id: string
  name: string
  phone: string
  statusCode: string
  statusName: string
  physical?: any
}
//查询条件
interface ReqAppSearchData{
  appId: string
  contact: string
  name: string
  phone: string
  sortField: string
  sortType: string
  statusCode: string
}

interface ReqAppRightsData{
  addResourceIds: string[]
  removeResourceIds: string[]
  targetId: string
  targetTableName: string
}

