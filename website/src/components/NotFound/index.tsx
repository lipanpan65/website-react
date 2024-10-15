import React from 'react';
import { Button, Result } from 'antd';

import {
  Link,
  useNavigate,
} from "react-router-dom"

const App: React.FC = () => {

  const navigate = useNavigate()

  const handleLinkTo = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <React.Fragment >
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在。"
        extra={<Button type="primary" onClick={handleLinkTo}>返回</Button>}
      />
    </React.Fragment>
  )
};

export default App;