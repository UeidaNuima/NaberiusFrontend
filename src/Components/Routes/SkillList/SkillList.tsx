import React, { useState } from 'react';
import { Layout, Pagination, Input } from 'antd';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { SkillData } from 'interfaces';
import SkillTable from 'Components/SkillTable';
import Loading from 'Components/Loading';

const { Content } = Layout;

interface Data {
  Skills: SkillData[];
}

const SkillList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSetSearch = (search: string) => {
    setSearch(search);
    setCurrentPage(1);
  };

  const skillFilter = (skill: any) => {
    return !search || JSON.stringify(skill).includes(search);
  };

  const { data, loading } = useQuery<Data>(gql`
    query {
      Skills {
        SkillID
        SkillName
        WaitTime
        ContTimeMax
        PowerMax
        LevelMax
        Text
        Configs {
          Type_Collision
          Type_CollisionState
          Type_ChangeFunction
          Data_Target
          Data_InfluenceType
          Data_MulValue
          Data_MulValue2
          Data_MulValue3
          Data_AddValue
          _HoldRatioUpperLimit
          _Expression
          _ExpressionActivate
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
      <Loading spinning={loading}>
        <Input
          placeholder="搜索技能"
          value={search}
          onChange={event => {
            handleSetSearch(event.target.value);
          }}
        />
        {data &&
          data.Skills &&
          data.Skills.filter(skillFilter)
            .slice(50 * (currentPage - 1), 50 * currentPage)
            .map((skill, index) => <SkillTable skills={[skill]} key={index} />)}
        {data && data.Skills && (
          <Pagination
            defaultCurrent={1}
            defaultPageSize={50}
            current={currentPage}
            onChange={page => setCurrentPage(page)}
            total={data.Skills.filter(skillFilter).length}
          />
        )}
      </Loading>
    </Content>
  );
};

export default SkillList;
