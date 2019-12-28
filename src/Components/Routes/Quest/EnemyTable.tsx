import React, { useState, useRef, useEffect } from 'react';
import { Button, Divider, Row, Col, Switch, Input, message, Spin } from 'antd';
import { ICO_URL, ENEMY_DOT_URL, ENEMY_CHANGE_COND } from 'consts';
import styles from './Quest.module.less';
import { Dot, Enemy, MapEntry, SpecialtyConfig } from 'interfaces';
import { useMediaQuery } from 'react-responsive';
import DotTable from 'Components/DotTable';
import TalkRow from 'Components/DotAnimation/TalkRow';
import { Quest as QuestType } from 'interfaces';
import MissileTable from 'Components/MissileTable';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import classNames from 'classnames';

const getAttackSpeed = (enemy: Enemy & MapEntry, dots: Dot[]) => {
  let length = 0;
  for (const dot of dots) {
    if (dot.Name === 'Attack') {
      length = dot.Length;
    }
  }
  // don't know why
  if (!length) {
    return null;
  }
  let attackSpeed = enemy.AttackWait * 2 + length;
  if (!enemy.ATTACK_RANGE) {
    attackSpeed += enemy.ATTACK_SPEED;
  }
  return attackSpeed;
};

const EnemyConfigTableRows: React.FC<{ config: SpecialtyConfig }> = ({
  config,
}) => {
  const [value, setValue] = useState(config.Comment || '');

  const [setEnemyConfigMeta, { loading, data }] = useMutation<{
    EnemyConfigMeta?: { TypeID: number; Comment: string };
  }>(
    gql`
      mutation($TypeID: Int!, $Comment: String) {
        EnemyConfigMeta(TypeID: $TypeID, Comment: $Comment) {
          TypeID
          Comment
        }
      }
    `,
    {
      onCompleted: d => {
        setValue(d?.EnemyConfigMeta?.Comment || '');
      },
    },
  );

  const [editing, setEditing] = useState(false);
  const ref = useRef<Input>(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
    }
  }, [editing]);

  const handleSave = async () => {
    await setEnemyConfigMeta({
      variables: { TypeID: config.Type_Influence, Comment: value },
    });
    message.success('修改成功');
    setEditing(false);
  };

  return (
    <tbody className={styles.configRowGroup}>
      <tr className={styles.cover}>
        <td
          colSpan={8}
          className={classNames({
            [styles.blank]: !(data
              ? data.EnemyConfigMeta?.Comment
              : config.Comment),
          })}
        >
          {editing ? (
            <Spin spinning={loading}>
              <Input
                size="small"
                ref={ref}
                value={value}
                onChange={e => setValue(e.target.value)}
                onBlur={handleSave}
                onPressEnter={handleSave}
              />
            </Spin>
          ) : (
            <div
              className={classNames(styles.fakeInput, styles.small)}
              onClick={() => setEditing(true)}
            >
              {data ? data.EnemyConfigMeta?.Comment : config.Comment}
            </div>
          )}
        </td>
      </tr>

      <tr>
        <td>{config.Type_Influence}</td>
        <td>{config.Param_1}</td>
        <td>{config.Param_2}</td>
        <td>{config.Param_3}</td>
        <td>{config.Param_4}</td>
      </tr>

      {!!(config._Expression || config._ExtParam) && (
        <tr
          style={{
            borderBottom: '2px solid #e8e8e8',
          }}
        >
          <td colSpan={3}>{config._Expression}</td>
          <td colSpan={2}>{config._ExtParam}</td>
        </tr>
      )}
    </tbody>
  );
};

interface EnemyTableRowsProps {
  enemies: Array<Enemy & MapEntry>;
  drops: string[];
  isTabletOrMobile: boolean;
}

