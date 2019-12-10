import React, { useState } from 'react';
import { SkillWithType, SkillData } from './type';
import styles from './Unit.module.less';
import { Button, Input } from 'antd';
import { renderDescription } from '../../../utils';

const SKILL_TYPE = {
  Init: '初始',
  CC: 'CC',
  Evo: '技觉',
};

const SingleSkillTable: React.FC<{ skill: SkillData }> = ({ skill }) => {
  const [showConfigs, setShowConfigs] = useState(false);
  return (
    <React.Fragment>
      <tr>
        <th colSpan={2} style={{ width: '40%' }}>
          {skill.SkillName}
        </th>
        <td
          colSpan={3}
          style={{ textAlign: 'left' }}
          dangerouslySetInnerHTML={{
            __html: renderDescription(skill.Text),
          }}
        />
      </tr>
      <tr>
        <td>{skill.LevelMax}</td>
        <td>{skill.ContTimeMax}</td>
        <td>{skill.WaitTime}</td>
        <td>{skill.PowerMax}</td>
        <td>
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
          <td colSpan={5} style={{ padding: 0 }}>
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
              <tbody>
                {skill.Configs.map((config, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{config.Data_InfluenceType}</td>
                      <td>{config.Data_MulValue}</td>
                      <td>{config.Data_MulValue2}</td>
                      <td>{config.Data_MulValue3}</td>
                      <td>{config.Data_AddValue}</td>
                      <td>{config.Type_Collision}</td>
                      <td>{config.Type_CollisionState}</td>
                      <td>{config.Data_Target}</td>
                    </tr>
                    {(config._ExpressionActivate !== '' ||
                      config._Expression !== '') && (
                      <tr>
                        <td colSpan={4}>{config._Expression}</td>
                        <td colSpan={4}>{config._ExpressionActivate}</td>
                      </tr>
                    )}
                    <tr style={{ borderBottom: '2px solid #e8e8e8' }}>
                      <td colSpan={8}>
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
    </React.Fragment>
  );
};

const SkillTable: React.FC<{
  skills: SkillWithType[];
}> = ({ skills }) => {
  return (
    <div>
      <h2>技能</h2>
      {skills.map(skillWithType => (
        <table key={skillWithType.Type} className={styles.table}>
          <thead>
            <tr>
              <td colSpan={7}>{SKILL_TYPE[skillWithType.Type]}</td>
            </tr>
            <tr>
              <th>等级</th>
              <th>持续</th>
              <th>再动</th>
              <th>强度</th>
              <th>详细</th>
            </tr>
          </thead>
          <tbody>
            {skillWithType.Skills.map((skill, index) => (
              <SingleSkillTable key={index} skill={skill} />
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
};

export default SkillTable;
