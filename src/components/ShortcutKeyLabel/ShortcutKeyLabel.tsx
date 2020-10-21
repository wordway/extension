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
    const { shortcutKey, active } = this.props;

    const shortcutKeys = shortcutKey?.split('+') || [];

    const wrapper = (children: any) => {
      return <div>{children}</div>;
    };
    return (
      <div className="shortcut-key-label" {...this.props}>
        {wrapper(
          <div className={active ? 'active' : ''} style={{}}>
            {shortcutKeys.map((v, index) => (
              <>
                <kbd>{v}</kbd>
                {index < shortcutKeys.length - 1 && <>&nbsp;+&nbsp;</>}
              </>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default ShortcutKeyLabel;
