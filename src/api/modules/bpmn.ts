import request from "@/libs/utils.requset";

// 查询 
export const findByPid = (id:string): Res<Record<string, unknown>> => {
    return request({
      url: "/bpmn/getBpmnById.do",
      method: "post",
      data: {data:id}
    });
  }