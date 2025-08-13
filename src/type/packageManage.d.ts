interface ReqPendingSearchData { 
    id: string,
    code: string,
    levelCode: string,
    name: string,
    parentId: string,
    securityLevelCode: string,
    sortField: string,
    sortType: string
}


interface ReqMyPackageAddFormData {
    flowId: string,
    about: string,
    code: string,
    departmentRelaName:string,
    departmentRelaIds: string[],
    departmentTypeCode: string,
    levelCode: string,
    levelName: string,
    memo: string,
    name: string,
    personTypeCode: string,
    personRelaIds:string[],
    personRelaList: {personId: string,personTypeCode: string}[],
    extendProjectParam: {propertyField: string,propertyValue: string}[],
    securityLevelCode: string,
    businessCode:string,
    planBeginDate: string,
    planEndDate: string,
    region: string,
    direction:string,
    taskType:string,
    troops:string,
    id?:string
}


