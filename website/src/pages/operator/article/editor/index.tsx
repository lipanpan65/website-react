
import * as React from 'react'
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'

import {
  // Button,
  Input
} from 'antd'

import request from '../../../../utils/request'

import 'react-markdown-editor-lite/lib/index.css';
import './index.css'

import { useLocation, useNavigate } from 'react-router-dom'

const mdParser = new MarkdownIt(/* Markdown-it options */);

const initialState = {
  article: {
    id: null,
    title: null,
    text: null,
    html: null
  }
};

const reducer = (state: any, action: any) => {
  // console.log("state===>", state)
  // console.log("action===>", state)
  switch (action.type) {
    case 'CREATE':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'UPDATE':
      // console.log("update===>", state)
      const { text, html } = action.payload
      let { article } = state
      article.text = text
      article.html = html
      return { article: article }
    case 'UPDATE_TITLE':
      const { title } = action.payload
      state.article.title = title
      return { article: state.article }
    default:
      return state
  }
};

const EditorArticle: React.FC = () => {

  // const navigate = useNavigate();
  // const location: any = useLocation() // {id,status:draft}
  // const mdEditor: any = React.useRef(null);
  // const [id, setId] = React.useState<any>(null)
  // const [title, setTitle] = React.useState<any>("")
  // const [content, setContent] = React.useState<string | undefined>(undefined);
  // const [html, setHtml] = React.useState<string | undefined>(undefined)

  // const [article, setArticle] = React.useState();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  console.log("state===>", state)

  const updateArticle = () => {
    console.log("updateArticle.state===>", state)
    // request({ ...state }).then((r: any) => {

    // }).catch((e) => {

    // }).finally(() => {
    
    // })
  }

  const onChange = (e: any) => {
    const title = e.target.value
    dispatch({ type: 'UPDATE_TITLE', payload: { title } })
  }

  React.useEffect(() => {
    // console.log("发送请求", state)
    updateArticle()
  }, [state])

  const handleEditorChange = ({ html, text }: any) => {
    // console.log("handleEditorChange===>", html)
    // console.log("handleEditorChange===>", text)
    // const newValue = text.replace(/\d/g, "");
    // setContent(text);
    // setHtml(html)
    dispatch({ type: 'UPDATE', payload: { html, text } })
  };

  return (
    <React.Fragment>
      <div className='edit-container'>
        <div className='header'>
          <div className="header-left">
            <Input
              style={{ fontSize: 24 }}
              className='input-title'
              value={state.article.title}
              onChange={onChange}
              placeholder="请输入文章标题"
              bordered={false} />
          </div>
          <div className="header-right">
            {/* <Button type="primary" onClick={publishPosts} >发布</Button>
            <Button type="primary" onClick={toDrafts}>草稿箱</Button> */}
          </div>
        </div>
        <div className="bootom">
          <MdEditor
            // ref={mdEditor}
            value={state.article.text || ""}
            // value={content}
            style={{ height: "500px" }}
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




