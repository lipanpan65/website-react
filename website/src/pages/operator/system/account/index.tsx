import * as React from 'react'
import { Table, theme, Space, message, Modal, Flex } from 'antd'

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

const { confirm } = Modal;

const AppUserInfoSearch = () => {
  return (
    <React.Fragment>
      <AppContent>
        search 组件
      </AppContent>
    </React.Fragment>
  )
}

const AppUserInfoTable = () => {

  return (
    <React.Fragment>
      <AppContent>
        表格组件 组件
      </AppContent>
    </React.Fragment>
  )
}

const AppUserInfo = () => {

  const dialogRef: any = React.useRef()
  const dataTableRef: any = React.useRef()
  const navigate = useNavigate()

  const {
    token: {
      colorBgContainer,
      borderRadiusLG
    },
  } = theme.useToken();

  const columns: TableProps<any>['columns'] = [
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
      <AppUserInfoSearch />
      <AppUserInfoTable />
    </AppContainer>
  )
}

export default AppUserInfo