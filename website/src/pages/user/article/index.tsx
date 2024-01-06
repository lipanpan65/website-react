import * as React from 'react'

// import {
//     Link,
//     NavLink,
//   } from "react-router-dom"  

import {
  List
  // Space,
  // Dropdown,
  // Menu,
  // Row,
  // Col,
  // Avatar,
} from 'antd'

// import request from '@/utils/request'
import request from '../../../utils/request';


const rowKeyF = (record: { id: number }): number => record.id
const showTotal = (total: any) => `共${total}条记录`
// 接口返回的数据
const initialState = {
  loading: false,
  data: []
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'CREATE':
      return state
    case 'READ':
      return state
    case 'READ_DONE':
      console.log('READ_DONE===>', action)
      const { payload } = action
      console.log('READ_DONE===>', state)
      return {
        ...state,
        ...payload
      }
    default:
      return state
  }
}

const Article: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  // const [loading, setLoading] = React.useState<any>(false)
  // const [data, setData] = React.useState<any>([])
  const [pagination, setPagination] = React.useState<any>({
    total: 0,
    current: 0,
    pageSize: 5,
    showTotal
  })

  const onChange = (page: any, pageSize: any) => {
    console.log('onChange===>', page, pageSize)
  }

  const getArticleList = (params?: any): any => {
    request({
      url: `/api/user/v1/article/`,
      method: 'GET',
      params: params || {}
    }).then((response: any) => {
      console.log('getArticleList===>', response)
      const { status, statusText } = response
      if (status === 200 && statusText === 'OK') {
        console.log('data===>', response.data)
        dispatch({ type: 'READ_DONE', payload: { data: response.data } })
      }
    })
  }

  React.useEffect(() => getArticleList(), [])

  // console.log('Article',state)

  return (
    <React.Fragment>
      <List
        loading={state.loading}
        itemLayout="horizontal"
        dataSource={state.data}
        pagination={{
          ...pagination,
          showSizeChanger: false,
          onChange // function(page, pageSize)
        }}
        rowKey={rowKeyF}
        renderItem={(item: any, index: number) => (
          <List.Item>
            <List.Item.Meta
              // avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
              title={<a href="https://ant.design">{item.title}</a>}
              description={item.content}
            />
          </List.Item>
        )}
      />
    </React.Fragment>
  )
}

export default Article







