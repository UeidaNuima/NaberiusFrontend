import React, { useState } from 'react';
import { Button, Icon, Tag, Radio, Row, Col } from 'antd';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import useRouter from 'use-react-router';
import { BASE_GAME_URL, ICO_URL, BONUS_TYPE } from 'consts';
import styles from './Unit.module.less';
import { Data, query } from './types';
import Rarity from 'Components/Rarity';
import Gender from 'Components/Gender';
import Loading from 'Components/Loading';
import { useQuery } from '@apollo/react-hooks';
import classNames from 'classnames';
import SkillTable from 'Components/SkillTable';
import AbilityTable from 'Components/AbilityTable';
import ClassTable from 'Components/ClassTable';
import { Card, ClassData } from 'interfaces';
import DotTable from 'Components/DotTable';
import ConneNameInput from './ConneNameInput';
import NickNamesInput from './NickNamesInput';
import MediaContext from 'context/MediaContext';

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
  card: Card,
  nearRange?: { [k: string]: number },
) {
  let maxLevelUnit = 0;
  switch (classData.Type) {
    case 'Evo2a':
    case 'Evo2b':
      maxLevelUnit = 99;
      break;
    case 'Evo':
      if (card.Rare === 3) maxLevelUnit = 80;
      if (card.Rare === 4) maxLevelUnit = 90;
      if (card.Rare === 5) maxLevelUnit = 99;
      if (card.Rare === 7) maxLevelUnit = 85;
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
      if (
        classData.Data_ExtraAwakeOrbs.length === 0 &&
        classData.JobChange !== 0
      ) {
        maxLevelUnit = 50;
        break;
      }
    // eslint-disable-next-line no-fallthrough
    case 'CC':
      if (card.Rare === 2) maxLevelUnit = 55;
      if (card.Rare === 3) maxLevelUnit = 60;
      if (card.Rare === 4) maxLevelUnit = 70;
      if (card.Rare === 5) maxLevelUnit = classData.MaxLevel;
      if (card.Rare === 7) maxLevelUnit = 65;
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

const getStatus = (card: Data['Card']) => {
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

  const { isTabletOrMobile } = MediaContext.useContainer();

  const { loading, data, refetch } = useQuery<Data>(query, {
    variables: { id: CardID },
  });

  if (data) {
    if (data.Card.Rare >= 10)
      data.Card.Classes = data.Card.Classes.filter(cl => cl.Type === 'Evo');
  }

  return (
    <div className={styles.container}>
      <Loading spinning={loading}>
        {data && !_.isEmpty(data) && (
          <div>
            <h1 className="unit-title">
              <Link to={`/quest/${CardID - 1}`}>
                <Icon type="left" />
              </Link>

              <Gender gender={data.Card.Kind} />
              <div style={{ display: 'inline-block' }}>
                <Rarity rare={data.Card.Rare} />
                <div>{data.Card.Name}</div>
              </div>
              <Link to={`/unit/${CardID + 1}`}>
                <Icon type="right" />
              </Link>
            </h1>
            <p>
              {data.Card.RaceName && (
                <span>
                  <Tag>{data.Card.RaceName}</Tag>
                </span>
              )}
              {data.Card.AssignName && (
                <span>
                  <Tag color="magenta">{data.Card.AssignName}</Tag>
                </span>
              )}
              {data.Card.IdentityName && (
                <span>
                  <Tag color="black">{data.Card.IdentityName}</Tag>
                </span>
              )}
              {data.Card.GenusName && (
                <span>
                  <Tag color="blue">{data.Card.GenusName}</Tag>
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
                    {data.Card.ImageStand.map((_, index) => (
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
                    {data.Card.ImageCG.map((_, index) => (
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
                    {data.Card.HarlemTextA.map((_, index) => (
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
                    {data.Card.HarlemTextR.map((_, index) => (
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
                            ? data.Card.HarlemTextA[currentText]
                            : data.Card.HarlemTextR[currentText - 10]
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
                        ? data.Card.ImageStand[currentImg]
                        : data.Card.ImageCG[currentImg - 10])
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
                  <td colSpan={5}>{data.Card.IllustName}</td>
                </tr>
                <tr>
                  <th>昵称</th>
                  <td colSpan={5}>
                    <NickNamesInput
                      NickNames={data.Card.NickNames}
                      CardID={CardID}
                      onCompleted={refetch}
                    />
                  </td>
                </tr>
                <tr>
                  <th>圆爹名</th>
                  <td colSpan={5}>
                    <ConneNameInput
                      ConneName={data.Card.ConneName}
                      CardID={CardID}
                      onCompleted={refetch}
                    />
                  </td>
                </tr>
                <tr>
                  <th>手料理</th>
                  <td colSpan={5}>{data.Card.HomeCooking}</td>
                </tr>
                <tr>
                  <th>金币</th>
                  <td colSpan={2}>{data.Card.SellPrice}</td>
                  <th>虹水晶</th>
                  <td colSpan={2}>{data.Card._TradePoint}</td>
                </tr>
                <tr>
                  <th>魔抗</th>
                  <td colSpan={5}>{data.Card.MagicResistance}</td>
                </tr>
                <tr>
                  <th>HP补正</th>
                  <td>{data.Card.MaxHPMod / 100}</td>
                  <th>Atk补正</th>
                  <td>{data.Card.AtkMod / 100}</td>
                  <th>Def补正</th>
                  <td>{data.Card.DefMod / 100}</td>
                </tr>
                <tr>
                  <th>好感1</th>
                  <td>
                    {data.Card.BonusType !== 0 &&
                      BONUS_TYPE.get(data.Card.BonusType).replace(
                        '%d',
                        Math.ceil(data.Card.BonusNum * 1.2),
                      )}
                  </td>
                  <th>好感2</th>
                  <td>
                    {data.Card.BonusType2 !== 0 &&
                      BONUS_TYPE.get(data.Card.BonusType2).replace(
                        '%d',
                        Math.ceil(data.Card.BonusNum2 * 1.2),
                      )}
                  </td>
                  <th>好感150</th>
                  <td>
                    {data.Card.BonusType3 !== 0 &&
                      BONUS_TYPE.get(data.Card.BonusType3).replace(
                        '%d',
                        Math.ceil(data.Card.BonusNum3),
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
                {getStatus(data.Card).map((st, index) => (
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

            <div>
              <h2>技能</h2>
              {data.Card.Skills.map((skillWithType, index) => (
                <SkillTable
                  skills={skillWithType.Skills}
                  type={skillWithType.Type}
                  key={index}
                />
              ))}
            </div>

            <div>
              <h2>被动</h2>
              {_.uniqBy(data.Card.Abilities, 'AbilityID').map(ability => (
                <AbilityTable key={ability.AbilityID} ability={ability} />
              ))}
            </div>

            <div>
              <h2>职业</h2>
              {data.Card.Classes.map(cl => (
                <ClassTable
                  classData={cl}
                  key={cl.ClassID}
                  onCompleted={refetch}
                />
              ))}
            </div>

            {data.Card.Dots && (
              <div>
                <h2>点阵</h2>
                <Row gutter={8}>
                  {data.Card.Dots.map((dot, index) => (
                    <Col key={index} sm={24} md={12}>
                      <DotTable
                        dot={dot}
                        CardID={data.Card.CardID}
                        type="Player"
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </div>
        )}
      </Loading>
    </div>
  );
};

export default Unit;
