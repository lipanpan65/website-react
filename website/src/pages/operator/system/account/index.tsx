import * as React from 'react'
import {
  Table,
  theme,
  Space,
  message,
  Modal,
  Flex,
  Form
} from 'antd'

import {
  Navigate,
  useLocation,
  useRoutes,
  useNavigate
} from 'react-router-dom'

import type { TableProps, FormInstance } from 'antd';

import { ExclamationCircleFilled } from '@ant-design/icons';

import { dateFormate, request } from '@/utils'
import AppContent from '@/components/AppContent';
import AppContainer from '@/components/AppContainer';
import AppSearch from '@/components/AppSearch';
import AppTable from '@/components/AppTable';

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

  const handleSearchClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log('搜索按钮点击');
  };

  const buttonConfig = {
    label: '搜索',
    // type: 'primary',
    // onClick: showModel,
    onclick: (event: any) => showModel(event, {})
  };

  return (
    <React.Fragment>
      <AppContent>
        <AppSearch
          buttonConfig={buttonConfig}  // 动态按钮配置
          onFormInstanceReady={(form) => console.log('Form instance ready:', form)}
          // showModel={(event, data) => console.log('Show model:', data)}
          setQueryParams={(params) => console.log('Query params:', params)}
          formItems={[
            {
              // label: '搜索',
              name: 'search',
              placeholder: '请输入...',
              type: 'input',
            },
            {
              name: 'category',
              placeholder: '请选择分类',
              type: 'select',
              width: 150,
              allowClear: true,
              options: [
                { label: '科技', value: 'tech' },
                { label: '健康', value: 'health' },
              ],
            },
          ]}
        // buttonLabel="添加"
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
  // data?: any;  // 设置可选
  data?: {
    page: PaginationProps;
    data: any;  // 数据数组，包含 id, name, description
  };
  columns?: any;  // 设置可选
  onFormInstanceReady: (instance: FormInstance<any>) => void;
}

const AppUserInfoTable: React.FC<UserInfoTableProps> = ({
  data = {
    page: {
      total: 0,
      current: 1,
      pageSize: 5
    },
    data: []
  },
  columns = [], // 设置默认值为空数组
  onFormInstanceReady,
}) => {

  // const data = {
  //   page: {
  //     total: 50,
  //     current: 1,
  //     pageSize: 5,
  //   },
  //   data: [
  //     { id: 1, name: '分类1', description: '这是分类1' },
  //     { id: 2, name: '分类2', description: '这是分类2' },
  //   ],
  // };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    console.log('分页、筛选或排序改变:', pagination, filters, sorter);
  };

  return (
    <React.Fragment>
      <AppContent>
        <AppTable
          data={data}
          columns={columns}
          onChange={handleTableChange}
          loading={false}
          rowKey={(record) => record.id}  // 自定义 rowKey 为 record.name
        />
      </AppContent>
    </React.Fragment>
  )
}

const AppUserInfoDialog = () => {

}

const AppUserInfo = () => {
  const dialogRef: any = React.useRef()
  const dataTableRef: any = React.useRef()
  const navigate = useNavigate()
  const [formInstance, setFormInstance] = React.useState<FormInstance>();
  const [queryParams, setQqueryParams] = React.useState<any>({})
  
  const {
    token: {
      colorBgContainer,
      borderRadiusLG
    },
  } = theme.useToken();

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
      // render: (text: any, _: any, __: any) => USER_ROLE_MAP[text]
    },
    {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
    },
    {
      title: '组织架构',
      dataIndex: 'orgs',
      key: 'orgs',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      // render: (text: any, _: any, __: boolean) => {
      //   return <Tag color={USER_STATUS_COLOR[text]}>{USER_STATUS[text]}</Tag>
      // }
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      // sorter: true,
      // 升序 1,2,3,4,5 ascending order
      // 降序 5,4,3,2,1 descending order
      // sortOrder: 'descend',
      render: (_: any, record: any) => (
        <Space size="middle">
          <a onClick={(event: any) => showModel(event, record)}>编辑</a>
          <a onClick={(event: any) => handleDelete(event, record)}>删除</a>
        </Space>
      ),
    },
  ];

  const handleLinkTo = () => {
    navigate('/')
  }

  const showModel = (event: any, data?: any) => {
    dialogRef.current.showModel(true, data)
  }

  const handleDelete = (event: any, data?: any) => {
    const onOk = () => new Promise<void>((resolve, reject) => {
      request({
        url: `/api/user/v1/article_category/${data.id}/`,
        method: 'DELETE',
      }).then((r: any) => {
        const { status, statusText
        } = r
        if (status === 200 && statusText === 'OK') {
          message.success('操作成功')
          resolve(r.data)
        }
      }).catch((e: any) => {
        message.error('操作失败')
        reject()
      })
    }).then((r: any) => {
    }).finally(() => {
      dialogRef.current.setOpen(false)
      // getArticleCategory()
    })

    confirm({
      title: '删除分类',
      icon: <ExclamationCircleFilled />,
      content: `确认删除该分类${data.category_name}吗？`,
      onOk,
    });
  }

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
        columns={columns}
        onFormInstanceReady={(instance: any) => {
          setFormInstance(instance);
        }}
      />

    </AppContainer>
  )
}

export default AppUserInfo