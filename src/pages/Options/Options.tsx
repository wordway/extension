import * as React from "react";
import { Helmet } from "react-helmet";
import {
  Button,
  FormGroupContainer,
  FormGroup,
  Divider,
  WidgetContainer,
  Widget,
  WidgetContent,
  Radio,
  Dropdown,
  DropdownItem,
  DropdownMenuPosition
} from "@duik/it";
import toastr from "toastr";

import {
  SelectTranslateEngine,
} from "../../components";
import env from "../../utils/env";
import UserConfig from "../../utils/user-config";

// import cls from "./Options.module.scss";

interface OptionsProps { }
interface OptionsState {
  userConfig: UserConfig;
  currentUser?: any;
  selectionTranslateMode?: string;
  selectionTranslateEngine?: string;
  autoplayPronunciation?: string;
}

class Options extends React.Component<OptionsProps, OptionsState> {
  constructor(props: OptionsProps, state: OptionsState) {
    super(props, state);

    this.state = {
      userConfig: new UserConfig(),
    };
  }

  componentDidMount() {
    chrome.storage.onChanged.addListener((changes, _) => {
      for (const key in changes) {
        if (key === "currentUser") {
          const storageChange = changes[key];

          if (!storageChange.oldValue) {
            toastr.success("登录成功。");
          }
          if (!storageChange.newValue) {
            toastr.success("退出成功。");
          }

          this.reloadConfig();
        }
      }
    });

    this.reloadConfig();
  }

  reloadConfig = () => {
    UserConfig.load((newUserConfig: any) => {
      this.setState({
        userConfig: newUserConfig,
        ...newUserConfig,
      });
    })
  }

  handleChangeSelectionTranslateMode = (event: any) => {
    const { value } = event.currentTarget;
    this.setState({ selectionTranslateMode: value });
  }

  handleOptionClickSelectionTranslateEngine = ({ value }: any) => {
    this.setState({ selectionTranslateEngine: value });
  }

  handleChangeAutoplayPronunciation = (event: any) => {
    const { value } = event.currentTarget;
    this.setState({ autoplayPronunciation: value });
  }

  handleClickLogin = () => {
    const urlSearchParams = new URLSearchParams(
      Object.entries({
        extensionId: chrome.i18n.getMessage("@@extension_id")
      })
    );
    chrome.tabs.create({
      url: `${env.webURL}/account/login?${urlSearchParams}`
    });
  }

  handleClickLogout = () => {
    const urlSearchParams = new URLSearchParams(
      Object.entries({
        extensionId: chrome.i18n.getMessage("@@extension_id")
      })
    );
    chrome.tabs.create({
      url: `${env.webURL}/account/logout?${urlSearchParams}`
    });
  }

  handleClickSubmit = (event: any) => {
    event.preventDefault();

    const {
      userConfig,
      selectionTranslateMode,
      selectionTranslateEngine,
      autoplayPronunciation,
    } = this.state;

    UserConfig.save(
      Object.assign(userConfig, {
        selectionTranslateMode,
        selectionTranslateEngine,
        autoplayPronunciation,
      }),
      (newUserConfig: UserConfig) => {
        this.setState({
          userConfig: newUserConfig,
          ...newUserConfig,
        });

        toastr.success("选项已重置。");
      });
  };

  handleClickReset = (event: any) => {
    event.preventDefault();

    UserConfig.save(new UserConfig(), (newUserConfig: UserConfig) => {
      this.setState({
        userConfig: newUserConfig,
        ...newUserConfig,
      });

      toastr.success("选项已重置。");
    });
  };

