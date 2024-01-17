import * as React from 'react'
import { Col, MenuProps, Row, Menu, theme, Tabs, List } from 'antd'

import {
  MenuOutlined,
  HomeOutlined
} from '@ant-design/icons'

import type { TabsProps } from 'antd';

import {
  Link,
} from "react-router-dom"

import { request } from '../../../../utils';

const rowKeyF = (record: { id: number }): number => record.id
const showTotal = (total: any) => `共${total}条记录`
const ArticleTitle = (article: any) => <Link className='title'
  to={`/user/article/editor/${article.id}`}
  state={{ id: article.id, status: 'drafts' }}
  target='_blank'>{article.title ?? '无标题'}</Link>
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

const CratorArticle: any = () => {

  const {
    token: {
      colorBgContainer,
      // borderRadiusLG
    },
  } = theme.useToken();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const onChange = (page: any, pageSize: any) => {
    // console.log('onChange===>', page, pageSize)
    getArticleList({ page, pageSize })
  }

  console.log('CratorArticle===>', state)

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

  // React.useEffect(() => {
  //   // console.log('分页发生变化')
  //   // getArticleList()
  // }, [state.page])

  React.useEffect(() => getArticleList(), [])

  return (
    <React.Fragment>
      <article style={{
        background: colorBgContainer,
        minHeight: '100vh'
      }}>
        <List
          loading={state.loading}
          itemLayout="horizontal"
          dataSource={state.data}
          pagination={{
            ...state.page,
            showTotal,
            align: 'center',
            showSizeChanger: false,
            onChange // function(page, pageSize)
          }}
          rowKey={rowKeyF}
          renderItem={(item: any, index: number) => (
            <List.Item style={{ padding: '12px 12px 0' }}>
              <List.Item.Meta
                // avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                title={ArticleTitle(item)}
                description={<div style={{ width: '85%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.content}</div>}
              />
            </List.Item>
          )}
        />
      </article>
    </React.Fragment>
  )
}

export default CratorArticle

