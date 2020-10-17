import React from 'react';
import { Typography } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import { LookUpResult } from '@wordway/translate-api';

import { SoundPlayButton } from '../../components';
import { Word } from '../../interfaces';

import './WordItem.less';

const { Text } = Typography;

interface WordItemProps {
  word: Word | LookUpResult;
}

const WordItem = (props: WordItemProps) => {
  const { word } = props;

  return (
    <div key={word.word} className="word-item" style={{ display: 'flex' }}>
      <div style={{ flex: 1, flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Text className="word">{word.word}</Text>
          {/* 发音 */}
          <div className="ipa">
            {[
              {
                flag: '美',
                ipa: word.usIpa,
                pronunciationUrl: word.usPronunciationUrl,
              },
              {
                flag: '英',
                ipa: word.ukIpa,
                pronunciationUrl: word.ukPronunciationUrl,
              },
            ]
              .filter(
                ({ ipa, pronunciationUrl }: any) => ipa || pronunciationUrl
              )
              .map(({ flag, ipa, pronunciationUrl }: any) => (
                <div key={`${flag}-${ipa}`} className="ipa-item">
                  <Text type="secondary">
                    {`${flag}`} {ipa ? ` [${ipa}]` : ''}
                  </Text>
                  <SoundPlayButton pronunciationUrl={pronunciationUrl} />
                </div>
              ))}
          </div>
          {/* 释义 */}
        </div>
        {/* 释义 */}
        <div className="definitions">
          {word?.definitions?.slice(0, 1).map(({ type, values }: any) => (
            <Text key={`${type}-${values.join(',')}`} type="secondary">
              {values.join('；')}
            </Text>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordItem;