const EnemyTableRows: React.FC<EnemyTableRowsProps> = ({
  enemies,
  drops,
  isTabletOrMobile,
}) => {
  const [expand, setExpand] = useState(false);
  const [showTable, setShowTable] = useState<boolean[]>(
    Array(enemies.length).fill(false),
  );

  return (
    <>
      {enemies.slice(0, expand ? enemies.length : 1).map((e, index) => {
        const dots = e.Dots;
        const previewSprite = dots[0].Entries[0].Sprites[0];
        const types = [
          e.SkyFlag && '飛行',
          e.EnemyElem._EnemyElementName,
          e.EnemyType._EnemyTypeName,
          e._Attribute,
        ]
          .filter(st => st && st !== 'なし')
          .join(' ');
        const changeCondition = e.Param_ChangeParam
          ? ENEMY_CHANGE_COND[e.Param_ChangeCondition]
          : null;
        const imgID = (e.PatternID >> 8) % 4096;
        const dropImg =
          e.PrizeCardID !== 0 ? (
            <img
              src={drops[e.PrizeCardID - 1]}
              alt={e.PrizeCardID.toString()}
              style={{ width: 40 }}
            />
          ) : null;
        return (
          <React.Fragment key={index}>
            <tr
              className={styles.compact}
              style={{ cursor: 'pointer' }}
              onClick={() =>
                setShowTable(st =>
                  st.map((v, i) => {
                    if (i === index) return !v;
                    return v;
                  }),
                )
              }
            >
              <td style={{ textAlign: 'left' }}>
                {enemies.length > 1 && index === 0 && (
                  <Button
                    icon={expand ? 'minus' : 'plus'}
                    onClick={e => {
                      e.stopPropagation();
                      setExpand(e => !e);
                    }}
                    style={{
                      width: 20,
                      height: 20,
                      fontSize: 10,
                      marginRight: 5,
                    }}
                  />
                )}
                {enemies.length > 1 && index !== 0 && (
                  <Divider style={{ margin: '0 12.5px' }} type="vertical" />
                )}
                <div
                  style={{
                    display: 'inline-block',
                    width: previewSprite.Width,
                    height: previewSprite.Height,
                    backgroundImage: `url("${ENEMY_DOT_URL}/${imgID}/sprite.png")`,
                    backgroundPositionX: -previewSprite.X,
                    backgroundPositionY: -previewSprite.Y,
                    zoom: Math.min(
                      40 / previewSprite.Height,
                      40 / previewSprite.Width,
                    ),
                    verticalAlign: 'middle',
                  }}
                />
              </td>
              {!isTabletOrMobile && <td>{types}</td>}
              <td>
                {getAttackSpeed(e, dots)}
                <br />
                {e.ATTACK_RANGE}
              </td>
              <td>{e.HP}</td>
              <td
                style={{
                  background:
                    e.TypeAttack === 300
                      ? '#ffdad2'
                      : e.MagicAttack
                      ? '#c8f1bb'
                      : '#ccecff',
                }}
              >
                {e.ATTACK_POWER}
              </td>
              <td>
                {e.ARMOR_DEFENSE}
                <br />
                {e.MAGIC_DEFENSE}
              </td>
              <td>{e.Param_ResistanceAssassin}</td>
              {!isTabletOrMobile && <td>{dropImg}</td>}
              {!isTabletOrMobile && <td>{changeCondition}</td>}
            </tr>
            {showTable[index] && (
              <tr>
                <td colSpan={9} style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <Row gutter={8}>
                    <Col xs={24} md={12}>
                      <table className={styles.table}>
                        <tbody>
                          <tr>
                            <th>类型</th>
                            <td>{types}</td>
                          </tr>
                          {changeCondition && (
                            <tr>
                              <th>切换条件</th>
                              <td>{changeCondition}</td>
                            </tr>
                          )}
                          <tr>
                            <th>循环数量</th>
                            <td>{e.Loop}</td>
                          </tr>
                          <tr>
                            <th>路线</th>
                            <td>{e.RouteNo}</td>
                          </tr>
                          {e.PrizeCardID !== 0 && (
                            <tr>
                              <th>掉落</th>
                              <td>{dropImg}</td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {e.SpecialtyConfigs.length > 0 && (
                        <table
                          className={styles.table}
                          style={{
                            tableLayout: 'fixed',
                            position: 'relative',
                          }}
                        >
                          <thead>
                            <tr>
                              <th>类型</th>
                              <th>p1</th>
                              <th>p2</th>
                              <th>p3</th>
                              <th>p4</th>
                            </tr>
                            <tr>
                              <th colSpan={3}>cmd</th>
                              <th colSpan={2}>...p</th>
                            </tr>
                          </thead>
                          {e.SpecialtyConfigs.map((config, index) => (
                            <EnemyConfigTableRows key={index} config={config} />
                          ))}
                        </table>
                      )}
                      {!!(e.Missile && e.Missile.Enemy === 1) && (
                        <MissileTable missile={e.Missile} compact />
                      )}
                    </Col>
                    <Col xs={24} md={12}>
                      {dots.map((dot, i) => (
                        <DotTable
                          key={i}
                          CardID={imgID}
                          type="Enemy"
                          dot={dot}
                        />
                      ))}
                    </Col>
                  </Row>
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

interface EnemyTableProps {
  data: {
    Quest: QuestType;
    QuestEventTexts: Array<{
      Message: string;
      Name: string;
      FaceID: number;
    }>;
  };
}

const EnemyTable: React.FC<EnemyTableProps> = ({ data }) => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 991px)' });
  const { Quest: quest } = data;
  const enemies = quest.Map.Enemies || quest.Mission.Enemies;
  const entries = quest.Map.Entries[quest.EntryNo];
  const mapLevel = quest.Level;
  const [showDuplicate, setShowDuplicate] = useState(false);
  const [showTalk, setShowTalk] = useState(true);
  const drops = [
    quest.Treasure1,
    quest.Treasure2,
    quest.Treasure3,
    quest.Treasure4,
    quest.Treasure5,
  ].map(treasure => `${ICO_URL}/0/${treasure}.png`);
  const parsedEnemies: Array<Array<Enemy & MapEntry> | MapEntry> = [];
  const parseEnemy = (entry: MapEntry, enemyID: number = entry.EnemyID - 1) => {
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
  for (const entry of entries) {
    // ids between 0 and 1000 are true enemies
    if (entry.EnemyID >= 0 && entry.EnemyID < 1000) {
      const enemy = parseEnemy(entry);
      const enemyGroup = [enemy];
      if (
        parsedEnemies.find(
          ea =>
            !showDuplicate &&
            ea instanceof Array &&
            ea[0].EnemyID === enemy.EnemyID,
        )
      ) {
        continue;
      }
      if (enemy.Param_ChangeParam) {
        while (enemyGroup[enemyGroup.length - 1].Param_ChangeParam) {
          const changeFrom = enemyGroup[enemyGroup.length - 1];
          const enemyID = changeFrom.Param_ChangeParam - 1;
          if (enemyGroup.find(e => e.EnemyID === enemyID)) {
            break;
          }
          const newEnemy = parseEnemy(entry, enemyID);
          enemyGroup.push(newEnemy);
        }
      }
      parsedEnemies.push(enemyGroup);
    } else {
      parsedEnemies.push(entry);
    }
  }
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <td colSpan={12}>
            重复敌人
            <Switch
              checkedChildren="显示"
              unCheckedChildren="隐藏"
              checked={showDuplicate}
              onChange={value => setShowDuplicate(value)}
            />
            <Divider type="vertical" />
            对话
            <Switch
              checkedChildren="显示"
              unCheckedChildren="隐藏"
              checked={showTalk}
              onChange={value => setShowTalk(value)}
            />
          </td>
        </tr>
        <tr>
          <th rowSpan={2} style={{ width: 100 }}>
            点阵
          </th>
          {!isTabletOrMobile && <th rowSpan={2}>属性</th>}
          <th>攻速</th>
          <th rowSpan={2}>HP</th>
          <th rowSpan={2}>攻击</th>
          <th>防御</th>
          <th rowSpan={2}>暗杀</th>
          {!isTabletOrMobile && <th rowSpan={2}>掉落</th>}
          {!isTabletOrMobile && <th rowSpan={2}>切换</th>}
        </tr>
        <tr>
          <th>射程</th>
          <th>魔抗</th>
        </tr>
      </thead>

      <tbody>
        {parsedEnemies.map((enemies, index) => {
          if (enemies instanceof Array) {
            return (
              <EnemyTableRows
                isTabletOrMobile={isTabletOrMobile}
                enemies={enemies}
                drops={drops}
                key={index}
              />
            );
          } else if (enemies.EnemyID === -1) {
            // wait
            return null;
          } else if (enemies.EnemyID === 2000) {
            // exclution mark
            return null;
          } else if (enemies.EnemyID >= 1000 && enemies.EnemyID < 2000) {
            // quest event text
            return showTalk ? (
              <TalkRow
                key={`enemy-table-${index}`}
                talk={data.QuestEventTexts[enemies.EnemyID - 1000]}
                MissionID={quest.Mission.MissionID}
                isTabletOrMobile={isTabletOrMobile}
              />
            ) : null;
          } else if (enemies.EnemyID === 4201) {
            // command, play se or call a event, etc
            const command = enemies.EntryCommand;
            const match = /CallEvent\(([\d,]+)\)/.exec(command);
            if (match) {
              const list = match[1].split(',');
              return list.map((s, index) => {
                const recordIndex = Number.parseInt(s, 10);
                const talk = quest.Mission.BattleTalkEvents.find(
                  e => e.RecordIndex === recordIndex,
                );
                if (!talk) {
                  return null;
                }
                return showTalk ? (
                  <TalkRow
                    key={`enemy-table-${index}-event-${recordIndex}`}
                    MissionID={quest.Mission.MissionID}
                    talk={talk}
                    isTabletOrMobile={isTabletOrMobile}
                  />
                ) : null;
              });
            }
            return (
              <tr style={{ display: 'none' }} key={`enemy-table-${index}`}>
                <td colSpan={14}>{enemies.EntryCommand}</td>
              </tr>
            );
          }
          return null;
        })}
      </tbody>
    </table>
  );
};

export default EnemyTable;
