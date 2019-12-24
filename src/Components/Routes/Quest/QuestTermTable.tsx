import React from 'react';
import { QuestTermConfig } from 'interfaces';
import styles from './Quest.module.less';

const QuestTermTable: React.FC<{ terms: QuestTermConfig[] }> = ({ terms }) => {
  return (
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
        </tr>
        <tr>
          <th colSpan={5}>cmd</th>
        </tr>
      </thead>
      <tbody>
        {terms.map((term, index) => (
          <React.Fragment key={index}>
            <tr
              style={{
                borderBottom: term.Data_Expression
                  ? undefined
                  : '2px solid #e8e8e8',
              }}
            >
              <td>{term.Type_Influence}</td>
              <td>{term.Data_Param1}</td>
              <td>{term.Data_Param2}</td>
              <td>{term.Data_Param3}</td>
              <td>{term.Data_Param4}</td>
            </tr>
            {term.Data_Expression && (
              <tr style={{ borderBottom: '2px solid #e8e8e8' }}>
                <td colSpan={5}>{term.Data_Expression}</td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
};

export default QuestTermTable;
