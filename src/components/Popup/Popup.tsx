import React from 'react';
import { Avatar, List, Switch } from 'antd';
import { LookUpResult } from '@wordway/translate-api';
import { SettingOutlined } from '@ant-design/icons';

interface PopupProps {}

interface PopupState {
  q: string;
  lookUpResult?: LookUpResult;
  lookUpError?: Error;
}

class Popup extends React.Component<PopupProps, PopupState> {
  constructor(props: PopupProps, state: PopupState) {
    super(props, state);

    this.state = {
      q: '',
    };
  }

  handleClickSubmit = (event: any) => {
    event.preventDefault();

    const { q } = this.state;

    this.setState({
      q,
    });
  };

  render() {
    return (
      <div
        style={{
          border: 'none',
          height: '100vh',
          minWidth: '320px',
          minHeight: '200px',
        }}
      >
        <form onSubmit={this.handleClickSubmit}></form>
        <List>
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title="查词引擎"
              description={'item.email'}
            />
            <Switch />
          </List.Item>
          <List.Item>
            <List.Item.Meta
              avatar={<SettingOutlined />}
              title="更多设置"
              description={'点击前往设置页面进行详细设置'}
            />
            <Switch />
          </List.Item>
        </List>
      </div>
    );
  }
}

export default Popup;
