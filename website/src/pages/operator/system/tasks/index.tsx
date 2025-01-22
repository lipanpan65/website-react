import * as React from 'react'
import AppContainer from '@/components/AppContainer'
import { FormInstance, Input, message, Select } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import AppContent from '@/components/AppContent';
import AppSearch from '@/components/AppSearch';
import { TaskProvider, useTask } from '@/hooks/state/useTasks';
import AppDialog from '@/components/AppDialog';
import { api } from '@/api';
import { RoleProvider } from '@/hooks/state/useRole';


interface AppTaskSearchProps {
  showModel: (event: React.MouseEvent<HTMLElement>, data: any) => void;
  onFormInstanceReady: (instance: FormInstance<any>) => void;
  setQueryParams: (params: any) => void;
}

const AppTaskSearch: React.FC<AppTaskSearchProps> = ({
  showModel,
  onFormInstanceReady,
  setQueryParams,
}) => {
  const { state } = useTask();
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
    </React.Fragment>
  )
}

const AppTaskDialog = React.forwardRef((props: any, ref) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { onSubmit, initialValues } = props
  const [formInstance, setFormInstance] = React.useState<FormInstance | null>(null);
  const [record, setRecord] = React.useState<any>({}) // 添加状态管理表示当前数据

  const fields = [
    {
      label: '角色名称',
      name: 'role_name',
      rules: [{ required: true, message: '请输入角色名称' }],
      component: <Input placeholder="请输入角色名称" />,
      span: 24,  // 使字段占据一半宽度
    },
    {
      label: '状态',
      name: 'enable',
      rules: [{ required: true, message: '请输入角色类型' }],
      component: (
        <Select placeholder="请选择状态" allowClear>
          <Select.Option value={1}>启用</Select.Option>
          <Select.Option value={0}>禁用</Select.Option>
        </Select>
      ),
      span: 12,
    },
    {
      label: '角色类型',
      name: 'role_type',
      rules: [{ required: true, message: '请输入角色类型' }],
      component: (
        <Select placeholder="请选择角色类型" allowClear>
          <Select.Option value={0}>普通用户</Select.Option>
          <Select.Option value={1}>管理员</Select.Option>
          <Select.Option value={2}>超级管理员</Select.Option>
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
        title='添加角色'
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


const AppTasks = () => {
  const { state, enhancedDispatch } = useTask();
  const dialogRef: any = React.useRef()
  const searchFormRef = React.useRef<FormInstance | null>(null);
  const [queryParams, setQueryParams] = React.useState<any>({})

  const onFormInstanceReady = (form: FormInstance) => {
    searchFormRef.current = form; // 将 form 实例存储到 ref
  };

  const showModel = (_: any, data?: any) => {
    dialogRef.current.showModel(true, data)
  }

  const onSubmit = async (
    actionType: 'CREATE' | 'UPDATE' | 'DELETE',
    data: Record<string, any>
  ) => {
    // 确定请求方法
    const requestAction =
      actionType === 'DELETE'
        ? () => api.role.delete(data.id)
        : actionType === 'UPDATE'
          ? api.role.update
          : api.role.create;

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
      // await queryRole();
    }
  }; 

  
  return (
    <React.Fragment>
      <AppContainer>
        <AppTaskSearch
          showModel={showModel}
          onFormInstanceReady={onFormInstanceReady}
          setQueryParams={setQueryParams}
        />
        <AppTaskDialog
          ref={dialogRef}
          onSubmit={onSubmit}
        />
      </AppContainer>
    </React.Fragment>
  )
}


export default () => (
  <TaskProvider>
    <AppTasks />
  </TaskProvider>
);