  render() {
    const {
      currentUser,
      selectionTranslateMode,
      selectionTranslateEngine,
      autoplayPronunciation,
    } = this.state;
    return (
      <>
        <Helmet>
          <title>选项 | 一路背单词（查词助手）</title>
        </Helmet>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <WidgetContainer style={{ width: "768px" }}>
            <Widget>
              <WidgetContent>
                <FormGroupContainer horizontal>
                  <h3>扩展选项</h3>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end"
                    }}
                  >
                    {currentUser ? null : (
                      <Button
                        onClick={this.handleClickLogin}
                      >
                        立即登录
                      </Button>
                    )}
                    {!currentUser ? null : (
                      <Dropdown
                        menuPosition={DropdownMenuPosition["bottom-right"]}
                        buttonText={`${currentUser?.name}（${currentUser?.email}）`}
                      >
                        <DropdownItem
                          onClick={this.handleClickLogout}
                        >
                          退出登录
                        </DropdownItem>
                      </Dropdown>
                    )}
                  </div>
                </FormGroupContainer>
              </WidgetContent>
              <Divider />
              <form
                onSubmit={this.handleClickSubmit}
                onReset={this.handleClickReset}
              >
                <WidgetContent>
                  <FormGroupContainer>
                    <h5>划词翻译</h5>
                    <FormGroup
                      style={{
                        display: "flex",
                        flexDirection: "column"
                      }}
                    >
                      <span className="content-title">
                        弹出翻译（在选中单词或短语时）
                      </span>
                      <Radio
                        checked={
                          selectionTranslateMode === "enable-translate-icon"
                        }
                        label="显示图标"
                        name="selectionTranslateMode"
                        description="点击图标即可显示弹出式翻译。"
                        value="enable-translate-icon"
                        onChange={this.handleChangeSelectionTranslateMode}
                      />
                      <Radio
                        checked={
                          selectionTranslateMode === "enable-translate-tooltip"
                        }
                        label="显示弹出式翻译"
                        name="selectionTranslateMode"
                        description="自动将选中的单词或短语发送至翻译引擎，以确定是否应显示翻译。"
                        value="enable-translate-tooltip"
                        onChange={this.handleChangeSelectionTranslateMode}
                      />
                      <Radio
                        checked={selectionTranslateMode === "disabled"}
                        label="不显示图标和弹出式翻译"
                        description="此时您可以按下快捷键「Shift」来调出弹出式翻译。"
                        name="selectionTranslateMode"
                        value="disabled"
                        onChange={this.handleChangeSelectionTranslateMode}
                      />
                    </FormGroup>
                    <FormGroup>
                      <span className="content-title">
                        自动发音
                      </span>
                      <FormGroupContainer
                        horizontal
                        style={{
                          marginTop: "auto"
                        }}
                      >
                        <Radio
                          checked={autoplayPronunciation === "disabled"}
                          label="禁用该功能"
                          name="autoplayPronunciation"
                          value="disabled"
                          onChange={this.handleChangeAutoplayPronunciation}
                        />
                        <Radio
                          checked={autoplayPronunciation === "us-pronunciation"}
                          label="美式发音"
                          name="autoplayPronunciation"
                          value="us-pronunciation"
                          onChange={this.handleChangeAutoplayPronunciation}
                        />
                        <Radio
                          checked={autoplayPronunciation === "uk-pronunciation"}
                          label="英式发音"
                          name="autoplayPronunciation"
                          value="uk-pronunciation"
                          onChange={this.handleChangeAutoplayPronunciation}
                        />
                      </FormGroupContainer>
                    </FormGroup>
                    <FormGroup>
                      <SelectTranslateEngine
                        block
                        label="翻译引擎"
                        activeOption={selectionTranslateEngine}
                        onOptionClick={this.handleOptionClickSelectionTranslateEngine}
                      />
                    </FormGroup>
                  </FormGroupContainer>
                </WidgetContent>
                <WidgetContent style={{ display: "flex" }}>
                  <FormGroupContainer horizontal>
                    <Button type="submit" success>
                      保存
                    </Button>
                    <Button type="reset" transparent>
                      重置
                    </Button>
                  </FormGroupContainer>
                </WidgetContent>
              </form>
            </Widget>
          </WidgetContainer>
        </div>
      </>
    );
  }
}

export default Options;
