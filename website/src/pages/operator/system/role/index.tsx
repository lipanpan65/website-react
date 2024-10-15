import * as React from 'react'
import { Space, Table, theme } from 'antd'
import { rowKeyF, showTotal } from '@/utils'

// 初始化参数
const initialState = {
  loading: false,
  open: false,
  entry: {
    id: null,
    menu_name: null,
    enable: null,
    url: null,
    element: null,
    pid: null
  },
  page: {
    total: 0,
    current: 0,
    pageSize: 5
  },
  data: [],
  params: {}
};

// 定义 Context
export const RoleContext = React.createContext<{
  state: typeof initialState,
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => { }
})

// 定义 Reducer 
const reducer = (preState: any, action: any) => {

  let { type } = action;
  if (typeof action == 'function') {
    type = action()
  }

  switch (action.type) {
    case 'READ':
      const { params } = action.payload
      preState.loading = true
      preState.params = params
      return {
        ...preState
      }
    case 'READ_DONE':
      const { data, page } = action.payload
      preState.loading = false
      preState.data = data
      preState.page = page
      console.log("READ_DONE===>", preState)
      return {
        ...preState
      }
    case 'CREATE':
      preState.loading = true
      return {
        ...preState
      }
    case 'UPDATE':
      return preState
    case 'SHOW_MODEL':
      const { open, entry } = action.payload
      preState.open = open
      preState.entry = entry
      return {
        ...preState
      }
    default:
      return preState
  }
}



interface ISearchProps {

}

const AppRoleSearch: React.FC<ISearchProps> = (props) => {

  return (
    <React.Fragment>
      search 组件
    </React.Fragment>
  )
}

// TODO 定义元素是空数组，并且默认是空
interface ITableProps {
  columns: any[]
}

const AppRoleTable: React.FC<ITableProps> = (props) => {
  const context = React.useContext(RoleContext)
  const { page, data, } = context.state
  const { columns } = props
  
  const pagination = {
    total: page?.total || 0, // 数据总数
    current: page?.current || 1, // 当前页码
    pageSize: page?.pageSize || 5, // 每页显示条数
    // showSizeChanger: true, // 是否显示 pageSize 改变器
    // showQuickJumper: true, // 是否显示快速跳转
    showTotal: (total: number) => `总共 ${total} 条数据`, // 自定义显示总数的格式
  };

  return (
    <React.Fragment>
      <Table
        rowKey={rowKeyF}
        // onChange={onChange}
        pagination={pagination}
        columns={columns}
        // rowSelection={{ ...rowSelection, checkStrictly }}
        dataSource={data}
      />
    </React.Fragment>
  )
}

interface IProps {

}



const AppRole: React.FC<IProps> = (props) => {

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          {/* <a onClick={(event: any) => showModel(event, record)}>编辑</a> */}
          <a onClick={(event: any) => alert(1)}>编辑</a>
          <a onClick={(event: any) => alert(1)}>添加</a>
          <a onClick={(event: any) => alert(1)}>删除</a>
          {/* <a onClick={(event: any) => onDelete(event, record)}>删除</a> */}
        </Space>
      ),
    },
  ]

  const [state, dispatch] = React.useReducer(reducer, initialState)

  // 定义action 
  const dispatchF: React.Dispatch<any> = (action: any) => {
    // 判断action是不是函数，如果是函数，就执行,并且把dispatch传进去
    if (typeof action === 'function') {
      action(dispatch)
    } else {
      dispatch(action)
    }
  }

  return (
    <React.Fragment>
      <RoleContext.Provider value={{ state, dispatch: dispatchF }}>
        <AppRoleSearch />
        <AppRoleTable
          columns={columns}
        />
      </RoleContext.Provider>
    </React.Fragment>
  )
}

export default AppRole