import React from 'react';
import { Alert, Modal, Typography } from 'antd';
import { HotkeysEvent } from 'hotkeys-js';
import ReactHotkeys from 'react-hot-keys';

import './SetShortcutKeyModal.less';
import ShortcutKeyLabel from '../ShortcutKeyLabel';

const { Text } = Typography;

interface SetShortcutKeyModalProps {
  visible: boolean;
  onChange: (shortcutKey: string) => void;
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
}

interface SetShortcutKeyModalState {
  shortcutKey: string;
  shortcutKeyPressed: boolean;
}

class SetShortcutKeyModal extends React.Component<
  SetShortcutKeyModalProps,
  SetShortcutKeyModalState
> {
  _changeTimer: NodeJS.Timeout = setTimeout(() => {}, 0);
  static getDerivedStateFromProps(
    nextProps: SetShortcutKeyModalProps,
    prevState: SetShortcutKeyModalState
  ) {
    const { visible } = nextProps;
    if (!visible) {
      return {
        shortcutKey: '',
        shortcutKeyPressed: false,
      };
    }
    return null;
  }

  constructor(
    props: SetShortcutKeyModalProps,
    state: SetShortcutKeyModalState
  ) {
    super(props, state);

    this.state = {
      shortcutKey: '',
      shortcutKeyPressed: false,
    };
  }

  onKeyUp(keyName: string, e: KeyboardEvent, handle: HotkeysEvent) {
    this.setState({
      shortcutKeyPressed: false,
    });

    clearTimeout(this._changeTimer);
    this._changeTimer = setTimeout(() => {
      this.props.onChange(this.state.shortcutKey);
    }, 1000);
  }

  onKeyDown(keyName: string, e: KeyboardEvent, handle: HotkeysEvent) {
    this.setState({
      shortcutKey: handle.shortcut,
      shortcutKeyPressed: true,
    });

    clearTimeout(this._changeTimer);
  }

  render() {
    const { shortcutKey, shortcutKeyPressed } = this.state;

    return (
      <Modal
        centered
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        width={320}
        footer={null}
      >
        <div className="set-shortcut-key-modal">
          <ReactHotkeys
            keyName="shift+q,shift+w,shift+a,shift+s"
            onKeyDown={this.onKeyDown.bind(this)}
            onKeyUp={this.onKeyUp.bind(this)}
          >
            <Text style={{ fontSize: '20px' }}>请按下键盘上的按键</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              支持组合键
            </Text>
            <div style={{ marginTop: '16px', marginBottom: '16px' }}>
              {shortcutKey && (
                <ShortcutKeyLabel
                  shortcutKey={shortcutKey}
                  active={shortcutKeyPressed}
                />
              )}
            </div>
            {shortcutKey && !shortcutKeyPressed && (
              <div>
                <Alert message="将在 1 秒后保存" type="warning" />
              </div>
            )}
          </ReactHotkeys>
        </div>
      </Modal>
    );
  }
}

export default SetShortcutKeyModal;
