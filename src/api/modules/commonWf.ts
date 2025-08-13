import request from "@/libs/utils.requset";

// 参与部门
export const getJoinDepartment = (data:ReqJoinDepartSearchData): Res<Record<string, unknown>> => {
    return request({
      url: "/wfcommon/web/departmentRela/listByBusinessId.do",
      method: "post",
      data: { data:data }
    });
  }
  
// 批量新增部门
export const batchAddDepartment = (data:ReqBatchAddFormData): Res<Record<string, unknown>> => {
    return request({
      url: "/wfcommon/web/departmentRela/batchAdd.do",
      method: "post",
      data: { data:data }
    });
  }
  
// 获取指定页码元数据内的数据
export const metaRelaList = (data:ReqMetaRelaSearchData): Res<Record<string, unknown>> => {
    return request({
      url: "/wfcommon/web/metaRela/findByPid.do",
      method: "post",
      data: { data:data }
    });
  }
  
// 添加元数据
export const metaAdd = (data:ReqMetaRelaFormData): Res<Record<string, unknown>> => {
    return request({
      url: "/wfcommon/web/metaRela/add.do",
      method: "post",
      data: { data:data }
    });
  }
  
// 修改元数据
export const metaUpdate = (data:{model:ReqMetaRelaFormData,id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/wfcommon/web/metaRela/update.do",
      method: "post",
      data: { data:data }
    });
  }
  
// 删除元数据
export const metaDel = (data:{id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/wfcommon/web/metaRela/delete.do",
      method: "post",
      data: { data:data }
    });
  }
  
