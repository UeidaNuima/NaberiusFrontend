import React, { useState, useRef, useEffect } from 'react';
import styles from './AbilityTable.module.less';
import { renderDescription } from '../../utils';
import { Button, Row, Col, Input, message, Spin } from 'antd';
import { AbilityData, AbilityConfig } from 'interfaces';
import MediaContext from 'context/MediaContext';
import { Link } from 'react-router-dom';
import { ICO_URL } from 'consts';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import classNames from 'classnames';

const ABILITY_TYPE = {
  Init: '初始',
  Evo: '觉醒',
};

const AbilityConfigTableRows: React.FC<{ config: AbilityConfig }> = ({
  config,
}) => {
  const [value, setValue] = useState(config.Comment || '');

  const [setAbilityConfigMeta, { loading, data }] = useMutation<{
    AbilityConfigMeta?: { TypeID: number; Comment: string };
  }>(
    gql`
      mutation($TypeID: Int!, $Comment: String) {
        AbilityConfigMeta(TypeID: $TypeID, Comment: $Comment) {
          TypeID
          Comment
        }
      }
    `,
    {
      onCompleted: d => {
        setValue(d?.AbilityConfigMeta?.Comment || '');
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
    await setAbilityConfigMeta({
      variables: { TypeID: config._InfluenceType, Comment: value },
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
              ? data.AbilityConfigMeta?.Comment
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
              {data ? data.AbilityConfigMeta?.Comment : config.Comment}
            </div>
          )}
        </td>
      </tr>
      <tr>
        <td>{config._InfluenceType}</td>
        <td>{config._Param1}</td>
        <td>{config._Param2}</td>
        <td>{config._Param3}</td>
        <td>{config._Param4}</td>
        <td>{config._InvokeType}</td>
        <td>{config._TargetType}</td>
      </tr>
      {(config._Command !== '' || config._ActivateCommand !== '') && (
        <tr>
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
    </tbody>
  );
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
                        <th>发动</th>
                        <th>对象</th>
                      </tr>
                      <tr>
                        <th colSpan={3}>条件</th>
                        <th colSpan={4}>发动条件</th>
                      </tr>
                    </thead>
                    {ability.Configs.map((config, index) => (
                      <AbilityConfigTableRows key={index} config={config} />
                    ))}
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
