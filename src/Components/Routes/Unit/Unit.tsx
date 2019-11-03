import React, { useState, useRef, useEffect } from 'react';
import { Query } from 'react-apollo';
import { Spin, Popover, Layout, Tabs, Divider, Button, Icon, Tag } from 'antd';
import _ from 'lodash';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import useRouter from 'use-react-router';
import SkillInfluenceTable from '../../SkillInfluenceTable';
import AbilityConfigTable from '../../AbilityConfigTable';
import DotAnimation from '../../DotAnimation';
import {
  BASE_GAME_URL,
  ICO_URL,
  PLAYER_DOT_URL,
  BONUS_TYPE,
} from '../../../consts';
import './index.less';
import { ClassData, Data, query } from './type';
import Rarity from '../../Rarity';
import Gender from '../../Gender';

const { Content } = Layout;
const { TabPane } = Tabs;

function countMinMax(
  min: number,
  max: number,
  maxLevel: number,
  maxLevelUnit: number,
  mod: number,
) {
  return [
    Math.ceil(mod * (min + (max - min) * (1 / maxLevel))),
    Math.ceil(mod * (min + (max - min) * (maxLevelUnit / maxLevel))),
  ];
}

// 用职业数据计算单位属性
function classDataToUnit(
  {
    InitHP,
    MaxHP,
    InitAtk,
    MaxAtk,
    InitDef,
    MaxDef,
    MaxLevel,
    MaxLevelUnit,
    Cost: cost,
    AtkArea: range,
    BlockNum: block,
    Name: className,
    Explanation,
    MaxLevelUnit: maxLevelUnit,
    AttackWait,
    ClassID,
  }: ClassData,
  nearRange: number,
  hpMod: number,
  atkMod: number,
  defMod: number,
  costMod: number,
  costDec: number,
) {
  return {
    hp: countMinMax(InitHP, MaxHP, MaxLevel, MaxLevelUnit, hpMod),
    atk: countMinMax(InitAtk, MaxAtk, MaxLevel, MaxLevelUnit, atkMod),
    def: countMinMax(InitDef, MaxDef, MaxLevel, MaxLevelUnit, defMod),
    cost: [cost + costMod, cost + costMod - costDec],
    range:
      nearRange === 0
        ? ClassID < 10000 || ClassID >= 100000
          ? 0
          : range
        : nearRange,
    block,
    className,
    maxLevelUnit,
    Explanation,
    AttackWait,
  };
}

const getStatus = (card: Data['card']) => {
  const hpMod = card.MaxHPMod / 100;
  const atkMod = card.AtkMod / 100;
  const defMod = card.DefMod / 100;
  const { CostDecValue: costDec, CostModValue: costMod } = card;
  const { BattleStyle } = card.Class.ClassInit;
  let ranges = [0, 0, 0, 0, 0];
  if (BattleStyle) {
    ranges = [
      BattleStyle._Range_01,
      BattleStyle._Range_02,
      BattleStyle._Range_03,
      BattleStyle._Range_04,
      BattleStyle._Range_05,
    ];
  }
  // const rarity = card.Rare;
  const status = [
    {
      stat: '初始',
      data: classDataToUnit(
        card.Class.ClassInit,
        ranges[0],
        hpMod,
        atkMod,
        defMod,
        costMod,
        costDec,
      ),
    },
  ];
  if (card.Class.ClassCC) {
    status.push({
      stat: 'CC',
      data: classDataToUnit(
        card.Class.ClassCC,
        ranges[1],
        hpMod,
        atkMod,
        defMod,
        costMod,
        costDec,
      ),
    });
  }
  if (card.Class.ClassEvo) {
    status.push({
      stat: '觉醒',
      data: classDataToUnit(
        card.Class.ClassEvo,
        ranges[2],
        hpMod,
        atkMod,
        defMod,
        costMod,
        costDec,
      ),
    });
  }
  if (
    card.Class.ClassEvo2a &&
    (card._AwakePattern === 1 || card._AwakePattern === 3)
  ) {
    status.push({
      stat: '第二觉醒A',
      data: classDataToUnit(
        card.Class.ClassEvo2a,
        ranges[3],
        hpMod,
        atkMod,
        defMod,
        costMod,
        costDec,
      ),
    });
  }
  if (
    card.Class.ClassEvo2b &&
    (card._AwakePattern === 2 || card._AwakePattern === 3)
  ) {
    status.push({
      stat: '第二觉醒B',
      data: classDataToUnit(
        card.Class.ClassEvo2b,
        ranges[4],
        hpMod,
        atkMod,
        defMod,
        costMod,
        costDec,
      ),
    });
  }
  return status;
};

