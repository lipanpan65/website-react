import * as React from 'react'
import {
  Button, Col,
  Form,
  Input, Modal,
  Radio, Row, Space, Table,
  Flex,
  Tag, message, theme
} from 'antd'
import type { TableProps, FormInstance } from 'antd';
import { ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons';
import { request } from '@/utils';
import { dateFormate } from '@/utils';
import './index.css'
import { ArticleCategoryProvider, useArticleCategory } from '@/hooks/state/useArticleCategory';
import AppSearch from '@/components/AppSearch';
import AppContent from '@/components/AppContent';
import AppContainer from '@/components/AppContainer';
import AppTable from '@/components/AppTable';
import ConfirmableButton from '@/components/ConfirmableButton';
import { api } from '@/api';


// const api = {
//   fetch: (params?: any) => request({
//     url: `/api/user/v1/article_category`,
//     method: 'GET',
//     params
//   }).then((r: any) => {
//     const { status, statusText } = r
//     if (status === 200 && statusText === 'OK') {
//       return r.data
//     } else {
//       return r.data
//     }
//   }).catch((e: any) => e)
// }

// type FormInstance

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};


interface AppArticleCategorySearchProps {
  showModel: (event: React.MouseEvent<HTMLElement>, data: any) => void;
  onFormInstanceReady: (instance: FormInstance<any>) => void;
  setQueryParams: (params: any) => void;
}

// 定义分页和表格数据的类型
interface PaginationProps {
  total: number;
  current: number;
  pageSize: number;
}

interface DataItem {
  id: number;
  name: string;
  description: string;
}

interface AppArticleCategoryTableProps {
  data?: {
    page: PaginationProps;
    data: any[];  // 数据数组，包含 id, name, description
  };
  columns?: any;  // 设置可选
  onChange?: (pagination: PaginationProps, filters?: any, sorter?: any) => void;  // 新增 onChange 属性
}

const AppArticleCategorySearch: React.FC<AppArticleCategorySearchProps> = ({
  showModel,
  onFormInstanceReady,
  setQueryParams,
}) => {

  const { state } = useArticleCategory();
  const formRef = React.useRef<FormInstance | null>(null);

  const handleFormInstanceReady = (form: FormInstance) => { // 该 form 为 AppSearchForm 中的实例
    formRef.current = form; // 将 AppSearchForm 中的 form 传递给当前组件
    onFormInstanceReady(form); // 将 form 实例传递给父组件
  };

  const buttonConfig = {
    label: '添加',
    type: 'primary' as const,  // 明确指定类型以符合 ButtonConfig
    onClick: (event: React.MouseEvent<HTMLElement>) => showModel(event, {}),
    disabled: false,
    icon: <PlusCircleOutlined />,  // 例如使用 Ant Design 的图标
  };

  return (
    <React.Fragment>
      <AppContent>
        <AppSearch
          buttonConfig={buttonConfig}  // 动态按钮配置
          onFormInstanceReady={handleFormInstanceReady}
          setQueryParams={setQueryParams}
          initialParams={state.params}
          formItems={[
            {
              name: 'search',
              placeholder: '请输入...',
              type: 'input',
            },
            {
              name: 'enable',
              placeholder: '请选择角色类型',
              type: 'select',
              width: 150,
              selectConfig: {
                allowClear: true,
                options: [
                  { label: '启用', value: 1 },
                  { label: '禁用', value: 0 },
                ],
              },
            },
          ]}
        />
      </AppContent>
      {/* <Form
        form={form}
        name="control-hooks"
      >
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className='search'>
          <Button type="primary" onClick={(event: any) => showModel(event, {})}>添加</Button>
          <Form.Item
            name="search"
            rules={[{ required: false }]}>
            <Input
              placeholder='请搜索...'
              allowClear
              // onPressEnter={onPressEnter}
              onPressEnter={(e: any) => onPressEnter('search', e)}
              onFocus={() => { console.log('onFocus') }}
              onBlur={() => { console.log('onBlur') }}
            />
          </Form.Item>
        </Row>
      </Form> */}
    </React.Fragment >
  )
}

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York',
    // address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No',
    tags: ['cool', 'teacher'],
  },
];

