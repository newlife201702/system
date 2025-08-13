import { ref } from 'vue'

import * as api from "@/api"

export default function dicOptions(arr: {code:string,businessCode:string}[]) {
  const postLevelCodeList = ref<ReqDicFormData[]>([]) // 职务级别    
  const secretLevelList = ref<ReqDicFormData[]>([])//涉密等级 
  const dataSecurityLevelCodeList = ref<ReqDicFormData[]>([])//最高数据权限代码 
  const directionTypeList  = ref<ReqDicFormData[]>([]) // 作战方向
  const taskTypeList   = ref<ReqDicFormData[]>([]) // 任务类型
  const toorsTypeList = ref<ReqDicFormData[]>([]) // 军兵种
  



  const genderCodeList = ref<ReqDicFormData[]>([])
  const feFlowNodeTypeList = ref<ReqDicFormData[]>([])
  const toolTypeList = ref<ReqDicFormData[]>([])



  // 载入制定的字典
  function initDic() {
    
    arr.map(async (item:{code:string,businessCode:string}) => {
      switch (item.code) {
        // case "postLevelCodeList":
        //   postLevelCodeList.value = await getOptionList('POST_LEVEL_CODE')
        //   break;
        case "SECRET_LEVEL":
            secretLevelList.value = await getOptionList(item)
          break;
        case "TOOL_TYPE":
          toolTypeList.value = await getOptionList(item)
          break;
        case "DIRECTION_TYPE":
          directionTypeList.value = await getOptionList(item)
          break;
        case "TASK_TYPE":
          taskTypeList.value = await getOptionList(item)
          break;
        case "TOOPRS_TYPE":
          toorsTypeList.value = await getOptionList(item)  
          break;

          

        // case "dataSecurityLevelCodeList":
        //   dataSecurityLevelCodeList.value = await getOptionList('DATA_SECURITY_LEVEL_CODE')
        //   break;  
        // case "genderCodeList":
        //   genderCodeList.value = await getOptionList('GENDER_CODE')
        //   break;  
        
        case "FE_FLOW_NODE_TYPE":
          feFlowNodeTypeList.value = await getOptionList(item)
          break;  
      }
    })

  }


  async function getOptionList(data:{code:string,businessCode:string}) {
    const result = await api.dictionary.list(data)
    return (result?.data as any).map((item: any) => { return { name: item.name, code: item.code ,id: item.id} })
  }
  initDic()

  // 对外暴露参数与方法
  return {
    postLevelCodeList,
    secretLevelList,
    dataSecurityLevelCodeList,
    genderCodeList,
    feFlowNodeTypeList,
    toolTypeList,
    directionTypeList,
    taskTypeList,
    toorsTypeList
  }
}