const Unit: React.FC = () => {
  const [tabActiveKey, setTabActiveKey] = useState('');

  const { match } = useRouter<{ CardID: string }>();
  const CardIDM = match.params.CardID;
  const CardIDRef = useRef<string>();

  useEffect(() => {
    if (CardIDM) {
      CardIDRef.current = CardIDM;
    }
  }, [CardIDM]);

  // trick，如果CardIDM因为跳到/unit变成空了则保留上一次的数值
  const CardID = (CardIDM || CardIDRef.current)!;

  const handleTabChange = (tabActiveKey: string) => {
    setTabActiveKey(tabActiveKey);
  };

  return (
    <Query<Data> query={query} variables={{ id: CardID }}>
      {({ loading, error, data }) => {
        return (
          <Content className="unit-containter container">
            <Spin spinning={loading} style={{ height: '100%', width: '100%' }}>
              {data && !_.isEmpty(data) && (
                <div>
                  <h1 className="unit-title">
                    <Link to={`/quest/${Number.parseInt(CardID, 10) - 1}`}>
                      <Icon type="left" />
                    </Link>

                    <Gender gender={data.card.Kind} />
                    <div style={{ display: 'inline-block' }}>
                      <Rarity rare={data.card.Rare} />
                      <div>{data.card.Name}</div>
                    </div>
                    <Link to={`/unit/${Number.parseInt(CardID, 10) + 1}`}>
                      <Icon type="right" />
                    </Link>
                  </h1>
                  <p>
                    {data.card.Race && (
                      <span>
                        <Tag>{data.card.Race}</Tag>
                      </span>
                    )}
                    {data.card.Assign && (
                      <span>
                        <Tag color="magenta">{data.card.Assign}</Tag>
                      </span>
                    )}
                    {data.card.Identity && (
                      <span>
                        <Tag color="black">{data.card.Identity}</Tag>
                      </span>
                    )}
                  </p>
                  <div className="harem-container">
                    <div className="ant-carousel">
                      <Slider dots className={`cg-${data.card.ImageCG.length}`}>
                        {[...data.card.ImageStand, ...data.card.ImageCG].map(
                          (img: string) => (
                            <div key={img}>
                              <img alt={img} src={`${BASE_GAME_URL}${img}`} />
                            </div>
                          ),
                        )}
                      </Slider>
                    </div>
                    <Tabs
                      activeKey={tabActiveKey}
                      onChange={handleTabChange}
                      className={
                        'harlem-text-tabs ' +
                        (data.card.HarlemTextR &&
                          `harlem-text-tabs-${data.card.HarlemTextR.length}`)
                      }
                      // type="card"
                    >
                      {data.card.HarlemTextA &&
                        data.card.HarlemTextA.map(
                          (text: string, index: number) => (
                            <TabPane tab={`表${index + 1}`} key={`a-${index}`}>
                              <div>
                                <Button
                                  onClick={() => handleTabChange('')}
                                  type="danger"
                                  shape="circle"
                                  icon="close"
                                />
                              </div>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: text
                                    .replace(
                                      /([＠@].*\r\n)/g,
                                      (match, p1) =>
                                        `<span style="font-weight: bold">${p1}</span>`,
                                    )
                                    .replace(/\r\n/g, '<br />'),
                                }}
                              />
                            </TabPane>
                          ),
                        )}
                      {data.card.HarlemTextR &&
                        data.card.HarlemTextR.map(
                          (text: string, index: number) => (
                            <TabPane tab={`里${index + 1}`} key={`r-${index}`}>
                              <div>
                                <Button
                                  onClick={() => handleTabChange('')}
                                  type="danger"
                                  shape="circle"
                                  icon="close"
                                />
                              </div>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: text
                                    .replace(
                                      /([@＠].*\r\n)/g,
                                      (match, p1) =>
                                        `<span style="font-weight: bold">${p1}</span>`,
                                    )
                                    .replace(/\r\n/g, '<br />'),
                                }}
                              />
                            </TabPane>
                          ),
                        )}
                    </Tabs>
                    {/* {data.card.HarlemTextR[0]} */}
                  </div>
                  <p>
                    Illust: <strong>{data.card.Illust}</strong>
                  </p>
                  <div className="ant-table ant-table-bordered ant-table-middle">
                    <div className="ant-table-title">
                      <strong>HP补正:</strong>
                      {data.card.MaxHPMod / 100}/<strong>攻击补正:</strong>
                      {data.card.AtkMod / 100}/<strong>防御补正:</strong>
                      {data.card.DefMod / 100}
                    </div>
                    <div className="ant-table-content">
                      <div className="ant-table-body">
                        <table>
                          <thead className="ant-table-thead">
                            <tr>
                              <th>状态</th>
                              <th>职业名</th>
                              <th>头像</th>
                              <th>等级</th>
                              <th>HP</th>
                              <th>攻击力</th>
                              <th>防御力</th>
                              <th>魔抗</th>
                              <th>射程</th>
                              <th>档数</th>
                              <th>Cost</th>
                            </tr>
                          </thead>
                          <tbody className="ant-table-tbody">
                            {getStatus(data.card).map(stat => [
                              <tr
                                className="ant-table-row"
                                key={`${stat.stat}-1`}
                              >
                                <td rowSpan={2}>{stat.stat}</td>
                                <td rowSpan={2}>{stat.data.className}</td>
                                <td rowSpan={2}>
                                  {(() => {
                                    let url = ICO_URL;
                                    switch (stat.stat) {
                                      case '初始':
                                        url += '/0';
                                        break;
                                      case '觉醒':
                                        url += '/1';
                                        break;
                                      case '第二觉醒A':
                                        url += '/2';
                                        break;
                                      case '第二觉醒B':
                                        url += '/3';
                                        break;
                                      default:
                                        return null;
                                    }
                                    return (
                                      <img
                                        alt={data.card.CardID.toString()}
                                        src={`${url}/${data.card.CardID}.png`}
                                      />
                                    );
                                  })()}
                                </td>
                                <td>Lv1</td>
                                <td>{stat.data.hp[0]}</td>
                                <td>{stat.data.atk[0]}</td>
                                <td>{stat.data.def[0]}</td>
                                <td rowSpan={2}>{data.card.MagicResistance}</td>
                                <td rowSpan={2}>
                                  {stat.data.range ? stat.data.range : '近战'}
                                </td>
                                <td rowSpan={2}>{stat.data.block}</td>
                                <td rowSpan={2}>
                                  {stat.data.cost[0]}({stat.data.cost[1]})
                                </td>
                              </tr>,
                              <tr
                                className="ant-table-row"
                                key={`${stat.stat}-2`}
                              >
                                <td>
                                  Lv
                                  {stat.data.maxLevelUnit}
                                </td>
                                <td>{stat.data.hp[1]}</td>
                                <td>{stat.data.atk[1]}</td>
                                <td>{stat.data.def[1]}</td>
                              </tr>,
                            ])}
                          </tbody>
                        </table>
                      </div>
                      <div className="ant-table-footer">
                        {data.card.BonusType !== 0 && (
                          <span>
                            <strong>
                              {BONUS_TYPE.get(data.card.BonusType)}
                            </strong>
                            {Math.ceil(data.card.BonusNum * 1.2)}
                          </span>
                        )}
                        {data.card.BonusType2 !== 0 && (
                          <span>
                            <Divider type="vertical" />
                            <strong>
                              {BONUS_TYPE.get(data.card.BonusType2)}
                            </strong>
                            {Math.ceil(data.card.BonusNum2 * 1.2)}
                          </span>
                        )}
                        {data.card.BonusType3 !== 0 && (
                          <span>
                            <Divider>150%</Divider>
                            <strong>
                              {BONUS_TYPE.get(data.card.BonusType3)}
                            </strong>
                            {Math.ceil(data.card.BonusNum3)}
                          </span>
                        )}
                        {data.card.BonusType === 0 && <span>无好感</span>}
                      </div>
                    </div>
                  </div>
                  {data.card.AbilityEvoInfo.AbilityID !== 0 && (
                    <div>
                      <h2>被动</h2>
                      <div className="ant-table ant-table-bordered ant-table-middle">
                        <div className="ant-table-content">
                          <div className="ant-table-body">
                            <table>
                              <thead className="ant-table-thead">
                                <tr>
                                  <th>状态</th>
                                  <th>名称</th>
                                  <th>描述</th>
                                </tr>
                              </thead>
                              <tbody className="ant-table-tbody">
                                {[
                                  {
                                    ...data.card.AbilityInitInfo,
                                    Type: '初始',
                                  },
                                  {
                                    ...data.card.AbilityEvoInfo,
                                    Type: '觉醒',
                                  },
                                ]
                                  .filter(
                                    (ability: any) => ability.AbilityID !== 0,
                                  )
                                  .map((ability: any) => (
                                    <Popover
                                      content={
                                        <AbilityConfigTable
                                          configs={ability.Config}
                                        />
                                      }
                                      key={ability.AbilityName}
                                    >
                                      <tr key={ability.AbilityName}>
                                        <td>{ability.Type}</td>
                                        <td>{ability.AbilityName}</td>
                                        <td>{ability.Text}</td>
                                      </tr>
                                    </Popover>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {data.card.SkillInit[0].SkillName !== 'なし' && (
                    <div>
                      <h2>技能</h2>
                      <div className="ant-table ant-table-bordered ant-table-middle">
                        <div className="ant-table-content">
                          <div className="ant-table-body">
                            <table>
                              <thead className="ant-table-thead">
                                <tr>
                                  <th>状态</th>
                                  <th>技能名</th>
                                  <th>效果</th>
                                  <th>持续</th>
                                  <th>再动</th>
                                  <th>技能等级</th>
                                  <th>&lt;POW_I&gt;</th>
                                </tr>
                              </thead>
                              <tbody className="ant-table-tbody">
                                {[
                                  {
                                    Data: [...data.card.SkillInit],
                                    Type: '初始',
                                  },
                                  {
                                    Data: [...data.card.SkillCC],
                                    Type: 'CC',
                                  },
                                  {
                                    Data: [...data.card.SkillEvo],
                                    Type: '觉醒',
                                  },
                                ]
                                  .filter(skills => {
                                    if (
                                      skills.Type === 'CC' &&
                                      data.card.ClassLV0SkillID ===
                                        data.card.ClassLV1SkillID
                                    ) {
                                      return false;
                                    }
                                    if (skills.Data[0].SkillName === 'なし') {
                                      return false;
                                    }
                                    return true;
                                  })
                                  .map(skills =>
                                    skills.Data.map((skill: any, index) => (
                                      <Popover
                                        key={`skill-${skills.Type}-${index}`}
                                        content={
                                          <SkillInfluenceTable skill={skill} />
                                        }
                                      >
                                        <tr>
                                          {index === 0 && (
                                            <td rowSpan={skills.Data.length}>
                                              {skills.Type}
                                            </td>
                                          )}
                                          <td>{skill.SkillName}</td>
                                          <td>{skill.Text}</td>
                                          <td>{skill.ContTimeMax}</td>
                                          <td>
                                            {skill.WaitTime - skill.LevelMax}
                                          </td>
                                          <td>{skill.LevelMax}</td>
                                          <td>{skill.PowerMax}</td>
                                        </tr>
                                      </Popover>
                                    )),
                                  )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div>
                    <h2>职业</h2>
                    <div className="ant-table ant-table-bordered ant-table-middle">
                      <div className="ant-table-content">
                        <div className="ant-table-body">
                          <table>
                            <thead className="ant-table-thead">
                              <tr>
                                <th>职业</th>
                                <th>描述</th>
                                <th>后摇</th>
                                <th>被动强度</th>
                              </tr>
                            </thead>
                            <tbody className="ant-table-tbody">
                              {Object.keys(data.card.Class).map(key => {
                                if (!(key in data.card.Class)) {
                                  throw Error('No such key');
                                }

                                const classData =
                                  data.card.Class[
                                    key as keyof Data['card']['Class']
                                  ];
                                if (
                                  !classData ||
                                  typeof classData !== 'object'
                                ) {
                                  return null;
                                }
                                return (
                                  <Popover
                                    content={
                                      <AbilityConfigTable
                                        configs={classData.ClassAbilityConfig1}
                                      />
                                    }
                                    key={key}
                                  >
                                    <tr key={key}>
                                      <td>{classData.Name}</td>
                                      <td>{classData.Explanation}</td>
                                      <td>{classData.AttackWait}</td>
                                      <td>{classData.ClassAbilityPower1}</td>
                                    </tr>
                                  </Popover>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  {data.card.Dots && (
                    <div>
                      <h2>点阵</h2>
                      <div className="ant-table ant-table-bordered ant-table-middle">
                        <div className="ant-table-content">
                          <div className="ant-table-body">
                            <table>
                              <tbody className="ant-table-tbody">
                                {data.card.Dots.map(
                                  (dot: any, index: number) => (
                                    <tr key={index + dot.Name}>
                                      <td
                                        style={{
                                          background: '#f5f6fa',
                                          fontWeight: 500,
                                          color: 'rgba(0, 0, 0, 0.85)',
                                        }}
                                      >
                                        {dot.Name}
                                      </td>
                                      <td>{dot.Length}f</td>
                                      <td>
                                        {dot.Entries.map(
                                          (entry: any, entryIndex: number) => (
                                            <div key={entryIndex}>
                                              {entry.Sprites.map(
                                                (
                                                  sprite: any,
                                                  index: number,
                                                ) => {
                                                  return (
                                                    <div
                                                      key={`${entryIndex}-${index}`}
                                                      style={{
                                                        display: 'inline-block',
                                                        width: sprite.Width,
                                                        height: sprite.Height,
                                                        backgroundImage: `url("${PLAYER_DOT_URL}/${data.card.CardID}.png")`,
                                                        backgroundPositionX: -sprite.X,
                                                        backgroundPositionY: -sprite.Y,
                                                      }}
                                                    />
                                                  );
                                                },
                                              )}
                                            </div>
                                          ),
                                        )}
                                      </td>
                                      <td>
                                        <DotAnimation
                                          dot={dot}
                                          cardID={data.card.CardID}
                                        />
                                      </td>
                                    </tr>
                                  ),
                                )}
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
        );
      }}
    </Query>
  );
};

export default Unit;
