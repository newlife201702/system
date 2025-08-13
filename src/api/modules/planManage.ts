import request from "@/libs/utils.requset";



  // 新增任务
export const add = (data:ReqPlanManageAddFormData): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/batchAdd.do",
      method: "post",
      data: {data:data}
    });
  }

    // 修改工作包
export const update = (data:{model:ReqPlanManageAddFormData,id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/taskPackage/update.do",
      method: "post",
      data: {data:data}
    });
  }

  // 工作包查询分页
  export const getList = (data:ReqPlanSearchData): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/taskPackage/page.do",
      method: "post",
      data: data
    });
  }




// 依据工作包Id获取指定数据
export const getInfo = (data:{id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/taskPackage/getById.do",
      method: "post",
      data: {data:data}
    });
  }
  
//获取任务详情数据  
export const getTaskById = (data:{id:string}): Res<Record<string, unknown>> =>{
   return request({
        url: "/plan/web/task/getTaskById.do",
        method: "post",
        data: {data:data}
    });
}



// 删除工作包
export const del = (data: { id: string }): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/taskPackage/delete.do",
      method: "post",
      data: {data:data}
    });
  }

  // 按上级任务查找任务
export const findByPid = (data: { parentId: string }): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/taskPackage/findAllByPid.do",
      method: "post",
      data: {data:data}
    });
  }

export const getTaskInputList = (data:any): Res<Record<string, unknown>> => {
  return request({
      url: "/plan/web/task/getTaskInputData.do",
      method: "post",
      data: {data:{id:data}}
    }
  )
}

export const getTaskOutputList = (data:any): Res<Record<string, unknown>> => {
  return request({
      url: "/plan/web/task/getTaskOutputData.do",
      method: "post",
      data: {data:{id:data}}
    }
  )
}






  