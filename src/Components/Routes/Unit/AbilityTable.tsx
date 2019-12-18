import React, { useState } from 'react';
import styles from './Unit.module.less';
import { renderDescription } from '../../../utils';
import { Button, Input } from 'antd';
import _ from 'lodash';
import { AbilityData } from 'interfaces';

const ABILITY_TYPE = {
  Init: '初始',
  Evo: '觉醒',
};

const SingleAbilityTable: React.FC<{ ability: AbilityData }> = ({
  ability,
}) => {
  const [showConfigs, setShowConfigs] = useState(false);
  return (
    <table className={styles.table}>
      <tbody>
        <tr>
          <td colSpan={3}>{ABILITY_TYPE[ability.Type]}</td>
        </tr>
        <tr>
          <th style={{ width: '30%' }}>{ability.AbilityName}</th>
          <td
            style={{ textAlign: 'left' }}
            dangerouslySetInnerHTML={{
              __html: renderDescription(ability.Text),
            }}
          />
          <td style={{ width: 20 }}>
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
            <td colSpan={3} style={{ padding: 0 }}>
              <table
                className={styles.table}
                style={{
                  margin: -1,
                  width: 'calc(100% + 2px)',
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
                      <tr>
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
                        <tr>
                          <td colSpan={3}>{config._Command}</td>
                          <td colSpan={4}>{config._ActivateCommand}</td>
                        </tr>
                      )}
                      <tr style={{ borderBottom: '2px solid #e8e8e8' }}>
                        <td colSpan={7}>
                          <Input />
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const AbilityTable: React.FC<{ abilities: AbilityData[] }> = ({
  abilities,
}) => {
  return (
    <div>
      <h2>被动</h2>
      {_.uniqBy(abilities, 'AbilityID').map(ability => (
        <SingleAbilityTable key={ability.AbilityID} ability={ability} />
      ))}
    </div>
  );
};

export default AbilityTable;
