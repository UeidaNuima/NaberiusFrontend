import React from 'react';
import { Query } from 'react-apollo';
import { Spin, Popover, Layout, Tabs, Divider, Button } from 'antd';
import _ from 'lodash';
import Slider from 'react-slick';
import { RouteComponentProps } from 'react-router-dom';
import gql from 'graphql-tag';
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

const { Content } = Layout;
const { TabPane } = Tabs;

interface ClassData {
  Name: string;
  InitHP: number;
  MaxHP: number;
  InitDef: number;
  MaxDef: number;
  InitAtk: number;
  MaxAtk: number;
  AtkArea: number;
  BlockNum: number;
  MaxLevel: number;
  MaxLevelUnit: number;
  Explanation: string;
  Cost: number;
  AttackWait: string;
  ClassAbilityConfig1: Array<{
    _InvokeType: number;
    _TargetType: number;
    _InfluenceType: number;
    _Param1: number;
    _Param2: number;
    _Param3: number;
    _Param4: number;
    _Command: string;
    _ActivateCommand: string;
    Description: string;
  }>;
  ClassAbilityPower1: number;
}

interface SkillData {
  SkillName: string;
  WaitTime: number;
  ContTimeMax: number;
  PowerMax: number;
  LevelMax: number;
  Text: string;
  InfluenceConfig: {
    Type_Collision: number;
    Type_CollisionState: number;
    Type_ChangeFunction: number;
    Data_Target: number;
    Data_InfluenceType: number;
    Data_MulValue: number;
    Data_MulValue2: number;
    Data_MulValue3: number;
    Data_AddValue: number;
    _HoldRatioUpperLimit: number;
    _Expression: string;
    _ExpressionActivate: string;
    Description: string;
  };
}

interface AbilityData {
  AbilityID: number;
  Text: string;
  AbilityName: string;
  Config: {
    _InvokeType: number;
    _TargetType: number;
    _InfluenceType: number;
    _Param1: number;
    _Param2: number;
    _Param3: number;
    _Param4: number;
    _Command: string;
    _ActivateCommand: string;
    Description: string;
  };
}

interface Data {
  card: {
    CardID: number;
    _AwakePattern: number;
    HarlemTextR: string[];
    HarlemTextA: string[];
    Name: number;
    Rare: number;
    Kind: number;
    MaxHPMod: number;
    AtkMod: number;
    DefMod: number;
    CostModValue: number;
    CostDecValue: number;
    MagicResistance: number;
    BonusType: number;
    BonusNum: number;
    BonusType2: number;
    BonusNum2: number;
    BonusType3: number;
    BonusNum3: number;
    Race: number;
    Assign: number;
    Identity: number;
    Illust: number;
    Dots: Array<{
      Name: string;
      Length: number;
      Entries: Array<{
        Name: string;
        Sprites: Array<{
          X: number;
          Y: number;
          Width: number;
          Height: number;
          OriginX: number;
          OriginY: number;
        }>;
        PatternNo: {
          Time: number;
          Data: number;
        };
      }>;
      Image: string;
    }>;
    Class: {
      ClassInit: ClassData;
      ClassCC: ClassData;
      ClassEvo: ClassData;
      ClassEvo2a: ClassData;
      ClassEvo2b: ClassData;
    };
    ImageCG: string[];
    ImageStand: string[];
    AbilityEvoInfo: AbilityData;
    AbilityInitInfo: AbilityData;
    ClassLV0SkillID: number;
    ClassLV1SkillID: number;
    SkillInit: SkillData[];
    SkillCC: SkillData[];
    SkillEvo: SkillData[];
  };
}

interface UnitStates {
  tabActiveKey: string;
}

export default class Unit extends React.Component<
  RouteComponentProps<{ CardID: string }>,
  UnitStates
