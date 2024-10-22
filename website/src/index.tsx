import React from 'react';
import ReactDOM from 'react-dom/client';
import './common/global.css';  // 引入全局 CSS 变量
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';

import { ConfigProvider } from 'antd'

import {
  HashRouter as Router
} from 'react-router-dom'

import zhCN from 'antd/es/locale/zh_CN'
import "moment/locale/zh-cn"
import store from './store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

root.render(
  <Provider store={store}>
    <ConfigProvider
      locale={{
        ...zhCN, // 保留其他中文配置
        Modal: {
          ...zhCN.Modal, // 保留 Modal 的其他默认配置
          okText: '确定',
          cancelText: '取消',
          justOkText: '知道了', // 自定义 justOkText 文本
        },
      }}
    >
      <Router>
        <App />
      </Router>
    </ConfigProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
