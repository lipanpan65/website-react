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
import { request } from '@/utils'
// 代码高亮
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
// 高亮的主题npm i --save-dev @types/react-syntax-highlighter
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import MarkDownTOC from '@/components/MarkDownTOC';
import './style.css'
import { Col, Row, message, theme, Card, Skeleton } from 'antd'
import CodeCopy from '@/components/CodeCopy';


const { Meta } = Card;
// const headerStyle: React.CSSProperties = {
//   textAlign: 'center',
//   color: '#fff',
//   height: 64,
//   paddingInline: 48,
//   lineHeight: '64px',
//   backgroundColor: '#4096ff',
// };

// https://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html

interface Article {
  id: number | null,
  titile: string | null,
  content: string | null,
}

// TODO 文章的接口
const initialState = {
  loading: false,
  article: {}
};

const reducer = (preState: any, action: any) => {
  switch (action.type) {
    case 'READ':
      return {
        loading: true,
        article: preState.article
      }
    case 'READ_DONE':
      console.log('READ_DONE.preState', preState)
      console.log('READ_DONE.action', action)
      const { payload: { article } } = action
      return {
        loading: false,
        article: { ...article }
      }
    default:
      return preState
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
    dispatch({ type: 'READ', payload: {} })
    const { id } = params
    if (!id) {
      console.log('aaaaa')
    }
    request({
      url: `/api/user/v1/article/${id}/`,
      method: 'GET',
    }).then((res: any) => {
      console.log("getArticle.res===>", res)
      const { code, success, data } = res
      if (code === "0000") {
        const article: Article = data
        console.log('article', article)
        dispatch({ type: 'READ_DONE', payload: { article } })
      } else if (code === "9999") {
        message.error("操作失败")
      }
    }
    )
  }

  React.useEffect(() => getArticle(), [])

  let ref: any = ''
  const Pre = (preProps: any) => {
    return (
      <pre
        style={{ tabSize: 2 }}
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
      <div className="layout-3-1 app-layout debug-border" style={{ borderRadius: borderRadiusLG }}>
        <Skeleton loading={state.loading}>
          <div className="left-column main-container">
            <div style={{
              padding: '2.667rem',
              borderRadius: borderRadiusLG,
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
            }}>
              <h1 className='article-title'>{state.article.title}</h1>
              <div className='article-body' style={{
                position: 'relative'
              }}>
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
                  {state.article.content}
                </Markdown>
              </div>
            </div>
          </div>
          <div className="right-column">
            <Card title="目录" style={{
              width: '100%',
              overflowY: 'auto'
            }}>
              {state.article.content &&
                <div className="navigation">
                  <MarkDownTOC source={state.article.content || ""} />
                </div>
              }
            </Card>
            {/* <Card title="目录" style={{
            width: '100%'
          }}>
            {state.article.content &&
              <div className="navigation">
                <MarkDownTOC source={state.article.content || ""} />
              </div>
            }
          </Card> */}
            {/* <Card title="目录" style={{
            width: '100%'
          }}>
            {state.article.content &&
              <div className="navigation">
                <MarkDownTOC source={state.article.content || ""} />
              </div>
            }
          </Card> */}
          </div>
        </Skeleton>
      </div>
    </React.Fragment>
  )
}

export default ArticleDetail