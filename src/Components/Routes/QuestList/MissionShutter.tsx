import React from 'react';
import { Spin, Col, Row } from 'antd';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { QuestData } from './types';
import useRouter from 'use-react-router';

const MissionShutter: React.FC<{ mission: any }> = ({ mission }) => {
  const { history } = useRouter();

  const showQuest = (questID: number) => {
    history.push(`/quest/${questID}`);
  };
  return (
    <Query<{
      mission: {
        Quests: QuestData[];
      };
    }>
      query={gql`
        query($MissionID: Int!) {
          mission(MissionID: $MissionID) {
            Quests {
              Name
              QuestID
              Charisma
              ActionPoint
            }
          }
        }
      `}
      variables={{ MissionID: mission.MissionID }}
    >
      {({ loading, error, data }) => {
        if (loading) {
          return <Spin />;
        }
        if (data && data.mission.Quests.length === 0) {
          return <div>该战役下没有关卡。</div>;
        }
        return (
          data &&
          data.mission.Quests.map((quest: any) => (
            <Row
              key={quest.QuestID}
              className="list-card quest-list"
              onClick={showQuest.bind(null, quest.QuestID)}
            >
              <Col span={2}>{quest.QuestID}</Col>
              <Col span={2} className="charisma">
                {quest.Charisma}
              </Col>
              <Col span={2} className="action-point">
                {quest.ActionPoint}
              </Col>
              <Col className="important" span={18}>
                {quest.Name}
              </Col>
            </Row>
          ))
        );
      }}
    </Query>
  );
};

export default MissionShutter;