const AppArticleCategoryTable: React.FC<AppArticleCategoryTableProps> = ({
  columns = [], // 设置默认值为空数组
  onChange
}) => {
  const { state } = useArticleCategory();
  const { page = { total: 0, current: 1, pageSize: 10 }, data = [], loading } = state;
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (onChange) {
      onChange(pagination, filters, sorter);  // 确保 onChange 已定义
    }
  };

  return (
    <React.Fragment>
      <AppContent>
        <AppTable
          data={{ page, data }}
          columns={columns}
          onChange={handleTableChange}
          loading={loading}
        />
      </AppContent>
    </React.Fragment>
  )
}

interface ArticleCategory {
  category_name?: string;
  remark?: string;
}

interface CategoryModelProps {
  ref: null;
  open: boolean;
  onOK: (values: ArticleCategory) => void;
  onCancel: () => void;
  initialValues: ArticleCategory;
}

interface ModelFormProps {
  isUpdate: boolean;
  initialValues: ArticleCategory;
  onFormInstanceReady: (instance: FormInstance<ArticleCategory>) => void;
}

const ModelForm: React.FC<ModelFormProps> = ({
  isUpdate,
  initialValues,
  onFormInstanceReady,
}) => {
  const [form] = Form.useForm();

  // 组件渲染完成将组件回传给 ModelForm
  React.useEffect(() => {
    onFormInstanceReady(form);
  }, []);


  const validateNameExists = (_: any, category_name: any) => new Promise(async (resolve, reject) => {
    const id = form.getFieldValue('id')
    if (id) {
      resolve(category_name)
    }
    const r: any = await request({
      url: `/api/user/v1/article_category/validate_category_name`,
      method: 'GET',
      params: { category_name }
    })
    const { data: { code, success, message: msg } } = r
    if (!success) {
      reject(msg)
    } else {
      resolve(category_name)
    }
  })

  return (
    <React.Fragment>
      <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
        <Form.Item
          name="category_name"
          label="分类名称"
          rules={[
            { required: true, message: '请输入分类名称' },
            { validator: validateNameExists }
          ]}
        >
          <Input
            placeholder='请输入分类名称'
            disabled={isUpdate}
          />
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <Input.TextArea
            placeholder='请输入备注'
            showCount maxLength={100} />
        </Form.Item>
      </Form>
    </React.Fragment>
  )
}

const AppArticleCategoryDialog: any = React.forwardRef((props: any, ref: any) => {
  const { initialValues, onSubmit } = props
  const [open, setOpen] = React.useState<boolean>(false);
  // 将 formInstance 回传到组件中
  const [formInstance, setFormInstance] = React.useState<FormInstance>();

  const [formValues, setFormValues] = React.useState<any>({})

  React.useEffect(() => {
    formInstance?.setFieldsValue({ ...formValues })
  }, [formInstance, data])

  const showModel = (open: boolean, data?: any) => {
    Promise.resolve().then(() => {
      setOpen(preState => open)
    }).then(() => {
      if (data) {
        setFormValues(() => data)
      }
    })
  }

  const onOk = () => {
    formInstance?.validateFields()
      .then((values: any) => {
        if (formValues.id) {
          values["id"] = formValues.id
        }
        onSubmit(values)
      }).catch((e: any) => {
        console.log('e', e)
        return;
      })
  }

  const onCancel = () => {
    formInstance?.resetFields();
    setOpen(false)
  }

  // 仅仅需要处理一些回掉即可
  const afterOpenChange = (open: any) => {
    formInstance?.setFieldsValue({
      ...formValues
    })
  }

  React.useImperativeHandle(ref, () => ({
    onOk,
    onCancel,
    setOpen,
    showModel,
    setFormValues
  }))

  return (
    <React.Fragment>
      <Modal
        open={open}
        title="创建文章分类"
        okText="确定"
        cancelText="取消"
        okButtonProps={{ autoFocus: true }}
        onCancel={onCancel}
        destroyOnClose
        onOk={onOk}
      >
        <ModelForm
          initialValues={initialValues}
          onFormInstanceReady={(instance) => {
            setFormInstance(instance);
          }}
          isUpdate={!!formValues.id}
        />
      </Modal>
    </React.Fragment>
  )
})


