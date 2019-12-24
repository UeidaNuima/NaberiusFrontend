import React from 'react';
import { Spin } from 'antd';
import { choose } from '../../utils';
import { SpinProps } from 'antd/lib/spin';

const fuck = ['氆氇', '脱', '包子头', '毛熊', 'ED'];

const Loading: React.FC<SpinProps> = ({ ...props }) => (
  <Spin
    tip={`干${choose(fuck)}中...`}
    size="large"
    style={{ marginTop: '20vh', display: 'block' }}
    {...props}
  />
);

export default Loading;
