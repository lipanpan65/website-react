import React, { useReducer, useState, useEffect, useRef, createContext } from 'react';
import { Button, FormInstance, Input, Select, Spin, message } from 'antd';
import { LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import Publish from './publish';
import { useNavigate, useParams } from 'react-router-dom';
import { request } from '@/utils';
import 'react-markdown-editor-lite/lib/index.css';
import './index.css';
import { ArticleEditorProvider, useArticleEditor } from '@/hooks/state/useArticleEditor';
import AppDialog from '@/components/AppDialog';
import { api } from '@/api';
import AppLayout from '@/components/AppLayout';

const mdParser = new MarkdownIt();


// 提取纯汉字的函数
const extractChineseSummary = (markdownText: string, maxLength: number) => {
  if (!markdownText) return '';

  // 去掉代码块
  markdownText = markdownText.replace(/```[^`\n]*\n+[^```]+```/g, '');

  // 去掉行内代码
  markdownText = markdownText.replace(/`[^`\n]+`/g, '');

  // 去掉标题（# 开头的内容）
  markdownText = markdownText.replace(/^#+\s*(.*)$/gm, '');

  // 去掉其他 Markdown 语法，比如链接和图片
  markdownText = markdownText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // 链接
  markdownText = markdownText.replace(/!\[([^\]]+)\]\([^)]+\)/g, ''); // 图片
  markdownText = markdownText.replace(/\*\*(.*?)\*\*/g, '$1'); // 粗体
  markdownText = markdownText.replace(/\*(.*?)\*/g, '$1'); // 斜体
  markdownText = markdownText.replace(/[-_*~`>]/g, ''); // 删除 Markdown 常见符号

  // 移除多余的空格、换行符，仅保留汉字
  const chineseOnly = markdownText
    .replace(/[^\u4e00-\u9fa5\s]/g, '') // 只保留汉字和空格
    .replace(/\s+/g, ' ') // 合并多余的空格
    .trim();

  return chineseOnly.substring(0, maxLength);
};

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



const ArticlePublishDialog = React.forwardRef((props: any, ref) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { onSubmit, initialValues } = props
  const [record, setRecord] = React.useState<any>({}) // 添加状态管理表示当前数据
  const [formInstance, setFormInstance] = React.useState<FormInstance | null>(null);
  const [options, setOptions] = React.useState<any[]>([])

  // 监听 record 变化并更新表单
  React.useEffect(() => {
    if (formInstance && record) {
      console.log("Updating form with record:", record);
      if (!!record) {
        console.log("首次发布")
        // 提取 content 的纯汉字摘要
        const summary = extractChineseSummary(record.content || '', 100);
        formInstance.setFieldsValue({
          ...record,
          summary,
          // summary: record.content ? record.content.substring(0, 100) : '',
        });
      } else {
        formInstance.setFieldsValue(record);
      }
    }
  }, [record, formInstance]);

  // 查询分类数据
  const queryCategories = async () => {
    try {
      const response: any = await request({
        url: `/api/user/v1/article_category`,
        method: 'GET',
      }); // 替换为你的后端接口
      console.log("queryCategories", response)
      const { data: { page, data }, success } = response
      if (success) {
        //  const data = data.map((v: any) => ({ value: v.id, label: v.category_name })
        setOptions(data.map((v: any) => ({ value: v.id, label: v.category_name })))
      }
    } catch (error) {
      console.error('分类数据获取失败:', error);
      message.error('分类数据加载失败，请稍后重试！');
    }
  };

  React.useEffect(() => {
    queryCategories(); // 组件加载时调用查询分类
  }, []); // 空依赖数组表示仅加载一次

  const fields = [
    {
      label: '分类',
      name: 'category_id',
      rules: [{ required: true, message: '请输入分类名称' }],
      component: <Select
        placeholder="请输入分类名称" allowClear
        options={options}
      />
    },
    {
      label: '编辑摘要',
      name: "summary",
      component: <Input.TextArea placeholder="请输入备注" showCount maxLength={100} />,
    },
  ]

  const showModel = (isOpen: boolean, data?: any) => {
    setOpen(isOpen);
    if (isOpen && data) {
      setRecord(data); // 更新 record 状态
    }
  };


  const handleSubmit = async () => {
    try {
      const payload = await formInstance?.validateFields();
      await onSubmit('PUBLISH', { id: record.id, ...payload, });
      setOpen(false);
    } catch (error) {
      message.error('请检查表单内容');
    }
  };

  const onCancel = () => {
    formInstance?.resetFields();
    setOpen(false);
  };

  React.useImperativeHandle(ref, () => ({
    showModel,
    onCancel,
    setOpen,
  }));


  return (
    <React.Fragment>
      <AppDialog
        title='发布文章'
        fields={fields}
        record={record}
        onCancel={onCancel}
        open={open}
        onSubmit={handleSubmit}
        isEditing={!!record.id}
        setFormInstance={(instance) => {
          setFormInstance(instance);
        }}
      />
    </React.Fragment>
  )
})


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
  // const navigate = useNavigate();
  const navigator = useNavigate()

  const { state, enhancedDispatch } = useArticleEditor();
  const [saveStatus, setSaveStatus] = useState('文章将自动保存到草稿箱');
  const dialogRef: any = React.useRef()
  const isSaving = useRef(false);

  const showModel = (_: any, data?: any) => {
    // const record = state.article
    console.log(state.article)
    dialogRef.current.showModel(true, state.article)
  }

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
    if (res.success) {
      console.log("createArticle", res)
      enhancedDispatch({ type: 'UPDATE_ARTICLE', payload: { id: res.data.id } });
    }
  };

  const updateArticle = async () => {
    const { article } = state;
    await request({ url: `/api/user/v1/article/${article.id}/`, method: 'PUT', data: article });
  };

  const onSubmit = async (actionType: 'PUBLISH', data: Record<string, any>) => {
    const url = `/api/user/v1/article/${data.id}/publish/`
    const method = 'POST';

    try {
      const response = await request({ url, method, data });
      console.log
      if (response.success) {
        message.success('发布成功');
        navigator(`/user/article/overview`, {
          // replace: true
          state: {
            // id: article.id,
            // status: 'draft',
          }
        })
      } else {
        message.error(response?.data?.message || '发布失败，请稍后重试');
      }
    } catch (error) {
      console.error('操作出错:', error);
      message.error('操作出错，请检查网络或稍后重试');
    }
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
    navigator('/user/creator/overview');
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
              <Button type="primary" onClick={showModel}>发布</Button>
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
          <ArticlePublishDialog
            ref={dialogRef}
            onSubmit={onSubmit}
          // initialValues={}
          />
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