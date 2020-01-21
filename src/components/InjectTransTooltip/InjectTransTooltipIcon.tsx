import '../../utils/isomorphic-translate-api';

import * as React from 'react';
import { Button } from '@duik/it';
import Translate, { LookUpResult } from '@wordway/translate-api';
import CloudoptAIEngine from '@wordway/translate-engine-cloudoptai'
import BingWebEngine from '@wordway/translate-webengine-bing';
import YoudaoWebEngine from '@wordway/translate-webengine-youdao';

import ShadowRoot from '../ShadowRoot';
import r from '../../utils/r';
import UserConfig from '../../utils/user-config';

interface InjectTransTooltipIconProps {
  q: string;
  autoload: boolean;
  onLoadComplete: any;
}
interface InjectTransTooltipIconState {
  userConfig: UserConfig;
  loading: boolean;
}

class InjectTransTooltipIcon extends React.Component<
  InjectTransTooltipIconProps,
  InjectTransTooltipIconState
> {
  private translate: Translate;

  constructor(
    props: InjectTransTooltipIconProps,
    state: InjectTransTooltipIconState
  ) {
    super(props, state);

    const cloudoptAIEngine = new CloudoptAIEngine();
    const bingWebEngine = new BingWebEngine();
    const youdaoWebEngine = new YoudaoWebEngine();

    this.translate = new Translate([
      cloudoptAIEngine,
      bingWebEngine,
      youdaoWebEngine,
    ]);

    this.state = {
      userConfig: new UserConfig(),
      loading: false
    };
  }

  componentDidMount() {
    const { autoload } = this.props;

    const callback = (userConfig: any) => {
      this.setState({ userConfig }, () => {
        if (autoload) this.reloadData();
      });
    };
    UserConfig.load(callback);
  }

  reloadData = async () => {
    const { q, onLoadComplete } = this.props;
    const { userConfig } = this.state;

    let beginTime = new Date().getTime();

    let lookUpResult: LookUpResult;
    let lookUpError: Error;

    try {
      this.setState({ loading: true });
      lookUpResult = await this.translate
        .engine(userConfig.selectionTranslateEngine)
        .lookUp(q, { exclude: ['originData'] });
    } catch (e) {
      lookUpError = e;
    } finally {
      const usedTime = new Date().getTime() - beginTime;
      setTimeout(
        () => {
          this.setState({ loading: false }, () => {
            onLoadComplete(lookUpResult, lookUpError);
          });
        },
        usedTime > 60 ? 0 : 60 - usedTime
      );
    }
  };

  render() {
    return (
      <ShadowRoot>
        <Button
          transparent
          square
          style={{
            border: 'none'
          }}
          sm
          loading={this.state.loading}
          onClick={() => this.reloadData()}
          {...this.props}
        >
          <img
            src={r('/images/trans_tooltip_icon.png')}
            alt="icon"
            style={{ width: '28px' }}
          />
        </Button>
      </ShadowRoot>
    );
  }
}

export default InjectTransTooltipIcon;
