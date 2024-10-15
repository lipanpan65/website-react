import * as React from 'react'

import {
  Link,
} from "react-router-dom"

import {
  List,
  theme
} from 'antd'

import { request, rowKeyF, showTotal } from '@/utils'

import './index.css';

// 导入本地的开发环境
import { postsMock } from '@/mock';

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
      const { status, statusText } = response
      if (status === 200 && statusText === 'OK') {
        const { success, message, data: { page, data } } = response.data
        dispatch({ type: 'READ_DONE', payload: { data, page } })
      }
    })
  }

  // const handleScroll = () => {
  //   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  //   if (scrollTop + clientHeight >= scrollHeight - 50) {
  //     console.log("state", state)
  //     const { page, pageSize, data } = state
  //     console.log("page", page, pageSize, data)
  //     getArticleList(); // 滚动到底部时加载更多数据
  //   }
  // };

  // React.useEffect(() => {
  //   getArticleList(); // 初始加载
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, []);

  React.useEffect(() => getArticleList(), [])

  return (
    <React.Fragment>
      <div className='container'>
        <article style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          minHeight: '100vh',
          width: '850px'
        }}>
          <List
            itemLayout="vertical"
            loading={state.loading}
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
              <List.Item
                style={{
                  padding: '12px 12px 12px 12px'
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
                  description={<div style={{ width: '85%', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item.summary}</div>}
                />
              </List.Item>
            )}
          />
        </article>
      </div>
    </React.Fragment>
  )
}

export default Article






