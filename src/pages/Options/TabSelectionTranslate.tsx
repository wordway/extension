import React from 'react';
import { List, Table, Typography, Switch, Radio, Button } from 'antd';
import { SetShortcutKeyModal, ShortcutKeyLabel } from '../../components';
import translateEngines from '../../networking/translateClient/engines';
import {
  sharedConfigManager,
  Config,
  ConfigListener,
} from '../../utils/config';

const { Text, Title, Paragraph } = Typography;

interface TabSelectionTranslateState {
  config?: Config | undefined;
  setShortcutKeyModalVisible: boolean;
}

class TabSelectionTranslate
  extends React.Component<any, TabSelectionTranslateState>
  implements ConfigListener {
  constructor(props: any, state: TabSelectionTranslateState) {
    super(props, state);

    this.state = {
      config: undefined,
      setShortcutKeyModalVisible: false,
    };
  }

  componentDidMount() {
    sharedConfigManager.addListener(this);

    setTimeout(() => this._loadData(), 1);
  }

  componentWillUnmount() {
    sharedConfigManager.removeListener(this);
  }

  onConfigChange(newConfig: Config) {
    this.setState({
      config: newConfig,
    });
  }

  async _loadData() {
    let config = await sharedConfigManager.getConfig();

    this.setState({
      config,
    });
  }

  render() {
    let { config } = this.state;

    const radioStyle = {
      display: 'block',
      height: '54px',
    };
    const radioSummaryStyle = {
      display: 'block',
      paddingLeft: '24px',
      fontSize: '12px',
    };

    return (
      <div>
        <Title level={1}>划词翻译</Title>
        <Paragraph></Paragraph>
        <List>
          <List.Item
            style={{
              alignItems: 'flex-start',
            }}
          >
            <List.Item.Meta
              title="自动弹出（在选中单词或短语时）"
              description={
                <>
                  {config?.selectionTranslateMode !== 'disabled' && (
                    <Radio.Group
                      value={config?.selectionTranslateMode}
                      style={{ marginTop: '12px', marginBottom: -14 }}
                      onChange={(e) => {
                        sharedConfigManager.setSelectionTranslateMode(
                          e.target.value
                        );
                      }}
                    >
                      <Radio style={radioStyle} value="enable-translate-icon">
                        显示图标
                        <Text type="secondary" style={radioSummaryStyle}>
                          点击图标即可显示弹出式翻译。
                        </Text>
                      </Radio>
                      <Radio
                        style={radioStyle}
                        value="enable-translate-tooltip"
                      >
                        显示弹出式翻译
                        <Text type="secondary" style={radioSummaryStyle}>
                          自动将选中的单词或短语发送至翻译引擎，以确定是否应显示翻译。
                        </Text>
                      </Radio>
                    </Radio.Group>
                  )}
                </>
              }
            />
            <Switch
              checked={config?.selectionTranslateMode !== 'disabled'}
              onChange={(checked) => {
                sharedConfigManager.setSelectionTranslateMode(
                  checked ? 'enable-translate-icon' : 'disabled'
                );
              }}
            />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              title="快捷键取词"
              description={
                <>
                  当禁用自动弹出功能时，可通过快捷键
                  <ShortcutKeyLabel
                    style={{ marginLeft: 8, marginRight: 8 }}
                    shortcutKey={config?.selectionTranslateShortcutKey}
                  />
                  触发显示弹出式翻译。
                </>
              }
            />
            <Button
              size="small"
              onClick={() => {
                this.setState({
                  setShortcutKeyModalVisible: true,
                });
              }}
            >
              修改
            </Button>
          </List.Item>
          <List.Item>
            <List.Item.Meta title="自动播放发音" />
            <Radio.Group
              size="small"
              value={config?.autoplayPronunciation}
              onChange={(e) => {
                sharedConfigManager.setAutoplayPronunciation(e.target.value);
              }}
            >
              <Radio.Button value="us-pronunciation">美式</Radio.Button>
              <Radio.Button value="uk-pronunciation">英式</Radio.Button>
              <Radio.Button value="disabled">禁用</Radio.Button>
            </Radio.Group>
          </List.Item>
        </List>
        <Title level={4} style={{ marginTop: '32px' }}>
          翻译引擎
        </Title>
        <Table
          size="middle"
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [config?.translateEngine ?? 'youdao-web'],
            onChange: (selectedRowKeys, selectedRows) => {
              sharedConfigManager.setTranslateEngine(selectedRowKeys[0]);
            },
          }}
          columns={[
            {
              title: '名称',
              dataIndex: 'name',
              key: 'name',
            },
          ]}
          dataSource={translateEngines}
          showHeader={false}
          bordered
          pagination={{ hideOnSinglePage: true }}
          onRow={(record) => ({
            onClick: () => {
              sharedConfigManager.setTranslateEngine(record.key);
            },
          })}
        />
        {/* <Title level={4} style={{ marginTop: '32px' }}>
          拒绝名单
        </Title>
        <Table
          size="middle"
          columns={[
            {
              title: '匹配规则',
              dataIndex: 'match_rule',
              key: 'rule',
            },
          ]}
          dataSource={[]}
          bordered
          pagination={{ hideOnSinglePage: true }}
        /> */}
        <SetShortcutKeyModal
          visible={this.state.setShortcutKeyModalVisible}
          onChange={(shortcutKey) => {
            this.setState({
              setShortcutKeyModalVisible: false,
            });
            sharedConfigManager.setSelectionTranslateShortcutKey(shortcutKey);
          }}
          onCancel={() => {
            this.setState({
              setShortcutKeyModalVisible: false,
            });
          }}
        />
      </div>
    );
  }
}

export default TabSelectionTranslate;
