
import * as React from 'react'
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'

import {
  Button,
  Input
} from 'antd'

// import request from '../../../../utils/request'

import { request } from '../../../../utils'

import 'react-markdown-editor-lite/lib/index.css';
import './index.css'

import { useLocation, useNavigate } from 'react-router-dom'

const mdParser = new MarkdownIt(/* Markdown-it options */);

const initialState = {
  article: {
    id: null,
    title: null,
    content: null,
    content_html: null
  }
};

const reducer = (state: any, action: any) => {

  switch (action.type) {
    case 'READ_DONE':
      return state
    case 'CREATE':
      return { count: state.count + 1 };
    case 'UPDATE':
      const { content, content_html } = action.payload
      state.article.content = content
      state.article.content_html = content_html
      console.log("update===>", state)
      return { article: state.article }
    case 'UPDATE_TITLE':
      const { title } = action.payload
      state.article.title = title
      return { article: state.article }
    case "UPDATE_ID":
      const { id } = action.payload
      state.article.id = id
      return { article: state.article }
    default:
      return state
  }
};

const EditorArticle: React.FC = () => {

  // const navigate = useNavigate();
  const location: any = useLocation() // {id,status:draft}
  console.log('location===>', location)
  // const mdEditor: any = React.useRef(null);
  // const [id, setId] = React.useState<any>(null)
  // const [title, setTitle] = React.useState<any>("")
  // const [content, setContent] = React.useState<string | undefined>(undefined);
  // const [html, setHtml] = React.useState<string | undefined>(undefined)

  // const [article, setArticle] = React.useState();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  console.log("state===>", state)

  const getArticle = () => {

  }

  const createArticle = () => {
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
    console.log('方法一')
  }, [])
  
  React.useEffect(() => {
    console.log('方法二')
  }, [])

  const updateArticle = () => {
    console.log("updateArticle.state===>", state)
    const { article } = state
    request({ url: `/api/user/v1/article/${article.id}/`, method: 'PUT', data: { ...article } }).then((r: any) => {
      console.log('updateArticle===>', r)
    }).catch((e) => {
      console.log('updateArticle.err===>', e)
    }).finally(() => {

    })
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      console.log("state.article===>", state.article)
      if (!state.article.id) {
        createArticle()
      } else if (state.article.id) {
        updateArticle()
      }
    }, 5000 * 2);
    return () => clearInterval(interval)
  }, [])

  const onChange = (e: any) => {
    const title = e.target.value
    dispatch({ type: 'UPDATE_TITLE', payload: { title } })
  }

  // React.useEffect(() => {
  //   updateArticle()
  // }, [state])



  const handleEditorChange = ({ html, text }: any) => {
    console.log("handleEditorChange===>", html)
    console.log("handleEditorChange===>", text)
    // const newValue = text.replace(/\d/g, "");
    // setContent(text);
    // setHtml(html)
    // const { article } = state
    // if (!article.id) {
    //   console.log('创建')
    // }
    dispatch({ type: 'UPDATE', payload: { content_html: html, content: text } })
  };

  const publishPosts = () => {

  }

  const toDrafts = () => {

  }


  return (
    <React.Fragment>
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
    </React.Fragment>
  )
}


export default EditorArticle




