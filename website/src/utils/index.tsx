import moment from 'moment'




const timedeltaFormate: any = (timedelta: any) => {
  const oneMinute = 60
  const oneHour = 60 * oneMinute
  const oneDay = 24 * oneHour
  let intTimedelta = parseInt(timedelta)
  if (intTimedelta >= oneDay) {
    const days = Math.floor(intTimedelta / oneDay)
    intTimedelta = Math.floor(intTimedelta % oneDay)
    const hours = Math.floor(intTimedelta / oneHour)
    intTimedelta = Math.floor(intTimedelta % oneHour)
    const minutes = Math.floor(intTimedelta / oneMinute)
    return `${days}天${hours}时${minutes}分`
  } else if (intTimedelta >= oneHour) {
    const hours = Math.floor(intTimedelta / oneHour)
    intTimedelta = Math.floor(intTimedelta % oneHour)
    const minutes = Math.floor(intTimedelta / oneMinute)
    const seconds = Math.floor(intTimedelta % oneMinute)
    return `${hours}时${minutes}分${seconds}秒`
  } else if (intTimedelta >= oneMinute) {
    const minutes = Math.floor(intTimedelta / oneMinute)
    const seconds = Math.floor(intTimedelta % oneMinute)
    return `${minutes}分${seconds}秒`
  }
}

// 获取cookie
const getCookie: (any | null) = (name?: any) => {
  const cookies = document.cookie
  const list = cookies.split("; ")
  for (let i = 0; i < list.length; i++) {
    const arr = list[i].split("=")
    if (arr[0] === name) {
      return decodeURIComponent(arr[1],)
    }
  }
  return null
}
// 清除所有 cookie
//清空cookie
const clearCookie = () => {
  let keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (let i = keys.length; i--;) {
      document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString()//清除当前域名下的,例如：m.kevis.com
      document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString()//清除当前域名下的，例如 .m.kevis.com
      document.cookie = keys[i] + '=0;path=/;domain=kevis.com;expires=' + new Date(0).toUTCString()//清除一级域名下的或指定的，例如 .kevis.com
    }
  }
}

// TODO arrary 的
// const list2Tree = (data:Array<{}>,id:any,pid:any)

/**
 * 将列表数据转化为 Tree 数据
 * @param {数组} arrary 
 * @param {唯一索引} id 
 * @param {父索引} pid 
 */
// const toTree = (arr, id, pid) => {
//     arr.forEach((node) => {
//         const pNode = arr.find((row) => row[id] === node[pid])
//         if (pNode) {
//             pNode.children = pNode.children || []
//             pNode.children.push(node)
//         }
//     })
//     return arr.filter((node) => !node[pid])
// }

const list2Tree = (data: any, id?: any, pid?: any) => {
  data.forEach((o: any) => {
    const p = data.find((r: any) => r['orgid'] === o['parentid'])
    if (p) {
      p.children = p.children || []
      p.children.push(o)
    }
  })
  // 过滤所有的一级节点
  return data.filter((o: any) => o['parentid'] === '0')
}

// const statusTag = (status:boolean,STATUS_COLOR?:any=) => {
//   <Tag color={STATUS_COLOR[status]}>{USER_STATUS[text]}</Tag>
// }

export {  request  } from './request'

export {
  dateFormate, getCookie, list2Tree, clearCookie, timedeltaFormate
}