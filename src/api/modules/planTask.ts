import request from "@/libs/utils.requset";



  // 新增一个任务
export const add = (data:ReqPlanManageAddFormData): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/add.do",
      method: "post",
      data: {data:data}
    });
  }

    // 修改任务
export const update = (data:{model:ReqPlanManageAddFormData,id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/update.do",
      method: "post",
      data: {data:data}
    });
  }


// 依据任务Id获取任务对象
export const getInfo = (data:{id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/getById.do",
      method: "post",
      data: {data:data}
    });
}
  
// 删除任务
export const del = (data: { id: string }): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/delete.do",
      method: "post",
      data: {data:data}
    });
  }

export const getInputData = (data:{id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/getTaskInputData.do",
      method: "post",
      data: {data:data}
    });
}


export const getOutputData = (data:{id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/getTaskOutputData.do",
      method: "post",
      data: {data:data}
    });
}
