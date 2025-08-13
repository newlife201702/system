import request from "@/libs/utils.requset";
//一般情况下，接口类型会放到一个文件
// 下面两个TS接口，表示要传的参数
interface ReqLogin {
  name: string
  paw: string
}
interface ReqStatus {
  id: number
  navStatus?: string
}


// // Res是返回的参数，T是泛型，需要自己定义，返回对数统一管理***
// type Res<T> = Promise<ItypeAPI<T>>;
// // 一般情况下响应数据返回的这三个参数，
// // 但不排除后端返回其它的可能性，
// interface ItypeAPI<T> {
//   result?: T,//请求的数据，用泛型 可选字段
//   msg: string | null // 返回状态码的信息，如请求成功等
//   code: number //返回后端自定义的200，404，500这种状态码
// }


// post请求 ，没参数
export const LogoutAPI = (): Res<null> => request.post("/admin/logout");

// post请求，有参数,如传用户名和密码
export const loginAPI = (data: ReqLogin): Res<string> => {
  return request({
    url: "/admin/login",
    method: "post",
    data,
    //默认传的是json
    // headers: {
    //   "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    // },
  });
}


// post请求 ，query与body传递参数
export const getUserInfo = (params: ReqStatus): Res<null> => {
  return request({
    url: "/getHaoKanVideo",
    method: "post",
    params,
    data: { name: 'zzm', pwd: "123456" }
    //默认传的是json
    // headers: {
    //   "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    // },
  });
}

//  get请求，没参数，
// Record<string, never> 空对象
// Record<string, unknown> 任意对象
// {} 任何不为空的对象
export const list = (params:any): Res<Record<string, unknown>> =>
  request.get("/index/admin/list",{params:params});

// get请求，有参数，路径也要传参  (也可能直接在这写类型，不过不建议,大点的项目会维护一麻烦)
export const ProductCategoryApi = (params: { parentId: number }): Res<Record<string, unknown>> =>
  request.get(`/productCategory/list/${params.parentId}`, { params });

// get请求，有参数，(如果你不会写类型也可以使用any,不过不建议,因为用了之后 和没写TS一样)
export const AdminListAPI = (params: any): Res<Record<string, unknown>> => request.get("/admin/list", { params });

// get请求，有参数，(如果你不会写类型也可以使用any,不过不建议,因为用了之后 和没写TS一样)
export const del = (params: { id: number }) =>
// export const del = (params:{ id: number }): Res<any> => 
{
  return request({
    url: "/userDel",
    method: "delete",
    params,
    data: { name: 'zzm', pwd: "123456" }
  });
}


