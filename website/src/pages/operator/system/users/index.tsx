import * as React from 'react';
import { Button, Form, FormInstance, Input, message, Table, TableProps, theme } from 'antd';
import { dateFormate } from '@/utils';
import { UsersProvider, useUsers } from '@/hooks/state/useUsers';
import AppContainer from '@/components/AppContainer';
import AppTable from '@/components/AppTable';
import AppContent from '@/components/AppContent';
import AppSearch from '@/components/AppSearch';
import { api } from '@/api';
import StatusTag from '@/components/StatusTag';
import { usePagination } from '@/hooks/usePagination';
import { PlusCircleOutlined } from '@ant-design/icons';

const AppUserSearch: React.FC<{
  onFormInstanceReady: (instance: FormInstance<any>) => void;
  setQueryParams: (params: any) => void;
}> = ({ onFormInstanceReady, setQueryParams }) => {
  const { state } = useUsers();
  const formRef = React.useRef<FormInstance | null>(null);

  const handleFormInstanceReady = (form: FormInstance) => {
    formRef.current = form;
    onFormInstanceReady(form);
  };

  const buttonConfig = {
    label: '搜索',
    type: 'primary' as const,
    disabled: false,
    icon: <PlusCircleOutlined />,
  };

  return (
    <AppContent>
      <AppSearch
        onFormInstanceReady={handleFormInstanceReady}
        setQueryParams={setQueryParams}
        initialParams={state.params}
        formItems={[
          {
            name: 'username',
            placeholder: '请输入用户名',
            type: 'input',
          },
          {
            name: 'status',
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
        buttonConfig={buttonConfig}
      />
    </AppContent>
  );
};

const AppUserTable: React.FC<{
  onChange?: (pagination: any, filters?: any, sorter?: any) => void;
}> = ({ onChange }) => {
  const { state } = useUsers();
  const { page, data, loading } = state;

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  const handleEdit = (record: any) => {
    // TODO: 实现编辑功能
    console.log('Edit record:', record);
  };

  return (
    <AppContent>
      <AppTable
        data={{ page, data }}
        columns={[
          {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text: number) => <StatusTag status={text} />
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
            render: (_, record) => (
              <Button size='small' type="link" onClick={() => handleEdit(record)}>
                编辑
              </Button>
            ),
          },
        ]}
        onChange={handleTableChange}
        loading={loading}
      />
    </AppContent>
  );
};

const AppUser = () => {
  const { state, enhancedDispatch } = useUsers();
  const searchFormRef = React.useRef<FormInstance | null>(null);
  
  const { queryParams, setQueryParams, handlePaginationChange } = usePagination({
    dispatch: enhancedDispatch,
    actionType: 'UPDATE_PARAMS'
  });

  const onFormInstanceReady = (form: FormInstance) => {
    searchFormRef.current = form;
  };

  const queryUsers = async () => {
    try {
      const { params } = state;
      // 使用正确的 API 路径
      const response = await api.userInfo.fetch(params);
      if (response && response.success) {
        const { data, page } = response.data;
        enhancedDispatch({
          type: 'READ_DONE',
          payload: { data, page }
        });
      } else {
        message.error(response?.message || '获取数据失败');
      }
    } catch (error) {
      message.error('请求失败，请稍后重试');
    }
  };

  React.useEffect(() => {
    if (Object.keys(queryParams).length > 0) {
      queryUsers();
    }
  }, [state.params]);

  const onChange = (pagination: any) => {
    handlePaginationChange(pagination);
  };

  return (
    <AppContainer>
      <AppUserSearch
        onFormInstanceReady={onFormInstanceReady}
        setQueryParams={setQueryParams}
      />
      <AppUserTable onChange={onChange} />
    </AppContainer>
  );
};

export default () => (
  <UsersProvider>
    <AppUser />
  </UsersProvider>
); 