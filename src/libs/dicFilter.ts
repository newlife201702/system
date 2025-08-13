export const getUserStatusNamebyCode = (code:string) => {
  const dicList=[
    {name:"启用",code:"USER_STATUS_ENABLE"},
    {name:"禁用",code:"USER_STATUS_DISABLE"}
  ]
  let statusName=""
  dicList.map(item=>{
    if(item.code===code)
    {
      statusName=item.name
    }
  })
  return statusName
};

