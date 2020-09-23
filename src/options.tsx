import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Options as OptionsPage } from './pages';

import './styles/global.less';

chrome.tabs.query({ active: true, currentWindow: true }, tab => {
  const el = document.getElementById('root');
  ReactDOM.render(<OptionsPage />, el);
});
