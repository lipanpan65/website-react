import * as React from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {
  Button,
  FormInstance, Input, message, Modal, Select, Space, TableProps
} from 'antd';

import { ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons';

import { request } from '@/utils';
import { api } from '@/api';
import AppContainer from '@/components/AppContainer'
import AppContent from '@/components/AppContent';
import AppSearch from '@/components/AppSearch';
import AppTable from '@/components/AppTable';
import AppDialog from '@/components/AppDialog';
import ConfirmableButton from '@/components/ConfirmableButton';
import CodeMirrorEditor from '@/components/CodeMirrorEditor';
import { useGlobalDict, GlobalProvider } from '@/hooks/state/useGlobalDict';
import StatusTag from '@/components/StatusTag';

interface AppGlobalDictSearchProps {
  showModel: (event: React.MouseEvent<HTMLElement>, data: any) => void;
  onFormInstanceReady: (instance: FormInstance<any>) => void;
  setQueryParams: (params: any) => void;
}

const AppGlobalDictSearch: React.FC<AppGlobalDictSearchProps> = ({
  showModel,
  onFormInstanceReady,
  setQueryParams,
}) => {
  const { state, enhancedDispatch } = useGlobalDict();
  const formRef = React.useRef<FormInstance | null>(null);

  const handleFormInstanceReady = (form: FormInstance) => { // 该 form 为 AppSearchForm 中的实例
    formRef.current = form; // 将 AppSearchForm 中的 form 传递给当前组件
    onFormInstanceReady(form); // 将 form 实例传递给父组件
  };

  const handleSearchClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log('搜索按钮点击');
    // 你可以在这里添加显示模态框的逻辑，例如调用 showModel
  };

  const buttonConfig = {
    label: '添加',
    type: 'primary' as const,  // 明确指定类型以符合 ButtonConfig
    onClick: (event: React.MouseEvent<HTMLElement>) => showModel(event, {}),
    disabled: false,
    icon: <PlusCircleOutlined />,  // 例如使用 Ant Design 的图标
  };

  // 使用 form 实例的地方
  const handleFormSubmit = async () => {
    try {
      // 获取表单值
      const values = await formRef.current?.validateFields();
      setQueryParams(values); // 更新查询参数
      console.log('表单提交成功，值为:', values);
    } catch (errorInfo) {
      console.error('表单验证失败:', errorInfo);
    }
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
              placeholder: '请选择分类',
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
    </React.Fragment>
  )
}

const AppGlobalDictDialog = React.forwardRef((props: any, ref) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { onSubmit, initialValues } = props
  const [formInstance, setFormInstance] = React.useState<FormInstance | null>(null);
  const [record, setRecord] = React.useState<any>({}) // 添加状态管理表示当前数据

  const fields = [
    {
      label: '字典名称',
      name: 'cname',
      rules: [{ required: true, message: '请输入字典名称' }],
      component: <Input placeholder="请输入字典名称" />,
      span: 12,  // 使字段占据一半宽度
    },
    {
      label: 'ckey',
      name: 'ckey',
      rules: [{ required: true, message: '请输入ckey' }],
      component: <Input placeholder="请输入ckey" />,
      span: 12,  // 使字段占据一半宽度
    },
    {
      label: '状态',
      name: 'enable',
      component: (
        <Select placeholder="请选择状态">
          <Select.Option value={1}>启用</Select.Option>
          <Select.Option value={0}>禁用</Select.Option>
        </Select>
      ),
      span: 12,  // 使字段占据一半宽度
    },
    {
      label: 'cvalue',
      name: 'cvalue',
      rules: [
        { validator: (_: any, value: string) => value.trim() ? Promise.resolve() : Promise.reject('请输入cvalue') }
      ],
      component: (
        <CodeMirrorEditor
          lines={5}
          value={formInstance?.getFieldValue('cvalue') || ''}
          onChange={(newValue) => {
            formInstance?.setFieldsValue({ cvalue: newValue });
          }}
        />
      ),
      span: 24,  // 使字段占据一半宽度
    },
    {
      name: 'remark',
      label: '备注',
      component: <Input.TextArea placeholder="请输入备注" showCount maxLength={100} />,
      span: 24,
    },
  ];

  // 监听 record 变化并更新表单
  React.useEffect(() => {
    if (formInstance && record) {
      console.log("Updating form with record:", record);
      formInstance.setFieldsValue(record);
    }
  }, [record, formInstance]);

  const showModel = (isOpen: boolean, data?: any) => {
    setOpen(isOpen);
    if (isOpen && data) {
      setRecord(data); // 更新 record 状态
    }
  };

  const handleSubmit = async () => {
    try {
      const data = await formInstance?.validateFields();
      if (!!record.id) {
        const newRecord = { id: record.id, ...data };
        await onSubmit('UPDATE', newRecord); // 不再需要传递 `dispatch`
      } else {
        await onSubmit('CREATE', data); // 不再需要传递 `dispatch`
      }
      // enhancedDispatch((dispatch) => onSubmit(dispatch, 'UPDATE', newRecord));
      setOpen(false);
    } catch (error: any) {
      console.error('捕获的异常:', error);
      message.error(error.message || '表单验证失败，请检查输入内容。');
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
        title='添加字典'
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
  );
});

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

