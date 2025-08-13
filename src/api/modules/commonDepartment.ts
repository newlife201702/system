import request from "@/libs/utils.requset";

/* 
获取部门信息
参数{id:""} 
*/
interface ReqGetInfo {
  id: string
}

// 获取指定页码内的数据
export const list = (data: { parentId: string ,departmentTypes:string[]}): Res<Record<string, unknown>> => {
  return request({
    url: "/common/web/department/list.do",
    method: "post",
    data: { data: data }
  });
}




