import * as React from 'react';
import './Pill.less';

export interface PillProps {
  bordered?: boolean;
  type?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onClick?: () => void;
}

export default class Pill extends React.Component<PillProps> {
  private colorType(type: string | undefined) {
    switch (type) {
      case 'danger':
        return 'pill-color-danger';
      default:
        return 'pill-color-default';
    }
  }
  public render() {
    return (
      <div
        className={`pill ${this.props.bordered &&
          'pill-bordered'} ${this.colorType(this.props.type)}`}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        onFocus={this.props.onFocus}
        onClick={this.props.onClick}
      >
        {this.props.children}
      </div>
    );
  }
}
