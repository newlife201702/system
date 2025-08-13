import request from "@/libs/utils.requset";


// 新增一个接入应用
export const add = (data:ReqAppFormData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/accessapp/add.do",
    method: "post",
    data: {data:data}
  });
}

// 删除接入应用
export const del = (data:{id:string}): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/accessapp/delete.do",
    method: "post",
    data: {data:data}
  });
}

// 依据接入应用Id获取接入应用对象
export const getInfo = (data:{id:string}): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/accessapp/getById.do",
    method: "post",
    data: {data:data}
  });
}

// 获取指定页码内的数据
export const list = (data:ReqResourceFormData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/accessapp/list.do",
    method: "post",
    data: {data:data}
  });
}

// 获取指定页码内的数据
export const getList = (data:ReqAppSearchData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/accessapp/page.do",
    method: "post",
    data: data
  });
}

// 角色授权
export const setRole = (data:ReqAppRightsData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/accessapp/roleGrantProcess.do",
    method: "post",
    data: {data:data}
  });
}
// 修改接入应用
export const update = (data:ReqAppFormData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/accessapp/update.do",
    method: "post",
    data: {data:data}
  });
}


// 修改接入应用的状态
export const updateStatus = (data:{id:string,model:{statusCode:string}}): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/accessapp/updateAccessAppStatus.do",
    method: "post",
    data: {data:data}
  });
}


