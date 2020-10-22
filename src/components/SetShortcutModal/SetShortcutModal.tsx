import React from 'react';
import { Alert, Modal, Typography } from 'antd';
import { HotkeysEvent } from 'hotkeys-js';
import ReactHotkeys from 'react-hot-keys';

import ShortcutLabel from '../ShortcutLabel';
import supportedKeys from './supportedKeys';

import './SetShortcutModal.less';
const { Text } = Typography;

interface SetShortcutModalProps {
  visible: boolean;
  onChange: (shortcut: string) => void;
  onCancel?: (e: React.MouseEvent<HTMLElement>) => void;
}

interface SetShortcutModalState {
  shortcut: string;
  shortcutPressed: boolean;
}

class SetShortcutModal extends React.Component<
  SetShortcutModalProps,
  SetShortcutModalState
> {
  _changeTimer: NodeJS.Timeout = setTimeout(() => {}, 0);
  static getDerivedStateFromProps(
    nextProps: SetShortcutModalProps,
    prevState: SetShortcutModalState
  ) {
    const { visible } = nextProps;
    if (!visible) {
      return {
        shortcut: '',
        shortcutPressed: false,
      };
    }
    return null;
  }

  constructor(props: SetShortcutModalProps, state: SetShortcutModalState) {
    super(props, state);

    this.state = {
      shortcut: '',
      shortcutPressed: false,
    };
  }

  onKeyUp(keyName: string, e: KeyboardEvent, handle: HotkeysEvent) {
    this.setState({
      shortcutPressed: false,
    });

    clearTimeout(this._changeTimer);
    this._changeTimer = setTimeout(() => {
      this.props.onChange(this.state.shortcut);
    }, 1000);
  }

  onKeyDown(keyName: string, e: KeyboardEvent, handle: HotkeysEvent) {
    this.setState({
      shortcut: handle.shortcut,
      shortcutPressed: true,
    });

    clearTimeout(this._changeTimer);
  }

  render() {
    const { shortcut, shortcutPressed } = this.state;

    return (
      <Modal
        centered
        visible={this.props.visible}
        onCancel={this.props.onCancel}
        width={320}
        footer={null}
      >
        <div className="set-shortcut-modal">
          <ReactHotkeys
            keyName={supportedKeys.join(',')}
            onKeyDown={this.onKeyDown.bind(this)}
            onKeyUp={this.onKeyUp.bind(this)}
          >
            <Text style={{ fontSize: '20px' }}>请按下键盘上的按键</Text>
            <Text type="secondary">
              查看被允许使用的
              <a
                href="https://github.com/wordway/wordway-extension/tree/master/src/components/SetShortcutModal/supportedKeys.ts"
                target="_blank"
                rel="noopener noreferrer"
              >
                快捷键列表
              </a>
            </Text>
            <div style={{ marginTop: '16px', marginBottom: '16px' }}>
              {shortcut && (
                <ShortcutLabel shortcut={shortcut} active={shortcutPressed} />
              )}
            </div>
            {shortcut && !shortcutPressed && (
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

export default SetShortcutModal;
