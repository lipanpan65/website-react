// import request from "./request"

export { request } from './request'
export { dateFormate, timedeltaFormate } from './date-formate'
export { getCookie, clearCookie } from './cookie'


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

export const list2Tree = (data: any, id?: any, pid?: any) => {
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


export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// https://blog.csdn.net/hfdxmz_3/article/details/106637270

// const statusTag = (status:boolean,STATUS_COLOR?:any=) => {
//   <Tag color={STATUS_COLOR[status]}>{USER_STATUS[text]}</Tag>
// }


// export {
//   getCookie, list2Tree, clearCookie
// }