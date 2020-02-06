import React, { useState, useRef, useEffect } from 'react';
import styles from './SkillTable.module.less';
import { Button, Row, Col, Input, message, Spin } from 'antd';
import { renderDescription } from '../../utils';
import { SkillData, SkillConfig } from 'interfaces';
import MediaContext from 'context/MediaContext';
import { Link } from 'react-router-dom';
import { ICO_URL } from 'consts';
import classNames from 'classnames';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const SKILL_TYPE = {
  Init: '初始',
  CC: 'CC',
  Evo: '技觉',
};

const SkillConfigTableRows: React.FC<{ config: SkillConfig }> = ({
  config,
}) => {
  const [value, setValue] = useState(config.Comment || '');

  const [setSkillConfigMeta, { loading, data }] = useMutation<{
    SkillConfigMeta?: { TypeID: number; Comment: string };
  }>(
    gql`
      mutation($TypeID: Int!, $Comment: String) {
        SkillConfigMeta(TypeID: $TypeID, Comment: $Comment) {
          TypeID
          Comment
        }
      }
    `,
    {
      onCompleted: d => {
        setValue(d?.SkillConfigMeta?.Comment || '');
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
    await setSkillConfigMeta({
      variables: { TypeID: config.Data_InfluenceType, Comment: value },
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
              ? data.SkillConfigMeta?.Comment
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
              {data ? data.SkillConfigMeta?.Comment : config.Comment}
            </div>
          )}
        </td>
      </tr>
      <tr>
        <td>{config.Data_InfluenceType}</td>
        <td>{config.Data_MulValue}</td>
        <td>{config.Data_MulValue2}</td>
        <td>{config._HoldRatioUpperLimit}</td>
        <td>{config.Data_AddValue}</td>
        <td>{config.Type_Collision}</td>
        <td>{config.Type_CollisionState}</td>
        <td>{config.Data_Target}</td>
      </tr>
      {(config._ExpressionActivate !== '' || config._Expression !== '') && (
        <tr>
          <td
            colSpan={4}
            style={{
              wordWrap: 'break-word',
            }}
          >
            {config._Expression}
          </td>
          <td
            colSpan={4}
            style={{
              wordWrap: 'break-word',
            }}
          >
            {config._ExpressionActivate}
          </td>
        </tr>
      )}
    </tbody>
  );
};

const SkillTableRows: React.FC<{ skill: SkillData }> = ({ skill }) => {
  const [showConfigs, setShowConfigs] = useState(false);
  const { isTabletOrMobile } = MediaContext.useContainer();
  const secondRow = (
    <>
      <td>{skill.LevelMax}</td>
      <td>{skill.ContTimeMax}</td>
      <td>{skill.WaitTime - skill.LevelMax}</td>
      <td>{skill.PowerMax}</td>
      <td>
        <Button
          type="primary"
          size="small"
          onClick={() => setShowConfigs(!showConfigs)}
          icon={showConfigs ? 'up' : 'down'}
        />
      </td>
    </>
  );
  return (
    <React.Fragment>
      <tr>
        <th colSpan={isTabletOrMobile ? 2 : 1}>
          <small>#{skill.SkillID}</small>
          {skill.SkillName}
        </th>
        <td
          colSpan={isTabletOrMobile ? 3 : 1}
          style={{ textAlign: 'left' }}
          dangerouslySetInnerHTML={{
            __html: renderDescription(skill.Text),
          }}
        />
        {!isTabletOrMobile && secondRow}
      </tr>
      {isTabletOrMobile && <tr>{secondRow}</tr>}
      {showConfigs && (
        <tr>
          <td colSpan={isTabletOrMobile ? 5 : 7}>
            <Row gutter={8}>
              <Col xs={24} md={12}>
                <table
                  className={styles.table}
                  style={{ tableLayout: 'fixed' }}
                >
                  <tbody>
                    <tr>
                      <th style={{ width: '6em' }}>拥有的卡</th>
                      <td>
                        {skill.Cards.sort((c1, c2) => c2.Rare - c1.Rare).map(
                          card => (
                            <Link key={card.CardID} to={`/unit/${card.CardID}`}>
                              <img
                                alt={card.CardID.toString()}
                                style={{ width: 40, marginLeft: 8 }}
                                src={`${ICO_URL}/0/${card.CardID}.png`}
                              />
                              {card.Name}
                            </Link>
                          ),
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Col>
              <Col xs={24} md={12}>
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
                      <th>効果</th>
                      <th>差分</th>
                      <th>固定</th>
                      <th>加算</th>
                      <th>冲突</th>
                      <th>状态</th>
                      <th>对象</th>
                    </tr>
                    <tr>
                      <th colSpan={4}>条件</th>
                      <th colSpan={4}>发动条件</th>
                    </tr>
                  </thead>
                  {skill.Configs.map((config, index) => (
                    <SkillConfigTableRows config={config} key={index} />
                  ))}
                </table>
              </Col>
            </Row>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
};

const SkillTable: React.FC<{
  skills: SkillData[];
  type?: keyof typeof SKILL_TYPE;
}> = ({ skills, type }) => {
  const { isTabletOrMobile } = MediaContext.useContainer();
  return (
    <table className={styles.table}>
      <thead>
        {type && (
          <tr>
            <td colSpan={7}>{SKILL_TYPE[type]}</td>
          </tr>
        )}
        <tr>
          {!isTabletOrMobile && (
            <>
              <td style={{ width: 200 }} />
              <th>描述</th>
            </>
          )}
          <th style={{ width: isTabletOrMobile ? '20%' : 60 }}>等级</th>
          <th style={{ width: isTabletOrMobile ? '20%' : 60 }}>持续</th>
          <th style={{ width: isTabletOrMobile ? '20%' : 60 }}>再动</th>
          <th style={{ width: isTabletOrMobile ? '20%' : 60 }}>强度</th>
          <th style={{ width: isTabletOrMobile ? '20%' : 60 }}>详细</th>
        </tr>
      </thead>
      <tbody>
        {skills.map((skill, index) => (
          <SkillTableRows key={index} skill={skill} />
        ))}
      </tbody>
    </table>
  );
};

export default SkillTable;