const AppArticleCategory = (props: any) => {
  const { state, enhancedDispatch } = useArticleCategory();
  const dialogRef: any = React.useRef()
  const searchFormRef = React.useRef<FormInstance | null>(null);
  const [queryParams, setQueryParams] = React.useState<any>({})

  const columns: TableProps<DataType>['columns'] = [
    {
      title: '分类名称',
      dataIndex: 'category_name',
      key: 'category_name',
      render: (text: any) => <a>{text}</a>,
    },
    {
      title: '更新人',
      dataIndex: 'update_user',
      key: 'update_user',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      render: dateFormate
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button size='small' color="primary" variant="link" onClick={(event: any) => showModel(event, record)}>
            编辑
          </Button>
          <ConfirmableButton
            type='link'
            onSubmit={() => onSubmit('DELETE', record)}
          >删除</ConfirmableButton>
        </Space>
      ),
    },
  ];

  const onChange = (pagination: any) => {
    setQueryParams((preQueryParams: any) => {
      return {
        ...preQueryParams,
        page: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total
      }
    })
  }


  const onSubmit = async (
    actionType: 'CREATE' | 'UPDATE' | 'DELETE',
    data: Record<string, any>
  ) => {
    // 确定请求方法
    const requestAction =
      actionType === 'DELETE'
        ? () => api.articleCategory.delete(data.id)
        : actionType === 'UPDATE'
          ? api.articleCategory.update
          : api.articleCategory.create;

    // 设定响应消息
    const responseMessages = {
      success: actionType === 'UPDATE' ? '更新成功' : actionType === 'DELETE' ? '删除成功' : '创建成功',
      error: actionType === 'UPDATE' ? '更新失败，请重试' : actionType === 'DELETE' ? '删除失败，请重试' : '创建失败，请重试',
    };

    // 执行状态更新
    enhancedDispatch({ type: actionType, payload: { data } });

    try {
      const response = await requestAction(data);
      const messageText = response?.success ? responseMessages.success : response?.message || responseMessages.error;
      message[response?.success ? 'success' : 'error'](messageText);
    } catch (error) {
      console.error('提交出错:', error);
      message.error('提交出错，请检查网络或稍后重试');
    } finally {
      await queryArticleCategory();
    }
  };

  React.useEffect(() => {
    if (Object.keys(queryParams).length > 0) {
      enhancedDispatch({ type: 'UPDATE_PARAMS', payload: { params: queryParams } });
    }
  }, [queryParams]);

  const onFormInstanceReady = (form: FormInstance) => {
    searchFormRef.current = form; // 将 form 实例存储到 ref
  };

  const showModel = (event: any, data?: any) => {
    dialogRef.current.showModel(true, data)
  }

  const queryArticleCategory = async () => {
    try {
      const { params } = state;
      const response = await api.articleCategory.fetch(params);
      if (response && response.success) {
        const { data, page } = response.data;
        enhancedDispatch({
          type: 'READ_DONE', payload: {
            data, page
          }
        });
      } else {
        message.error(response?.message || '获取数据失败');
      }
    } catch (error) {
      message.error('请求失败，请稍后重试');
    }
  };

  React.useEffect(() => {
    (async () => {
      await queryArticleCategory();
    })();
  }, [state.params]);

  return (
    <React.Fragment>
      <AppContainer>
        <AppArticleCategorySearch
          showModel={showModel}
          onFormInstanceReady={onFormInstanceReady}
          setQueryParams={setQueryParams}
        />
        <AppArticleCategoryTable
          columns={columns}
          onChange={onChange}
        />
        <AppArticleCategoryDialog
          ref={dialogRef}
          onSubmit={onSubmit}
        />
      </AppContainer>
    </React.Fragment>
  )
}

export default () => (
  <ArticleCategoryProvider>
    <AppArticleCategory />
  </ArticleCategoryProvider>
);

