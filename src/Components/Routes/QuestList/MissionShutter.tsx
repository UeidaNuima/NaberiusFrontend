import React from 'react';
import { Spin, Tag } from 'antd';
import gql from 'graphql-tag';
import { QuestData } from './types';
import useRouter from 'use-react-router';
import { useQuery } from '@apollo/react-hooks';
import styles from './QuestList.module.less';

const MissionShutter: React.FC<{ mission: any; isTabletOrMobile: boolean }> = ({
  mission,
  isTabletOrMobile,
}) => {
  const { history } = useRouter();

  const showQuest = (questID: number) => {
    history.push(`/quest/${questID}`);
  };

  const { loading, data } = useQuery<{ mission: { Quests: QuestData[] } }>(
    gql`
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
    `,
    { variables: { MissionID: mission.MissionID } },
  );
  return loading ? (
    <Spin />
  ) : data!.mission.Quests.length === 0 ? (
    <div>该战役下没有关卡。</div>
  ) : (
    <div>
      {data!.mission.Quests.map(quest => (
        <div
          key={quest.QuestID}
          className={styles.listCard}
          onClick={showQuest.bind(null, quest.QuestID)}
        >
          <span>{quest.QuestID}</span>
          &nbsp;
          <strong>{quest.Name}</strong>
          <div
            style={{
              display: isTabletOrMobile ? 'block' : 'inline-block',
              float: isTabletOrMobile ? 'none' : 'right',
            }}
          >
            {quest.Charisma !== 0 && <Tag color="green">{quest.Charisma}</Tag>}
            {quest.ActionPoint !== 0 && (
              <Tag color="red">{quest.ActionPoint}</Tag>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MissionShutter;
