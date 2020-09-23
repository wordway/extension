import * as React from 'react';
import { Helmet } from 'react-helmet';
import {
  message,
  Avatar,
  Button,
  Layout,
  Menu,
  Tabs,
  Typography,
  Popconfirm,
} from 'antd';
import {
  TranslationOutlined,
  UserOutlined,
  InfoCircleOutlined,
  ReadOutlined,
  BookOutlined,
  ExperimentOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

import env from '../../utils/env';
import r from '../../utils/r';
import TabAboutUs from './TabAboutUs';
import TabExperimentalFeature from './TabExperimentalFeature';
import TabNewWords from './TabNewWords';
import TabReadingAid from './TabReadingAid';
import TabSelectionTranslate from './TabSelectionTranslate';
import TabTranslationHistory from './TabTranslationHistory';

import { LoginModal } from '../../components';
import {
  sharedConfigManager,
  ConfigListener,
  Config,
} from '../../utils/config';

import './Options.less';

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
const { Text } = Typography;

const kTabAboutUs: string = 'about_us';
const kTabExperimentalFeature = 'experimental_feature';
const kTabNewWords: string = 'new_words';
const kTabReadingAid: string = 'reading_aid';
const kTabSelectionTranslate = 'selection_translate';
const kTabTranslationHistory = 'translation_history';

class OptionsPage extends React.Component<any, any> implements ConfigListener {
  constructor(props: any, state: any) {
    super(props, state);

    this.state = {
      currentUser: null,
      selectedTabKey: kTabSelectionTranslate,
      loginModalVisible: false,
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
    if (!this.state.currentUser && newConfig.currentUser) {
      message.success('登录成功');
    }
    if (this.state.currentUser && !newConfig.currentUser) {
      message.success('退出成功');
    }

    this.setState({
      currentUser: newConfig.currentUser,
    });
  }

  async _loadData() {
    let config = await sharedConfigManager.getConfig();

    this.setState({
      currentUser: config.currentUser,
    });
  }

  _handleClickLogin = () => {
    if (this.state.currentUser) return;

    if (!chrome.extension) {
      this.setState({ loginModalVisible: true });
      return;
    }
    const urlSearchParams = new URLSearchParams(
      Object.entries({ extensionId: env.extensionId })
    );
    chrome.tabs.create({
      url: `${env.webURL}/account/login?${urlSearchParams}`,
    });
  };

  _handleClickLogout = () => {
    if (!this.state.currentUser) return;

    if (!chrome.extension) {
      sharedConfigManager.setCurrentUser(null);
      return;
    }

    const urlSearchParams = new URLSearchParams(
      Object.entries({ extensionId: env.extensionId })
    );
    chrome.tabs.create({
      url: `${env.webURL}/account/logout?${urlSearchParams}`,
    });
  };

  render() {
    const { selectedTabKey, currentUser, loginModalVisible } = this.state;
    return (
      <>
        <Helmet>
          <title>一路背单词（查词助手）</title>
        </Helmet>
        <div className="page-options">
          <Layout>
            <Header>
              <img
                src={r('/images/icon128.png')}
                alt="logo"
                style={{ width: '28px', marginRight: '8px' }}
              />
              一路背单词
            </Header>
            <Layout>
              <Sider theme="light" width={220}>
                <div className="user-info" onClick={this._handleClickLogin}>
                  <Avatar
                    size={64}
                    icon={<UserOutlined />}
                    src={currentUser?.avatarUrl}
                  />
                  <Text strong>{currentUser?.name || '立即登录'}</Text>
                  <Text type="secondary">
                    {currentUser?.email || '登录以保持数据同步'}
                  </Text>
                </div>
                <Menu
                  defaultSelectedKeys={[selectedTabKey]}
                  mode="inline"
                  onSelect={({ key }: any) => {
                    this.setState({
                      selectedTabKey: key,
                    });
                  }}
                >
                  <Menu.ItemGroup>
                    <Menu.Item key={kTabNewWords}>
                      <HistoryOutlined />
                      生词本
                    </Menu.Item>
                    <Menu.Item key={kTabTranslationHistory}>
                      <BookOutlined />
                      翻译记录
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup title="基本功能">
                    <Menu.Item key={kTabSelectionTranslate}>
                      <TranslationOutlined />
                      划词翻译
                    </Menu.Item>
                    <Menu.Item key={kTabReadingAid}>
                      <ReadOutlined />
                      阅读辅助
                    </Menu.Item>
                  </Menu.ItemGroup>
                  <Menu.ItemGroup title="其他设置">
                    <Menu.Item key={kTabExperimentalFeature}>
                      <ExperimentOutlined />
                      实验性功能
                    </Menu.Item>
                    <Menu.Item key={kTabAboutUs}>
                      <InfoCircleOutlined />
                      关于我们
                    </Menu.Item>
                  </Menu.ItemGroup>
                </Menu>
                {currentUser && (
                  <Popconfirm
                    title="确定退出登录吗？"
                    onConfirm={this._handleClickLogout}
                    okText="是"
                    cancelText="否"
                  >
                    <Button
                      type="primary"
                      ghost
                      style={{ width: '120px', marginTop: '100px' }}
                    >
                      退出登录
                    </Button>
                  </Popconfirm>
                )}
              </Sider>
              <Content>
                <Tabs activeKey={selectedTabKey} renderTabBar={() => <div />}>
                  <TabPane key={kTabNewWords}>
                    <TabNewWords />
                  </TabPane>
                  <TabPane key={kTabTranslationHistory}>
                    <TabTranslationHistory />
                  </TabPane>
                  <TabPane key={kTabSelectionTranslate}>
                    <TabSelectionTranslate />
                  </TabPane>
                  <TabPane key={kTabReadingAid}>
                    <TabReadingAid />
                  </TabPane>
                  <TabPane key={kTabExperimentalFeature}>
                    <TabExperimentalFeature />
                  </TabPane>
                  <TabPane key={kTabAboutUs}>
                    <TabAboutUs />
                  </TabPane>
                </Tabs>
              </Content>
            </Layout>
          </Layout>
          <LoginModal
            visible={loginModalVisible}
            onCancel={() => {
              this.setState({
                loginModalVisible: false,
              });
            }}
            onLoginSuccess={(user) => {
              this.setState({
                loginModalVisible: false,
              });

              sharedConfigManager.setCurrentUser(user);
            }}
          />
        </div>
      </>
    );
  }
}

export default OptionsPage;