> {
  public state: UnitStates = {
    tabActiveKey: '',
  };
  public getStatus = (card: any) => {
    const hpMod = card.MaxHPMod / 100;
    const atkMod = card.AtkMod / 100;
    const defMod = card.DefMod / 100;
    const { CostDecValue: costDec, CostModValue: costMod } = card;
    // const rarity = card.Rare;
    const status = [
      {
        stat: '初始',
        data: classDataToUnit(card.Class.ClassInit),
      },
    ];
    if (card.Class.ClassCC) {
      status.push({
        stat: 'CC',
        data: classDataToUnit(card.Class.ClassCC),
      });
    }
    if (card.Class.ClassEvo) {
      status.push({
        stat: '觉醒',
        data: classDataToUnit(card.Class.ClassEvo),
      });
    }
    if (
      card.Class.ClassEvo2a &&
      (card._AwakePattern === 1 || card._AwakePattern === 3)
    ) {
      status.push({
        stat: '第二觉醒A',
        data: classDataToUnit(card.Class.ClassEvo2a),
      });
    }
    if (
      card.Class.ClassEvo2b &&
      (card._AwakePattern === 2 || card._AwakePattern === 3)
    ) {
      status.push({
        stat: '第二觉醒B',
        data: classDataToUnit(card.Class.ClassEvo2b),
      });
    }
    return status;
    function classDataToUnit({
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
    }: any) {
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
      return {
        hp: countMinMax(InitHP, MaxHP, MaxLevel, MaxLevelUnit, hpMod),
        atk: countMinMax(InitAtk, MaxAtk, MaxLevel, MaxLevelUnit, atkMod),
        def: countMinMax(InitDef, MaxDef, MaxLevel, MaxLevelUnit, defMod),
        cost: [cost + costMod, cost + costMod - costDec] as number[],
        range: range as number,
        block: block as number,
        className: className as string,
        maxLevelUnit: maxLevelUnit as number,
        Explanation: Explanation as string,
        AttackWait: AttackWait as number,
      };
    }
  };
  public getGender = (kind: number) => {
    if (kind === 1) {
      return <span className="gender genderFemale" />;
    } else if (kind === 0) {
      return <span className="gender genderMale" />;
    } else {
      return <span className="gender genderUnknown" />;
    }
  };

  public handleTabChange = (tabActiveKey: string) => {
    this.setState({
      tabActiveKey,
    });
  };

  public render() {
    const id = this.props.match.params.CardID;
    return (
      <Query<Data>
        query={gql`
          query($id: Int!) {
            card(CardID: $id) {
              CardID
              _AwakePattern
              HarlemTextR
              HarlemTextA
              Name
              Rare
              Kind
              MaxHPMod
              AtkMod
              DefMod
              CostModValue
              CostDecValue
              MagicResistance
              BonusType
              BonusNum
              BonusType2
              BonusNum2
              BonusType3
              BonusNum3
              Race
              Assign
              Identity
              Illust
              Dots {
                Name
                Length
                Entries {
                  Name
                  Sprites {
                    X
                    Y
                    Width
                    Height
                    OriginX
                    OriginY
                  }
                  PatternNo {
                    Time
                    Data
                  }
                }
                Image
              }
              Class {
                ClassInit {
                  Name
                  InitHP
                  MaxHP
                  InitDef
                  MaxDef
                  InitAtk
                  MaxAtk
                  AtkArea
                  BlockNum
                  MaxLevel
                  MaxLevelUnit
                  Explanation
                  Cost
                  AttackWait
                  ClassAbilityConfig1 {
                    _InvokeType
                    _TargetType
                    _InfluenceType
                    _Param1
                    _Param2
                    _Param3
                    _Param4
                    _Command
                    _ActivateCommand
                    Description
                  }
                  ClassAbilityPower1
                }
                ClassCC {
                  Name
                  InitHP
                  MaxHP
                  InitDef
                  MaxDef
                  InitAtk
                  MaxAtk
                  AtkArea
                  BlockNum
                  MaxLevel
                  MaxLevelUnit
                  Explanation
                  Cost
                  AttackWait
                  ClassAbilityConfig1 {
                    _InvokeType
                    _TargetType
                    _InfluenceType
                    _Param1
                    _Param2
                    _Param3
                    _Param4
                    _Command
                    _ActivateCommand
                    Description
                  }
                  ClassAbilityPower1
                }
                ClassEvo {
                  Name
                  InitHP
                  MaxHP
                  InitDef
                  MaxDef
                  InitAtk
                  MaxAtk
                  AtkArea
                  BlockNum
                  MaxLevel
                  MaxLevelUnit
                  Explanation
                  Cost
                  AttackWait
                  ClassAbilityConfig1 {
                    _InvokeType
                    _TargetType
                    _InfluenceType
                    _Param1
                    _Param2
                    _Param3
                    _Param4
                    _Command
                    _ActivateCommand
                    Description
                  }
                  ClassAbilityPower1
                }
                ClassEvo2a {
                  Name
                  InitHP
                  MaxHP
                  InitDef
                  MaxDef
                  InitAtk
                  MaxAtk
                  AtkArea
                  BlockNum
                  MaxLevel
                  MaxLevelUnit
                  Explanation
                  Cost
                  AttackWait
                  ClassAbilityConfig1 {
                    _InvokeType
                    _TargetType
                    _InfluenceType
                    _Param1
                    _Param2
                    _Param3
                    _Param4
                    _Command
                    _ActivateCommand
                    Description
                  }
                  ClassAbilityPower1
                }
                ClassEvo2b {
                  Name
                  InitHP
                  MaxHP
                  InitDef
                  MaxDef
                  InitAtk
                  MaxAtk
                  AtkArea
                  BlockNum
                  MaxLevel
                  MaxLevelUnit
                  Explanation
                  Cost
                  AttackWait
                  ClassAbilityConfig1 {
                    _InvokeType
                    _TargetType
                    _InfluenceType
                    _Param1
                    _Param2
                    _Param3
                    _Param4
                    _Command
                    _ActivateCommand
                    Description
                  }
                  ClassAbilityPower1
                }
              }
              ImageCG
              ImageStand
              AbilityEvoInfo {
                AbilityID
                Text
                AbilityName
                Config {
                  _InvokeType
                  _TargetType
                  _InfluenceType
                  _Param1
                  _Param2
                  _Param3
                  _Param4
                  _Command
                  _ActivateCommand
                  Description
                }
              }
              AbilityInitInfo {
                AbilityID
                Text
                AbilityName
                Config {
                  _InvokeType
                  _TargetType
                  _InfluenceType
                  _Param1
                  _Param2
                  _Param3
                  _Param4
                  _Command
                  _ActivateCommand
                  Description
                }
              }
              ClassLV0SkillID
              ClassLV1SkillID
              SkillInit {
                SkillName
                WaitTime
                ContTimeMax
                PowerMax
                LevelMax
                Text
                InfluenceConfig {
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
                  Description
                }
              }
              SkillCC {
                SkillName
                WaitTime
                ContTimeMax
                PowerMax
                LevelMax
                Text
                InfluenceConfig {
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
                  Description
                }
              }
              SkillEvo {
                SkillName
                WaitTime
                ContTimeMax
                PowerMax
                LevelMax
                Text
                InfluenceConfig {
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
                  Description
                }
              }
            }
          }
        `}
        variables={{ id }}
      >
        {({ loading, error, data }) => {
          return (
            <Content className="unit-containter container">
              <Spin
                spinning={loading}
                style={{ height: '100%', width: '100%' }}
              >
                {data && !_.isEmpty(data) && (
                  <div>
                    <h1 className="unit-title">
                      <span
                        className={`rarity-circle rarity-circle-${
                          data.card.Rare
                        }`}
                      />
                      <span className={`gender gender-${data.card.Kind}`} />
                      <span>{data.card.Name}</span>
                    </h1>
                    <p>
                      {data.card.Race && <span>&lt;{data.card.Race}&gt;</span>}
                      {data.card.Assign && (
                        <span>&lt;{data.card.Assign}&gt;</span>
                      )}
                      {data.card.Identity && (
                        <span>&lt;{data.card.Identity}&gt;</span>
                      )}
                    </p>
                    <div className="harem-container">
                      <div className="ant-carousel">
                        <Slider
                          dots
                          className={`cg-${data.card.ImageCG.length}`}
                        >
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
                        activeKey={this.state.tabActiveKey}
                        onChange={this.handleTabChange}
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
                              <TabPane
                                tab={`表${index + 1}`}
                                key={`a-${index}`}
                              >
                                <div>
                                  <Button
                                    onClick={() => this.handleTabChange('')}
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
                              <TabPane
                                tab={`里${index + 1}`}
                                key={`r-${index}`}
                              >
                                <div>
                                  <Button
                                    onClick={() => this.handleTabChange('')}
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
                              {this.getStatus(data.card).map(stat => [
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
                                  <td rowSpan={2}>
                                    {data.card.MagicResistance}
                                  </td>
                                  <td rowSpan={2}>{stat.data.range}</td>
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
                                            <SkillInfluenceTable
                                              skill={skill}
                                            />
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
                                          configs={
                                            classData.ClassAbilityConfig1
                                          }
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
                                            (
                                              entry: any,
                                              entryIndex: number,
                                            ) => (
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
                                                          display:
                                                            'inline-block',
                                                          width: sprite.Width,
                                                          height: sprite.Height,
                                                          backgroundImage: `url("${PLAYER_DOT_URL}/${
                                                            data.card.CardID
                                                          }.png")`,
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
  }
}
