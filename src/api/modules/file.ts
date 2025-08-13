import request from "@/libs/utils.requset";


//文件下载 download

export const fileDown = (params:{id:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/common/web/file/download.do",
      method: "post",
      data:{},
      params:params
    });
}


export const fileDownload = (): Res<Record<string, unknown>> => {
    return request({
      //url: "/common/web/file/downloadFile.do",
      url : "/aos/import/downloadFile.do",
      method: "get",
      data:{},
    });
}

