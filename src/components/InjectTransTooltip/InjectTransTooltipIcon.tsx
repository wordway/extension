import * as React from 'react';
import { Button } from '@duik/it';
import {
  LookUpResult,
} from '@wordway/translate-api';
import { sharedTranslate } from '../../networking';

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
  constructor(
    props: InjectTransTooltipIconProps,
    state: InjectTransTooltipIconState
  ) {
    super(props, state);

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
      lookUpResult = await sharedTranslate
        .engine(userConfig.translateEngine)
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
