import request from '@/libs/utils.requset'


export const getList = (data:any): any => {
    return request({
      url: "/logger/web/logger/page.do",
      method: "post",
      data: data
    });
  }
 