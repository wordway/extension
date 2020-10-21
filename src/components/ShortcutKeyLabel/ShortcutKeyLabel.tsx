import React, { HTMLAttributes } from 'react';

import './ShortcutKeyLabel.less';

interface ShortcutKeyLabelProps extends HTMLAttributes<HTMLDivElement> {
  active?: boolean | undefined;
  shortcutKey?: string;
}

interface ShortcutKeyLabelState {}

class ShortcutKeyLabel extends React.Component<
  ShortcutKeyLabelProps,
  ShortcutKeyLabelState
> {
  render() {
    const { shortcutKey, active, ...restProps } = this.props;

    const shortcutKeys = shortcutKey?.split('+') || [];

    const wrapper = (children: any) => {
      return <div>{children}</div>;
    };
    return (
      <div className="shortcut-key-label" {...restProps}>
        {wrapper(
          <div className={active ? 'active' : ''} style={{}}>
            {shortcutKeys.map((v, index) => (
              <span key={v}>
                <kbd>{v}</kbd>
                {index < shortcutKeys.length - 1 && <>&nbsp;+&nbsp;</>}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default ShortcutKeyLabel;
