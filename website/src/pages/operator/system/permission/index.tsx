import * as React from 'react'

import { TableProps } from '@/types/common';

import { usePermission, PermissionData, PermissionProvider } from '@/hooks/state/usePermission';
import { useDialog } from '@/hooks/useDialog';
import AppContent from '@/components/AppContent';
import AppTable from '@/components/AppTable';
import { Button, FormInstance, Input, message, Select, Space } from 'antd';
import StatusTag from '@/components/StatusTag';
import ConfirmableButton from '@/components/ConfirmableButton';
import { api } from '@/api';
import AppContainer from '@/components/AppContainer';
import { PlusCircleOutlined } from '@ant-design/icons';
import AppSearch from '@/components/AppSearch';
import AppDialog from '@/components/AppDialog';

interface AppPermissionSearchProps {
  showModel: (event: React.MouseEvent<HTMLElement>, data: any) => void;
  onFormInstanceReady: (instance: FormInstance<any>) => void;
  setQueryParams: (params: any) => void;
}

const AppPermissionSearch: React.FC<AppPermissionSearchProps> = ({
  showModel,
  onFormInstanceReady,
  setQueryParams,
}) => {
  // 我想把 这个 state 同时也传递给 AppSearch 然后同时更新 state 中的 parasm 的参数
  const { state } = usePermission();

  // 使用 useRef 创建 form 实例的引用
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
              placeholder: '请选择状态',
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

const AppPermissonTable: React.FC<TableProps<PermissionData>> = ({
  columns = [], // 设置默认值为空数组
  onChange
}) => {
  const { state } = usePermission();

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

const AppPermissonDialog = React.forwardRef((props: any, ref) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { onSubmit, initialValues } = props
  const [formInstance, setFormInstance] = React.useState<FormInstance | null>(null);
  const [record, setRecord] = React.useState<any>({}) // 添加状态管理表示当前数据

  const fields = [
    {
      label: '权限名称',
      name: 'permission_name',
      rules: [{ required: true, message: '请输入权限名称' }],
      component: <Input placeholder="请输入权限名称" />,
      span: 12,  // 使字段占据一半宽度
    },
    {
      label: '权限唯一标识',
      name: 'permission_code',
      rules: [{ required: true, message: '请输入权限唯一标识' }],
      component: <Input placeholder="请输入权限唯一标识" />,
      span: 12,  // 使字段占据一半宽度
    },
    {
      label: '状态',
      name: 'enable',
      rules: [{ required: true, message: '请输入权限状态' }],
      component: (
        <Select placeholder="请选择状态" allowClear>
          <Select.Option value={1}>启用</Select.Option>
          <Select.Option value={0}>禁用</Select.Option>
        </Select>
      ),
      span: 12,
    },
    {
      label: '权限类型',
      name: 'category',
      rules: [{ required: true, message: '请输入权限类型' }],
      component: (
        <Select placeholder="请选择权限类型" allowClear>
          <Select.Option value={'user'}>普通用户</Select.Option>
          <Select.Option value={'sss'}>管理员</Select.Option>
          <Select.Option value={'admin'}>超级管理员</Select.Option>
        </Select>
      ),
      span: 12,
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
        const newRecord = Object.assign({}, data, { ...record })
        await onSubmit('CREATE', newRecord); // 不再需要传递 `dispatch`
      }
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
        title='添加权限'
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

const AppPermission: React.FC<any> = (props) => {
  const { state, enhancedDispatch } = usePermission();
  const { dialogRef, showModel } = useDialog();
  const searchFormRef = React.useRef<FormInstance | null>(null);
  const [queryParams, setQueryParams] = React.useState<any>({})

  const onFormInstanceReady = (form: FormInstance) => {
    searchFormRef.current = form; // 将 form 实例存储到 ref
  };

  const queryGlobalDict = async () => {
    const response = await api.globalDict.get({ ckey: 'ROLE_TYPE' });
    console.log("response===>", response)
  }


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

  React.useEffect(() => {
    if (Object.keys(queryParams).length > 0) {
      enhancedDispatch({ type: 'UPDATE_PARAMS', payload: { params: queryParams } });
    }
  }, [queryParams]);

  const queryPermissions = async () => {
    try {
      const { params } = state;
      const response = await api.permission.fetch(params);
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
      console.log("error", error)
      message.error('请求失败，请稍后重试');
    }
  };

  const onSubmit = async (
    actionType: 'CREATE' | 'UPDATE' | 'DELETE',
    data: Record<string, any>
  ) => {
    // 确定请求方法
    const requestAction =
      actionType === 'DELETE'
        ? () => api.permission.delete(data.id)
        : actionType === 'UPDATE'
          ? api.permission.update
          : api.permission.create;

    // 设定响应消息
    const responseMessages = {
      success: actionType === 'UPDATE' ? '更新成功' : actionType === 'DELETE' ? '删除成功' : '创建成功',
      error: actionType === 'UPDATE' ? '更新失败，请重试' : actionType === 'DELETE' ? '删除失败，请重试' : '创建失败，请重试',
    };

    // 执行状态更新
    enhancedDispatch({ type: actionType, payload: { data } });

    try {
      const response = await requestAction(data);
      console.log("response===>", response)
      const messageText = response?.success ? responseMessages.success : response?.message || responseMessages.error;
      message[response?.success ? 'success' : 'error'](messageText);
    } catch (error) {
      console.error('提交出错:', error);

      message.error('提交出错，请检查网络或稍后重试');
    } finally {
      await queryPermissions();
    }
  };

  const columns = [
    {
      title: '权限名称',
      dataIndex: 'permission_name',
      key: 'permission_name',
    },
    {
      title: '权限类型',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '状态',
      dataIndex: 'enable',
      key: 'enable',
      render: (text: number) => <StatusTag status={text} />
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button size='small' color="primary" variant="link" onClick={(event: any) => showModel(event, {
            parent_permission_id: record.id
          })}>
            添加子权限
          </Button>
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
  ]

  React.useEffect(() => {
    (async () => {
      await queryPermissions();
      await queryGlobalDict();
    })();
  }, [state.params]);

  return (
    <AppContainer>
      <AppPermissionSearch
        showModel={showModel}
        onFormInstanceReady={onFormInstanceReady}
        setQueryParams={setQueryParams}
      />
      <AppPermissonTable
        columns={columns}
        onChange={onChange}
      />
      <AppPermissonDialog
        ref={dialogRef}
        onSubmit={onSubmit}
      />
    </AppContainer>
  );
};

export default () => (
  <PermissionProvider>
    <AppPermission />
  </PermissionProvider>
)











