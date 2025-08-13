import request from "@/libs/utils.requset";


// 按上级部门查找资源
export const treeList = (data:ReqResourceTreeSearchData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/resource/findByPid.do",
    method: "post",
    data: {data:data}
  });
}


// 获取资源列表
export const list = (data:ReqResourceFormData): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/resource/listWithLeaf.do",
    method: "post",
    data: {data:data}
  });
}
