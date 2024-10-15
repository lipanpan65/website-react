import { theme } from 'antd';
import * as React from 'react'

const WorkBench = () => {
  
  const {
    token: {
      colorBgContainer,
      borderRadiusLG
    },
  } = theme.useToken();

  return (
    <React.Fragment>
      <div className="container" >
        <div style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          minHeight: '100vh',
          width: '100%'
        }}>
          我的工作台
        </div>
      </div>
    </React.Fragment>
  )
}


export default WorkBench