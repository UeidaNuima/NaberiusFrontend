import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Layout, Row, Col, Tag, Icon, Button } from 'antd';
import { Link } from 'react-router-dom';
import useRouter from 'use-react-router';
import { ICO_URL } from 'consts';
import EnemyTable from './EnemyTable';
import styles from './Quest.module.less';
import Loading from 'Components/Loading';
import { useQuery } from '@apollo/react-hooks';
import { renderDescription } from 'utils';
import { MapEntry, Enemy } from 'interfaces';
import { DotFragment, EnemyFragment } from 'fragments';
import PreviewDot from './PreviewDot';
import MapTable from './MapTable';
import QuestTermTable from './QuestTermTable';
import { Quest as QuestType } from 'interfaces';

const { Content } = Layout;

const Quest: React.FC = () => {
  const { match } = useRouter<{ QuestID: string }>();
  const QuestID = Number.parseInt(match.params.QuestID, 10);
  const [showTerms, setShowTerms] = useState(false);
  const [showHardTerms, setShowHardTerms] = useState(false);

  const { data, loading } = useQuery<{
    Quest: QuestType;
    QuestEventTexts: Array<{
      Message: string;
      Name: string;
      FaceID: number;
    }>;
  }>(
    gql`
      fragment termConfig on QuestTermConfig {
        Type_Influence
        Data_Param1
        Data_Param2
        Data_Param3
        Data_Param4
        Data_Expression
      }
      query($id: Int!) {
        Quest(QuestID: $id) {
          EventArcs {
            _TalkerName
            _TalkText
          }
          Name
          Message
          Charisma
          EntryNo
          LocationNo
          Level
          ActionPoint
          Treasure1
          Treasure2
          Treasure3
          Treasure4
          Treasure5
          RankExp
          Gold
          Capacity
          QuestTerms
          _HardCondition
          QuestTermConfigs {
            ...termConfig
          }
          QuestHardTermConfigs {
            ...termConfig
          }
          Mission {
            MissionID
            Enemies {
              ...enemy
            }
            BattleTalkEvents {
              Message
              Name
              FaceID
              RecordIndex
            }
          }
          MapNo
          Map {
            Image
            Entries {
              EnemyID
              Wait
              RouteNo
              Loop
              Level
              PrizeEnemySpawnPercent
              PrizeCardID
              PrizeEnemyDropPercent
              RouteOffset
              IsAppear
              FreeCommand
              EntryCommand
              DeadCommand
            }
            Routes {
              X
              Y
              JumpPoint
              WarpDelay
              WaitTime
              OnEvent
            }
            Locations {
              ObjectID
              X
              Y
              _Command
            }
            Enemies {
              ...enemy
            }
          }
        }
        QuestEventTexts {
          Message
          Name
          FaceID
        }
      }
      ${DotFragment}
      ${EnemyFragment}
    `,
    { variables: { id: QuestID } },
  );

  const dropper: Array<Array<Enemy & MapEntry>> = [[], [], [], [], []];
  let enemiesCount = 0;
  if (data) {
    const enemies = data.Quest.Map.Enemies || data.Quest.Mission.Enemies;
    const entries = data.Quest.Map.Entries[data.Quest.EntryNo];
    for (const entry of entries) {
      if (entry.EnemyID >= 0 && entry.EnemyID < 1000) {
        enemiesCount += entry.Loop;
        if (entry.PrizeCardID !== 0) {
          dropper[entry.PrizeCardID - 1].push({
            ...enemies[entry.EnemyID - 1],
            ...entry,
            Loop: enemiesCount,
          });
        }
      }
    }
  }

  const haveDrop = dropper
    .map(drop => drop.length !== 0)
    .reduce((prev, curr) => prev || curr);

  return (
    <Content className={styles.questContainer}>
      {loading && <Loading />}
      {data && data.Quest && (
        <div>
          <h1 className={styles.questTitle}>
            <Link to={`/quest/${QuestID - 1}`}>
              <Icon type="left" />
            </Link>
            {data.Quest.Name}
            <Link to={`/quest/${QuestID + 1}`}>
              <Icon type="right" />
            </Link>
          </h1>
          <div>
            {data.Quest.Charisma ? (
              <Tag color="green">
                魅力：
                {data.Quest.Charisma}
              </Tag>
            ) : null}
            {data.Quest.ActionPoint ? (
              <Tag color="red">
                体力：
                {data.Quest.ActionPoint}
              </Tag>
            ) : null}
          </div>
          <Row gutter={8} className={styles.questInfo}>
            <Col md={12} sm={24}>
              <MapTable quest={data.Quest} />
            </Col>
            <Col md={12} sm={24}>
              <table className={styles.table} style={{ margin: 0 }}>
                <tbody>
                  <tr>
                    <td colSpan={4}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: renderDescription(data.Quest.Message),
                        }}
                        style={{
                          textAlign: 'left',
                          maxWidth: '20em',
                          margin: 'auto',
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>经验</th>
                    <td>{data.Quest.RankExp}</td>
                    <th>钱</th>
                    <td>{data.Quest.Gold}</td>
                  </tr>
                  <tr>
                    <th>心数</th>
                    <td>{data.Quest.Capacity}</td>
                    <th>怪数</th>
                    <td>{enemiesCount}</td>
                  </tr>
                  <tr>
                    <th>补正</th>
                    <td>{data.Quest.Level}</td>
                    <th>设置</th>
                    <td>
                      {data.Quest.QuestTerms !== 0 && (
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => setShowTerms(!showTerms)}
                          icon={showTerms ? 'up' : 'down'}
                        />
                      )}
                    </td>
                  </tr>
                  {showTerms && (
                    <tr>
                      <td colSpan={4} style={{ padding: 0 }}>
                        <QuestTermTable terms={data.Quest.QuestTermConfigs} />
                      </td>
                    </tr>
                  )}
                  {data.Quest._HardCondition !== 0 && (
                    <tr>
                      <th>4☆补正</th>
                      <td>{data.Quest.Level}</td>
                      <th>设置</th>
                      <td>
                        <Button
                          type="primary"
                          size="small"
                          onClick={() => setShowHardTerms(!showHardTerms)}
                          icon={showHardTerms ? 'up' : 'down'}
                        />
                      </td>
                    </tr>
                  )}
                  {showHardTerms && (
                    <tr>
                      <td colSpan={4} style={{ padding: 0 }}>
                        <QuestTermTable
                          terms={data.Quest.QuestHardTermConfigs}
                        />
                      </td>
                    </tr>
                  )}
                  {haveDrop && (
                    <tr>
                      <td colSpan={4}>
                        <table>
                          <tbody>
                            <tr>
                              {dropper.map((_, index) => {
                                const treasure: number = (data.Quest as any)[
                                  `Treasure${index + 1}`
                                ];
                                return (
                                  <td style={{ width: '20%' }} key={index}>
                                    {treasure ? (
                                      <div>
                                        <img
                                          alt={treasure.toString()}
                                          style={{ width: '100%' }}
                                          src={`${ICO_URL}/0/${treasure}.png`}
                                        />
                                        {dropper[4].length === 0 &&
                                          index === 4 && (
                                            <Tag
                                              color="red"
                                              style={{ margin: 0 }}
                                            >
                                              COM
                                            </Tag>
                                          )}
                                      </div>
                                    ) : null}
                                  </td>
                                );
                              })}
                            </tr>
                            <tr>
                              {dropper.map((drops, index) => (
                                <td key={index}>
                                  {drops.map((drop, i) => {
                                    return (
                                      <div key={i}>
                                        <PreviewDot enemy={drop} />#{drop.Loop}
                                      </div>
                                    );
                                  })}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Col>
          </Row>
          {data && <EnemyTable data={data} />}
          {data && data.Quest.EventArcs && data.Quest.EventArcs.length !== 0 && (
            <div>
              <h2>过场对话</h2>
              <table className={styles.table}>
                <tbody>
                  {data.Quest.EventArcs.map((arc, index) => (
                    <tr key={index}>
                      <th>{arc._TalkerName}</th>
                      <td>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: renderDescription(arc._TalkText),
                          }}
                          style={{
                            margin: 'auto',
                            maxWidth: '30em',
                            textAlign: 'left',
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Content>
  );
};

export default Quest;
