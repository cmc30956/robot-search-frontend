import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // 如果你的项目有这个文件，请保留
import App from './App'; // 如果你的主组件是App.js，请保留
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 如果你想开始测量应用性能，请发送一个函数
// 了解更多: https://bit.ly/CRA-vitals
reportWebVitals();

