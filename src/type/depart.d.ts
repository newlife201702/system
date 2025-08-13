interface ReqDepartPhysical{
    createTime: string
    createUserId: string
    createUserName: string
    dataDeleted: number
    dataTimestamp: string
    updateTime: string
    updateUserId: string
    updateUserName: string

}
interface ReqDepartFormData{
  about: string
  code: string
  departmentCode: string
  departmentId: string
  departmentType: string
  levelCode: string
  levelName: string
  memo: string
  name: string
  openId: string
  parentId: string
  sortNo: string
  statusCode: string
  statusName: string
  typeCode: string
  physical?: ReqDepartPhysical
  id?:string
  isSystem?:string
}

interface ReqDepartRowData{
  about: string
  code: string
  departmentCode: string
  departmentId: string
  departmentType: string
  levelCode: string
  levelName: string
  memo: string
  name: string
  openId: string
  parentId: string
  sortNo: string
  statusCode: string
  statusName: string
  typeCode: string
  physical?: ReqDepartPhysical
  id?:string
  isSystem?:string
}

export {ReqDepartFormData,ReqDepartPhysical,ReqDepartRowData}
