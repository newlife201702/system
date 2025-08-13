interface ReqJoinDepartSearchData { 
    businessDataId: string,
    businessTable: string,
    departmentTypeCode: string
}


interface ReqStepSearchData { 
    businessTable: string,
    businessDataId: string,
    metaTable: string,
}

interface ReqBatchAddFormData { 
    departmentIds: string[],
    departmentRela: {
        businessDataId: string,
        businessTable: string,    
        departmentTypeCode: string,
      }
}

interface ReqMetaRelaSearchData { 
    metaDataTable:  string,
    parentId: string,
    projectId: string
    
}
interface ReqMetaRelaFormData { 
    metaDataTable: string,  
    name: string,
    parentId: string,
    projectId: string,
    id?:string
}


