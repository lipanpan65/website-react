import { Space, theme } from 'antd'
import * as Icon from '@ant-design/icons';
import * as React from 'react';

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

// TODO 如何使用全部
// export const rowKeyF = (record: { id: number }): number => record.id
export const rowKeyF = (record: any): number => record.id || record.pk
export const showTotal = (total: any) => `共${total}条记录`
export const matchPath = (menuUrl: any, curPath: any) => curPath.indexOf(menuUrl) === 0
export const getLeftActive = (func: any, curPath: any, parent = []) => {
  let active: any;
  func.every((item: any) => {
    if (item.childs) {
      // 递归调用获取 activate,如果菜单存在子级菜单则 parent 即为 item 本身
      active = getLeftActive(item.childs, curPath, item)
      if (active) {
        // 如果层级嵌套可能存在多个 item
        if (!Array.isArray(active.parent)) {
          active.parent = [active.parent]
        }
        active.parent = parent
        return false;
      }
      return true
    } else {
      if (matchPath(item.hash, curPath)) {
        item.parent = parent;
        active = item;
        return false;
      }
      return true;
    }
  })
  return active;
}

export const IconText = (icon: string, text: string) => {
  const Icons: any = Icon
  return (
    <React.Fragment>
      <Space>
        {React.createElement(Icons[icon])}
        {text}
      </Space>
    </React.Fragment>
  )
}

const style: React.CSSProperties = {
  // background: '#0092ff', 
  padding: '16px 0'
};


/**
 * 
 * 
 * import * as Icon from '@ant-design/icons';
//iconName是icon名字字符串
  const createAntdIcon = (iconName) => {
    return React.createElement(Icon[iconName]);
  }
  list 的页面
  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);
 * 
 */



// https://blog.csdn.net/hfdxmz_3/article/details/106637270

// const statusTag = (status:boolean,STATUS_COLOR?:any=) => {
//   <Tag color={STATUS_COLOR[status]}>{USER_STATUS[text]}</Tag>
// }


// export {
//   getCookie, list2Tree, clearCookie
// }