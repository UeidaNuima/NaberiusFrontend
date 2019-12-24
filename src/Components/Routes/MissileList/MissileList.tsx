import React from 'react';
import MissileTable from 'Components/MissileTable';
import { Layout } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { MissileFragment } from 'fragments';
import Loading from 'Components/Loading';
import { Missile } from 'interfaces';

const { Content } = Layout;

const MissileList: React.FC = () => {
  const { data, loading } = useQuery<{ Missiles: Missile[] }>(gql`
    query {
      Missiles {
        ...missile
      }
    }
    ${MissileFragment}
  `);
  return (
    <Content className="container">
      <Loading spinning={loading}>
        {data &&
          data.Missiles.map((missile, index) => (
            <MissileTable missile={missile} key={index} />
          ))}
      </Loading>
    </Content>
  );
};

export default MissileList;
