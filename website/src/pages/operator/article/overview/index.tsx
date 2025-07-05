import * as React from 'react'

import AppContainer from '@/components/AppContainer'
import AppContent from '@/components/AppContent'
import AppSearch from '@/components/AppSearch'  
import { FormInstance } from 'antd';
import AppTable from '@/components/AppTable';
// 搜索
const ArticleSearch: React.FC = () => {
  const [formInstance, setFormInstance] = React.useState<FormInstance<any> | null>(null);
  const [searchParams, setSearchParams] = React.useState<any>({});
  
  const onFormInstanceReady = (formInstance: FormInstance<any>) => {
    setFormInstance(formInstance);
  }

  const onSearch = (values: any) => {
    console.log(values);
  }


  return (
    <AppContent>
        <AppSearch 
        onFormInstanceReady={onFormInstanceReady}
        setQueryParams={setSearchParams}
        initialParams={searchParams}
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
        buttonConfig={{
          label: '搜索',
          onClick: onSearch,
        }}          
      />
    </AppContent>
  )
}


interface ArticleTableProps {
  columns?: any[];
  onChange?: (pagination: any, filters: any, sorter: any) => void;
}

const ArticleTable: React.FC<ArticleTableProps> = ({
  columns = [], // 设置默认值为空数组
  onChange
}) => {
  // const { state } = useArticleCategory();
  const state = {
    page: { total: 0, current: 1, pageSize: 10 },
    data: [],
    loading: false,
  }
  const { page = { total: 0, current: 1, pageSize: 10 }, data = [], loading } = state;
  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (onChange) {
      onChange(pagination, filters, sorter);  // 确保 onChange 已定义
    }
  };


  return (
    <AppContent>
      <AppTable 
        data={{ page, data }}
        columns={columns}
        onChange={handleTableChange}
        loading={loading}
      />
    </AppContent>
  )
}


// 管理端文章列表
const OperatorArticleList: React.FC = () => {
  return (
    <AppContainer>
        <ArticleSearch />
        <ArticleTable />
    </AppContainer>
  )
}

export default OperatorArticleList






