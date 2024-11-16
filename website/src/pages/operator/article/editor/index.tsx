import React, { useReducer, useState, useEffect, useRef, createContext } from 'react';
import { Button, Input, Spin, message } from 'antd';
import { LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import Publish from './publish';
import { useNavigate, useParams } from 'react-router-dom';
import { request } from '@/utils';
import 'react-markdown-editor-lite/lib/index.css';
import './index.css';
import { ArticleEditorProvider, useArticleEditor } from '@/hooks/state/useArticleEditor';

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

// 定义 State 和 Action 类型
interface ArticleType {
  id: string | null;
  title: string | null;
  content: string | null;
  summary: string | null;
  html: string | null;
  category_id: string | null;
}

// const initialState = {
//   loading: false,
//   article: { id: null, title: null, content: null, summary: null, html: null, category_id: null },
//   options: [],
// };


// const reducer = (state: any, action: any) => {
//   switch (action.type) {
//     case 'READ':
//       return { ...state, loading: true };
//     case 'READ_DONE':
//       return { loading: false, article: action.payload.article };
//     case 'UPDATE_TITLE':
//       return { ...state, article: { ...state.article, title: action.payload.title } };
//     case 'UPDATE_CONTENT':
//       return {
//         ...state,
//         article: {
//           ...state.article,
//           content: action.payload.content,
//           html: action.payload.html,
//           summary: removeMarkdownSyntax(action.payload.content, 100),
//         }
//       };
//     case 'UPDATE_ID':
//       return { ...state, article: { ...state.article, id: action.payload.id } };
//     default:
//       return state;
//   }
// };

const useThrottle = (callback: () => Promise<void>, delay: number) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastExecTime = useRef<number>(0);

  const throttledFunction = async () => {
    const now = Date.now();

    // 如果距离上次执行的时间小于 delay，则延迟执行
    if (timerRef.current || now - lastExecTime.current < delay) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        lastExecTime.current = Date.now();
        await callback();
        timerRef.current = null;
      }, delay - (now - lastExecTime.current));
    } else {
      // 立即执行
      lastExecTime.current = now;
      await callback();
    }
  };

  return throttledFunction;
};

const ArticleEditor = () => {
  const params = useParams();
  const navigate = useNavigate();
  const publishRef = useRef<any>();
  // const [state, dispatch] = useReducer(reducer, initialState);
  const { state, enhancedDispatch } = useArticleEditor();
  const [saveStatus, setSaveStatus] = useState('文章将自动保存到草稿箱');
  const isSaving = useRef(false);

  const saveArticle = useThrottle(async () => {
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
    enhancedDispatch({ type: 'READ' });
    try {
      const res = await request({ url: `/api/user/v1/article/${id}`, method: 'GET' });
      if (res.success) {
        enhancedDispatch({ type: 'READ_DONE', payload: { article: res.data } });
      } else {
        message.error('操作失败');
      }
    } catch {
      message.error('加载文章失败');
    }
  };

  const createArticle = async () => {
    const { title, content, html } = state.article;
    const res = await request({
      url: '/api/user/v1/article/',
      method: 'POST',
      data: { title, content, html },
    });
    if (res.data.success) {
      enhancedDispatch({ type: 'UPDATE_ARTICLE', payload: { id: res.data.data.id } });
    }
  };

  const updateArticle = async () => {
    const { article } = state;
    await request({ url: `/api/user/v1/article/${article.id}/`, method: 'PUT', data: article });
  };

  // const handleInputChange = (field: keyof ArticleType, value: string) => {
  //   // 立即更新保存状态
  //   setSaveStatus('文章保存中...');
  //   isSaving.current = true;
  //   enhancedDispatch({ type: 'UPDATE_ARTICLE', payload: { [field]: value } });
  //   saveArticle();
  // };

  const handleInputChange = (fields: Partial<typeof state.article>) => {
    setSaveStatus('文章保存中...');
    isSaving.current = true;
    enhancedDispatch({ type: 'UPDATE_ARTICLE', payload: fields });
    saveArticle();
  };

  const handLinkToDrafts = () => {
    navigate('/user/creator/overview');
  };

  useEffect(() => {
    if (params.id && params.id !== 'new') getArticle(params.id);
  }, [params.id]);

  return (
    <React.Fragment>
      <Spin spinning={state.loading}>
        <div className="edit-container">
          <div className="header">
            <div className="header-left">
              <Input
                style={{ fontSize: 24, height: '100%' }}
                className="input-title"
                value={state.article.title || ""}
                // onChange={(e) => handleInputChange('title', e.target.value)}
                onChange={(e) => handleInputChange({ title: e.target.value })}
                placeholder="请输入文章标题"
                variant="borderless"
              />
            </div>
            <div className="header-right">
              <div className='save-status'>
                {saveStatus}
                {saveStatus === '文章保存中...' && (
                  <Spin
                    size="small"
                    indicator={<LoadingOutlined />}
                    style={{ marginLeft: '8px' }}
                  />
                )}
                {saveStatus === '保存成功' && (
                  <CheckCircleOutlined style={{ color: 'green', marginLeft: '8px' }} />
                )}
              </div>
              <Button type="primary" onClick={() => publishRef.current.showModel()}>发布</Button>
              <Button type="primary" onClick={handLinkToDrafts}>草稿箱</Button>
            </div>
          </div>
          <MdEditor
            value={state.article.content || ""}
            style={{ height: "100vh" }}
            // onChange={({ html, text }) => handleInputChange('content', text)}
            onChange={({ html, text }) => handleInputChange({ content: text, html })}
            renderHTML={text => mdParser.render(text)}
          />
          <Publish ref={publishRef} />
        </div>
      </Spin>
    </React.Fragment>
  );
};

export default () => (
  <ArticleEditorProvider>
    <ArticleEditor />
  </ArticleEditorProvider>
);