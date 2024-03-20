import * as React from 'react'
import MarkdownNavbar from 'markdown-navbar';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
// TODO 查看如何使用
import rehypeHighlight from 'rehype-highlight'
import { useParams } from 'react-router-dom'
import './style.scss'
import 'markdown-navbar/dist/navbar.css';
import 'github-markdown-css';
import 'react-markdown-editor-lite/lib/index.css';
import { request } from '../../../../utils'
// 代码高亮
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// 高亮的主题npm i --save-dev @types/react-syntax-highlighter
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import MarkDownTOC from '../../../../components/MarkDownTOC';

import './style.css'
import { Col, Row, theme } from 'antd'
import CodeCopy from '../../../../components/CodeCopy';

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
  } = theme.useToken()


  const getArticle = () => {
    const { id } = params
    if (!id) {
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

  let ref: any = ''
  const Pre = (preProps: any) => {
    return (
      <pre
        className='blog-pre'
        // 兼容移动端的触摸事件
        onTouchStart={({ currentTarget }) => {
          if (ref) ref.className = 'blog-pre'
          currentTarget.className = 'blog-pre active'
          ref = currentTarget
        }}
      >
        <CodeCopy>{preProps.children}</CodeCopy>
        {preProps.children}
      </pre>
    )
  }

  return (
    <React.Fragment>
      <Row style={{ paddingTop: '1rem' }}>
        <Col span={12} offset={6} style={{
          background: colorBgContainer,
          borderRadius: '4px 4px 0 0',
          // paddingLeft: '2.667rem',
          // paddingRight: '2.667rem',
          // paddingTop: '2.667rem',
          padding: '2.667rem',
          minHeight: '100vh',
          marginRight: '16px'
        }}>
          <main className='container main-container'>
            <h1 className='article-title'>{state.data.title}</h1>
            <div className='article-body' style={{ position: 'relative' }}>
              <Markdown
                className={'markdown-body'}
                remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                components={{
                  pre: Pre, // 修改pre标签
                  code({ node, inline, className, children, ...props }: any) {
                    return <code className={className} {...props} children={children} />
                    // const match = /language-(\w+)/.exec(className || '')
                    // return !inline && match ? (
                    //   <SyntaxHighlighter
                    //     children={String(children).replace(/\n$/, '')}
                    //     // style={coldarkDark}
                    //     // language={match[1]}
                    //     PreTag="div"
                    //     // showLineNumbers={true}
                    //     // showInlineLineNumbers={true}
                    //     {...props}
                    //   />
                    // ) : (
                    //   <code className={className} {...props} children={children} />
                    // )
                  }
                }}
              >
                {state.data.content}
              </Markdown>
            </div>
          </main>
        </Col>
        <Col span={4} style={{
          // background: colorBgContainer,
          // borderRadius: '4px 4px 0 0',
        }}>
          <div style={{
            background: colorBgContainer,
            borderRadius: '4px 4px 0 0',
          }}>
            <div className='sidebar-title'><span>目录</span></div>
            {state.data.content &&
              <div className="navigation">
                <MarkDownTOC source={state.data.content || ""} />
              </div>
            }
          </div>
        </Col>
      </Row>
    </React.Fragment>
  )
}

export default ArticleDetail