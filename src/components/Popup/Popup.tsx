import React from 'react';
import { Button, Divider, Form, Input, Spin } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { LookUpResult } from '@wordway/translate-api';
import {
  BlockOutlined,
  CloseSquareOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

import { TranslateResultView } from '../../components';
import { sharedDb, sharedTranslateClient } from '../../networking';
import { sharedConfigManager } from '../../utils/config';
import env from '../../utils/env';
import r from '../../utils/r';

import './Popup.less';

const { TextArea } = Input;

interface PopupProps {}

interface PopupState {
  loading: boolean;
  q: string;
  lookUpResult?: LookUpResult;
  lookUpError?: Error;
}

class Popup extends React.Component<PopupProps, PopupState> {
  formRef = React.createRef<FormInstance>();
  formSubmitTimer: any;

  constructor(props: PopupProps, state: PopupState) {
    super(props, state);

    this.state = {
      loading: false,
      q: '',
    };
  }

  componentDidMount() {
    document.title = '一路背单词（查词助手）';
    this.resizeStandaloneWindow();
  }

  componentDidUpdate() {
    this.resizeStandaloneWindow();
  }

  isStandaloneWindow() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const mode = urlSearchParams.get('mode');

    return mode === 'standalone';
  }

  resizeStandaloneWindow() {
    if (!this.isStandaloneWindow()) return;

    const height = document.getElementById('popup')?.offsetHeight;
    if (height) {
      chrome.windows.update(
        chrome.windows.WINDOW_ID_CURRENT,
        { height: height + (window.outerHeight - window.innerHeight) },
        () => {}
      );
    }
  }

  handleFinish = async (values: any) => {
    const { q } = values;

    if (!q) {
      this.setState({
        q,
        loading: false,
        lookUpResult: undefined,
        lookUpError: undefined,
      });
      return;
    }

    try {
      this.setState({ loading: true });
      let config = await sharedConfigManager.getConfig();

      let lookUpResult = await sharedTranslateClient
        .engine(config.translateEngine)
        .lookUp(q, { exclude: ['originData'] });

      sharedDb.data?.translationRecords.splice(0, 0, lookUpResult);
      sharedDb.write();

      this.setState({
        q,
        loading: false,
        lookUpResult,
        lookUpError: undefined,
      });
    } catch (e) {
      this.setState({
        loading: false,
        lookUpResult: undefined,
        lookUpError: e,
      });
    }
  };

  render() {
    const { loading, q, lookUpResult, lookUpError } = this.state;
    return (
      <div id="popup" className="popup">
        <style>
          {`
          html,
          body {
            height: auto !important;
          }
          `}
        </style>
        <div className="header">
          <a href={env.webURL} target="_blank" rel="noopener noreferrer">
            <img
              src={r('/images/icon128.png')}
              alt="logo"
              style={{ width: '18px', marginRight: '8px' }}
            />
            <span style={{ fontSize: '10px' }}>一路背单词（查词助手）</span>
          </a>
          <div style={{ flex: 1 }} />
          {this.isStandaloneWindow() ? (
            <Button
              type="text"
              icon={<CloseSquareOutlined />}
              size="small"
              onClick={() => window.close()}
            />
          ) : (
            <Button
              type="text"
              icon={<BlockOutlined />}
              size="small"
              onClick={() => {
                chrome.windows.create({
                  url: 'popup.html?mode=standalone',
                  type: 'popup',
                  width: 360,
                  height: 156,
                });
                window.close();
              }}
            />
          )}
        </div>
        <div className="content">
          <div className="translate-form">
            <Form ref={this.formRef} onFinish={this.handleFinish}>
              <Form.Item>
                <Form.Item name="q">
                  <TextArea
                    rows={2}
                    placeholder="在此输入要翻译的单词或文字"
                    onPressEnter={(e) => {
                      e.preventDefault();
                      this.formRef.current?.submit();
                    }}
                    onChange={(e) => {
                      clearTimeout(this.formSubmitTimer);
                      this.formSubmitTimer = setTimeout(() => {
                        this.formRef.current?.submit();
                      }, 500);
                    }}
                  />
                </Form.Item>
                {loading && (
                  <Spin
                    style={{
                      marginLeft: '16px',
                      position: 'absolute',
                      right: '8px',
                      top: '8px',
                    }}
                    indicator={
                      <LoadingOutlined style={{ fontSize: 14 }} spin />
                    }
                  />
                )}
              </Form.Item>
            </Form>
          </div>
          {(lookUpResult || lookUpError) && (
            <>
              <Divider style={{ margin: 0 }} />
              <TranslateResultView
                q={q}
                lookUpResult={lookUpResult}
                lookUpError={lookUpError}
              />
            </>
          )}
        </div>
        <div className="footer">
          <span className="copyright">© 2020 LiJianying</span>
          <div style={{ flex: 1 }} />
          <a
            onClick={() => {
              if (chrome.extension) {
                chrome.runtime.sendMessage({ method: 'openOptionsPage' });
              }
            }}
          >
            扩展程序选项
          </a>
        </div>
      </div>
    );
  }
}

export default Popup;
