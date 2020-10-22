import React, { HTMLAttributes } from 'react';

import './ShortcutLabel.less';

interface ShortcutLabelProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean | undefined;
  shortcut?: string;
}

interface ShortcutLabelState {}

class ShortcutLabel extends React.Component<
  ShortcutLabelProps,
  ShortcutLabelState
> {
  render() {
    const { shortcut, active, ...restProps } = this.props;

    const keys = shortcut?.split('+') || [];

    return (
      <div className="shortcut-label" {...restProps}>
        <div className={active ? 'active' : ''} style={{}}>
          {keys.map((v, index) => (
            <span key={v}>
              <kbd>{v}</kbd>
              {index < keys.length - 1 && <>&nbsp;+&nbsp;</>}
            </span>
          ))}
        </div>
      </div>
    );
  }
}

export default ShortcutLabel;
