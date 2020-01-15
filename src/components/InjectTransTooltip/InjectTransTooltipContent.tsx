import * as React from 'react';
import {
  Alert,
  WidgetContainer,
  Widget,
  WidgetContent,
  Divider,
  FormGroupContainer,
  Button,
  ButtonGroup,
  FormGroup
} from '@duik/it';
import * as FeatherIcons from 'react-feather';
import { LookUpResult } from '@wordway/translate-api';

import ShadowRoot from '../ShadowRoot';
import { sharedApiClient } from '../../networking';

const IpaItem = (props: any) => {
  const { flag, ipa, pronunciationUrl } = props;
  if (!ipa && !pronunciationUrl) return <div />;
  return (
    <div
      style={{
        marginRight: '12px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <span
        style={{
          fontSize: '14px',
          marginRight: '6px'
        }}
      >
        {`${flag}`}
        {ipa ? ` [${ipa}]` : ''}
      </span>
      <button
        style={{
          minWidth: '28px',
          height: '28px',
          paddingLeft: '4px',
          paddingRight: '4px',
          background: 'transparent',
          border: 'none',
          marginTop: '2px',
          outline: 'none'
        }}
        onClick={() => {
          chrome.runtime.sendMessage({
            method: 'playAudio',
            arguments: { url: pronunciationUrl }
          });
        }}
      >
        <FeatherIcons.Volume2 size={20} color="var(--indigo)" />
      </button>
    </div>
  );
};

const DefinitionWrapper = (props: any) => {
  return <ul {...props} />;
};
const DefinitionListItem = (props: any) => {
  const { type, values } = props;
  return (
    <li
      style={{
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
        margin: 0
      }}
    >
      <span
        style={{
          fontSize: '13px',
          fontWeight: 'bold',
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: '4px',
          paddingRight: '4px',
          marginRight: '10px',
          minWidth: '42px',
          height: '20px',
          lineHeight: '20px',
          backgroundColor: 'var(--text-secondary)',
          color: '#fff',
          verticalAlign: 'middle',
          textAlign: 'center'
        }}
      >
        {type}
      </span>
      <span
        style={{
          fontWeight: 'bold',
          padding: 0,
          margin: 0,
          display: 'flex',
          flex: 1,
          lineHeight: '20px'
        }}
      >
        {values.join('；')}
      </span>
    </li>
  );
};

const TenseWrapper = (props: any) => {
  return <div {...props} />;
};

const TenseListItem = (props: any) => {
  const { name, values } = props;
  return (
    <>
      <span
        style={{
          margin: '0 6px 0 0',
          fontSize: '14px'
        }}
      >
        {name}
      </span>
      <span
        style={{
          margin: '0 6px 0 0',
          fontSize: '14px',
          color: 'var(--indigo)'
        }}
      >
        {values}
      </span>
    </>
  );
};

interface InjectTransTooltipContentProps {
  q: string;
  lookUpResult?: LookUpResult;
  lookUpError?: Error;
}

interface InjectTransTooltipContentState {
  currentUser: any;
  processing: boolean;
  wordbookWord: any;
}

class InjectTransTooltipContent extends React.Component<
  InjectTransTooltipContentProps,
  InjectTransTooltipContentState
> {
  constructor(
    props: InjectTransTooltipContentProps,
    state: InjectTransTooltipContentState
  ) {
    super(props, state);

    this.state = {
      currentUser: undefined,
      processing: false,
      wordbookWord: undefined
    };
  }

  componentDidMount() {
    const keys = ['currentUser', 'autoplayPronunciation'];
    const callback = (result: any) => {
      const currentUser = result.currentUser
        ? JSON.parse(result.currentUser)
        : null;
      this.setState({ currentUser }, () => {
        if (currentUser) this.reloadData();
      });

      const autoplayPronunciation = result.autoplayPronunciation || 'disabled';
      if (autoplayPronunciation !== 'disabled') {
        let pronunciationUrl = this.props.lookUpResult?.usPronunciationUrl;
        if (autoplayPronunciation.startsWith('uk')) {
          pronunciationUrl = this.props.lookUpResult?.ukPronunciationUrl;
        }

        chrome.runtime.sendMessage({
          method: 'playAudio',
          arguments: { url: pronunciationUrl }
        });
      }

    };
    chrome.storage.sync.get(keys, callback);
  }

  reloadData = async () => {
    const { lookUpResult } = this.props;
    const { currentUser } = this.state;

    try {
      const r = await sharedApiClient.get(
        `/wordbooks/newwords-for-user-${currentUser?.id}/words/${lookUpResult?.word}`
      );
      const {
        data: { data: wordbookWord }
      } = r;

      this.setState({
        wordbookWord
      });
    } catch (e) {
      console.log(e);
    }
  };

  handleClickAddToNewWords = async () => {
    const { lookUpResult } = this.props;
    const { currentUser } = this.state;

    let wordbookWord;
    try {
      this.setState({ processing: true });

      const r = await sharedApiClient.post(
        `/wordbooks/newwords-for-user-${currentUser?.id}/words`,
        { word: lookUpResult?.word }
      );
      wordbookWord = r.data.data;
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({
        wordbookWord,
        processing: false
      });
    }
  };

  handleClickRemoveFromNewWords = async () => {
    const { lookUpResult } = this.props;
    const { currentUser } = this.state;

    try {
      this.setState({ processing: true });

      await sharedApiClient.delete(
        `/wordbooks/newwords-for-user-${currentUser?.id}/words/${lookUpResult?.word}`
      );
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({
        wordbookWord: undefined,
        processing: false
      });
    }
  };

  renderLookUpError = () => {
    const { lookUpError }: InjectTransTooltipContentProps = this.props;
    if (!lookUpError) return <></>;

    return (
      <WidgetContent>
        <FormGroupContainer>
          <FormGroup
            style={{
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <h4>{lookUpError?.message}</h4>
          </FormGroup>
        </FormGroupContainer>
      </WidgetContent>
    );
  };

  renderLookUpResult = () => {
    const { lookUpResult }: InjectTransTooltipContentProps = this.props;

    if (!lookUpResult) return <></>;

    if (!lookUpResult?.word) {
      return (
        <WidgetContent>
          <FormGroupContainer>
            <FormGroup
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <span className="content-title">原文</span>
              <h4>{lookUpResult?.sourceText}</h4>
            </FormGroup>
          </FormGroupContainer>
          <FormGroupContainer>
            <FormGroup
              style={{
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <span className="content-title">译文</span>
              <h4>{lookUpResult?.targetText}</h4>
            </FormGroup>
          </FormGroupContainer>
        </WidgetContent>
      );
    }

    return (
      <>
        <WidgetContent
          style={{
            padding: '16px 16px'
          }}
        >
          <h3
            style={{
              marginRight: '12px'
            }}
          >
            {lookUpResult?.word}
          </h3>
        </WidgetContent>
        {!lookUpResult?.tip ? null : (
          <>
            <Divider />
            <Alert
              warning
              style={{
                width: '100%',
                padding: '6px 16px',
                border: 'none',
                borderRadius: 0
              }}
            >
              {lookUpResult?.tip}
            </Alert>
          </>
        )}
        <Divider />
        <WidgetContent
          style={{
            padding: '16px 16px'
          }}
        >
          <FormGroupContainer>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              <IpaItem
                flag="美"
                ipa={lookUpResult?.usIpa}
                pronunciationUrl={lookUpResult?.usPronunciationUrl}
              />
              <IpaItem
                flag="英"
                ipa={lookUpResult?.ukIpa}
                pronunciationUrl={lookUpResult?.ukPronunciationUrl}
              />
            </div>
            <DefinitionWrapper>
              {lookUpResult?.definitions?.map((v: any) => (
                <DefinitionListItem
                  key={v?.values?.join('；')}
                  type={v.type}
                  values={v.values}
                />
              ))}
            </DefinitionWrapper>
            {!lookUpResult?.tenses ? null : (
              <TenseWrapper>
                {lookUpResult?.tenses?.map((v: any) => (
                  <TenseListItem key={v.type} name={v.name} values={v.values} />
                ))}
              </TenseWrapper>
            )}
          </FormGroupContainer>
        </WidgetContent>
      </>
    );
  };

  render() {
    const { lookUpResult }: InjectTransTooltipContentProps = this.props;
    const { currentUser, wordbookWord, processing } = this.state;

    return (
      <ShadowRoot>
        <WidgetContainer
          style={{
            padding: 0,
            minWidth: '360px',
            minHeight: '120px',
            maxWidth: '420px',
            maxHeight: '540px'
          }}
        >
          <Widget
            style={{
              border: 'none',
              boxShadow: 'none'
            }}
          >
            {this.renderLookUpError()}
            {this.renderLookUpResult()}
            <Divider />
            <WidgetContent
              style={{
                display: 'flex',
                padding: '16px 16px'
              }}
            >
              {!lookUpResult?.word ? null : (
                <ButtonGroup sm>
                  {/* <Button>
                    <FeatherIcons.Bookmark size={16} color="var(--text-main)" />
                  </Button> */}
                  <Button
                    loading={processing}
                    onClick={() => {
                      if (!currentUser) {
                        chrome.runtime.sendMessage({
                          method: 'openOptionsPage'
                        });
                        return;
                      }
                      if (!wordbookWord) {
                        this.handleClickAddToNewWords();
                      } else {
                        this.handleClickRemoveFromNewWords();
                      }
                    }}
                  >
                    {!wordbookWord ? (
                      <>
                        <FeatherIcons.Plus size={16} color="var(--text-main)" />
                        &nbsp;添加到生词本
                      </>
                    ) : (
                      <>
                        <FeatherIcons.Check
                          size={16}
                          color="var(--text-main)"
                        />
                        &nbsp;已添加到生词本
                      </>
                    )}
                  </Button>
                </ButtonGroup>
              )}
              <div style={{ flex: 1 }} />
              <Button
                transparent
                square
                sm
                onClick={() => {
                  chrome.runtime.sendMessage({ method: 'openOptionsPage' });
                }}
              >
                <FeatherIcons.Settings size={16} color="var(--text-main)" />
              </Button>
            </WidgetContent>
          </Widget>
        </WidgetContainer>
      </ShadowRoot>
    );
  }
}

export default InjectTransTooltipContent;
