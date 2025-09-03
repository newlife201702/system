interface ReqPlanSearchData { 
    id: string,
    code: string,
    levelCode: string,
    name: string,
    parentId: string,
    securityLevelCode: string,
    sortField: string,
    sortType: string
}


interface ReqPlanManageAddFormData { 
    bpmnXml: "",//bpmn图
    svgXml: "",
    projectId: '',
    flowId:  '',
    flowName:  '',
    businessCode:  '',
    businessTable:  '',
    businessTableName:  '',
    autoNodeSortNo:  'true',
    generBackLine:  'false',
    countersign: 'false',
    workItemParams: [],//流程节点集合
    feFlowRelationResultList: []
}

interface planFormAdd{
  projectId: "",
  flowId: "",
  businessCode: "",
  autoNodeSortNo: any,
  generBackLine: any,
  workItemParams: [],
  connections:[],
  x6NodeJson: any,
  x6NodeRelationJson: any,
  cells: Properties[]
}





interface ResPlanManageRowData { 
    about: string, //说明
    code: string, //编号
    departmentRelaName:string,//回显用的
    departmentRelaIds: string[], //部门id
    departmentTypeCode: string, //部门类型
    levelCode: string, //层级代码
    levelName: string, //层级名称
    memo: string, //备注
    name: string, //任务包名
    parentId: string, //任务包上级id
    personRelaId:string,
    personRelaList: {personId: string,personTypeCode: string}[], //关联人员
    pmStructureId: string,
    securityLevelCode: string, //任务包密级
    sortNo: number, //顺序编号
    statusCode: string, //状态码
    statusName: string, //状态名
    templateWorkItemId: string, //模板标识
    templateWorkItemName: string, //模板名称
    id:string
}




