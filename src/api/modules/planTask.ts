import request from "@/libs/utils.requset";



  // 新增一个任务
export const add = (data:ReqPlanManageAddFormData): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/add.do",
      method: "post",
      data: {data:data}
    });
  }



export const addTask = (data:planFormAdd): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/batchAdd.do",
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


export const getTemplateProjectList = (data:{alias:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/getTempProjList.do",
      method: "post",
      data: {data:data}
    });
}

export const taskExecute = (data:{taskId:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/taskExecute.do",
      method: "post",
      data: {data:data}
    });
}

export const getModelData  = (data:{taskId:string,projectId:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/getModelTreeData.do",
      method: "post",
      data: {data:data}
    });
}

  export const getList = (data:ReqPlanSearchData): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/taskPlanPage.do",
      method: "post",
      data: data
    });
  }

  export const totalTaskNum = (data:ReqPlanSearchData): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/totalTaskNum.do",
      method: "post",
      data:data
    });
  }


export const commitTask = (data:{id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/commitTask.do",
      method: "post",
      data:{data:data}
    });
  }

export const getToolList = (data:{isSys:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/getToolList.do",
      method: "post",
      data:{data:data}
    });
  }


  export const gengerTaskRelation  = (data:{id:string}):Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/gengerTaskRelation.do",
      method: "post",
      data:{data:data}
    });
  }

  export const publishAllTask = (data:{id:string}):Res<Record<string, unknown>> => {
    return request({
      url: "/plan/web/task/publishAllTask.do",
      method: "post",
      data:{data:data}
    });
  }







