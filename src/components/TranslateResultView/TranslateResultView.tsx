import * as React from 'react';
import { Alert, Button, Typography } from 'antd';
import { PlusOutlined, SoundFilled } from '@ant-design/icons';
import { LookUpResult } from '@wordway/translate-api';

import { sharedHttpClient } from '../../networking';
import { sharedConfigManager } from '../../utils/config';
import translateEngines from '../../networking/translateClient/engines';

import './TranslateResultView.less';

const { Title } = Typography;

interface TranslateResultViewProps {
  q: string;
  lookUpResult?: LookUpResult;
  lookUpError?: Error;
}

interface TranslateResultViewState {
  loggedInUser: any;
  newWordIsAdded: boolean;
  newWordIsAdding: boolean;
}

class TranslateResultView extends React.Component<
  TranslateResultViewProps,
  TranslateResultViewState
> {
  constructor(
    props: TranslateResultViewProps,
    state: TranslateResultViewState
  ) {
    super(props, state);

    this.state = {
      loggedInUser: undefined,
      newWordIsAdded: false,
      newWordIsAdding: false,
    };
  }

  componentDidMount() {
    const callback = (userConfig: any) => {
      const { loggedInUser, autoplayPronunciation } = userConfig;

      this.setState({ loggedInUser }, () => {
        if (loggedInUser && this.props.lookUpResult) this.loadData();
      });

      if (autoplayPronunciation !== 'disabled') {
        let pronunciationUrl = this.props.lookUpResult?.usPronunciationUrl;
        if (autoplayPronunciation.startsWith('uk')) {
          pronunciationUrl = this.props.lookUpResult?.ukPronunciationUrl;
        }

        chrome.runtime.sendMessage({
          method: 'playAudio',
          arguments: { url: pronunciationUrl },
        });
      }
    };

    setTimeout(async () => {
      const config = await sharedConfigManager.getConfig();
      this.setState({
        loggedInUser: config.loggedInUser,
      });
      callback(config);
    }, 0);
  }

  loadData = async () => {
    const { lookUpResult } = this.props;
    const { loggedInUser } = this.state;

    try {
      const r = await sharedHttpClient.get(
        `/wordbooks/newwords-for-user-${loggedInUser?.id}/words/${lookUpResult?.word}`
      );
      const {
        data: { data: wordbookWord },
      } = r;
      if (wordbookWord) {
        this.setState({
          newWordIsAdded: true,
          newWordIsAdding: false,
        });
      }
    } catch (e) {
      // skip
    }
  };

  handleClickAddToNewWords = async () => {
    const { lookUpResult } = this.props;
    const { loggedInUser } = this.state;

    try {
      this.setState({
        newWordIsAdding: true,
      });

      await sharedHttpClient.post(
        `/wordbooks/newwords-for-user-${loggedInUser?.id}/words`,
        { word: lookUpResult?.word }
      );
      this.setState({
        newWordIsAdded: true,
        newWordIsAdding: false,
      });
    } catch (e) {
      this.setState({
        newWordIsAdded: false,
        newWordIsAdding: false,
      });
    }
  };

  handleClickViewMyNewWords = async () => {};

  renderLookUpError = () => {
    const { lookUpError }: TranslateResultViewProps = this.props;
    if (!lookUpError) return <></>;

    return (
      <div className="error">
        <span>{lookUpError?.message}</span>
      </div>
    );
  };

  renderLookUpResult = () => {
    const { lookUpResult }: TranslateResultViewProps = this.props;
    const { loggedInUser, newWordIsAdded, newWordIsAdding } = this.state;

    if (!lookUpResult) return <></>;

    if (!lookUpResult?.word) {
      return (
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span className="content-title">原文</span>
            <h4>{lookUpResult?.sourceText}</h4>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span className="content-title">译文</span>
            <h4>{lookUpResult?.targetText}</h4>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="word">
          <Title level={4} style={{ flex: 1 }}>
            {lookUpResult?.word}
          </Title>
          {newWordIsAdded ? (
            <Button
              key="view-my-newwords"
              type="ghost"
              size="small"
              loading={false}
              onClick={() => {
                this.handleClickViewMyNewWords();
              }}
            >
              查看生词本
            </Button>
          ) : (
            <Button
              key="add-to-my-newwords"
              type="ghost"
              size="small"
              loading={newWordIsAdding}
              icon={<PlusOutlined />}
              onClick={() => {
                if (!loggedInUser) {
                  chrome.runtime.sendMessage({
                    method: 'openOptionsPage',
                  });
                  return;
                }
                this.handleClickAddToNewWords();
              }}
            >
              <>&nbsp;生词本</>
            </Button>
          )}
        </div>
        {/* 贴士 */}
        {lookUpResult?.tip && (
          <Alert className="tip" type="warning" message={lookUpResult?.tip} />
        )}
        {/* 发音 */}
        <div className="ipa">
          {[
            {
              flag: '美',
              ipa: lookUpResult?.usIpa,
              pronunciationUrl: lookUpResult?.usPronunciationUrl,
            },
            {
              flag: '英',
              ipa: lookUpResult?.ukIpa,
              pronunciationUrl: lookUpResult?.ukPronunciationUrl,
            },
          ]
            .filter(({ ipa, pronunciationUrl }: any) => ipa || pronunciationUrl)
            .map(({ flag, ipa, pronunciationUrl }: any) => (
              <div key={`${flag}-${ipa}`} className="ipa-item">
                <span>
                  {`${flag}`} {ipa ? ` [${ipa}]` : ''}
                </span>
                <button
                  className="ipa-item-soundplay"
                  onClick={() => {
                    chrome.runtime.sendMessage({
                      method: 'playAudio',
                      arguments: { url: pronunciationUrl },
                    });
                  }}
                >
                  <SoundFilled />
                </button>
              </div>
            ))}
        </div>
        {/* 释义 */}
        <ul className="definitions">
          {lookUpResult?.definitions?.map(({ type, values }: any) => (
            <li key={`${type}-${values.join(',')}`} className="definition-item">
              <span className="definition-item-type">{type}</span>
              <span className="definition-item-value">{values.join('；')}</span>
            </li>
          ))}
        </ul>
        {/* 时态 */}
        {(lookUpResult?.tenses || []).length > 0 && (
          <div className="tenses">
            {lookUpResult?.tenses?.map(({ name, values }: any) => (
              <span key={`${name}-${values.join(',')}`}>
                <span className="tense-item-name">{name}</span>
                {values?.map((value: any) => (
                  <span key={`${name}-${value}`} className="tense-item-word">
                    {value}
                  </span>
                ))}
              </span>
            ))}
          </div>
        )}
        {/* 图片 */}
        {(lookUpResult?.images || []).length > 0 && (
          <div className="images">
            {lookUpResult?.images?.map((imageUrl: any) => (
              <img
                key={imageUrl}
                className="image-item"
                src={imageUrl}
                alt=""
              />
            ))}
          </div>
        )}
        <div className="source">
          <img
            src={
              translateEngines.find((v) => v.key === lookUpResult?.engine)?.icon
            }
            alt=""
          />
        </div>
      </>
    );
  };

  render() {
    return (
      <div className="translate-result-view">
        {this.renderLookUpError()}
        {this.renderLookUpResult()}
      </div>
    );
  }
}

export default TranslateResultView;
