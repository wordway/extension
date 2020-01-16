import * as React from 'react';
import { Button } from '@duik/it';
import Translate, { LookUpResult } from '@wordway/translate-api';
import BingWebEngine from '@wordway/translate-webengine-bing';
import YoudaoWebEngine from '@wordway/translate-webengine-youdao';

import ShadowRoot from '../ShadowRoot';
import r from '../../utils/r';

interface InjectTransTooltipIconProps {
  q: string;
  onLoadComplete: any;
}
interface InjectTransTooltipIconState {
  selectionTranslateMode?: string;
  selectionTranslateEngine?: string;
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

    const bingWebEngine = new BingWebEngine();
    const youdaoWebEngine = new YoudaoWebEngine();

    this.translate = new Translate([bingWebEngine, youdaoWebEngine]);

    this.state = {
      selectionTranslateMode: 'enable-translate-tooltip',
      selectionTranslateEngine: 'youdao-web',
      loading: false
    };
  }

  componentDidMount() {
    const keys = ['selectionTranslateMode', 'selectionTranslateEngine'];
    const callback = (result: any) => {
      this.setState({ ...result });
      const { selectionTranslateMode } = result;
      if (selectionTranslateMode === 'enable-translate-tooltip') {
        this.reloadData();
      }
    };
    chrome.storage.sync.get(keys, callback);
  }

  reloadData = async () => {
    const { q, onLoadComplete } = this.props;
    const { selectionTranslateEngine } = this.state;

    let beginTime = new Date().getTime();

    let lookUpResult: LookUpResult;
    let lookUpError: Error;

    try {
      this.setState({ loading: true });
      lookUpResult = await this.translate
        .engine(selectionTranslateEngine)
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
        usedTime > 100 ? 0 : 100 - usedTime
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
