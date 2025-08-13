import request from "@/libs/utils.requset";

  // 定义一个功能
export const funcInsert = (data:FuncData): Res<Record<string, unknown>> => {
    return request({
      url: "/config/web/func/funcInsert.do",
      method: "post",
      data: {data:data}
    });
  }

export const funcEdit = (data:{model:FuncData,id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/config/web/func/funcUpdate.do",
      method: "post",
      data: {data:data}
    });
  }


export const addUserRelaFunc = (data:UserRelaFuncData): Res<Record<string, unknown>> => {
    return request({
      url: "/config/web/func/addUserRelaFunc.do",
      method: "post",
      data: {data:data}
    });
  }  


  export const getFuncInfo = (data:{id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/config/web/func/getById.do",
      method: "post",
      data: {data:data}
    });
  }

  export const getList = (data:FuncData): Res<Record<string, unknown>> => {
    return request({
      url: "/admin/web/resource/page.do",
      method: "post",
      data: {data:data}
    });
  }

export const getResourceList  = (data:{businessCode:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/admin/web/resource/list.do",
      method: "post",
      data: {data:data}
    });
  }


  export const getRelaList = (data:FuncData): Res<Record<string, unknown>> => {
    return request({
      url: "/config/web/func/pageUserRelaResource.do",
      method: "post",
      data: data
    });
  }

export const getConfigHtml = (data:{id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/config/web/func/generFuncHtml.do",
      method: "post",
      data: {data:data}
    });
  }

// 删除功能
export const deleteUserRelaResource = (data: { id: string }): Res<Record<string, unknown>> => {
    return request({
      url: "/config/web/func/deleteUserRelaResource.do",
      method: "post",
      data: {data:data}
    });
  }


  export const importResourceColumn = (data:any): Res<Record<string, unknown>> => {
    return request({
      url: "/config/web/func/importResourceColumn.do",
      method: "post",
      data:data
    });
  }