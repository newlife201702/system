import request from "@/libs/utils.requset";

// interface ReqStatus {
//   id: number
//   navStatus?: string
// }

/* 
获取部门信息
参数{id:""} 
*/
interface ReqGetInfo {
  id: string
}

interface ReqFormData{
  parentId: string
  name:string
  departmentCode: string
  typeCode: string
  about: string
  memo: string,
  departmentType:string
  departmentId:string
  levelCode:string
  levelName:string
}

interface ReqPostDepartData{
  model:ReqFormData
  id?:string
}

/* 
新增部门
@params

 */
export const add = (data: ReqFormData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/department/add.do",
    method: "post",
    data: { data: data }
  });
}


// 根据id查询部门信息 
export const getInfo = (data: ReqGetInfo): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/department/getById.do",
    method: "post",
    data: { data: data }
  });
}


// 根据id删除部门信息
export const del = (data: { id: string }): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/department/delete.do",
    method: "post",
    data: { data: data }
  });
}

// 获取指定页码内的数据
export const listTree = (data: { parentId: string }): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/department/list.do",
    method: "post",
    data: { data: {...data,"typeCode": ""} }
  });
}

// 根据id修改部门
export const update = (data:ReqPostDepartData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/department/update.do",
    method: "post",
    data: { data: data }
  });
}

// 修改部门的状态
export const updateStatus = (data: { id: string,model:{statusCode:string} }): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/department/updateDepartmentStatus.do",
    method: "post",
    data: { data: data }
  });
}

// 修改部门父级标识
export const updateParentId = (data: { id: number }): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/department/updateParentId.do",
    method: "post",
    data: { data: data }
  });
}

// 修改部门的排序号
export const updateSortNo = (data: any[]): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/department/exchangeSort.do",
    method: "post",
    data: { data: data }
  });
}

// 按上级部门查找部门
export const list = (data: { parentId: string }): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/department/findByPid.do",
    method: "post",
    data: { data: {...data,"withLeaf": true,departmentType:'DEPARTMENT_TYPE_CODE_STANDARD'} }
  });
}





