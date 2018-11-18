import * as React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Spin, Layout, Row, Col, Tag, Popover, Switch } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import { ICO_URL, ENEMY_DOT_URL, ENEMY_CHANGE_COND } from '../../../consts';
import _ from 'lodash';
import styles from './index.module.less';

const { Content } = Layout;

interface QuestStates {
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
      <Query
        query={gql`
          query($id: Int!) {
            quest(QuestID: $id) {
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
              {!error && data.quest && (
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
                                      style={{ width: '100%' }}
                                      src={`${ICO_URL}/0/${treasure}.png`}
                                    />
                                    {this.state.treasureDrop[index].length ===
                                      0 && (
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
                  <EnemyTable
                    battleTalks={data.battleTalks}
                    quest={data.quest}
                    onDrop={this.pushDrop}
                    showDuplicated={this.state.showDuplicated}
                  />
                </div>
              )}
            </Spin>
          </Content>
        )}
      </Query>
    );
  }
}

interface EnemyTableProps {
  quest: any;
  battleTalks: Array<{
    Message: string;
    Name: string;
  }>;
  onDrop: Quest['pushDrop'];
  showDuplicated: boolean;
}

class EnemyTable extends React.Component<EnemyTableProps> {
  private trGen = (
    enemy: any,
    index: number,
    drops: string[],
    isChange: boolean = false,
  ) => (
    <tr
      key={`enemy-table-${index}`}
      className={enemy.Param_ChangeParam && 'ant-table-row-selected'}
    >
      <td>
        <img src={`${ENEMY_DOT_URL}/${(enemy.PatternID >> 8) % 4096}.png`} />
      </td>
      {!isChange && <td>{enemy.Loop}</td>}
      <td>{enemy.Types && enemy.Types.join(', ')}</td>
      <td>
        {enemy.TypeAttack === 300
          ? '真伤'
          : enemy.MagicAttack
          ? '魔法'
          : '物理'}
      </td>
      <td>0</td>
      <td>{enemy.ATTACK_RANGE ? enemy.ATTACK_RANGE : '近接'}</td>
      <td>{enemy.HP}</td>
      <td>{enemy.ATTACK_POWER}</td>
      <td>{enemy.ARMOR_DEFENSE}</td>
      <td>{enemy.MAGIC_DEFENSE}</td>
      <td>{enemy.Param_ResistanceAssassin}</td>
      {!isChange && (
        <td>
          {enemy.PrizeCardID ? (
            <img src={drops[enemy.PrizeCardID - 1]} />
          ) : null}
        </td>
      )}
      {isChange && (
        <td>
          {enemy.Param_ChangeParam
            ? ENEMY_CHANGE_COND[enemy.Param_ChangeCondition]
            : '不切换'}
        </td>
      )}
    </tr>
  );
  public componentDidMount() {
    const entries: any = _.find(this.props.quest.Map.Entries, {
      EntryID: this.props.quest.EntryNo,
    });
    const treasureDrop: number[][] = [[], [], [], [], []];
    entries.Entries.forEach((entry: any, index: number) => {
      if (entry.PrizeCardID) {
        treasureDrop[entry.PrizeCardID - 1].push(index);
      }
    });
    this.props.onDrop(treasureDrop);
  }
  public render() {
    const quest = this.props.quest;
    const enemies = quest.Mission.Enemies;
    console.log(quest);
    const entries: any = _.find(quest.Map.Entries, {
      EntryID: quest.EntryNo,
    });
    const mapLevel = quest.Level;
    const drops = [
      quest.Treasure1,
      quest.Treasure2,
      quest.Treasure3,
      quest.Treasure4,
      quest.Treasure5,
    ].map((treasure: number, index: number) => `${ICO_URL}/0/${treasure}.png`);
    const parsedEnemies: any = [];
    const parseEnemy = (entry: any, enemyID: number = entry.EnemyID - 1) => {
      const enemy = { ...enemies[enemyID], ...entry, EnemyID: enemyID };
      if (!enemy.Level) {
        enemy.Level = 100;
      }
      enemy.HP = (enemy.HP * mapLevel * enemy.Level) / 10000;
      if (!enemy.ATTACK_RANGE) {
        enemy.ATTACK_POWER =
          (enemy.ATTACK_POWER * mapLevel * enemy.Level) / 10000;
      }
      return enemy;
    };
    entries.Entries.forEach((entry: any) => {
      // ids between 0 and 1000 are true enemies
      if (entry.EnemyID >= 0 && entry.EnemyID < 1000) {
        const enemy = parseEnemy(entry);
        if (
          !this.props.showDuplicated &&
          parsedEnemies.find((e: any) => e.EnemyID === enemy.EnemyID)
        ) {
          enemy.duplicated = true;
        }
        if (enemy.Param_ChangeParam) {
          const changes = [enemy];
          while (changes[changes.length - 1].Param_ChangeParam) {
            const changeFrom = changes[changes.length - 1];
            const enemyID = changeFrom.Param_ChangeParam - 1;
            if (_.find(changes, ['EnemyID', enemyID])) {
              break;
            }
            const newEnemy = parseEnemy(entry, enemyID);
            changes.push(newEnemy);
          }
          enemy.Changes = changes;
        }
        parsedEnemies.push(enemy);
      } else {
        parsedEnemies.push(entry);
      }
    });
    return (
      <div className="ant-table ant-table-bordered ant-table-middle">
        <div className="ant-table-content">
          <div className="ant-table-body">
            <table style={{ textAlign: 'center' }}>
              <thead className="ant-table-thead">
                <tr>
                  <th>点阵</th>
                  <th>重复</th>
                  <th>属性</th>
                  <th>攻击属性</th>
                  <th>攻速</th>
                  <th>射程</th>
                  <th>HP</th>
                  <th>攻击</th>
                  <th>防御</th>
                  <th>魔抗</th>
                  <th>暗杀补正</th>
                  <th>掉落</th>
                </tr>
              </thead>
              <tbody className="ant-table-tbody">
                {parsedEnemies.map((enemy: any, index: number) => {
                  if (enemy.duplicated) {
                    return null;
                  }
                  if (enemy.EnemyID >= 0 && enemy.EnemyID < 1000) {
                    if (enemy.Param_ChangeParam) {
                      return (
                        <Popover
                          key={`enemy-table-${index}`}
                          content={
                            <div className="ant-table ant-table-bordered ant-table-middle">
                              <div className="ant-table-content">
                                <div className="ant-table-body">
                                  <table>
                                    <thead className="ant-table-thead">
                                      <tr>
                                        <th>点阵</th>
                                        <th>属性</th>
                                        <th>攻击属性</th>
                                        <th>攻速</th>
                                        <th>射程</th>
                                        <th>HP</th>
                                        <th>攻击</th>
                                        <th>防御</th>
                                        <th>魔抗</th>
                                        <th>暗杀补正</th>
                                        <th>变身条件</th>
                                      </tr>
                                    </thead>
                                    <tbody className="ant-table-tbody">
                                      {enemy.Changes.map(
                                        (enemyChange: any, index: number) =>
                                          this.trGen(
                                            enemyChange,
                                            index,
                                            drops,
                                            true,
                                          ),
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          }
                        >
                          {this.trGen(enemy, index, drops)}
                        </Popover>
                      );
                    }
                    return this.trGen(enemy, index, drops);
                  } else if (enemy.EnemyID === -1) {
                    // wait
                    return null;
                  } else if (enemy.EnemyID === 2000) {
                    // exclution mark
                    return null;
                  } else if (enemy.EnemyID >= 1000 && enemy.EnemyID < 2000) {
                    // quest event text
                    return (
                      <tr key={`enemy-table-${index}`}>
                        <td colSpan={12}>
                          <span style={{ fontWeight: 'bold', marginRight: 8 }}>
                            {this.props.battleTalks[enemy.EnemyID - 1000].Name}:
                          </span>
                          {this.props.battleTalks[enemy.EnemyID - 1000].Message}
                        </td>
                      </tr>
                    );
                  } else if (enemy.EnemyID === 4201) {
                    // command, play se or call a event, etc
                    const command = enemy.EntryCommand;
                    const match = /CallEvent\(([\d,]+)\)/.exec(command);
                    if (match) {
                      return match[1].split(',').map(s => {
                        const recordIndex = Number.parseInt(s, 10);
                        const talk: any = _.find(
                          this.props.quest.Mission.BattleTalks,
                          {
                            RecordIndex: recordIndex,
                          },
                        );
                        if (!talk) {
                          return null;
                        }
                        return (
                          <tr key={`enemy-table-${index}-event-${recordIndex}`}>
                            <td colSpan={12}>
                              <span
                                style={{ fontWeight: 'bold', marginRight: 8 }}
                              >
                                {talk.Name}:
                              </span>
                              {talk.Message}
                            </td>
                          </tr>
                        );
                      });
                    }
                    return (
                      <tr
                        style={{ display: 'none' }}
                        key={`enemy-table-${index}`}
                      >
                        <td colSpan={12}>{enemy.EntryCommand}</td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr
                        style={{ display: 'none' }}
                        key={`enemy-table-${index}`}
                      >
                        <td colSpan={12}>{JSON.stringify(enemy)}</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
