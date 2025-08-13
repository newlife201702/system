import request from "@/libs/utils.requset";
//工作流生命周期状态迁移
export const workPackegeEvent = (data:{businessDataId: string,businessTable: string,eventCode: string}): Res<Record<string, unknown>> => {
    return request({
      url: "/fe/event/event.do",
      method: "post",
      data:{ data: data }
    });
  }
  
  //工作流生命周期状态初始化
export const workPackegeInit = (data:{ businessCode: string,businessDataId: string,businessTable: string}): Res<Record<string, unknown>> => {
    return request({
      url: "/fe/event/init.do",
      method: "post",
      data:{ data: data }
    });
  }
  
 
    //工作流step
export const WorkFlowStep = (data:{ businessDataId: string,businessTable: string}): Res<Record<string, unknown>> => {
    return request({
      url: "/fe/web/FeFlowRelation/getByBusinessDataId.do",
      method: "post",
      data:{ data: data }
    });
  }
  
    //工作包生命周期状态迁移
    export const WorkFlowEvent = (data:{ businessDataId: string,businessTable: string,eventCode:string,beginDate:string,endDate:string}): Res<Record<string, unknown>> => {
        return request({
          url: "/fe/web/event/event.do",
          method: "post",
          data:{ data: data }
        });
      }

    export const flowList  = (data:{businessCode:string}): Res<Record<string, unknown>> => {
    return request({
      url: "/fe/web/FeFlow/list.do",
      method: "post",
      data: {data:data}
    });
    }
    
    export const getById = (data:{id:string}): Res<Record<string, unknown>> => {
      return request({
         url : "/fe/web/FeFlow/getById.do",
         method: "post",
         data: {data:data}
    })
  }



  



