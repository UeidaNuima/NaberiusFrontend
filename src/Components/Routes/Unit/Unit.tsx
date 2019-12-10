import React, { useState } from 'react';
import { Button, Icon, Tag, Radio, Row, Col, Input } from 'antd';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import useRouter from 'use-react-router';
import { BASE_GAME_URL, ICO_URL, BONUS_TYPE } from '../../../consts';
import './index.less';
import styles from './Unit.module.less';
import { ClassData, Data, query } from './type';
import Rarity from '../../Rarity';
import Gender from '../../Gender';
import Loading from '../../Loading';
import { useQuery } from '@apollo/react-hooks';
import { useMediaQuery } from 'react-responsive';
import classNames from 'classnames';
import SkillTable from './SkillTable';
import AbilityTable from './AbilityTable';
import ClassTable from './ClassTable';
import { Dot } from '../../../interfaces';
import DotTable from './DotTable';

function countMinMax(
  min: number,
  max: number,
  maxLevel: number,
  maxLevelUnit: number,
  mod: number,
) {
  return [
    Math.ceil((mod / 100) * (min + (max - min) * (1 / maxLevel))),
    Math.ceil((mod / 100) * (min + (max - min) * (maxLevelUnit / maxLevel))),
  ];
}

function classDataToUnit(
  classData: ClassData,
  card: Data['card'],
  nearRange?: { [k: string]: number },
) {
  let maxLevelUnit = 0;
  switch (classData.Type) {
    case 'Evo2a':
    case 'Evo2b':
      maxLevelUnit = 99;
      break;
    case 'Evo':
      if (card.Rare === 4) maxLevelUnit = 80;
      if (card.Rare === 5) maxLevelUnit = 90;
      if (card.Rare === 6) maxLevelUnit = 99;
      if (card.Rare === 8) maxLevelUnit = 85;
      if (card.Rare === 10) maxLevelUnit = 90;
      if (card.Rare === 11) maxLevelUnit = 99;
      break;
    case 'Init':
      if (card.Rare === 0) {
        maxLevelUnit = 30;
        break;
      }
      if (card.Rare === 1) {
        maxLevelUnit = 40;
        break;
      }
      if (classData.Data_ExtraAwakeOrbs.length === 0) {
        maxLevelUnit = 50;
        break;
      }
    // eslint-disable-next-line no-fallthrough
    case 'CC':
      if (card.Rare === 3) maxLevelUnit = 55;
      if (card.Rare === 4) maxLevelUnit = 60;
      if (card.Rare === 5) maxLevelUnit = 70;
      if (card.Rare === 6) maxLevelUnit = 80;
      if (card.Rare === 8) maxLevelUnit = 65;
      break;
  }

  return {
    ...classData,
    HP: countMinMax(
      classData.InitHP,
      classData.MaxHP,
      classData.MaxLevel,
      maxLevelUnit,
      card.MaxHPMod,
    ),
    Atk: countMinMax(
      classData.InitAtk,
      classData.MaxAtk,
      classData.MaxLevel,
      maxLevelUnit,
      card.AtkMod,
    ),
    Def: countMinMax(
      classData.InitDef,
      classData.MaxDef,
      classData.MaxLevel,
      maxLevelUnit,
      card.DefMod,
    ),
    Cost: [
      classData.Cost + card.CostModValue,
      classData.Cost + card.CostModValue - card.CostDecValue,
    ],
    range:
      nearRange && nearRange[classData.Type] !== 0
        ? nearRange[classData.Type]
        : classData.AtkArea,
    maxLevelUnit,
  };
}

const getStatus = (card: Data['card']) => {
  const { BattleStyle } = card.Classes[0];
  const ranges = BattleStyle && {
    Init: BattleStyle._Range_01,
    CC: BattleStyle._Range_02,
    Evo: BattleStyle._Range_03,
    Evo2a: BattleStyle._Range_04,
    Evo2b: BattleStyle._Range_05,
  };
  // const rarity = card.Rare

  const classes = [...card.Classes];

  if (card._AwakePattern === 1 || card._AwakePattern === 2) {
    const index = classes.findIndex(
      cl => cl.Type === `Evo2${card._AwakePattern === 1 ? 'b' : 'a'}`,
    );
    classes.splice(index, 1);
  }

  return classes.map(cl => classDataToUnit(cl, card, ranges));
};

