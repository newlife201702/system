import request from "@/libs/utils.requset";

// 依据人员标识统计工作包数量
export const userPackageTotal = (data:{id:string}): Res<Record<string, unknown>> => {
  return request({
    url: "/pm/web/project/userPackageTotal.do",
    method: "post",
    data: {data:data}
  });
}


// 获取人员代办工作包列表的数据
export const userPendingList = (data:ReqPendingSearchData): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/project/pendingList.do",
      method: "post",
      data: {data:data}
    });
  }



  // 新增一个项目
export const add = (data:ReqMyPackageAddFormData): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/project/addProject.do",
      method: "post",
      data: {data:data}
    });
  }

    // 修改项目
export const edit = (data:{model:ReqMyPackageAddFormData,id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/project/update.do",
      method: "post",
      data: {data:data}
    });
  }

  // 项目查询分页
  export const getList = (data:ReqMyPackageAddFormData): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/project/page.do",
      method: "post",
      data: data
    });
  }




// 依据工作包Id获取指定数据
export const getInfo = (data:{id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/project/getById.do",
      method: "post",
      data: {data:data}
    });
  }
  
// 删除工作包
export const del = (data: { id: string }): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/project/delete.do",
      method: "post",
      data: {data:data}
    });
  }

// 修改工作包状态
export const updateStatus = (data: {eventCode: string,projectId: string }): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/project/event.do",
      method: "post",
      data: {data:data}
    });
  }

  // 增加工作包代办
export const addProjectUserPending = (data: {id: string }): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/project/addProjectUserPending.do",
      method: "post",
      data: {data:data}
    });
  }

  // 获取工作包参与部门列表
  export const getParticiDepartment = (data: {id: string }): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/project/getParticiDepartment.do",
      method: "post",
      data: {data:data}
    });
  }

  export const finallyProject = (data: {id: string }): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/project/finallyProject.do",
      method: "post",
      data: {data:data}
    });
  }



