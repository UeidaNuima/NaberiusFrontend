import React, { useState, useRef, useEffect } from 'react';
import { QuestTermConfig } from 'interfaces';
import styles from './Quest.module.less';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Input, message, Spin } from 'antd';
import classNames from 'classnames';

const QuestConfigTableRows: React.FC<{ config: QuestTermConfig }> = ({
  config,
}) => {
  const [value, setValue] = useState(config.Comment || '');

  const [setQuestConfigMeta, { loading, data }] = useMutation<{
    QuestConfigMeta?: { TypeID: number; Comment: string };
  }>(
    gql`
      mutation($TypeID: Int!, $Comment: String) {
        QuestConfigMeta(TypeID: $TypeID, Comment: $Comment) {
          TypeID
          Comment
        }
      }
    `,
    {
      onCompleted: d => {
        setValue(d?.QuestConfigMeta?.Comment || '');
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
    await setQuestConfigMeta({
      variables: { TypeID: config.Type_Influence, Comment: value },
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
              ? data.QuestConfigMeta?.Comment
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
              {data ? data.QuestConfigMeta?.Comment : config.Comment}
            </div>
          )}
        </td>
      </tr>
      <tr>
        <td>{config.Type_Influence}</td>
        <td>{config.Data_Param1}</td>
        <td>{config.Data_Param2}</td>
        <td>{config.Data_Param3}</td>
        <td>{config.Data_Param4}</td>
      </tr>

      {!!config.Data_Expression && (
        <tr style={{ borderBottom: '2px solid #e8e8e8' }}>
          <td colSpan={5}>{config.Data_Expression}</td>
        </tr>
      )}
    </tbody>
  );
};

const QuestTermTable: React.FC<{ terms: QuestTermConfig[] }> = ({ terms }) => {
  return (
    <table
      className={styles.table}
      style={{
        margin: -1,
        width: 'calc(100% + 2px)',
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
        </tr>
        <tr>
          <th colSpan={5}>cmd</th>
        </tr>
      </thead>
      {terms.map((term, index) => (
        <QuestConfigTableRows key={index} config={term} />
      ))}
    </table>
  );
};

export default QuestTermTable;