const Unit: React.FC = () => {
  const { match } = useRouter<{ CardID: string }>();
  const CardID = Number.parseInt(match.params.CardID, 10);

  const [currentImg, setCurrentImg] = useState(0);
  const [currentText, setCurrentText] = useState<number>();

  const [avatars, setAvatars] = useState([0, 1, 2, 3]);

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 991px)' });

  const { loading, data } = useQuery<Data>(query, {
    variables: { id: CardID },
  });

  if (data) {
    if (data.card.Rare >= 10)
      data.card.Classes = data.card.Classes.filter(cl => cl.Type === 'Evo');
  }

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      {data && !_.isEmpty(data) && (
        <div>
          <h1 className="unit-title">
            <Link to={`/quest/${CardID - 1}`}>
              <Icon type="left" />
            </Link>

            <Gender gender={data.card.Kind} />
            <div style={{ display: 'inline-block' }}>
              <Rarity rare={data.card.Rare} />
              <div>{data.card.Name}</div>
            </div>
            <Link to={`/unit/${CardID + 1}`}>
              <Icon type="right" />
            </Link>
          </h1>
          <p>
            {data.card.RaceName && (
              <span>
                <Tag>{data.card.RaceName}</Tag>
              </span>
            )}
            {data.card.AssignName && (
              <span>
                <Tag color="magenta">{data.card.AssignName}</Tag>
              </span>
            )}
            {data.card.IdentityName && (
              <span>
                <Tag color="black">{data.card.IdentityName}</Tag>
              </span>
            )}
          </p>
          <div className={styles.previewContainer}>
            <div
              className={classNames(styles.outerRadioContainer, {
                [styles.inset]: !isTabletOrMobile,
              })}
            >
              <div className={styles.radioContainer}>
                <Radio.Group
                  onChange={e => setCurrentImg(e.target.value)}
                  value={currentImg}
                  className={styles.radioGroup}
                >
                  {data.card.ImageStand.map((_, index) => (
                    <Radio.Button key={`stand${index}`} value={index}>
                      立绘{index + 1}
                    </Radio.Button>
                  ))}
                </Radio.Group>
                <Radio.Group
                  onChange={e => setCurrentImg(e.target.value)}
                  value={currentImg}
                  className={classNames(styles.radioGroup, styles.danger)}
                >
                  {data.card.ImageCG.map((_, index) => (
                    <Radio.Button key={`cg${index}`} value={index + 10}>
                      CG{index + 1}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>
              <div className={styles.radioContainer}>
                <Radio.Group
                  onChange={e => setCurrentText(e.target.value)}
                  value={currentText}
                  className={styles.radioGroup}
                >
                  {data.card.HarlemTextA.map((_, index) => (
                    <Radio.Button key={`a${index}`} value={index}>
                      表{index + 1}
                    </Radio.Button>
                  ))}
                </Radio.Group>
                <Radio.Group
                  onChange={e => setCurrentText(e.target.value)}
                  value={currentText}
                  className={classNames(styles.radioGroup, styles.danger)}
                >
                  {data.card.HarlemTextR.map((_, index) => (
                    <Radio.Button key={`r${index}`} value={index + 10}>
                      里{index + 1}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              </div>
            </div>
            <div className={styles.outerImageContainer}>
              <div className={styles.imageContainer}>
                {currentText !== undefined && (
                  <div
                    className={classNames(styles.textContainer, {
                      [styles.fullScreen]: isTabletOrMobile,
                    })}
                  >
                    <Button
                      ghost
                      shape="circle"
                      onClick={() => setCurrentText(undefined)}
                      className={styles.closeButton}
                    >
                      <Icon type="close" />
                    </Button>
                    <div
                      className={styles.text}
                      dangerouslySetInnerHTML={{
                        __html: (currentText < 10
                          ? data.card.HarlemTextA[currentText]
                          : data.card.HarlemTextR[currentText - 10]
                        )
                          .replace(
                            /([＠@].*\r\n)/g,
                            (match, p1) =>
                              `<span style="font-weight: bold">${p1}</span>`,
                          )
                          .replace(/\r\n/g, '<br />'),
                      }}
                    />
                  </div>
                )}
                <img
                  style={{ height: '100%' }}
                  src={
                    BASE_GAME_URL +
                    (currentImg < 10
                      ? data.card.ImageStand[currentImg]
                      : data.card.ImageCG[currentImg - 10])
                  }
                  alt={currentImg.toString()}
                />
              </div>
            </div>
          </div>

          <table className={styles.table}>
            <tbody>
              <tr>
                <th>大头贴</th>
                <td colSpan={5}>
                  {avatars.map(avatar => (
                    <img
                      key={avatar}
                      src={`${ICO_URL}/${avatar}/${CardID}.png`}
                      alt={`${CardID}-${avatar}`}
                      onError={() => {
                        const index = avatars.findIndex(a => a === avatar);
                        setAvatars([
                          ...avatars.slice(0, index),
                          ...avatars.slice(index + 1),
                        ]);
                      }}
                    />
                  ))}
                </td>
              </tr>
              <tr>
                <th>画师</th>
                <td colSpan={5}>{data.card.IllustName}</td>
              </tr>
              <tr>
                <th>昵称</th>
                <td colSpan={5}>
                  <Input />
                </td>
              </tr>
              <tr>
                <th>圆爹名</th>
                <td colSpan={5}>
                  <Input />
                </td>
              </tr>
              <tr>
                <th>手料理</th>
                <td colSpan={5}>{data.card.HomeCooking}</td>
              </tr>
              <tr>
                <th>金币</th>
                <td colSpan={2}>{data.card.SellPrice}</td>
                <th>虹水晶</th>
                <td colSpan={2}>{data.card._TradePoint}</td>
              </tr>
              <tr>
                <th>魔抗</th>
                <td colSpan={5}>{data.card.MagicResistance}</td>
              </tr>
              <tr>
                <th>HP补正</th>
                <td>{data.card.MaxHPMod / 100}</td>
                <th>Atk补正</th>
                <td>{data.card.AtkMod / 100}</td>
                <th>Def补正</th>
                <td>{data.card.DefMod / 100}</td>
              </tr>
              <tr>
                <th>好感1</th>
                <td>
                  {data.card.BonusType !== 0 &&
                    BONUS_TYPE.get(data.card.BonusType).replace(
                      '%d',
                      Math.ceil(data.card.BonusNum * 1.2),
                    )}
                </td>
                <th>好感2</th>
                <td>
                  {data.card.BonusType2 !== 0 &&
                    BONUS_TYPE.get(data.card.BonusType2).replace(
                      '%d',
                      Math.ceil(data.card.BonusNum2 * 1.2),
                    )}
                </td>
                <th>好感150</th>
                <td>
                  {data.card.BonusType3 !== 0 &&
                    BONUS_TYPE.get(data.card.BonusType3).replace(
                      '%d',
                      Math.ceil(data.card.BonusNum3),
                    )}
                </td>
              </tr>
            </tbody>
          </table>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>职业名</th>
                <th>等级</th>
                <th>HP</th>
                <th>攻击</th>
                <th>防御</th>
                <th>射程</th>
                <th>档数</th>
                <th>Cost</th>
              </tr>
            </thead>
            <thead>
              {getStatus(data.card).map((st, index) => (
                <React.Fragment key={st.ClassID}>
                  <tr>
                    <td rowSpan={2}>
                      {st.Type === 'Evo2a' && (
                        <span style={{ color: '#1890ff' }}>(A) </span>
                      )}
                      {st.Type === 'Evo2b' && (
                        <span style={{ color: '#52c41a' }}>(B) </span>
                      )}
                      {st.Name}
                    </td>
                    <td>1</td>
                    <td>{st.HP[0]}</td>
                    <td>{st.Atk[0]}</td>
                    <td>{st.Def[0]}</td>
                    <td rowSpan={2}>{st.range}</td>
                    <td rowSpan={2}>{st.BlockNum}</td>
                    <td rowSpan={2}>
                      {st.Cost[0]}/{st.Cost[1]}
                    </td>
                  </tr>
                  <tr>
                    <td>{st.maxLevelUnit}</td>
                    <td>{st.HP[1]}</td>
                    <td>{st.Atk[1]}</td>
                    <td>{st.Def[1]}</td>
                  </tr>
                </React.Fragment>
              ))}
            </thead>
          </table>

          <Row gutter={8}>
            <Col md={12} sm={24}>
              <SkillTable skills={data.card.Skills} />
            </Col>
            <Col md={12} sm={24}>
              <AbilityTable abilities={data.card.Abilities} />
            </Col>
          </Row>

          <ClassTable
            isTabletOrMobile={isTabletOrMobile}
            classes={data.card.Classes}
          />

          {data.card.Dots && (
            <div>
              <h2>点阵</h2>
              <Row gutter={8}>
                {(JSON.parse(data.card.Dots) as Dot[]).map((dot, index) => (
                  <Col key={index} sm={24} md={12}>
                    <DotTable dot={dot} card={data.card} />
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Unit;
