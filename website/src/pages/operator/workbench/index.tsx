import * as React from 'react'
import { theme } from 'antd';
import AppContainer from '@/components/AppContainer';

const AppWorkBench = () => {

  const {
    token: {
      colorBgContainer,
      borderRadiusLG
    },
  } = theme.useToken();

  return (
    <React.Fragment>
      <AppContainer>
        我的工作台
      </AppContainer>
    </React.Fragment>
  )
}

export default AppWorkBench