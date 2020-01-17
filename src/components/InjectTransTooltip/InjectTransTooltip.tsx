import * as React from 'react';
import { Popper } from 'react-popper';
import classNames from 'classnames';
import { LookUpResult } from '@wordway/translate-api';

import InjectTransTooltipContent from './InjectTransTooltipContent';
import InjectTransTooltipIcon from './InjectTransTooltipIcon';

import cls from './InjectTransTooltip.module.scss';

class VirtualReferenceElement {
  boundingClientRect: DOMRect;

  constructor(boundingClientRect: DOMRect) {
    this.boundingClientRect = boundingClientRect;
  }

  getBoundingClientRect() {
    return this.boundingClientRect;
  }

  get clientWidth() {
    return this.getBoundingClientRect().width;
  }

  get clientHeight() {
    return this.getBoundingClientRect().height;
  }
}

interface InjectTransTooltipProps {
  q: string;
  boundingClientRect: DOMRect;
  onShow: any;
  onHide: any;
}

interface InjectTransTooltipState {
  visible: boolean;
  switching: boolean;
  lookUpResult?: LookUpResult;
  lookUpError?: Error;
}

class InjectTransTooltip extends React.Component<
  InjectTransTooltipProps,
  InjectTransTooltipState
> {
  virtualReferenceElement: VirtualReferenceElement;

  constructor(props: InjectTransTooltipProps, state: InjectTransTooltipState) {
    super(props, state);

    this.virtualReferenceElement = new VirtualReferenceElement(
      props.boundingClientRect
    );

    this.state = { visible: true, switching: false };
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousedown', this.onMouseDown);
  }

  onMouseUp = () => {};

  onMouseDown = (e: any) => {
    const path = e.path || (e.composedPath && e.composedPath());
    if (path.findIndex(({ id }: any) => id === '___wordway') >= 0) return;

    this.handleClose();
  };

  handleClose = () => {
    const { onHide } = this.props;

    this.setState({
      visible: false
    });

    setTimeout(() => onHide(), 200);
  };

  renderTransTooltipIcon = () => {
    const { q } = this.props;
    const handleLoadComplete = (lookUpResult: any, lookUpError: any) => {
      this.setState({ switching: true });
      setTimeout(() => {
        this.setState({
          switching: false,
          lookUpResult,
          lookUpError
        });
      }, 1);
    };

    return <InjectTransTooltipIcon q={q} onLoadComplete={handleLoadComplete} />;
  };

  renderTransTooltipContent = () => {
    return (
      <>
        <InjectTransTooltipContent
          q={this.props.q}
          lookUpResult={this.state.lookUpResult}
          lookUpError={this.state.lookUpError}
        />
        <button onClick={this.handleClose} className={cls['btn-close']}>
          <span />
        </button>
      </>
    );
  };

  render() {
    const { switching, lookUpResult, lookUpError } = this.state;
    if (switching) return <div />;

    let popperBody = this.renderTransTooltipIcon();
    let popperClassNames = (_: any): any => {};

    if (lookUpResult || lookUpError) {
      popperBody = this.renderTransTooltipContent();
      popperClassNames = (placement: any): any => {
        return {
          [cls['popper-fade-in-up']]:
            (placement || 'bottom').startsWith('top') &&
            this.state.visible,
          [cls['popper-fade-in-down']]:
            (placement || 'bottom').startsWith('bottom') &&
            this.state.visible,
          [cls['popper-fade-out-up']]:
            (placement || 'bottom').startsWith('top') &&
            !this.state.visible,
          [cls['popper-fade-out-down']]:
            (placement || 'bottom').startsWith('bottom') &&
            !this.state.visible
        }
      }
    }

    return (
      <Popper
        referenceElement={this.virtualReferenceElement}
      >
        {({ ref, style, placement, arrowProps }) => (
          <div ref={ref} className={cls['trans-tooltip']} style={style}>
            <div
              className={classNames(cls['popper'], {
                ...popperClassNames(placement),
              })}
            >
              <div className={cls['popper-body']}>{popperBody}</div>
              {!(lookUpResult || lookUpError) ? null : (
                <div
                  ref={arrowProps.ref}
                  data-placement={placement}
                  className={cls['popper-arrow']}
                  style={arrowProps.style}
                />
              )}
            </div>
          </div>
        )}
      </Popper>
    );
  }
}

export default InjectTransTooltip;
