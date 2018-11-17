import * as React from 'react';
import { Card } from 'antd';
import { CardProps, CardState } from 'antd/lib/card';
import './Card.less';

export default class ShadowedCard extends React.Component<
  CardProps,
  CardState
> {
  public render() {
    return <Card {...this.props} className="card" />;
  }
}
