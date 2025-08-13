import axios from "axios";
import { ElLoading, ElMessage } from 'element-plus'

import { getCookie } from "@/libs/utils";
// import store from "@/store";
import qs from "qs";

// 将多个请求loading合并成一个 避免页面闪烁

let reqNum: number = 0
let loading: any = ""

const startLoading = () => {
  if (reqNum === 0) {
    // console.log('开始loading')
    loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  }
  reqNum++
}

const endLoading = () => {
  // 延迟 300ms 再调用 closeLoading 方法, 合并300ms内的请求
  // 当有请求中嵌套请求的情况也也可开启延时来解决
  setTimeout(closeLoading, 300)
  // closeLoading()
}

const closeLoading = () => {
  if (reqNum <= 0) return
  reqNum--
  if (reqNum === 0) {
    loading.close()
    // console.log('结束loading')
  }
}


const errorHandler = (error: any) => {
  endLoading()
  if (error.response) {
    const { status, data } = error.response;
    // switch (status) {
    //   case 401: {
    //     Message.error("该账号已经重新登录,Token信息已失效");
    //     const token = storage.get(storage.token);
    //     if (token) {
    //       store.dispatch("logout");
    //     }
    //     break;
    //   }
    //   case 500:
    //     Message.error("服务器内部错误");
    //     break;
    //   default:
    //     Message.error(data.message || data.error);
    // }
  }
  return Promise.reject(error);
};
// axios.defaults.withCredentials = true;
const service = axios.create({
  // baseURL: process.env.NODE_ENV==="development"?"/api":"",
  baseURL: "/api",
  headers: {
    // "Content-Type": "application/json",
    // "content-type":'application/x-www-form-urlencoded;charset=UTF-8'
  },
  withCredentials: false,
  timeout: 6000,
});

service.interceptors.request.use((config) => {
  startLoading()
   config.headers["token"] = "11111";
//   console.log(config.data, "++++=====")
  //config.data.ticketProxy = localStorage.getItem("ticketProxy")
  // config.headers["Cookie"]="ticket-erm=" + localStorage.getItem("ticketProxy")
  if (config.headers["Content-Type"] === "application/x-www-form-urlencoded;charset=UTF-8") {
    config.transformRequest = [
      function (data) {
        console.log(data)
        // data={"aa":"bb",...data}
        // 这里可以在发送请求之前对请求数据做处理，比如form-data格式化等，这里可以使用开头引入的Qs
        data = qs.stringify(data);
        return data;
      },
    ];
  }

  return config;
}, errorHandler);

service.interceptors.response.use((response) => {
  endLoading()
  // if (response.config.type === "download") {
  //   downloadFile(
  //     window.URL.createObjectURL(response.data),
  //     response.headers.filename
  //   );
  //   return Promise.resolve(response);
  // }

  const { resultCode, resultMessage, returnCode, returnMessage } = response.data;
  if (resultCode === 0 && returnCode === 0) {
    
    // ElMessage({message: returnMessage,type: 'success' })
    return Promise.resolve(response.data);
  }
  // if ([400, 401].includes(code)) {
  //   Message.error("该账号已经重新登录,Token信息已失效");
  //   store.dispatch("logout");
  //   return Promise.reject(response.data);
  // }
  if (resultCode !== 0) {
    ElMessage({
      message: resultMessage,
      type: 'warning',
    })
  }

  if (returnCode !== 0) {
    ElMessage({
      message: returnMessage,
      type: 'warning',
    })
  }
  return Promise.resolve(response.data);
  // return Promise.reject(response.data);
}, errorHandler);

export default service;
