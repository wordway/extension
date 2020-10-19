import React, { useState, useEffect } from 'react';
import { Typography } from 'antd';
import { LookUpResult } from '@wordway/translate-api';

import { SoundPlayButton } from '../../components';
import { Word } from '../../interfaces';
import translateEngines from '../../networking/translateClient/engines';

import './WordItem.less';
import { Config, sharedConfigManager } from '../../utils/config';

const { Text } = Typography;

interface WordItemProps {
  word: Word | LookUpResult;
}

const WordItem = (props: WordItemProps) => {
  const { word } = props;

  let [config, setConfig] = useState<Config | null>(null);

  const loadData = async () => {
    let config = await sharedConfigManager.getConfig();
    setConfig(config);
  };

  useEffect(() => {
    if (!props.word) return;
    loadData();
  }, [props.word]);

  const translateEngine = translateEngines.find((v) => {
    return v.key === word?.engine || v.key === config?.translateEngine;
  });

  return (
    <div key={word.word} className="word-item" style={{ display: 'flex' }}>
      <div style={{ flex: 1, flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <a
            href={`${translateEngine?.lookUpUrl}${word?.word}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Text className="word">{word.word}</Text>
          </a>
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
