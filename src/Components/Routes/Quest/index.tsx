import * as React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Spin, Layout, Row, Col, Tag, Switch } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { ICO_URL } from '../../../consts';
import { Data } from './Types';
import EnemyTable from './EnemyTable';
import styles from './index.module.less';

const { Content } = Layout;

export interface QuestStates {
  treasureDrop: {
    [key: number]: number[];
  };
  showDuplicated: boolean;
}

export default class Quest extends React.Component<
  RouteComponentProps<{ QuestID: string }>,
  QuestStates
> {
  public state = {
    treasureDrop: { 0: [], 1: [], 2: [], 3: [], 4: [] },
    showDuplicated: false,
  };

  public pushDrop = (treasureDrop: number[][]) => {
    this.setState({
      treasureDrop,
    });
  };

  public handleDuplicatedChange = () => {
    this.setState(state => ({ showDuplicated: !state.showDuplicated }));
  };

  public render() {
    const id = this.props.match.params.QuestID;
    return (
      <Query<Data>
        query={gql`
          query($id: Int!) {
            quest(QuestID: $id) {
              EventArcs {
                _TalkerName
                _TalkText
              }
              Name
              Message
              Charisma
              EntryNo
              Level
              ActionPoint
              Treasure1
              Treasure2
              Treasure3
              Treasure4
              Treasure5
              RankExp
              Gold
              Mission {
                Enemies {
                  SpecialEffect
                  PatternID
                  Types
                  HP
                  HP_MAX
                  ATTACK_POWER
                  ATTACK_TYPE
                  ATTACK_RANGE
                  ATTACK_SPEED
                  ARMOR_DEFENSE
                  MAGIC_DEFENSE
                  SkyFlag
                  GainCost
                  EffectHeight
                  MagicAttack
                  AttackWait
                  Param_ResistanceAssassin
                  Param_ChangeParam
                  Param_ChangeCondition
                  TypeAttack
                  DotLength
                }
                BattleTalks {
                  Message
                  Name
                  FaceID
                  RecordIndex
                }
              }
              Map {
                Image
                Entries {
                  EntryID
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
                }
                Enemies {
                  SpecialEffect
                  PatternID
                  Types
                  Weather
                  HP
                  HP_MAX
                  ATTACK_POWER
                  ATTACK_TYPE
                  ATTACK_RANGE
                  ATTACK_SPEED
                  ARMOR_DEFENSE
                  MAGIC_DEFENSE
                  MOVE_SPEED
                  SKILL
                  SkyFlag
                  GainCost
                  EffectHeight
                  MagicAttack
                  AttackWait
                  MissileID
                  DeadEffect
                  Param_ResistanceAssassin
                  Param_ChangeParam
                  Param_ChangeCondition
                  TypeAttack
                  HeightOfs_Paralisys
                  DotLength
                }
              }
            }
            battleTalks {
              Message
              Name
            }
          }
        `}
        variables={{ id }}
      >
        {({ loading, error, data }) => (
          <Content className={styles.questContainer + ' container'}>
            <Spin spinning={loading}>
              {data && data.quest && (
                <div>
                  <h1 className={styles.questTitle}>{data.quest.Name}</h1>
                  <div>
                    {data.quest.Charisma ? (
                      <Tag color="green">
                        魅力：
                        {data.quest.Charisma}
                      </Tag>
                    ) : null}
                    {data.quest.ActionPoint ? (
                      <Tag color="red">
                        体力：
                        {data.quest.ActionPoint}
                      </Tag>
                    ) : null}
                  </div>
                  <Row gutter={8} className={styles.questInfo}>
                    <Col md={12} sm={24}>
                      <img
                        alt="map"
                        style={{ width: '100%' }}
                        src={data.quest.Map.Image}
                      />
                    </Col>
                    <Col md={12} sm={24}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: data.quest.Message.replace(/\n/g, '<br />'),
                        }}
                      />
                      <Row className={styles.questInfoList}>
                        <Col span={12}>
                          <span className={styles.questInfoListName}>
                            经验:
                          </span>
                          {data.quest.RankExp}
                        </Col>
                        <Col span={12}>
                          <span className={styles.questInfoListName}>钱:</span>
                          {data.quest.Gold}
                        </Col>
                      </Row>
                      <table>
                        <tbody>
                          <tr>
                            {[
                              data.quest.Treasure1,
                              data.quest.Treasure2,
                              data.quest.Treasure3,
                              data.quest.Treasure4,
                              data.quest.Treasure5,
                            ].map((treasure: number, index: number) => (
                              <td
                                style={{ width: '20%' }}
                                key={`treasure-${index}`}
                              >
                                {treasure ? (
                                  <div>
                                    <img
                                      alt={treasure.toString()}
                                      style={{ width: '100%' }}
                                      src={`${ICO_URL}/0/${treasure}.png`}
                                    />
                                    {(this.state.treasureDrop as any)[index]
                                      .length === 0 && (
                                      <Tag color="red" style={{ margin: 0 }}>
                                        COM
                                      </Tag>
                                    )}
                                  </div>
                                ) : null}
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                  <div className={styles.tableActions}>
                    重复行
                    <Switch
                      checked={this.state.showDuplicated}
                      onChange={this.handleDuplicatedChange}
                      checkedChildren="显示"
                      unCheckedChildren="隐藏"
                    />
                  </div>
                  {data && (
                    <EnemyTable
                      battleTalks={data.battleTalks}
                      quest={data.quest}
                      onDrop={this.pushDrop}
                      showDuplicated={this.state.showDuplicated}
                    />
                  )}
                  {data && data.quest.EventArcs.length !== 0 && (
                    <div>
                      <h2>过场对话</h2>
                      <div className="ant-table ant-table-bordered ant-table-middle">
                        <div className="ant-table-content">
                          <div className="ant-table-body">
                            <table>
                              <tbody className="ant-table-tbody">
                                {data.quest.EventArcs.map((arc, index) => (
                                  <tr key={index}>
                                    <td
                                      style={{
                                        background: '#f5f6fa',
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                        color: 'rgba(0, 0, 0, 0.85)',
                                      }}
                                    >
                                      {arc._TalkerName}
                                    </td>
                                    <td>{arc._TalkText}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Spin>
          </Content>
        )}
      </Query>
    );
  }
}
