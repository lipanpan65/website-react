import React, { useReducer, useState, useEffect, useRef, createContext } from 'react';
import { Button, Input, Spin, message } from 'antd';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import Publish from './publish';
import { useNavigate, useParams } from 'react-router-dom';
import { request } from '@/utils';
import 'react-markdown-editor-lite/lib/index.css';
import './index.css';

const mdParser = new MarkdownIt();

const removeMarkdownSyntax = (markdownText: string, maxLength: number) => {
  markdownText = markdownText
    .replace(/^#.*$/gm, '')
    .replace(/^#+\s*(.*)$/gm, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]+)\]\([^)]+\)/g, '')
    .replace(/```[^`\n]*\n+[^```]+```\n+/g, "")
    .replace(/`([^`\n]+)`/g, "$1")
    .replace(/\n+/g, ' ')
    .trim();
  return markdownText.substring(0, maxLength);
};

const initialState = {
  loading: false,
  article: { id: null, title: null, content: null, summary: null, html: null, category_id: null },
  options: [],
};

export const EditArticleContext = createContext<{
  state: typeof initialState,
  dispatch: React.Dispatch<any>
}>({
  state: initialState,
  dispatch: () => { }
});

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'READ':
      return { ...state, loading: true };
    case 'READ_DONE':
      return { loading: false, article: action.payload.article };
    case 'UPDATE_TITLE':
      return { ...state, article: { ...state.article, title: action.payload.title } };
    case 'UPDATE_CONTENT':
      return {
        ...state,
        article: {
          ...state.article,
          content: action.payload.content,
          html: action.payload.html,
          summary: removeMarkdownSyntax(action.payload.content, 100),
        }
      };
    case 'UPDATE_ID':
      return { ...state, article: { ...state.article, id: action.payload.id } };
    default:
      return state;
  }
};

const throttle = (fn: () => void, delay: number) => {
  let timer: NodeJS.Timeout | null = null;
  return () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn();
      timer = null;
    }, delay);
  };
};

const ArticleEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const publishRef = useRef<any>();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [saveStatus, setSaveStatus] = useState('文章将自动保存到草稿箱');
  const isSaving = useRef(false);

  const saveArticle = throttle(async () => {
    if (!state.article.title && !state.article.content) return;
    setSaveStatus('文章保存中...');
    isSaving.current = true;
    
    if (state.article.id) {
      await updateArticle();
    } else {
      await createArticle();
    }

    setSaveStatus('保存成功');
    isSaving.current = false;
  }, 3000);

  const getArticle = async (id: string) => {
    dispatch({ type: 'READ' });
    try {
      const res = await request({ url: `/api/user/v1/article/${id}`, method: 'GET' });
      if (res.success) {
        dispatch({ type: 'READ_DONE', payload: { article: res.data } });
      } else {
        message.error('操作失败');
      }
    } catch {
      message.error('加载文章失败');
    }
  };

  const createArticle = async () => {
    const { title, content, html } = state.article;
    try {
      const res = await request({
        url: '/api/user/v1/article/',
        method: 'POST',
        data: { title, content, html },
      });
      if (res.data.success) {
        dispatch({ type: 'UPDATE_ID', payload: { id: res.data.data.id } });
      }
    } catch {
      message.error('创建文章失败');
    }
  };

  const updateArticle = async () => {
    const { article } = state;
    try {
      await request({ url: `/api/user/v1/article/${article.id}/`, method: 'PUT', data: article });
    } catch {
      message.error('更新文章失败');
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_TITLE', payload: { title: e.target.value } });
    saveArticle();
  };

  const handleEditorChange = ({ html, text }: { html: string, text: string }) => {
    dispatch({ type: 'UPDATE_CONTENT', payload: { html, content: text } });
    saveArticle();
  };

  const handLinkToDrafts = () => {
    navigate('/user/creator/overview');
  };

  useEffect(() => {
    if (params.id && params.id !== 'new') getArticle(params.id);
  }, [params.id]);

  return (
    <EditArticleContext.Provider value={{ state, dispatch }}>
      <Spin spinning={state.loading}>
        <div className="edit-container">
          <div className="header">
            <div className="header-left">
              <Input
                style={{ fontSize: 24, height: '100%' }}
                className="input-title"
                value={state.article.title || ""}
                onChange={handleTitleChange}
                placeholder="请输入文章标题"
                variant="borderless"
              />
            </div>
            <div className="header-right">
              <div className='save-status'
              >{saveStatus}</div>
              <Button type="primary" onClick={() => publishRef.current.showModel()}>发布</Button>
              <Button type="primary" onClick={handLinkToDrafts}>草稿箱</Button>
            </div>
          </div>
          <MdEditor
            value={state.article.content || ""}
            style={{ height: "100vh" }}
            onChange={handleEditorChange}
            renderHTML={text => mdParser.render(text)}
          />
          <Publish ref={publishRef} />
        </div>
      </Spin>
    </EditArticleContext.Provider>
  );
};

export default ArticleEditor;
