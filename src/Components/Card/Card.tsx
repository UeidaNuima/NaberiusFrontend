import React from 'react';
import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';
import './Card.less';

export default class ShadowedCard extends React.Component<
  CardProps
> {
  public render() {
    return <Card {...this.props} className="card" />;
  }
}
