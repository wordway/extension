import * as React from 'react';
import { Button } from 'antd';
import { LookUpResult } from '@wordway/translate-api';
import { sharedDb, sharedTranslateClient } from '../../networking';

import r from '../../utils/r';
import { sharedConfigManager } from '../../utils/config';

interface InjectTransPopoverIconProps {
  q: string;
  autoload: boolean;
  onLoadComplete: any;
}
interface InjectTransPopoverIconState {
  loading: boolean;
}

class InjectTransPopoverIcon extends React.Component<
  InjectTransPopoverIconProps,
  InjectTransPopoverIconState
> {
  constructor(
    props: InjectTransPopoverIconProps,
    state: InjectTransPopoverIconState
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

      sharedDb.data?.translationRecords.splice(0, 0, lookUpResult);
      sharedDb.write();
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
      <Button
        type="link"
        loading={this.state.loading}
        icon={
          <img
            src={r('/images/trans_tooltip_icon.png')}
            alt="icon"
            style={{ width: '26px' }}
          />
        }
        onClick={() => {
          sharedConfigManager.getConfig().then((config) => {
            this.loadData(config);
          });
        }}
      />
    );
  }
}

export default InjectTransPopoverIcon;
