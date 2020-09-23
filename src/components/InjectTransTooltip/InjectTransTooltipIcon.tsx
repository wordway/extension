import * as React from 'react';
import { Button } from 'antd';
import { LookUpResult } from '@wordway/translate-api';
import { sharedTranslateClient } from '../../networking';

import ShadowRoot from '../ShadowRoot';
import r from '../../utils/r';
import { sharedConfigManager } from '../../utils/config';

interface InjectTransTooltipIconProps {
  q: string;
  autoload: boolean;
  onLoadComplete: any;
}
interface InjectTransTooltipIconState {
  loading: boolean;
}

class InjectTransTooltipIcon extends React.Component<
  InjectTransTooltipIconProps,
  InjectTransTooltipIconState
> {
  constructor(
    props: InjectTransTooltipIconProps,
    state: InjectTransTooltipIconState
  ) {
    super(props, state);

    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const { autoload } = this.props;

    sharedConfigManager.getConfig().then((config) => {
      if (autoload) this.loadData(config);
    });
  }

  loadData = async (config: any) => {
    const { q, onLoadComplete } = this.props;

    let beginTime = new Date().getTime();

    let lookUpResult: LookUpResult;
    let lookUpError: Error;

    try {
      this.setState({ loading: true });
      lookUpResult = await sharedTranslateClient
        .engine(config.translateEngine)
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
          type="link"
          loading={this.state.loading}
          icon={
            <img
              src={r('/images/trans_tooltip_icon.png')}
              alt="icon"
              style={{ width: '28px' }}
            />
          }
          onClick={() => {
            sharedConfigManager.getConfig().then((config) => {
              this.loadData(config);
            });
          }}
          {...this.props}
        />
      </ShadowRoot>
    );
  }
}

export default InjectTransTooltipIcon;
