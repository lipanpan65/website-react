import React from 'react';
import { Button, Result } from 'antd';

import {
  Link,
  useNavigate,
} from "react-router-dom"

const App: React.FC = () => {

  const navigate = useNavigate()

  const handleLinkTo = () => {
    navigate('/')
  }

  return (
    <React.Fragment >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={handleLinkTo}>返回首页</Button>}
      />
    </React.Fragment>
  )


};

export default App;