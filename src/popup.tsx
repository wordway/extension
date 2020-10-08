import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';

import { Popup } from './components';

import './styles/global.less';

chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
  const el = document.getElementById('root');
  ReactDOM.render(
    <ConfigProvider autoInsertSpaceInButton={false}>
      <Popup />
    </ConfigProvider>,
    el
  );
});
