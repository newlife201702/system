import request from "@/libs/utils.requset";

// interface ReqStatus {
//   id: number
//   navStatus?: string
// }


// 根据编码获取字典列表
export const list = (data:{code:string,businessCode:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/common/web/dictionary/findByDictionaryCode.do",
      method: "post",
      data: {data:data}
    });
  }
  




