interface ReqDesignRequireFormData{
    dataIds:string[],
    targetRequirement:{
        content: string,
        memo: string,
        projectId: string,
        title: string,
        summary:string
    },
    id?:string
}

