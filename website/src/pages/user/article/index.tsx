import * as React from 'react'

import {
  Link,
} from "react-router-dom"

import {
  Card,
  List,
  theme
} from 'antd'

import { request, rowKeyF, showTotal } from '@/utils'

import './index.css';

const ArticleTitle = (article: any) => <Link className='title'
  to={{
    pathname: `/user/article/detail/${article.id}`,
    // search: 'new'
  }}
  // state={{ id: article.id, status: 'drafts' }}
  target='_blank'>{article.title ?? '无标题'}</Link>

// 接口返回的数据
const initialState = {
  loading: false,
  data: [],
  page: {
    total: 0,
    current: 0,
    pageSize: 10
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
    token: {
      colorBgContainer,
      borderRadiusLG
    },
  } = theme.useToken();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const onChange = (page: any, pageSize: any) => {
    getArticleList({ page, pageSize })
  }

  const getArticleList = (params?: any): any => {
    request({
      url: `/api/user/v1/article/?status=publish`,
      method: 'GET',
      params: params || {}
    }).then((response: any) => {
      if (response && response.success) {
        const { page, data } = response.data
        dispatch({ type: 'READ_DONE', payload: { data, page } })
      }
    })
  }

  React.useEffect(() => getArticleList(), [])

  return (
    <React.Fragment>
      <div className='article-wrapper'>
        <div className="section section-left">
        </div>
        <div className="section center">
          <div className="article-list">
            <List
              itemLayout="vertical"
              loading={state.loading}
              dataSource={state.data}
              split={false}
              pagination={{
                ...state.page,
                showTotal,
                align: 'center',
                showSizeChanger: false,
                onChange // function(page, pageSize)
              }}
              rowKey={rowKeyF}
              renderItem={(item: any, index: number) => (
                <List.Item
                  style={{
                    // padding: '12px 12px 12px 12px'
                  }}
                  actions={[
                    // <span>{item.creator}</span>,
                    <span>{item.create_time}</span>,
                    <span>{item.category_name}</span>,
                  ]}
                >
                  <List.Item.Meta
                    // avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                    title={ArticleTitle(item)}
                    description={<div style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.summary}</div>}
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
        <div className="section section-right">
          <div className="right-pane">
            <Card>
              <p>晚上好</p>
            </Card>
          </div>
          <div className="right-pane">
            <Card title={"文章榜"}>Card content</Card>
          </div>
          <div className="right-pane">
            <Card title={"作者榜"}>Card content</Card>
          </div>
          <div className="right-pane">
            你好
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Article






