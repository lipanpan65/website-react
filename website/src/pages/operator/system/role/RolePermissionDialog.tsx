import * as React from 'react'
import { FormInstance, message, Modal } from 'antd'
import AppDialog from '@/components/AppDialog'
import { Tree } from 'antd'
import { DataNode } from 'antd/es/tree'
import { api } from '@/api/index'

interface RolePermissionDialogProps {
  onSubmit: (
    actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'GRANT',
    data: Record<string, any>
  ) => Promise<void>
}

const RolePermissionDialog = React.forwardRef<
  { showModel: (isOpen: boolean, data?: any) => void; onCancel: () => void; setOpen: (open: boolean) => void },
  RolePermissionDialogProps
>((props, ref) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const { onSubmit } = props
  const [formInstance, setFormInstance] = React.useState<FormInstance | null>(null)
  const [record, setRecord] = React.useState<any>({})
  const [checkedKeys, setCheckedKeys] = React.useState<React.Key[]>([])
  const [expandedKeys, setExpandedKeys] = React.useState<React.Key[]>([])
  const [treeData, setTreeData] = React.useState<DataNode[]>([])

  // 判断是否为更新操作
  const isUpdate = React.useMemo(() => !!record.id, [record.id])

  // 模拟权限树数据
  const defaultTreeData: DataNode[] = [
    {
      title: '系统管理',
      key: 'system',
      children: [
        {
          title: '用户管理',
          key: 'system:user',
          children: [
            { title: '查看', key: 'system:user:view' },
            { title: '新增', key: 'system:user:add' },
            { title: '编辑', key: 'system:user:edit' },
            { title: '删除', key: 'system:user:delete' },
          ],
        },
        {
          title: '角色管理',
          key: 'system:role',
          children: [
            { title: '查看', key: 'system:role:view' },
            { title: '新增', key: 'system:role:add' },
            { title: '编辑', key: 'system:role:edit' },
            { title: '删除', key: 'system:role:delete' },
          ],
        },
      ],
    },
    {
      title: '业务管理',
      key: 'business',
      children: [
        {
          title: '订单管理',
          key: 'business:order',
          children: [
            { title: '查看', key: 'business:order:view' },
            { title: '新增', key: 'business:order:add' },
            { title: '编辑', key: 'business:order:edit' },
            { title: '删除', key: 'business:order:delete' },
          ],
        },
      ],
    },
  ]

  const queryPermissions = async () => {
    const res = await api.permission.fetch()
    if (res.success) {
      // 将API返回的数据转换为Tree组件需要的格式
      const formattedData = res.data.data.map((item: any) => ({
        key: item.id,
        title: item.permission_name,
        children: item.children?.map((child: any) => ({
          key: child.id,
          title: child.permission_name,
          children: child.children?.map((grandChild: any) => ({
            key: grandChild.id,
            title: grandChild.permission_name
          }))
        }))
      }))
      setTreeData(formattedData)
    }
  }

  React.useEffect(() => {
    queryPermissions()
  }, [open])

  React.useEffect(() => {
    if (record && record.permissions) {
      setCheckedKeys(record.permissions)
    }
  }, [record])

  const showModel = (isOpen: boolean, data?: any) => {
    setOpen(isOpen)
    if (isOpen && data) {
      setRecord(data)
    }
  }

  const handleSubmit = async () => {
    try {
      const data = {
        id: record.id,
        permissions: checkedKeys,
      }
      await onSubmit('GRANT', data)
      setOpen(false)
    } catch (error: any) {
      console.error('捕获的异常:', error)
      message.error(error.message || '保存失败，请重试')
    }
  }

  const onCancel = () => {
    setCheckedKeys([])
    setOpen(false)
  }

  React.useImperativeHandle(ref, () => ({
    showModel,
    onCancel,
    setOpen,
  }))

  return (
    <React.Fragment>
      <Modal
        title={`${isUpdate ? '更新' : '创建'}权限`}
        open={open}
        onCancel={onCancel}
        onOk={handleSubmit}
      >
        <div style={{ marginBottom: 16 }}>
          <span>角色名称：</span>
          <span>{record.role_name}</span>
        </div>
        <Tree
          checkable
          checkedKeys={checkedKeys}
          expandedKeys={expandedKeys}
          onCheck={(checked) => setCheckedKeys(checked as React.Key[])}
          onExpand={(expanded) => setExpandedKeys(expanded)}
          treeData={treeData}
        />
      </Modal>
    </React.Fragment>
  )
})

export default RolePermissionDialog 