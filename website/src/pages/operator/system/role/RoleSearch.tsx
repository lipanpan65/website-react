import * as React from 'react'
import { FormInstance, Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import AppContent from '@/components/AppContent'
import AppSearch from '@/components/AppSearch'
import { useRole } from '@/hooks/state/useRole'

interface RoleSearchProps {
  showModel: (event: React.MouseEvent<HTMLElement>, data: any) => void
  onFormInstanceReady: (instance: FormInstance<any>) => void
  setQueryParams: (params: any) => void
}

const RoleSearch: React.FC<RoleSearchProps> = ({
  showModel,
  onFormInstanceReady,
  setQueryParams,
}) => {
  const { state } = useRole()
  const formRef = React.useRef<FormInstance | null>(null)

  const handleFormInstanceReady = (form: FormInstance) => {
    formRef.current = form
    onFormInstanceReady(form)
  }

  const buttonConfig = {
    label: '添加',
    type: 'primary' as const,
    onClick: (event: React.MouseEvent<HTMLElement>) => showModel(event, {}),
    disabled: false,
    icon: <PlusCircleOutlined />,
  }

  return (
    <React.Fragment>
      <AppContent>
        <AppSearch
          buttonConfig={buttonConfig}
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

export default RoleSearch 