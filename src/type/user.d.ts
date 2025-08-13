interface ReqUserFormData{
  birth:string
  code:string
  dataSecurityLevelCode:string
  dataSecurityLevelName:string
  email:string
  genderCode:string
  genderName:string
  lockStatus:string
  loginName:string
  memo:string
  name:string
  openId:string
  password:string
  phone:string
  postLevelCode:string
  postLevelName:string
  securityLevelCode:string
  statusCode?:string
  statusName?:string
  isSystem?:string
  id?: string
}

interface ReqUserRowData{
  birth: string
  code: string
  dataSecurityLevelCode: string
  dataSecurityLevelName: string
  email: string
  genderCode: string
  genderName: string
  id: string
  lockStatus: string
  loginName: string
  memo: string
  name: string
  openId: string
  password: string
  phone: string
  postLevelCode: string
  postLevelName: string
  securityLevelCode: string
  statusCode: string
  statusName: string 
  isSystem?:string
  physical?:ResUserPhysical
}

interface ResUserPhysical{
  createTime: string
  createUserId: string
  createUserName: string
  dataDeleted: string
  dataTimestamp: string
  updateTime: string
  updateUserId: string
  updateUserName: string
}
interface ReqUserRolesData{
  roleList: ReqUserRolesArrData[]
  user:{id:string}
}

interface ReqUserRolesArrData{
  id:string
  exclusive:string
}

interface ReqUserSearchFormData{
  code: string
  dataSecurityLevelCode: string
  departmentId: string
  email: string
  genderCode: string
  id: string
  isUnlock: string
  loginName: string
  name: string
  openId: string
  phone: string
  postLevelCode: string
  roleId: string
  securityLevelCode: string
  sortField: string
  sortType: string
  statusCode: string
  scope:string
  isSystem?:string
}

interface ReqAddUserDepartmentFormData
{ 
  departmentId: string,
  userList:ReqUserRowData[]
}
