import * as React from 'react'

import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// TODO 查看如何使用
import rehypeHighlight from 'rehype-highlight'
import { useParams } from 'react-router-dom'
import 'github-markdown-css';
import 'react-markdown-editor-lite/lib/index.css';
import { request } from '../../../../utils'

import './style.css'
import { Col, Row, theme } from 'antd'

const initialState = {
  loading: false,
  data: {
    id: null,
    title: null,
    content: null
  },
};

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'READ':
      return {
        loading: true,
        ...state
      }
    case 'READ_DONE':
      const { payload: { data } } = action
      return {
        ...state,
        data
      }
    default:
      return state
  }
}

const ArticleDetail: React.FC = () => {
  // TODO 应该在初始化函数进行判断 文件的ID是否为空
  const params = useParams()
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const {
    token: { colorBgContainer,
      borderRadiusLG },
  } = theme.useToken();
  // const markdown = 'This ~is not~ strikethrough, but ~~this is~~! `code` '
  // const markdown = 'This ~is not~ strikethrough, but ~~this is~~! ```sql select * from  ``` '

  const getArticle = () => {
    const { id } = params
    if (!id) {
      alert('页面跳转')
      console.log('aaaaa')
    }
    request({
      url: `/api/user/v1/article/${id}/`,
      method: 'GET',
    }).then((res: any) => {
      console.log("res=======>", res)
      const { status, statusText } = res
      if (status === 200 && statusText === 'OK') {
        const { data } = res
        dispatch({ type: 'READ_DONE', payload: { data } })
      }
    })
  }

  React.useEffect(() => getArticle(), [])

  console.log('state===>', state)

  return (
    <React.Fragment>
      <Row style={{ paddingTop: '1rem' }}>
        <Col span={12} offset={6} style={{
          background: colorBgContainer,
          borderRadius: '4px 4px 0 0',
          paddingLeft: '2.667rem',
          paddingRight: '2.667rem',
          paddingTop: '2.667rem',
          minHeight: '100vh'
        }}>
          <main className='container main-container'>
            <h1 className='article-title'>{state.data.title}</h1>
            <div>
              <Markdown
                className={'markdown-body'}
                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
                {state.data.content}
              </Markdown>
            </div>
          </main>
        </Col>
      </Row>

    </React.Fragment>
  )
}

export default ArticleDetail