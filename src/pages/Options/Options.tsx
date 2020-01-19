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
import config from "../../utils/config";

// import cls from "./Options.module.scss";

interface OptionsProps {}
interface OptionsState {
  currentUser: any;
  selectionTranslateMode: string;
  selectionTranslateEngine: string;
  autoplayPronunciation: string;
}

const defaultOptions = {
  selectionTranslateMode: "enable-translate-tooltip",
  selectionTranslateEngine: "youdao-web",
  autoplayPronunciation: "us-pronunciation",
};

class Options extends React.Component<OptionsProps, OptionsState> {
  constructor(props: OptionsProps, state: OptionsState) {
    super(props, state);

    this.state = {
      currentUser: null,
      ...defaultOptions,
    };
  }

  componentDidMount() {
    const keys = [
      "currentUser",
      "selectionTranslateMode",
      "selectionTranslateEngine"
    ];
    const callback = (result: any) => {
      const { currentUser, ...rest } = result;
      this.setState({
        currentUser: currentUser ? JSON.parse(currentUser) : null,
        ...rest
      });
    };
    chrome.storage.sync.get(keys, callback);
    chrome.storage.onChanged.addListener((changes, namespace) => {
      for (const key in changes) {
        if (key === "currentUser") {
          const storageChange = changes[key];

          this.setState({
            currentUser: storageChange.newValue
              ? JSON.parse(storageChange.newValue)
              : null
          });

          if (!storageChange.oldValue) {
            toastr.success("登录成功。");
          }
          if (!storageChange.newValue) {
            toastr.success("退出成功。");
          }
        }
      }
    });
  }

  handleClickSubmit = (event: any) => {
    event.preventDefault();

    const {
      selectionTranslateMode,
      selectionTranslateEngine,
      autoplayPronunciation,
    } = this.state;

    chrome.storage.sync.set(
      {
        selectionTranslateMode,
        selectionTranslateEngine,
        autoplayPronunciation,
      },
      () => {
        toastr.success("选项已保存。");
      }
    );
  };

  handleClickReset = (event: any) => {
    event.preventDefault();

    chrome.storage.sync.set(
      {
        ...defaultOptions
      },
      () => {
        this.setState(defaultOptions);
        toastr.success("选项已重置。");
      }
    );
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
                        onClick={() => {
                          const urlSearchParams = new URLSearchParams(
                            Object.entries({
                              extensionId: chrome.i18n.getMessage(
                                "@@extension_id"
                              )
                            })
                          );
                          chrome.tabs.create({
                            url: `${config.webURL}/account/login?${urlSearchParams}`
                          });
                        }}
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
                          onClick={() => {
                            const urlSearchParams = new URLSearchParams(
                              Object.entries({
                                extensionId: chrome.i18n.getMessage(
                                  "@@extension_id"
                                )
                              })
                            );
                            chrome.tabs.create({
                              url: `${config.webURL}/account/logout?${urlSearchParams}`
                            });
                          }}
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
                        onChange={e => {
                          this.setState({
                            selectionTranslateMode: e.currentTarget.value
                          });
                        }}
                      />
                      <Radio
                        checked={
                          selectionTranslateMode === "enable-translate-tooltip"
                        }
                        label="显示弹出式翻译"
                        name="selectionTranslateMode"
                        description="自动将选中的单词或短语发送至翻译引擎，以确定是否应显示翻译。"
                        value="enable-translate-tooltip"
                        onChange={e => {
                          this.setState({
                            selectionTranslateMode: e.currentTarget.value
                          });
                        }}
                      />
                      <Radio
                        checked={selectionTranslateMode === "disabled"}
                        label="不显示图标和弹出式翻译"
                        description="此时您可以按下快捷键「Shift」来调出弹出式翻译。"
                        name="selectionTranslateMode"
                        value="disabled"
                        onChange={e => {
                          this.setState({
                            selectionTranslateMode: e.currentTarget.value
                          });
                        }}
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
                          onChange={e => {
                            this.setState({
                              autoplayPronunciation: e.currentTarget.value
                            });
                          }}
                        />
                        <Radio
                          checked={
                            autoplayPronunciation === "us-pronunciation"
                          }
                          label="美式发音"
                          name="autoplayPronunciation"
                          value="us-pronunciation"
                          onChange={e => {
                            this.setState({
                              autoplayPronunciation: e.currentTarget.value
                            });
                          }}
                        />
                        <Radio
                          checked={
                            autoplayPronunciation === "uk-pronunciation"
                          }
                          label="英式发音"
                          name="autoplayPronunciation"
                          value="uk-pronunciation"
                          onChange={e => {
                            this.setState({
                              autoplayPronunciation: e.currentTarget.value
                            });
                          }}
                        />
                      </FormGroupContainer>
                    </FormGroup>
                    <FormGroup>
                      <SelectTranslateEngine
                        block
                        label="翻译引擎"
                        activeOption={selectionTranslateEngine}
                        onOptionClick={({ value }: any) => {
                          this.setState({ selectionTranslateEngine: value });
                        }}
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
