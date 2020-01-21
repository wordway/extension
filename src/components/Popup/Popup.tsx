import '../../utils/isomorphic-translate-api';

import * as React from 'react';
import {
  Button,
  FormGroupContainer,
  TextField,
  Widget,
  WidgetContent
} from '@duik/it';
import { LookUpResult } from '@wordway/translate-api';

// import cls from "./Popup.module.scss";

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
      q: ''
    };
  }

  handleClickSubmit = (event: any) => {
    event.preventDefault();

    const {
      q,
    } = this.state;

    this.setState({
      q,
    });
  };

  render() {
    return (
      <Widget
        style={{
          border: 'none',
          height: '100vh',
          minWidth: '420px',
          minHeight: '200px'
        }}
      >
        <form
          onSubmit={this.handleClickSubmit}
        >
          <WidgetContent>
            <FormGroupContainer
              style={{ display: "flex" }}
              horizontal
            >
              <div
                style={{ flex: 1 }}
              >
                <TextField/>
              </div>
              <Button
                style={{ flex: 'none', minWidth: 0 }}
                type="submit"
                primary
              >
                翻译
              </Button>
            </FormGroupContainer>
          </WidgetContent>
        </form>
      </Widget>
    );
  }
}

export default Popup;
