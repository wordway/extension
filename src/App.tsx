import React from 'react';
import { ConfigProvider } from 'antd';
import { Popup } from './components';
import { Options as OptionsPage } from './pages';

import './content_script';

const App: React.FC = () => {
  return (
    <ConfigProvider autoInsertSpaceInButton={false}>
      <Popup />
      {/* <OptionsPage /> */}
    </ConfigProvider>
  );
};

export default App;
