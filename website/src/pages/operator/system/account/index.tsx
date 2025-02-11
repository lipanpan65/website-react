import * as React from 'react'
import {
  theme,
  Space,
  message,
  Modal,
  Form,
  Input,
  Button,
  Select,
  TreeSelect,
  Spin
} from 'antd'

import {
  useNavigate
} from 'react-router-dom'

import type { TableProps, FormInstance } from 'antd';

import { ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons';

import { dateFormate, request } from '@/utils'
import AppContent from '@/components/AppContent';
import AppContainer from '@/components/AppContainer';
import AppSearch from '@/components/AppSearch';
import AppTable from '@/components/AppTable';
import AppDialog from '@/components/AppDialog';
import { UserInfoProvider, useUserInfo } from '@/hooks/state/useUserInfo';
import { api } from '@/api';
import ConfirmableButton from '@/components/ConfirmableButton';
import AppPassInput from '@/components/AppPassInput';
import AppOrgSelect from '@/components/AppOrgSelect';
import StatusTag from '@/components/StatusTag';

const { confirm } = Modal;


interface AppUserInfoSearchProps {
  showModel: (event: React.MouseEvent<HTMLElement>, data: any) => void;
  onFormInstanceReady: (instance: FormInstance<any>) => void;
  setQqueryParams: (params: any) => void;
}

const AppUserInfoSearch: React.FC<AppUserInfoSearchProps> = ({
  showModel,
  onFormInstanceReady,
  setQqueryParams,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    onFormInstanceReady(form);
  }, []);

  const handleSearchClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log('搜索按钮点击');
    // 你可以在这里添加显示模态框的逻辑，例如调用 showModel
  };

  const buttonConfig = {
    label: '添加',
    type: 'primary' as const,  // 明确指定类型以符合 ButtonConfig
    onClick: (event: React.MouseEvent<HTMLElement>) => showModel(event, {}),
    // 你可以添加更多的 Button 属性，如 disabled, icon 等
    disabled: false,
    icon: <PlusCircleOutlined />,  // 例如使用 Ant Design 的图标
  };

  return (
    <React.Fragment>
      <AppContent>
        <AppSearch
          buttonConfig={buttonConfig}  // 动态按钮配置
          onFormInstanceReady={(form) => console.log('Form instance ready:', form)}
          setQueryParams={(params) => console.log('Query params:', params)}
          formItems={[
            {
              name: 'search',
              placeholder: '请输入...',
              type: 'input',
            },
            {
              name: 'category',
              placeholder: '请选择分类',
              type: 'select',
              width: 150,
              selectConfig: {
                allowClear: true,
                options: [
                  { label: '科技', value: 'tech' },
                  { label: '健康', value: 'health' },
                ],
              },
            },
          ]}
        />
      </AppContent>
    </React.Fragment>
  )
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

interface UserInfoTableProps {
  data?: {
    page: PaginationProps;
    data: any;  // 数据数组，包含 id, name, description
  };
  columns?: any;  // 设置可选
  // onFormInstanceReady: (instance: FormInstance<any>) => void;
  onChange?: (pagination: PaginationProps, filters?: any, sorter?: any) => void;  // 新增 onChange 属性
}

