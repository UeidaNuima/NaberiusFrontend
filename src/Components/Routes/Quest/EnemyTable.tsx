import React from 'react';
import { Affix, Popover, Icon } from 'antd';
import _ from 'lodash';
import { ICO_URL, ENEMY_DOT_URL, ENEMY_CHANGE_COND } from '../../../consts';
import styles from './index.module.less';
import classNames from 'classnames';

interface EnemyTableRowsProps {
  enemy: any;
  drops: string[];
  isChange?: boolean;
}

interface EnemyTableRowsStates {
  showChange: boolean;
}

class EnemyTableRows extends React.Component<
  EnemyTableRowsProps,
  EnemyTableRowsStates
> {
  public readonly state: EnemyTableRowsStates = {
    showChange: false,
  };

  private getAttackSpeed(enemy: any) {
    // don't know why
    if (!enemy.DotLength) {
      return null;
    }
    let attackSpeed = enemy.AttackWait * 2 + enemy.DotLength;
    if (!enemy.ATTACK_RANGE) {
      attackSpeed += enemy.ATTACK_SPEED;
    }
    return attackSpeed;
  }

  private handleRowClick: () => void = () => {
    this.setState(state => ({ showChange: !state.showChange }));
  };

  public render() {
    const { enemy, drops, isChange = false } = this.props;
    const { showChange } = this.state;
    const enemies = (showChange && enemy.Changes) || [enemy];
    return (
      <>
        {enemies.map((e: any, index: number) => (
          <tr
            key={index}
            onClick={enemy.Changes ? this.handleRowClick : undefined}
            className={classNames({
              [styles.enemyRowWithChange]: enemy.Changes,
              [styles.rowShow]: showChange,
            })}
          >
            {index === 0 && (
              <td rowSpan={enemies.length}>
                {enemy.Changes && (
                  <Icon
                    style={{
                      transform: showChange ? 'rotate(-90deg)' : undefined,
                      transition: 'transform 0.3s',
                    }}
                    type="caret-down"
                    theme="filled"
                  />
                )}
              </td>
            )}
            <td>
              <img
                alt={((e.PatternID >> 8) % 4096).toString()}
                src={`${ENEMY_DOT_URL}/${(e.PatternID >> 8) % 4096}.png`}
              />
            </td>
            {!isChange && <td>{e.Loop}</td>}
            <td>{e.Types && e.Types.join(', ')}</td>
            <td>
              {e.TypeAttack === 300 ? '真伤' : e.MagicAttack ? '魔法' : '物理'}
            </td>
            <td>{this.getAttackSpeed(e)}</td>
            <td>{e.ATTACK_RANGE ? e.ATTACK_RANGE : '近接'}</td>
            <td>{e.HP}</td>
            <td>{e.ATTACK_POWER}</td>
            <td>{e.ARMOR_DEFENSE}</td>
            <td>{e.MAGIC_DEFENSE}</td>
            <td>{e.Param_ResistanceAssassin}</td>
            <td>
              {e.PrizeCardID ? (
                <img
                  alt={(e.PrizeCardID - 1).toString()}
                  src={drops[e.PrizeCardID - 1]}
                />
              ) : null}
            </td>
            <Popover
              content={
                <pre>
                  {JSON.stringify({ ...e, Changes: undefined }, null, 2)}
                </pre>
              }
              placement="left"
            >
              <td>
                {e.Param_ChangeParam ? (
                  <p>{ENEMY_CHANGE_COND[e.Param_ChangeCondition]}</p>
                ) : null}
              </td>
            </Popover>
          </tr>
        ))}
      </>
    );
  }
}

interface EnemyTableProps {
  quest: any;
  battleTalks: Array<{
    Message: string;
    Name: string;
  }>;
  onDrop: (treasureDrop: number[][]) => void;
  showDuplicated: boolean;
}

class EnemyTable extends React.Component<EnemyTableProps> {
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
    const enemies = quest.Map.Enemies || quest.Mission.Enemies;
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
      <>
        <Affix>
          <div className="ant-table ant-table-bordered ant-table-middle">
            <div className="ant-table-content">
              <div className="ant-table-body">
                <table style={{ textAlign: 'center' }}>
                  <thead className="ant-table-thead" style={{ width: '100%' }}>
                    <tr>
                      <th style={{ width: '8%' }} />
                      <th style={{ width: '13%' }}>点阵</th>
                      <th style={{ width: '5%' }}>重复</th>
                      <th style={{ width: '13%' }}>属性</th>
                      <th style={{ width: '5%' }}>攻击属性</th>
                      <th style={{ width: '5%' }}>攻速</th>
                      <th style={{ width: '5%' }}>射程</th>
                      <th style={{ width: '5%' }}>HP</th>
                      <th style={{ width: '5%' }}>攻击</th>
                      <th style={{ width: '5%' }}>防御</th>
                      <th style={{ width: '5%' }}>魔抗</th>
                      <th style={{ width: '5%' }}>暗杀补正</th>
                      <th style={{ width: '13%' }}>掉落</th>
                      <th style={{ width: '8%' }}>备注</th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
          </div>
        </Affix>
        <div className="ant-table ant-table-bordered ant-table-middle">
          <div className="ant-table-content">
            <div className="ant-table-body">
              <table style={{ textAlign: 'center' }}>
                <colgroup style={{ width: '8%' }} />
                <colgroup style={{ width: '13%' }} />
                <colgroup style={{ width: '5%' }} />
                <colgroup style={{ width: '13%' }} />
                <colgroup style={{ width: '5%' }} />
                <colgroup style={{ width: '5%' }} />
                <colgroup style={{ width: '5%' }} />
                <colgroup style={{ width: '5%' }} />
                <colgroup style={{ width: '5%' }} />
                <colgroup style={{ width: '5%' }} />
                <colgroup style={{ width: '5%' }} />
                <colgroup style={{ width: '5%' }} />
                <colgroup style={{ width: '13%' }} />
                <colgroup style={{ width: '8%' }} />

                <tbody className="ant-table-tbody">
                  {parsedEnemies.map((enemy: any, index: number) => {
                    if (enemy.duplicated) {
                      return null;
                    }
                    if (enemy.EnemyID >= 0 && enemy.EnemyID < 1000) {
                      return (
                        <EnemyTableRows
                          enemy={enemy}
                          drops={drops}
                          key={index}
                        />
                      );
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
                          <td
                            style={{
                              background: '#f5f6fa',
                              fontWeight: 'bold',
                              textAlign: 'center',
                              color: 'rgba(0, 0, 0, 0.85)',
                            }}
                          >
                            {this.props.battleTalks[enemy.EnemyID - 1000].Name}
                          </td>
                          <td colSpan={13} style={{ textAlign: 'left' }}>
                            {
                              this.props.battleTalks[enemy.EnemyID - 1000]
                                .Message
                            }
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
                            <tr
                              key={`enemy-table-${index}-event-${recordIndex}`}
                            >
                              <td
                                style={{
                                  background: '#f5f6fa',
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                  color: 'rgba(0, 0, 0, 0.85)',
                                }}
                              >
                                {talk.Name}
                              </td>
                              <td colSpan={13} style={{ textAlign: 'left' }}>
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
                          <td colSpan={14}>{enemy.EntryCommand}</td>
                        </tr>
                      );
                    } else {
                      return (
                        <tr
                          style={{ display: 'none' }}
                          key={`enemy-table-${index}`}
                        >
                          <td colSpan={14}>{JSON.stringify(enemy)}</td>
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default EnemyTable;
