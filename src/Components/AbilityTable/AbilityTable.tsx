import React, { useState } from 'react';
import styles from './AbilityTable.module.less';
import { renderDescription } from '../../utils';
import { Button, Row, Col } from 'antd';
import { AbilityData } from 'interfaces';
import MediaContext from 'context/MediaContext';
import { Link } from 'react-router-dom';
import { ICO_URL } from 'consts';

const ABILITY_TYPE = {
  Init: '初始',
  Evo: '觉醒',
};

const AbilityTable: React.FC<{ ability: AbilityData }> = ({ ability }) => {
  const { isTabletOrMobile } = MediaContext.useContainer();
  const [showConfigs, setShowConfigs] = useState(false);
  return (
    <table className={styles.table}>
      <tbody>
        {isTabletOrMobile && ability.Type && (
          <tr>
            <td colSpan={3}>{ABILITY_TYPE[ability.Type]}</td>
          </tr>
        )}
        {!isTabletOrMobile && (
          <tr>
            <td>{ABILITY_TYPE[ability.Type]}</td>
            <th>描述</th>
            <th>详细</th>
          </tr>
        )}
        <tr>
          <th style={{ width: '30%' }}>
            <small>#{ability.AbilityID}</small>
            {ability.AbilityName}
          </th>
          <td
            style={{ textAlign: 'left' }}
            dangerouslySetInnerHTML={{
              __html: renderDescription(ability.Text),
            }}
          />
          <td style={{ width: 50 }}>
            <Button
              type="primary"
              size="small"
              onClick={() => setShowConfigs(!showConfigs)}
              icon={showConfigs ? 'up' : 'down'}
            />
          </td>
        </tr>
        {showConfigs && (
          <tr>
            <td colSpan={3}>
              <Row gutter={8}>
                <Col xs={24} md={12}>
                  <table
                    className={styles.table}
                    style={{
                      tableLayout: 'fixed',
                    }}
                  >
                    <tbody>
                      <tr>
                        <th style={{ width: '6em' }}>拥有的卡</th>
                        <td>
                          {ability.Cards.sort(
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
                    </tbody>
                  </table>
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
                      {ability.Configs.map((config, index) => (
                        <React.Fragment key={index}>
                          <tr
                            style={{
                              borderBottom:
                                config._Command !== '' ||
                                config._ActivateCommand !== ''
                                  ? 'none'
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
                          {(config._Command !== '' ||
                            config._ActivateCommand !== '') && (
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

export default AbilityTable;
