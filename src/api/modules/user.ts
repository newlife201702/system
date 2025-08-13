import request from "@/libs/utils.requset";


interface ReqPostUserData{
  model:ReqUserFormData
  id?:string
}

// 新增一个用户
export const add = (data: ReqUserFormData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/user/add.do",
    method: "post",
    data: { data: data }
  });
}

// 为用户分配部门
export const addUserDepartment = (data: ReqAddUserDepartmentFormData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/user/addUserDepartment.do",
    method: "post",
    data: {data:data}
  });
}

// 为用户分配角色
export const addUserRole = (data: ReqUserRolesData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/user/addUserRole.do",
    method: "post",
    data: {data:data}
  });
}

// 删除用户
export const del = (data: { id: string }): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/user/delete.do",
    method: "post",
    data: {data:data}
  });
}


// 依据用户Id获取用户对象
export const getInfo = (data:{id:string}): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/user/getById.do",
    method: "post",
    data: {data:data}
  });
}

// 用户详情
// 包含部门 角色信息
export const getUserInfo = (data:{id:string}): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/user/getUserInfo.do",
    method: "post",
    data: {data:data}
  });
}


// 获取制定已满内的数据
export const list = (data:ReqUserSearchFormData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/user/list.do",
    method: "post",
    data: {data:data}
  });
}

//获取分页数据
export const getList = (data:any): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/user/page.do",
    method: "post",
    data
  });
}


// 移除用户部门
export const removeUserDepartment = (data:{removeDepartmentId: string,removeDepartmentUserId:string[]}): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/user/removeDepartmentUser.do",
    method: "post",
    data: {data:data}
  });
}

// 修改用户
export const update = (data:ReqPostUserData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/user/update.do",
    method: "post",
    data: { data: data }
  });
}

// 修改用户的状态
export const updateStatus = (data:{id:string,model:{statusCode:string}}): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/user/updateUserStatus.do",
    method: "post",
    data: {data:data}
  });
}

// 用户解锁
export const unlock = (data:{id:string,model:{lockStatus:string}}): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/user/userUnlock.do",
    method: "post",
    data: {data:data}
  });
}

// 获取制定已满内的数据
export const departmentUserlist = (data:any): Res<Record<string, unknown>> => {
    return request({
      url: "/admin/web/userDepartmentRela/getByDepartmentIds.do",
      method: "post",
      data: {data:data}
    });
  }


  // 获取用户菜单列表
export const getUserMenuList = (): Res<Record<string, unknown>> => {
    return request({
      url: "/sa/web/user/userMenuList.do",
      method: "post",
      data: {}
    });
  }
  



