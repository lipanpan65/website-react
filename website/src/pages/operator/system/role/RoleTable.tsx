import * as React from 'react'
import { Button, Space } from 'antd'
import { useRole } from '@/hooks/state/useRole'
import AppContent from '@/components/AppContent'
import AppTable from '@/components/AppTable'
import StatusTag from '@/components/StatusTag'
import ConfirmableButton from '@/components/ConfirmableButton'
import { Pagination } from '@/types/common'

interface RoleTableProps {
  data?: {
    page: Pagination
    data: any[]
  }
  columns?: any[]
  onChange?: (pagination: Pagination, filters?: any, sorter?: any) => void
  showModel: (event: any, data?: any) => void
  onSubmit: (actionType: 'CREATE' | 'UPDATE' | 'DELETE', data: Record<string, any>) => Promise<void>
}

const RoleTable: React.FC<RoleTableProps> = ({
  columns = [],
  onChange,
  showModel,
  onSubmit
}) => {
  const { state } = useRole()

  const { page = { total: 0, current: 1, pageSize: 10 }, data = [], loading } = state

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (onChange) {
      onChange(pagination, filters, sorter)
    }
  }

  const defaultColumns = [
    {
      title: '角色名称',
      dataIndex: 'role_name',
      key: 'role_name',
    },
    {
      title: '角色类型',
      dataIndex: 'role_type_display',
      key: 'role_type_display',
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
          <Button size='small' color="primary" variant="link" onClick={(event: any) => showModel(event, record)}>
            分配权限
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

  const tableColumns = columns.length > 0 ? columns : defaultColumns

  return (
    <React.Fragment>
      <AppContent>
        <AppTable
          data={{ page, data }}
          columns={tableColumns}
          onChange={handleTableChange}
          loading={loading}
        />
      </AppContent>
    </React.Fragment>
  )
}

export default RoleTable 