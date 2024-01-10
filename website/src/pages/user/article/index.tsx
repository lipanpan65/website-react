import * as React from 'react'

import {
  Link,
  // NavLink,
} from "react-router-dom"

import {
  Col,
  List, Row, theme
  // Space,
  // Dropdown,
  // Menu,
  // Row,
  // Col,
  // Avatar,
} from 'antd'

// import request from '@/utils/request'
import request from '../../../utils/request';

// 导入本地的开发环境
import { postsMock } from '../../../mock';

const rowKeyF = (record: { id: number }): number => record.id
const showTotal = (total: any) => `共${total}条记录`
const articleTitle = (article: any) => <Link to={`/user/article/detail/${article.id}`}>{article.title ?? '无标题'}</Link>

// const TabTitle = (i: any, t: any) => (<span>{i}{t}</span>)

// 接口返回的数据
const initialState = {
  loading: false,
  data: [],
  page: {
    total: 0,
    current: 0,
    pageSize: 5
  }
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'READ':
      return {
        loading: true,
        ...state
      }
    case 'READ_DONE':
      const { payload: { data, page } } = action
      return {
        ...state,
        data, page
      }
    default:
      return state
  }
}

const Article: React.FC = () => {

  const {
    token: { colorBgContainer,
      borderRadiusLG },
  } = theme.useToken();

  const [state, dispatch] = React.useReducer(reducer, initialState);
  // console.log('postsMock--->', postsMock)
  // console.log('state--->', state)

  const onChange = (page: any, pageSize: any) => {
    // console.log('onChange===>', page, pageSize)
    getArticleList({ page, pageSize })
  }

  const getArticleList = (params?: any): any => {
    request({
      url: `/api/user/v1/article/`,
      method: 'GET',
      params: params || {}
    }).then((response: any) => {
      // console.log('getArticleList===>', response)
      const { status, statusText } = response
      if (status === 200 && statusText === 'OK') {
        const { page, data } = response.data
        dispatch({ type: 'READ_DONE', payload: { data, page } })
      }
    })
  }

  React.useEffect(() => {
    console.log('分页发生变化')
    // getArticleList()
  }, [state.page])

  React.useEffect(() => getArticleList(), [])

  return (
    <React.Fragment>
      <Row>
        <Col span={12} offset={6}>
          <main style={{
            background: colorBgContainer
          }}>
            <List
              loading={state.loading}
              itemLayout="horizontal"
              dataSource={state.data}
              pagination={{
                ...state.page,
                showTotal,
                showSizeChanger: false,
                onChange // function(page, pageSize)
              }}
              rowKey={rowKeyF}
              renderItem={(item: any, index: number) => (
                <List.Item style={{padding:'12px 12px 0'}}>
                  <List.Item.Meta
                    // avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                    title={articleTitle(item)}
                    description={item.content}
                  />
                </List.Item>
              )}
            />
          </main>
        </Col>
      </Row>




    </React.Fragment>
  )
}

export default Article







