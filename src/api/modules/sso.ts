import request from "@/libs/utils.requset";


// 获取指定页码内的数据
export const login = (data: { loginName: string,password:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/auth/login",
      method: "post",
      data: data
    });
  }

// 获取指定页码内的数据
export const getUserInfo = (params: { access_token: string}): Res<Record<string, unknown>> => {
    return request({
      url: "/self/currentInfo",
      method: "post",
      data:{},
      params:params
    });
  }
  