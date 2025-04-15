import * as React from 'react'
import { FormInstance, Input, message, Select } from 'antd'
import AppDialog from '@/components/AppDialog'

interface RoleDialogProps {
  onSubmit: (
    actionType: 'CREATE' | 'UPDATE' | 'DELETE',
    data: Record<string, any>
  ) => Promise<void>
}

const RoleDialog = React.forwardRef<
  { showModel: (isOpen: boolean, data?: any) => void; onCancel: () => void; setOpen: (open: boolean) => void },
  RoleDialogProps
>((props, ref) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const { onSubmit } = props
  const [formInstance, setFormInstance] = React.useState<FormInstance | null>(null)
  const [record, setRecord] = React.useState<any>({})

  const fields = [
    {
      label: '角色名称',
      name: 'role_name',
      rules: [{ required: true, message: '请输入角色名称' }],
      component: <Input placeholder="请输入角色名称" />,
      span: 24,
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
  ]

  React.useEffect(() => {
    if (formInstance && record) {
      formInstance.setFieldsValue(record)
    }
  }, [record, formInstance])

  const showModel = (isOpen: boolean, data?: any) => {
    setOpen(isOpen)
    if (isOpen && data) {
      setRecord(data)
    }
  }

  const handleSubmit = async () => {
    try {
      const data = await formInstance?.validateFields()
      if (!!record.id) {
        const newRecord = { id: record.id, ...data }
        await onSubmit('UPDATE', newRecord)
      } else {
        await onSubmit('CREATE', data)
      }
      setOpen(false)
    } catch (error: any) {
      console.error('捕获的异常:', error)
      message.error(error.message || '表单验证失败，请检查输入内容。')
    }
  }

  const onCancel = () => {
    formInstance?.resetFields()
    setOpen(false)
  }

  React.useImperativeHandle(ref, () => ({
    showModel,
    onCancel,
    setOpen,
  }))

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
        setFormInstance={(instance) => setFormInstance(instance)}
      />
    </React.Fragment>
  )
})

export default RoleDialog 