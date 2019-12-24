import React, { useState } from 'react';
import { Spin, Layout, Pagination, Input } from 'antd';
import gql from 'graphql-tag';
import { AbilityData } from 'interfaces';
import { useQuery } from '@apollo/react-hooks';
import AbilityTable from 'Components/AbilityTable';

const { Content } = Layout;

const AbilityList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  const handleSetSearch = (search: string) => {
    setSearch(search);
    setCurrentPage(1);
  };

  const abilityFilter = (ability: AbilityData) => {
    return !search || (search && JSON.stringify(ability).includes(search));
  };

  const { data, loading } = useQuery<{ Abilities: AbilityData[] }>(gql`
    query {
      Abilities {
        AbilityID
        Text
        AbilityName
        Configs {
          _InvokeType
          _TargetType
          _InfluenceType
          _Param1
          _Param2
          _Param3
          _Param4
          _Command
          _ActivateCommand
        }
        Cards {
          CardID
          Name
          Rare
        }
      }
    }
  `);

  return (
    <Content className="container">
      <Spin spinning={loading}>
        <Input
          placeholder="搜索被动"
          value={search}
          onChange={event => {
            handleSetSearch(event.target.value);
          }}
        />
        {data &&
          data.Abilities &&
          data.Abilities.filter(abilityFilter)
            .slice(50 * (currentPage - 1), 50 * currentPage)
            .map((ability, index) => {
              return <AbilityTable ability={ability} key={index} />;
            })}
        {data && data.Abilities && (
          <Pagination
            defaultCurrent={1}
            defaultPageSize={50}
            current={currentPage}
            onChange={page => setCurrentPage(page)}
            total={data.Abilities.filter(abilityFilter).length}
          />
        )}
      </Spin>
    </Content>
  );
};

export default AbilityList;
