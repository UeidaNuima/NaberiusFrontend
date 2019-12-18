import React, { useState } from 'react';
import styles from './Unit.module.less';
import { renderDescription } from '../../../utils';
import { Button, Input } from 'antd';
import { ClassData } from 'interfaces';

const CLASS_TYPE = {
  Init: '初始',
  CC: 'CC',
  Evo: '觉醒',
  Evo2a: '二觉A',
  Evo2b: '二觉B',
};

const SingleClassTable: React.FC<{
  classData: ClassData;
  isTabletOrMobile: boolean;
}> = ({ classData, isTabletOrMobile }) => {
  const [showConfigs, setShowConfigs] = useState(false);

  return (
    <table className={styles.table}>
      <tbody>
        {isTabletOrMobile && (
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
          <th>{classData.Name}</th>
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
            <td colSpan={isTabletOrMobile ? 3 : 5} style={{ padding: 0 }}>
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
                  {classData.ClassAbilityConfigs.map((config, index) => (
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
                      {(config._Command || config._ActivateCommand) && (
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

const ClassTable: React.FC<{
  classes: ClassData[];
  isTabletOrMobile: boolean;
}> = ({ classes, isTabletOrMobile }) => {
  return (
    <div>
      <h2>职业</h2>
      {classes.map(cl => (
        <SingleClassTable
          isTabletOrMobile={isTabletOrMobile}
          classData={cl}
          key={cl.ClassID}
        />
      ))}
    </div>
  );
};

export default ClassTable;
