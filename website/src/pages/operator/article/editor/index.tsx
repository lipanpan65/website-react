
import * as React from 'react'
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'

import {
  Button,
  Input,
  Spin
} from 'antd'

// import request from '../../../../utils/request'

import { request, delay } from '../../../../utils'

import 'react-markdown-editor-lite/lib/index.css';
import './index.css'

import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { access } from 'fs'

const mdParser = new MarkdownIt(/* Markdown-it options */);


// 初始化参数
const initialState = {
  loading: false,
  article: {
    id: null,
    title: null,
    content: null,
    content_html: null
  }
};

const reducer = (state: any, action: any) => {

  switch (action.type) {
    case 'READ':
      return {
        loading: true,
        article: { ...state.article } // 
      }
    // case 'READ_DONE':
    //   return state
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
      state.article.title = title
      return {
        loading: false,
        article: state.article
      }
    case 'UPDATE_CONTENT':
      const { content, content_html } = action.payload
      state.article.content = content
      state.article.content_html = content_html
      return {
        loading: false,
        article: state.article
      }
    case "UPDATE_ID":
      const { id } = action.payload
      state.article.id = id
      return { article: state.article }
    case "READ_DONE_UPDATE":
      const { article } = action.payload
      return {
        loading: false,
        article
      }
    default:
      return state
  }
};

const EditorArticle: any = (props: any) => {

  // 获取请求参数
  const params = useParams();

  const [state, dispatch] = React.useReducer(reducer, initialState, (initialState) => {
    if (params.id && params.id != 'new') {
      // 此处为编辑页面
      const { article } = initialState
      const articleId = Number(params.id)
      return {
        loading: initialState.loading,
        article: {
          id: articleId,
          title: article.title,
          content: article.content,
          content_html: article.content_html
        }
      }
    }
    return initialState;
  });

  console.log("---------sssssssssssss-------------")
  console.log("EditorArticle===>", state)
  console.log("---------*************-------------")

  const getArticle = async (id: any) => {
    dispatch({ type: 'READ' })
    await delay(5000)
    request({
      url: `/api/user/v1/article/${id}`, method: 'GET'
    }).then((r: any) => {
      const { status, data } = r
      dispatch({ type: 'READ_DONE_UPDATE', payload: { article: { ...data } } })
    }).catch((e) => {
    }).finally(() => {
    })
  }

  const createArticle = () => {
    console.log("创建文章")
    const { article: { title, content, content_html } } = state
    if (title || content || content_html) {
      request({
        url: `/api/user/v1/article/`, method: 'POST', data: {
          title, content, content_html
        }
      }).then((r: any) => {
        console.log('createArticle===>', r)
        const { status, data } = r
        dispatch({ type: 'UPDATE_ID', payload: { id: data.id } })
      }).catch((e) => {
        console.log('createArticle.err===>', e)
      }).finally(() => {
      })
    }
    return
  }

  React.useEffect(() => {
    console.log('00000009999900')
    console.log(typeof state.article.id)
    console.log(state.article.id)
    console.log('创建文章 params.id', params.id, "state.article.id", state.article.id)
    console.log('00000000000000')
    if (state.article.id && params.id !== 'new') {
      console.log('创建文章')
      const articleId = state.article.id
      getArticle(articleId)
    }
    // }, [state.article.id])
  }, [])

  const updateArticle = () => {
    console.log("updateArticle.state===>", state)
    const { article } = state
    // console.log('')
    // request({ url: `/api/user/v1/article/${article.id}/`, method: 'PUT', data: { ...article } }).then((r: any) => {
    //   console.log('updateArticle===>', r)
    // }).catch((e) => {
    //   console.log('updateArticle.err===>', e)
    // }).finally(() => {
    // })
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      // console.log("state.article===>", state.article)
      if (params.id === 'new' && state.article.id === null) {
        console.log('创建文章 params.id', params.id, "state.article.id", state.article.id)
        createArticle()
      } else if (state.article.id) {
        console.log('更新文档 params.id', params.id, "state.article.id", state.article.id)
        updateArticle()
      }
    }, 5000 * 1);
    return () => clearInterval(interval)
  }, [])

  const onChange = (e: any) => {
    const title = e.target.value
    dispatch({ type: 'UPDATE_TITLE', payload: { title } })
  }

  const handleEditorChange = ({ html, text }: any) => {
    // console.log("handleEditorChange===>", html)
    // console.log("handleEditorChange===>", text)
    // const newValue = text.replace(/\d/g, "");
    dispatch({ type: 'UPDATE_CONTENT', payload: { content_html: html, content: text } })
  };

  const publishPosts = () => {

  }

  const toDrafts = () => {

  }

  return (
    <React.Fragment>
      <Spin spinning={state.loading}>
        <div className='edit-container'>
          <div className='header'>
            <div className="header-left">
              <Input
                style={{ fontSize: 24, height: '100%' }}
                className='input-title'
                value={state.article.title}
                onChange={onChange}
                placeholder="请输入文章标题"
                bordered={false} />
            </div>
            <div className="header-right">
              <Button type="primary" onClick={publishPosts} >发布</Button>
              <Button type="primary" onClick={toDrafts}>草稿箱</Button>
            </div>
          </div>
          <div className="bootom">
            <MdEditor
              // ref={mdEditor}
              value={state.article.content || ""}
              // value={content}
              style={{ height: "100vh" }}
              onChange={handleEditorChange}
              // renderHTML={text => <ReactMarkdown children={text} />}
              renderHTML={text => mdParser.render(text)}
            />
          </div>
        </div>
      </Spin>
    </React.Fragment>
  )
}


export default EditorArticle




