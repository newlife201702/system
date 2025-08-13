const validateEmail = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error("邮箱不能为空！"));
  }
  else {
    const reg = /^[1-9][0-9]{4,}@qq.com$/
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error("邮箱格式不正确！"));
    }
  }
}

const checkPhone = (rule: any, value: string, callback: any) => {
  if (!value) {
    return callback(new Error('手机号不能为空'));
  } else {
    //验证手机号
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    //验证区号
    const phoneReg = /^\d{3}-\d{8}|\d{4}-\d{7}$/
    console.log(reg.test(value));
    if (reg.test(value) || phoneReg.test(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的联系电话'));
    }
  }
}

const zipCode = (rule: any, value: string, callback: any) => {
  if (value && /^[0-9]{6}$/.test(value) == false) {
    callback(new Error("请输入正确的邮政编码"));
  } else {
    callback();
  }
}


export { validateEmail, checkPhone, zipCode }