const AppUserInfoTable: React.FC<UserInfoTableProps> = ({
  columns = [], // 设置默认值为空数组
  onChange
}) => {

  const { state } = useUserInfo();

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

const AppUserInfoDialog = React.forwardRef((props: any, ref) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const { onSubmit, roleTypes } = props
  const [formInstance, setFormInstance] = React.useState<FormInstance | null>(null);
  const [record, setRecord] = React.useState<any>({}) // 添加状态管理表示当前数据
  const [isOrgDataLoaded, setIsOrgDataLoaded] = React.useState<boolean>(false);

  // 使用 useCallback 缓存回调函数
  const handleOrgDataLoaded = React.useCallback((loaded: boolean) => {
    setIsOrgDataLoaded(loaded);
  }, []);

  const fields: any = [
    {
      label: '用户名称',
      name: 'name',
      rules: [{ required: true, message: '请输入用户名称' }],
      component: <Input placeholder="请输入用户名称" />,
      span: 12,
    },
    {
      label: 'OA',
      name: 'username',
      rules: [{ required: true, message: '请输入分类名称' }],
      component: <Input placeholder="请输入分类名称" />,
      span: 12,
    },
    {
      label: '手机号',
      name: 'phone',
      rules: [{ required: true, message: '请输入手机号' }],
      component: <Input placeholder="请输入手机号" />,
      span: 12,
    },
    {
      label: '邮箱',
      name: 'email',
      rules: [{ required: true, message: '请输入邮箱' }],
      component: <Input placeholder="请输入邮箱" />,
      span: 12,
    },
    {
      label: '角色类型',
      name: 'role',
      rules: [{ required: true, message: '请选择角色类型' }],
      component: (
        <Select placeholder="请选择角色类型" allowClear>
          {roleTypes.map((role: any) => (
            <Select.Option key={role.id} value={role.id}>
              {role.role_name}
            </Select.Option>
          ))}
        </Select>
      ),
      span: 12,
    },
    {
      label: '角色名称',
      name: 'role_name',
      rules: [{ required: true, message: '请输入角色名称' }],
      component: <Input placeholder="请输入角色名称" />,
      span: 12,
    },
    {
      label: '密码',
      name: 'password',
      rules: [{ required: true, message: '请输入密码' }],
      component: <AppPassInput />,
      span: 12,
    },
    {
      label: '组织架构',
      name: 'orgs',
      rules: [{ required: true, message: '请选择组织架构' }],
      component: <AppOrgSelect
        onDataLoaded={handleOrgDataLoaded} // 使用缓存的回调函数
      />,
      span: 24,
    },
    {
      name: 'remark',
      label: '备注',
      component: <Input.TextArea placeholder="请输入备注" showCount maxLength={100} />,
    },
  ];

  // 监听 record 变化并更新表单
  React.useEffect(() => {
    if (formInstance && record && isOrgDataLoaded) {
      console.log("Updating form with record:", record);
      formInstance.setFieldsValue(record);
    }
  }, [record, formInstance, isOrgDataLoaded]);

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
      setOpen(false);
    } catch (error: any) {
      console.error('捕获的异常:', error);
      message.error(error.message || '表单验证失败，请检查输入内容。');
    }
  };

  const onCancel = () => {
    formInstance?.resetFields();
    setOpen(false)
  }

  React.useImperativeHandle(ref, () => ({
    showModel,
    onCancel
  }));

  return (
    <React.Fragment>
        <AppDialog
          setFormInstance={setFormInstance}  // 管理表单实例
          fields={fields}
          title='添加用户'
          onCancel={onCancel}
          open={open}
          onSubmit={handleSubmit}
        />
    </React.Fragment>
  );
});

const AppUserInfo = () => {
  const navigate = useNavigate()
  const { state, enhancedDispatch } = useUserInfo();
  const dialogRef: any = React.useRef()
  const [formInstance, setFormInstance] = React.useState<FormInstance>();
  const [queryParams, setQqueryParams] = React.useState<any>({})
  const [loading, setLoading] = React.useState<boolean>()
  const [roleTypes, setRoleTypes] = React.useState<any[]>([]); // 新增角色类型状态

  console.log("AppUserInfo")

  // 获取角色数据
  const queryRoles = async () => {
    try {
      const response = await api.role.fetch();
      if (response && response.success) {
        const { data } = response.data;
        console.log("已经获取到最新的数据...")
        setRoleTypes(data);
      } else {
        message.error(response?.message || '获取数据失败');
      }
    } catch (error) {
      message.error('请求失败，请稍后重试');
    }
  };

  // /**
  // * 按照顺序执行
  // */
  // React.useEffect(() => {
  //   console.log("加载数据")
  //   queryRoles();
  // }, [])

  /**
  * 按照顺序执行
  */
  React.useEffect(() => {
    console.log("加载数据")
  }, [queryParams])

  const columns: TableProps<any>['columns'] = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      sorter: true
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色类型',
      dataIndex: 'role_type',
      key: 'role_type',
    },
    {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '状态',
      dataIndex: 'enable',
      key: 'enable',
      render: (text: number) => <StatusTag status={text} />
    },
    {
      title: '组织架构',
      dataIndex: 'orgs',
      key: 'orgs',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
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
    setLoading(true)

    setQqueryParams((preQueryParams: any) => {
      return {
        ...preQueryParams,
        page: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total
      }
    })
  }

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
        ? () => api.userInfo.delete(data.id)
        : actionType === 'UPDATE'
          ? api.userInfo.update
          : api.userInfo.create;
    console.log("===============")
    console.log("data====>", data)
    console.log("===============")

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
      await queryUserInfo();
    }
  };

  const queryUserInfo = async () => {
    try {
      const { params } = state;
      const response = await api.userInfo.fetch(params);
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
      await queryUserInfo();
    })();
  }, [state.params]);

  return (
    <AppContainer>
      <AppUserInfoSearch
        showModel={showModel}
        onFormInstanceReady={(instance: any) => {
          setFormInstance(instance);
        }}
        setQqueryParams={setQqueryParams}
      />
      <AppUserInfoTable
        onChange={onChange}
        columns={columns}
      />
      <AppUserInfoDialog
        ref={dialogRef}
        onSubmit={onSubmit}
        roleTypes={roleTypes}
      />
    </AppContainer>
  )
}

export default () => (
  <UserInfoProvider>
    <AppUserInfo />
  </UserInfoProvider>
);
