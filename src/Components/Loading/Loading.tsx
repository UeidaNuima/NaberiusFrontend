import React from 'react';
import { Spin } from 'antd';
import { choose } from '../../utils';

const fuck = ['氆氇', '脱', '包子头', '毛熊', 'ED'];

const Loading: React.FC = () => (
  <Spin
    tip={`干${choose(fuck)}中...`}
    size="large"
    style={{ marginTop: '20vh', display: 'block' }}
  />
);

export default Loading;
