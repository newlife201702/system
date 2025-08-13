// export * as storage from "./utils.storage";

/**
 * @description 更新标题
 * @param {String} titleText 标题
 */
export const updateTitle = (titleText: string) => {
    const processTitle = process.env.VUE_APP_TITLE || "";
    window.document.title = `${processTitle}${titleText ? ` | ${titleText}` : ""
        }`;
};

export const openLink = function (url: string) {
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");
    a.setAttribute("id", "lwadmin-link-temp");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(document.getElementById("lwadmin-link-temp") as HTMLElement);
};

export const downloadFile = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = decodeURI(fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const sleepFunc = (time = 800) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};


/**
 * @description 判断两个数组增加和减少的元素
 * // var beArr = [1,2,3,4],afArr = [2,3,6];
 * compare(beArr,afArr)
 */

export const compare = (beforeArr: any[], afterArr: any[]) => {
    const resObj: { add: any[], del: any[] } = {
        add: [],
        del: []
    },
        cenObj: Record<string, unknown> = {};
    //把beforeArr数组去重放入cenObj 
    for (let i = 0; i < beforeArr.length; i++) {
        cenObj[beforeArr[i]] = beforeArr[i];
    }
    //遍历afterArr，查看其元素是否在cenObj中
    for (let j = 0; j < afterArr.length; j++) {
        if (!cenObj[afterArr[j]]) {
            resObj.add.push(afterArr[j]);
        } else {
            delete cenObj[afterArr[j]]
        }
    }

    for (const k in cenObj) {
        resObj.del.push(cenObj[k]);
    }
    return resObj;
}


export const getCookie = (key: string) => {
    const name = key + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        const c = ca[i].trim();
        if (c.indexOf(name) == 0) { return decodeURIComponent(c.substring(name.length, c.length)); }
    }
    return "";
}

// 每三位数字添加一个逗号分隔数字
export const formatNum = (num: number) => { return (num || 0).toString().replace(/\d(?=(\d{3})+\b)/g, '$&,') }





export const getIcoByName = (name: string) => {
    const dicList = [
        { icoUrl: "1.svg", name: "公开" },
        { icoUrl: "2.svg", name: "核心商密" },
        { icoUrl: "3.svg", name: "机密" },
        { icoUrl: "4.svg", name: "秘密" },
        { icoUrl: "5.svg", name: "内部" },
        { icoUrl: "6.svg", name: "普通商密" }
    ]
    let icoUrl: string = ""
    dicList.map((item: any) => {
        if (item.name === name) {
            icoUrl = './images/ico/'+item.icoUrl
        }
    })
    return icoUrl
}




/**
* 8 character ID (base=2)
*uuid(8, 2)  //  "01001010"
* 
* 8 character ID (base=10)
*uuid(8, 10) // "47473046"
* 
* 8 character ID (base=16)
*uuid(8, 16) // "098F4D35"
len 为uuid长度
radix 为基数范围
**/
export const uuid=(len:number, radix:number)=> {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const uuid:string[] = [];
    let i:number;
    radix = radix || chars.length;
 
    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      let r;
 
      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
 
      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }
 
    return uuid.join('');
}

/**
 * 
 * @returns 返回当前时间的字符串 精确到时分秒
 */
export const getCurrentTimeString=()=>{
    const  timestamp = new Date();
    return formatDate(timestamp, 'yyyyMMddHHmmss')
}


/*
timestamp:timestamp
format : yyyy-MM-dd HH:mm:ss
*/
export const formatDate = (timestamp:any, format:any) => {
    // 将时间戳转换为日期对象
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()

    // 替换需要的时间格式
    format = format.replace('yyyy', year)
    format = format.replace('MM', month < 10 ? '0' + month : month)
    format = format.replace('dd', day < 10 ? '0' + day : day)
    format = format.replace('HH', hours < 10 ? '0' + hours : hours)
    format = format.replace('mm', minutes < 10 ? '0' + minutes : minutes)
    format = format.replace('ss', seconds < 10 ? '0' + seconds : seconds)

    return format
}

/* 
按照等长拆分字符串为数组
*/
export const splitByString = (str: string, strSize: number) => {
    const strArray: any = []
    let tempStr = '',
        tempStrLength = 0
    for (let i = 0; i < str.length; i++) {
        const iCount = getBytesCount(str[i]) //获取当前字符的字节长度
        if (tempStrLength + iCount <= strSize) {
            tempStr += str[i]
            tempStrLength += iCount
        } else {
            strArray.push(tempStr)
            tempStr = str[i]
            tempStrLength = iCount
        }
    }
    if (tempStr.length > 0) {
        strArray.push(tempStr)
    }

    return strArray
}

export const getBytesCount = (str: string) => {
    let bytesCount = 0
    if (str != null) {
        for (let i = 0; i < str.length; i++) {
            const c = str.charAt(i)
            if (c.match(/[^\x00-\xff]/gi) != null) {
                bytesCount += 2 // 全角
            } else {
                bytesCount += 1
            }
        }
    }
    return bytesCount
}