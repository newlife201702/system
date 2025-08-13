import request from "@/libs/utils.requset";
 // 新增一个项目目标与需求
 export const add = (data:ReqDesignRequireFormData): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/targetRequirement/add.do",
      method: "post",
      data: {data:data}
    });
  }

    // 修改项目目标与需求
export const update = (data:{model:ReqDesignRequireFormData,id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/targetRequirement/update.do",
      method: "post",
      data: {data:data}
    });
  }


  
// 删除项目目标与需求
export const del = (data: { id: string }): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/targetRequirement/delete.do",
      method: "post",
      data: {data:data}
    });
  }

  // 依据Id获取指定目标与需求
export const getInfo = (data:{id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/targetRequirement/getById.do",
      method: "post",
      data: {data:data}
    });
  }


// 获取指定页码内的数据
export const list = (data: { projectId: string}): Res<Record<string, unknown>> => {
    return request({
      url: "/pm/web/targetRequirement/list.do",
      method: "post",
      data: { data: data }
    });
  }
  