interface AppGlobalDictProps {
  data?: {
    page: PaginationProps;
    data: any;  // 数据数组，包含 id, name, description
  };
  columns?: any;  // 设置可选
  onChange?: (pagination: PaginationProps, filters?: any, sorter?: any) => void;  // 新增 onChange 属性
}

const AppGlobalDictTable: React.FC<AppGlobalDictProps> = ({
  columns = [], // 设置默认值为空数组
  onChange
}) => {
  const { state, enhancedDispatch } = useGlobalDict();

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

const AppGlobalDict = () => {
  const { state, enhancedDispatch } = useGlobalDict();
  const dialogRef: any = React.useRef()
  const dataTableRef: any = React.useRef()
  const navigate = useNavigate()
  // const [formInstance, setFormInstance] = React.useState<FormInstance>();
  const searchFormRef = React.useRef<FormInstance | null>(null);
  const [queryParams, setQueryParams] = React.useState<any>({})

  console.log("Initial state at render:", state);

  // const handleSetQueryParams = (newParams: any) => {
  //   console.log("Received newParams:", newParams);
  //   console.log("Type of newParams:", typeof newParams);

  //   setQueryParams((prevQueryParams: any) => {
  //     // 检查 newParams 是否是函数，如果是，调用它并传入当前状态
  //     const resolvedParams = typeof newParams === 'function' ? newParams(prevQueryParams) : newParams;

  //     // 合并参数
  //     const queryParams = { ...prevQueryParams, ...resolvedParams };
  //     console.log("Updated Params in handleSetQueryParams:", queryParams);

  //     // 调用 enhancedDispatch 更新全局 state
  //     enhancedDispatch({ type: 'UPDATE_PARAMS', payload: { params: queryParams } });
  //     return queryParams;
  //   });
  // };

  const handleSetQueryParams = (newParams: any) => {
    setQueryParams((prevQueryParams: any) => {
      const resolvedParams = typeof newParams === 'function' ? newParams(prevQueryParams) : newParams;
      return { ...prevQueryParams, ...resolvedParams };
    });
  };

  // 使用 useEffect 监听 queryParams 变化并触发 enhancedDispatch
  React.useEffect(() => {
    if (Object.keys(queryParams).length > 0) {
      enhancedDispatch({ type: 'UPDATE_PARAMS', payload: { params: queryParams } });
    }
  }, [queryParams]);


  const columns: TableProps<any>['columns'] = [
    {
      title: '#', dataIndex: 'id', key: 'id', sorter: true,
    },
    {
      title: '字典名称', dataIndex: 'cname', key: 'cname',
    },
    {
      title: 'ckey', dataIndex: 'ckey', key: 'ckey',
    },
    {
      title: 'cvalue',
      dataIndex: 'cvalue',
      key: 'cvalue',
    },
    {
      title: '状态',
      dataIndex: 'enable',
      key: 'enable',
      render: (text: number) => <StatusTag status={text} />
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      // sortOrder: 'descend',
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
      )
    },
  ];

  const onSubmit = async (
    actionType: 'CREATE' | 'UPDATE' | 'DELETE',
    data: Record<string, any>
  ) => {
    // 确定请求方法
    const requestAction =
      actionType === 'DELETE'
        ? () => api.globalDict.delete(data.id)
        : actionType === 'UPDATE'
          ? api.globalDict.update
          : api.globalDict.create;

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
      await queryGlobalDict();
    }
  };

  const showModel = (_: any, data?: any) => {
    dialogRef.current.showModel(true, data)
  }

  const onChange = (pagination: any) => {
    setQueryParams((preQueryParams: any) => {
      return {
        ...preQueryParams,
        page: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total
      }
    }
    )
  }

  const queryGlobalDict = async () => {
    try {
      const { params } = state;
      const response = await api.globalDict.fetch(params);
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
    console.log("Updated state.params in useEffect:", state.params);
    (async () => {
      await queryGlobalDict();
    })();
  }, [state.params]);

  // 用于处理 AppGlobalDictSearch 中传递的 form 实例
  const onFormInstanceReady = (form: FormInstance) => {
    searchFormRef.current = form; // 将 form 实例存储到 ref
  };

  // 示例：获取表单值
  const handleGetFormValues = () => {
    if (searchFormRef.current) {
      const values = searchFormRef.current.getFieldsValue();
      console.log('获取到的表单值:', values);
    }
  };

  // 示例：设置表单值
  const handleSetFormValues = () => {
    if (searchFormRef.current) {
      searchFormRef.current.setFieldsValue({
        search: '示例搜索',
        category: 'tech',
      });
      console.log('表单值已设置');
    }
  };

  // 示例：重置表单
  const handleResetForm = () => {
    if (searchFormRef.current) {
      searchFormRef.current.resetFields();
      console.log('表单已重置');
    }
  };

  return (
    <AppContainer>
      <AppGlobalDictSearch
        showModel={showModel}
        onFormInstanceReady={onFormInstanceReady}
        setQueryParams={setQueryParams}
      />
      <AppGlobalDictTable
        onChange={onChange}
        columns={columns}
      />
      <AppGlobalDictDialog
        ref={dialogRef}
        onSubmit={onSubmit}
      />
    </AppContainer>
  )
}

export default () => (
  <GlobalProvider>
    <AppGlobalDict />
  </GlobalProvider>
);