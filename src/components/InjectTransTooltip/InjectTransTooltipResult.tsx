import * as React from "react";
import {
  WidgetContainer,
  Widget,
  WidgetContent,
  Divider,
  FormGroupContainer,
  Button,
  ButtonGroup
} from "@duik/it";
import * as FeatherIcons from "react-feather";
import { LookUpResult } from "@wordway/translate-api";

import ShadowRoot from "../ShadowRoot";

const IpaItem = (props: any) => {
  const { flag, ipa, pronunciationUrl } = props;
  if (!ipa) return <div />;
  return (
    <div
      style={{
        marginRight: "12px",
        display: "flex",
        alignItems: "center"
      }}
    >
      <span
        style={{
          fontSize: "14px",
          marginRight: "6px"
        }}
      >
        {flag}
        {` [${ipa}]`}
      </span>
      <button
        style={{
          minWidth: "28px",
          height: "28px",
          paddingLeft: "4px",
          paddingRight: "4px",
          background: "transparent",
          border: "none",
          marginTop: "2px"
        }}
        onClick={() => {
          chrome.runtime.sendMessage({
            method: "playAudio",
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
        display: "flex",
        flexDirection: "row",
        padding: 0,
        margin: 0
      }}
    >
      <span
        style={{
          fontWeight: "bold",
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: "6px",
          paddingRight: "6px",
          marginRight: "10px",
          minWidth: "38px",
          height: "22px",
          lineHeight: "22px",
          backgroundColor: "var(--text-secondary)",
          color: "#fff",
          verticalAlign: "middle",
          textAlign: "center"
        }}
      >
        {type}
      </span>
      <span
        style={{
          fontWeight: "bold",
          padding: 0,
          margin: 0,
          display: "flex",
          flex: 1
        }}
      >
        {values.join("；")}
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
          margin: "0 6px 0 0",
          fontSize: "14px"
        }}
      >
        {name}
      </span>
      <span
        style={{
          margin: "0 6px 0 0",
          fontSize: "14px",
          color: "var(--indigo)"
        }}
      >
        {values}
      </span>
    </>
  );
};

interface InjectTransTooltipResultProps {
  q: string;
  lookUpResult?: LookUpResult;
}

interface InjectTransTooltipResultState {}

class InjectTransTooltipResult extends React.Component<
  InjectTransTooltipResultProps,
  InjectTransTooltipResultState
> {
  // constructor(
  //   props: InjectTransTooltipResultProps,
  //   state: InjectTransTooltipResultState
  // ) {
  //   super(props, state);
  // }

  componentDidMount() {
    console.log(JSON.stringify(this.props.lookUpResult, null, 2));
  }

  render() {
    const { lookUpResult }: InjectTransTooltipResultProps = this.props;

    return (
      <ShadowRoot>
        <WidgetContainer
          style={{
            padding: 0,
            minWidth: "340px",
            minHeight: "160px",
            maxWidth: "420px",
            maxHeight: "540px"
          }}
        >
          <Widget
            style={{
              border: "none",
              boxShadow: "none"
            }}
          >
            <WidgetContent
              style={{
                padding: "16px 16px"
              }}
            >
              <h3
                style={{
                  marginRight: "12px"
                }}
              >
                {lookUpResult?.word}
              </h3>
            </WidgetContent>
            <Divider />
            <WidgetContent
              style={{
                padding: "16px 16px"
              }}
            >
              <FormGroupContainer>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row"
                  }}
                >
                  <IpaItem
                    flag="英"
                    ipa={lookUpResult?.ukIpa}
                    pronunciationUrl={lookUpResult?.ukPronunciationUrl}
                  />
                  <IpaItem
                    flag="美"
                    ipa={lookUpResult?.ukIpa}
                    pronunciationUrl={lookUpResult?.usPronunciationUrl}
                  />
                </div>
                <DefinitionWrapper>
                  {lookUpResult?.definitions?.map((v: any) => (
                    <DefinitionListItem
                      key={v?.values?.join("；")}
                      type={v.type}
                      values={v.values}
                    />
                  ))}
                </DefinitionWrapper>
                <TenseWrapper>
                  {lookUpResult?.tenses?.map((v: any) => (
                    <TenseListItem
                      key={v.type}
                      name={v.name}
                      values={v.values}
                    />
                  ))}
                </TenseWrapper>
              </FormGroupContainer>
            </WidgetContent>
            <Divider />
            <WidgetContent
              style={{
                display: "flex",
                padding: "16px 16px"
              }}
            >
              <ButtonGroup sm>
                <Button>
                  <FeatherIcons.Bookmark size={16} color="var(--text-main)" />
                </Button>
                <Button>添加到生词本</Button>
              </ButtonGroup>
              <div style={{ flex: 1 }} />
              <Button
                transparent
                square
                sm
                onClick={() => {
                  chrome.runtime.sendMessage({ method: "openOptionsPage" });
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

export default InjectTransTooltipResult;
