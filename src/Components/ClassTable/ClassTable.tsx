import React, { useState, useEffect, useRef } from 'react';
import styles from './ClassTable.module.less';
import { renderDescription } from '../../utils';
import { Button, Row, Col, Select, Spin, Tag, message } from 'antd';
import { ClassData } from 'interfaces';
import MediaContext from 'context/MediaContext';
import { Link } from 'react-router-dom';
import { ICO_URL } from 'consts';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import MissileTable from 'Components/MissileTable';

const CLASS_TYPE = {
  Init: '初始',
  CC: 'CC',
  Evo: '觉醒',
  Evo2a: '二觉A',
  Evo2b: '二觉B',
};

const ClassTable: React.FC<{
  classData: ClassData;
  onCompleted?: () => any;
}> = ({ classData, onCompleted }) => {
  const [showConfigs, setShowConfigs] = useState(false);

  const { isTabletOrMobile } = MediaContext.useContainer();

  const [setClassMeta, { loading }] = useMutation(
    gql`
      mutation($ClassID: Int!, $NickNames: [String!]!) {
        ClassMeta(ClassID: $ClassID, NickNames: $NickNames) {
          NickNames
        }
      }
    `,
    { onCompleted },
  );

  const [value, setValue] = useState(classData.NickNames || []);
  const [editing, setEditing] = useState(false);
  const ref = useRef<Select<string[]>>(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
    }
  }, [editing]);

  const handleSave = async () => {
    await setClassMeta({
      variables: { ClassID: classData.ClassID, NickNames: value },
    });
    message.success('修改成功');
    setEditing(false);
  };

  return (
    <table className={styles.table}>
      <tbody>
        {isTabletOrMobile && classData.Type && (
          <tr>
            <td colSpan={isTabletOrMobile ? 3 : 5}>
              {CLASS_TYPE[classData.Type]}
            </td>
          </tr>
        )}
        <tr>
          {!isTabletOrMobile && (
            <>
              <td style={{ width: 200 }}>{CLASS_TYPE[classData.Type]}</td>
              <th>描述</th>
            </>
          )}
          <th style={{ width: isTabletOrMobile ? '33.33%' : 100 }}>后摇</th>
          <th style={{ width: isTabletOrMobile ? '33.33%' : 100 }}>被动</th>
          <th style={{ width: isTabletOrMobile ? '33.33%' : 100 }}>详细</th>
        </tr>
        <tr>
          <th>
            <small>#{classData.ClassID}</small>
            {classData.Name}
          </th>
          <td
            colSpan={isTabletOrMobile ? 2 : 1}
            style={{ textAlign: 'left' }}
            dangerouslySetInnerHTML={{
              __html: renderDescription(classData.Explanation),
            }}
          />
          {!isTabletOrMobile && (
            <>
              <td>{classData.AttackWait}</td>
              <td>{classData.ClassAbilityPower1}</td>
              <td>
                <Button
                  type="primary"
                  size="small"
                  onClick={() => setShowConfigs(!showConfigs)}
                  icon={showConfigs ? 'up' : 'down'}
                />
              </td>
            </>
          )}
        </tr>
        {isTabletOrMobile && (
          <tr>
            <td>{classData.AttackWait}</td>
            <td>{classData.ClassAbilityPower1}</td>
            <td>
              <Button
                type="primary"
                size="small"
                onClick={() => setShowConfigs(!showConfigs)}
                icon={showConfigs ? 'up' : 'down'}
              />
            </td>
          </tr>
        )}
        {showConfigs && (
          <tr>
            <td colSpan={isTabletOrMobile ? 3 : 5}>
              <Row gutter={8}>
                <Col xs={24} md={12}>
                  <table
                    style={{
                      tableLayout: 'fixed',
                    }}
                    className={styles.table}
                  >
                    <tbody>
                      <tr>
                        <th style={{ width: '6em' }}>昵称</th>
                        <td>
                          {editing ? (
                            <Spin spinning={loading}>
                              <Select<string[]>
                                mode="tags"
                                tokenSeparators={[',', ' ']}
                                ref={ref}
                                value={value}
                                onChange={v => setValue(v)}
                                onBlur={handleSave}
                                style={{ width: '100%' }}
                              />
                            </Spin>
                          ) : (
                            <div
                              onClick={() => setEditing(true)}
                              className={styles.fakeInput}
                            >
                              {classData.NickNames &&
                                classData.NickNames.map((name, index) => (
                                  <Tag key={index}>{name}</Tag>
                                ))}
                            </div>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>拥有的卡</th>
                        <td>
                          {classData.Cards.sort(
                            (c1, c2) => c2.Rare - c1.Rare,
                          ).map(card => (
                            <Link key={card.CardID} to={`/unit/${card.CardID}`}>
                              <img
                                alt={card.CardID.toString()}
                                style={{ width: 40, marginLeft: 8 }}
                                src={`${ICO_URL}/0/${card.CardID}.png`}
                              />
                              {card.Name}
                            </Link>
                          ))}
                        </td>
                      </tr>
                      <tr>
                        <th>职业类型</th>
                        <td>{classData.AttackAttribute}</td>
                      </tr>
                    </tbody>
                  </table>

                  {classData.Missile && (
                    <MissileTable missile={classData.Missile} compact />
                  )}
                </Col>
                <Col xs={24} md={12}>
                  <table
                    className={styles.table}
                    style={{
                      tableLayout: 'fixed',
                    }}
                  >
                    <thead>
                      <tr>
                        <th>类型</th>
                        <th>p1</th>
                        <th>p2</th>
                        <th>p3</th>
                        <th>p4</th>
                        <th>发动</th>
                        <th>对象</th>
                      </tr>
                      <tr>
                        <th colSpan={3}>条件</th>
                        <th colSpan={4}>发动条件</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classData.ClassAbilityConfigs.map((config, index) => (
                        <React.Fragment key={index}>
                          <tr
                            style={{
                              borderBottom:
                                config._Command || config._ActivateCommand
                                  ? undefined
                                  : '2px solid #e8e8e8',
                            }}
                          >
                            <td>{config._InfluenceType}</td>
                            <td>{config._Param1}</td>
                            <td>{config._Param2}</td>
                            <td>{config._Param3}</td>
                            <td>{config._Param4}</td>
                            <td>{config._InvokeType}</td>
                            <td>{config._TargetType}</td>
                          </tr>
                          {!!(config._Command || config._ActivateCommand) && (
                            <tr style={{ borderBottom: '2px solid #e8e8e8' }}>
                              <td
                                colSpan={3}
                                style={{
                                  wordWrap: 'break-word',
                                }}
                              >
                                {config._Command}
                              </td>
                              <td
                                colSpan={4}
                                style={{
                                  wordWrap: 'break-word',
                                }}
                              >
                                {config._ActivateCommand}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </Col>
              </Row>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default ClassTable;
