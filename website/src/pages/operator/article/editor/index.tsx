
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

const removeMarkdownSyntax = (markdownText: string) => {
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

  return markdownText;
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
    html: null
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
        // ...preState
      }
    case 'READ_DONE':
      return {
        loading: false,
        article: { ...preState.article }
      }
    // case 'UPDATE':
    //   const { content, content_html } = action.payload
    //   state.article.content = content
    //   state.article.content_html = content_html
    //   // console.log("update===>", state)
    //   return {
    //     loading: false,
    //     article: state.article
    //   }
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
      preState.article.summary = removeMarkdownSyntax(content)
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
  const timerId: any = React.useRef()
  // const [timerId, setTimerId] = React.useState(undefined)
  const navigator = useNavigate()
  const [status, setStatus] = React.useState<boolean | undefined>(undefined);

  const intervalRef: any = React.useRef();
  const publishRef: any = React.useRef();
  const titleRef: any = React.useRef();

  // intervalRef.current = () => {
  //   console.log("updateArticle.state===>", state)
  //   const { article } = state
  //   request({ url: `/api/user/v1/article/${article.id}/`, method: 'PUT', data: { ...article } }).then((r: any) => {
  //     console.log('updateArticle===>', r)
  //   }).catch((e) => {
  //     console.log('updateArticle.err===>', e)
  //   }).finally(() => {
  //   })
  // }

  // const [state, dispatch] = React.useReducer(reducer, initialState, (initialState) => {
  //   if (params.id && params.id != 'new') {
  //     // 此处为编辑页面
  //     const { article } = initialState
  //     const articleId = Number(params.id)
  //     return {
  //       loading: initialState.loading,
  //       article: {
  //         id: articleId,
  //         title: article.title,
  //         content: article.content,
  //         content_html: article.content_html
  //       }
  //     }
  //   }
  //   return initialState;
  // });
  const [save, setSave] = React.useState();
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

  console.log("---------sssssssssssss-------------")
  console.log("timerId====>", timerId)
  // console.log("---------*************-------------")

  const getArticle = async (id: any) => {
    dispatch({ type: 'READ' })
    await delay(5000)
    request({
      url: `/api/user/v1/article/${id}`, method: 'GET'
    }).then((r: any) => {
      const { data: { code, success, data } } = r
      if (code === '0000' && success) {
        intervalRef.current = data.content
        titleRef.current = data.title
        dispatch({ type: 'READ_DONE_UPDATE', payload: { article: { ...data } } })
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
    return
  }

  React.useEffect(() => {
    if (params.id && params.id !== 'new') {
      const articleId = params.id
      getArticle(articleId)
    }
    // }, [state.article.id])
  }, [])

  const updateArticle = () => {
    const { article } = state
    request({
      url: `/api/user/v1/article/${article.id}/`, method: 'PUT', data: {
        ...article
      }
    }).then((r: any) => {
    }).catch((e) => {
    }).finally(() => {
      setStatus(false)
    })
  }

  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     console.log(intervalRef.current)
  //     if (params.id === 'new' && state.article.id === null) {
  //       console.log('创建文章 params.id', params.id, "state.article.id", state.article.id)
  //       createArticle()
  //     } else if (state.article.id) {
  //       console.log('更新文档 params.id', params.id, "state.article.id", state.article.id)
  //       updateArticle()
  //     }
  //   }, 5000 * 1);
  //   return () => clearInterval(interval)
  // }, [])

  const onChange = (e: any) => {
    const title = e.target.value
    titleRef.current = title
    dispatch({ type: 'UPDATE_TITLE', payload: { title } })
    // throttle(5000)
  }

  const handleEditorChange = ({ html, text }: any) => {
    // console.log("handleEditorChange===>", html)
    // console.log("handleEditorChange===>", text)
    intervalRef.current = text
    // const newValue = text.replace(/\d/g, "");
    dispatch({ type: 'UPDATE_CONTENT', payload: { html, content: text } })
    console.log("handleEditorChange=timerId", timerId)
    throttle(5000)
  };

  const showModel = (event: any, data?: any) => {
    publishRef.current.showModel(true, data)
  }

  const handLinkToDrafts = () => {
    navigator(`/user/creator/overview`, {
      // replace: true
      state: {
        // id: article.id,
        // status: 'draft',
      }
    })
  }

  return (
    <React.Fragment>
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
                  bordered={false} />
              </div>
              <div>
                {state.tip}
              </div>
              {
                timerId.current === undefined ? <div>文章自动保存到草稿中...</div> : (timerId.current === null ? <div>保存成功...</div> : <div>保存中...</div>)
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
                // renderHTML={text => <ReactMarkdown children={text} />}
                renderHTML={text => mdParser.render(text)}
              />
            </div>
            <div>
              <Publish ref={publishRef} />
            </div>
          </div>
        </Spin>
      </EditArticleContext.Provider>

    </React.Fragment >
  )
}


export default EditorArticle




