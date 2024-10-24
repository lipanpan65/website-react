
import * as React from 'react'
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'

import {
  Button,
  Divider,
  Input,
  Spin,
  message
} from 'antd'

import Publish from './publish'

import { request, delay } from '@/utils'

import 'react-markdown-editor-lite/lib/index.css';
import './index.css'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'

const removeMarkdownSyntax = (markdownText: string, maxLength: number) => {
  // 匹配任何以 # 开头的行，并替换为空字符串
  markdownText = markdownText.replace(/^#.*$/gm, '');
  // 移除标题
  markdownText = markdownText.replace(/^#+\s*(.*)$/gm, '$1');
  // 移除粗体
  markdownText = markdownText.replace(/\*\*(.*?)\*\*/g, '$1');
  // 移除斜体
  markdownText = markdownText.replace(/\*(.*?)\*/g, '$1');
  // 移除链接
  markdownText = markdownText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // 移除图片
  markdownText = markdownText.replace(/!\[([^\]]+)\]\([^)]+\)/g, '');
  // // 移除行内代码
  // markdownText = markdownText.replace(/`([^`]+)`/g, '$1');
  // // 移除代码块
  // markdownText = markdownText.replace(/```[^`]+```/g, '');
  markdownText = markdownText.replace(/```[^`\n]*\n+[^```]+```\n+/g, "")
  markdownText = markdownText.replace(/`([^`\n]+)`/g, "$1")
  // 移除多余的换行符和空白行
  markdownText = markdownText.replace(/\n+/g, ' ');
  // 移除多余的空格
  markdownText = markdownText.trim();
  return markdownText.substring(0, maxLength);
}

// 初始化参数
const initialState = {
  // tip: '文章自动保存草稿中...',
  loading: false,
  article: {
    id: null,
    title: null,
    content: null,
    summary: null,
    html: null,
    category_id: null
  },
  options: []
};

// 定义context
export const EditArticleContext = React.createContext<{
  state: typeof initialState,
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => { }
})

const reducer = (preState: any, action: any) => {

  console.log("preState", preState, "action", action)

  let { type } = action;
  if (typeof action == 'function') {
    type = action()
  }

  switch (action.type) {
    case 'READ':
      return {
        loading: true,
        article: { ...preState.article },
      }
    case 'READ_DONE':
      return {
        loading: false,
        article: action.payload.article,
        // article: { ...preState.article }
      }
    case 'UPDATE':
      return {
        loading: false,
        article: action.payload.article,
        // article: state.article
      }
    case 'UPDATE_TITLE':
      const { title } = action.payload
      preState.article.title = title
      return {
        loading: false,
        article: preState.article,
        // ...preState
      }
    case 'UPDATE_CONTENT':
      const { content, html } = action.payload
      preState.article.content = content
      preState.article.html = html
      preState.article.summary = removeMarkdownSyntax(content, 100)
      return {
        loading: false,
        article: preState.article,
        // ...preState
      }
    case "UPDATE_ID":
      const { id } = action.payload
      preState.article.id = id
      return {
        loading: false,
        article: preState.article,
        // ...preState
      }
    case "READ_DONE_UPDATE":
      const { article } = action.payload
      return {
        loading: false,
        article,
        // ...preState
      }
    case "PUBLISH":
      const { category_name, summary } = action.payload
      console.log("PUBLISH", category_name, summary)
      return {
        loading: true,
        article: preState.article,
        // ...preState
      }
    default:
      return preState
  }
};

const mdParser = new MarkdownIt(/* Markdown-it options */);

const EditorArticle: any = (props: any) => {
  // 获取请求参数
  const params = useParams();
  const timerId: any = React.useRef(undefined)
  // const [timerId, setTimerId] = React.useState<any>(undefined)
  const navigator = useNavigate()
  const [status, setStatus] = React.useState<boolean | undefined>(undefined);
  const publishRef: any = React.useRef();
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

  // 作者：佑子呀
  // 链接：https://juejin.cn/post/7156123099522400293
  // 来源：稀土掘金
  // 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

  // const throttle: any = (fn: any, delay: number) => {
  // const throttle: any = (fn: any, delay: number) => {
  const throttle: any = (delay: number) => {

    console.log("----------------------")
    console.log("params======>", params)
    console.log("state.id", state.article.id)
    console.log("----------------------")

    setStatus(true)
    // https://www.cnblogs.com/aurora-ql/p/13757733.html
    if (timerId.current) {
      // 如果上一次存在 timerid 则清除请求
      clearTimeout(timerId.current)
      // return
    }
    timerId.current = setTimeout(() => {
      if (state.article.id === null && params.id === 'new') {
        createArticle()
      } else if (state.article.id) {
        updateArticle()
      }
      // 执行完成后清除 timeid 更新页面的保存中
      timerId.current = null
      console.log('timer----->', timerId)
    }, delay)
    console.log('--执行完成后timer----->', timerId)
  }


  const getArticle = async (id: any) => {
    dispatch({ type: 'READ' })
    await delay(1000)
    request({
      url: `/api/user/v1/article/${id}`, method: 'GET'
    }).then((r: any) => {
      const { data: { code, success, data } } = r
      if (code === '0000' && success) {
        dispatch({ type: 'READ_DONE', payload: { article: { ...data } } })
      } else if (code === '9999') {
        message.error('操作失败')
      }
    }).catch((e) => {
    }).finally(() => {
    })
  }

  const createArticle = () => {
    const { article: { title, content, html } } = state
    if (title || content || html) {
      request({
        url: `/api/user/v1/article/`, method: 'POST', data: {
          title, content, html
        }
      }).then((r: any) => {
        const { status, data: { code, success, data } } = r
        if (code === "0000") {
          dispatch({ type: 'UPDATE_ID', payload: { id: data.id } })
        }
      }).catch((e) => {
        console.log('createArticle.err===>', e)
      }).finally(() => {
      })
    }
  }

  React.useEffect(() => {
    if (params.id && params.id !== 'new') {
      const articleId = params.id
      getArticle(articleId)
    }
  }, [])

  const updateArticle = () => {
    const { article } = state
    request({
      url: `/api/user/v1/article/${article.id}/`, method: 'PUT', data: {
        ...article
      }
    }).then((r: any) => {
      // timerId.current = null
    }).catch((e) => {
    }).finally(() => {
      setStatus(false)
    })
  }

  const onChange = (e: any) => {
    const title = e.target.value
    const { article: preArticle } = state
    const article: any = Object.assign({}, preArticle, { title })
    dispatch({ type: 'UPDATE', payload: { article: { ...article } } })
    // throttle(3000)
  }

  const handleEditorChange = ({ html, text }: any) => {
    // intervalRef.current = text
    const { article: preArticle } = state
    const article: any = Object.assign({}, preArticle, { html, content: text })
    // const newValue = text.replace(/\d/g, "");
    dispatch({ type: 'UPDATE', payload: { article } })
    // throttle(3000)
  };

  const showModel = (event: any, data?: any) => {
    // 将模态框弹起
    publishRef.current.showModel(true, data)
  }

  React.useEffect(() => throttle(3000), [state.article])

  const handLinkToDrafts = () => {
    navigator(`/user/creator/overview`, {
      // replace: true
      state: {
        // id: article.id,
        // status: 'draft',
      }
    })
  }

  console.log("timerId====>", timerId)
  
  return (
    <React.Fragment>
      <div >
        <EditArticleContext.Provider value={{ state, dispatch: dispatchF }}>
          <Spin spinning={state.loading}>
            <div className='edit-container'>
              <div className='header'>
                <div className="header-left">
                  <Input
                    style={{ fontSize: 24, height: '100%' }}
                    className='input-title'
                    value={state.article.title || ""}
                    onChange={onChange}
                    placeholder="请输入文章标题"
                    // bordered={false}
                    variant="borderless"
                  />
                </div>
                <div>
                  {state.tip}
                  {timerId.current}
                </div>
                {
                  timerId.current === undefined ? <div>文章自动保存到草稿中...</div> : (timerId.current === null ? <div>保存成功...</div> : <div>保存中...</div>)
                  // timerId === undefined ? <div>文章自动保存到草稿中...</div> : (timerId === null ? <div>保存成功...</div> : <div>保存中...</div>)
                }
                <div className="header-right">
                  <Button type="primary" onClick={showModel} >发布</Button>
                  <Button type="primary" onClick={handLinkToDrafts}>草稿箱</Button>
                </div>
              </div>
              <div className="bootom">
                <MdEditor
                  onImageUpload={() => alert('image')}
                  // ref={mdEditor}
                  value={state.article.content || ""}
                  style={{ height: "100vh" }}
                  onChange={handleEditorChange}
                  renderHTML={text => mdParser.render(text)}
                />
              </div>
              <div>
                <Publish ref={publishRef} />
              </div>
            </div>
          </Spin>
        </EditArticleContext.Provider>

      </div>

    </React.Fragment >
  )
}


export default EditorArticle




