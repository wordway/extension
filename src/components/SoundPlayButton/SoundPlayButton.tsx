import React from 'react';
import { Typography } from 'antd';
import { SoundOutlined } from '@ant-design/icons';

import './SoundPlayButton.less';

const { Text } = Typography;

interface SoundPlayButtonProps {
  pronunciationUrl: string;
}

const SoundPlayButton = (props: SoundPlayButtonProps) => {
  const { pronunciationUrl } = props;

  return (
    <button
      className="soundplay-button"
      onClick={() => {
        chrome.runtime.sendMessage({
          method: 'playAudio',
          arguments: { url: pronunciationUrl },
        });
      }}
    >
      <SoundOutlined />
    </button>
  );
};

export default SoundPlayButton;
