import React from 'react';
import { Button, Divider, Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { LookUpResult } from '@wordway/translate-api';
import { BlockOutlined } from '@ant-design/icons';

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

  constructor(props: PopupProps, state: PopupState) {
    super(props, state);

    this.state = {
      loading: false,
      q: '',
    };
  }

  loadData = async () => {
    const { q } = this.state;

    try {
      this.setState({ loading: true });
      let config = await sharedConfigManager.getConfig();

      let lookUpResult = await sharedTranslateClient
        .engine(config.translateEngine)
        .lookUp(q, { exclude: ['originData'] });

      sharedDb.data?.translationRecords.push();
      sharedDb.write();

      this.setState({
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

  handleFinish = (values: any) => {
    const { q } = values;

    this.setState({ q }, () => {
      this.loadData();
    });
  };

  render() {
    const { loading, q, lookUpResult, lookUpError } = this.state;
    return (
      <div className="popup">
        <div className="header">
          <Button
            type="text"
            icon={<BlockOutlined />}
            size="small"
            onClick={() => {
              if (chrome.extension) {
                chrome.windows.create(
                  { url: 'popup.html', type: 'popup', width: 360 },
                  (window) => {}
                );
              }
            }}
          />
        </div>
        <div className="content">
          <div className="translate-form">
            <Form ref={this.formRef} onFinish={this.handleFinish}>
              <Form.Item>
                <Form.Item name="q">
                  <TextArea rows={2} />
                </Form.Item>
                <Button
                  name="submit"
                  size="small"
                  type="primary"
                  style={{
                    marginLeft: '16px',
                    position: 'absolute',
                    right: '10px',
                    bottom: '10px',
                  }}
                  htmlType="submit"
                  loading={loading}
                >
                  翻译
                </Button>
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
          <a
            onClick={() => {
              if (chrome.extension) {
                chrome.runtime.sendMessage({ method: 'openOptionsPage' });
              }
            }}
          >
            扩展程序选项
          </a>
          <span>‧</span>
          <a href={env.webURL} target="_blank">
            一路背单词
          </a>
        </div>
      </div>
    );
  }
}

export default Popup;
