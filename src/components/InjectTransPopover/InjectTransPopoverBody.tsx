import * as React from 'react';
import { LookUpResult } from '@wordway/translate-api';

import { TranslateResultView } from '../../components';

import './InjectTransPopoverBody.less';

interface InjectTransPopoverBodyProps {
  q: string;
  lookUpResult?: LookUpResult;
  lookUpError?: Error;
}

interface InjectTransPopoverBodyState {}

class InjectTransPopoverBody extends React.Component<
  InjectTransPopoverBodyProps,
  InjectTransPopoverBodyState
> {
  render() {
    const { q, lookUpResult, lookUpError } = this.props;
    return (
      <div className="inject-trans-popover-body">
        <TranslateResultView
          q={q}
          lookUpResult={lookUpResult}
          lookUpError={lookUpError}
        />
      </div>
    );
  }
}

export default InjectTransPopoverBody;
