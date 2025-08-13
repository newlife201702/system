import request from "@/libs/utils.requset";

/* 
获取部门信息
参数{id:""} 
*/

// 获取指定页码内的数据
export const list = (data:{businessCode:string}): Res<Record<string, unknown>> => {
  return request({
    url: "/admin/web/user/list.do",
    method: "post",
    data: { data: data }
  });
}



