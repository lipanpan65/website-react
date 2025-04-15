import * as React from 'react'
import { FormInstance, message } from 'antd'
import { useRole } from '@/hooks/state/useRole'
import { api } from '@/api'
import AppContainer from '@/components/AppContainer'
import RoleSearch from './RoleSearch'
import RoleTable from './RoleTable'
import RoleDialog from './RoleDialog'
import RolePermissionDialog from './RolePermissionDialog'

interface RoleProps {}

const Role: React.FC<RoleProps> = () => {
  const { state, enhancedDispatch } = useRole()
  const dialogRef = React.useRef<any>(null)
  const permissionDialogRef = React.useRef<any>(null)
  const searchFormRef = React.useRef<FormInstance | null>(null)
  const [queryParams, setQueryParams] = React.useState<any>({})

  const onFormInstanceReady = (form: FormInstance) => {
    searchFormRef.current = form
  }

  React.useEffect(() => {
    if (Object.keys(queryParams).length > 0) {
      enhancedDispatch({ type: 'UPDATE_PARAMS', payload: { params: queryParams } })
    }
  }, [queryParams])

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

  const showModel = (_: any, data?: any) => {
    dialogRef.current.showModel(true, data)
  }

  const showPermissionModel = (_: any, data?: any) => {
    permissionDialogRef.current.showModel(true, data)
  }

  const onSubmit = async (
    actionType: 'CREATE' | 'UPDATE' | 'DELETE' | 'GRANT',
    data: Record<string, any>
  ): Promise<void> => {
    // 确定请求方法
    const requestAction =
      actionType === 'DELETE'
        ? () => api.role.delete(data.id)
        : actionType === 'UPDATE'
          ? api.role.update
          : actionType === 'GRANT'
            ? api.role.grant
            : api.role.create

    // 设定响应消息
    const responseMessages = {
      success: actionType === 'UPDATE' ? '更新成功' : actionType === 'DELETE' ? '删除成功' : '创建成功',
      error: actionType === 'UPDATE' ? '更新失败，请重试' : actionType === 'DELETE' ? '删除失败，请重试' : '创建失败，请重试',
    }

    // 执行状态更新
    enhancedDispatch({ type: actionType, payload: { data } })

    try {
      const response = await requestAction(data)
      const messageText = response?.success ? responseMessages.success : response?.message || responseMessages.error
      message[response?.success ? 'success' : 'error'](messageText)
    } catch (error) {
      message.error('提交出错，请检查网络或稍后重试')
    } finally {
      await queryRole()
    }
  }


  const queryRole = async () => {
    try {
      const { params } = state
      const response = await api.role.fetch(params)
      if (response && response.success) {
        const { data, page } = response.data
        enhancedDispatch({
          type: 'READ_DONE', payload: {
            data, page
          }
        })
      } else {
        message.error(response?.message || '获取数据失败')
      }
    } catch (error) {
      message.error('请求失败，请稍后重试')
    }
  }

  React.useEffect(() => {
    (async () => {
      await queryRole()
    })()
  }, [state.params])

  return (
    <AppContainer>
      <RoleSearch
        showModel={showModel}
        onFormInstanceReady={onFormInstanceReady}
        setQueryParams={setQueryParams}
      />
      <RoleTable
        onChange={onChange}
        showModel={showModel}
        showPermissionModel={showPermissionModel}
        onSubmit={onSubmit}
      />
      <RoleDialog
        ref={dialogRef}
        onSubmit={onSubmit}
      />
      <RolePermissionDialog
        ref={permissionDialogRef}
        onSubmit={onSubmit}
      />
    </AppContainer>
  )
}

export default Role 