import request from "@/libs/utils.requset";


interface ReqPostRoleData{
  model:ReqRoleFormData
  id?:string
}

// 新增一个角色
export const add = (data: ReqRoleFormData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/role/add.do",
    method: "post",
    data: { data: data }
  });
}

// 删除角色
export const del = (data: { id: string }): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/role/delete.do",
    method: "post",
    data: {data:data}
  });
}


// 根据id获取详情
export const getInfo = (data:{id:string}): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/role/getById.do",
    method: "post",
    data: {data:data}
  });
}


// 获取制定已满内的数据
export const list = (data:ReqRoleSearchData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/role/list.do",
    method: "post",
    data: {data:data}
  });
}

//获取分页数据
export const getList = (data:any): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/role/page.do",
    method: "post",
    data
  });
}



// 角色授权
export const setRole = (data:ReqRoleRightsData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/role/roleGrantProcess.do",
    method: "post",
    data: {data:data}
  });
}

// 修改角色
export const update = (data:ReqPostRoleData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/role/update.do",
    method: "post",
    data: { data: data }
  });
}

// 修改角色的状态
export const updateStatus = (code:string): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/role/updateDepartmentStatus.do",
    method: "post",
    data: {data:code}
  });
}

// 批量关联角色用户
export const batchAdd = (data:{roleList:any[],userList:any[]}): Res<Record<string, unknown>> => {
    return request({
      url: "/admin/web/userRoleRela/batchAdd.do",
      method: "post",
      data: {data:data}
    });
  }







