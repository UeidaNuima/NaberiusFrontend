import React, { useState, useRef, useEffect } from 'react';
import styles from './Unit.module.less';
import { UnitSpeciatyConfig } from 'interfaces';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Input, message, Spin } from 'antd';
import classNames from 'classnames';

const UnitSpecialtyRows: React.FC<{ config: UnitSpeciatyConfig }> = ({
  config,
}) => {
  const [value, setValue] = useState(config.Comment || '');

  const [setUnitConfigMeta, { loading, data }] = useMutation<{
    UnitConfigMeta?: { TypeID: number; Comment: string };
  }>(
    gql`
      mutation($TypeID: Int!, $Comment: String) {
        UnitConfigMeta(TypeID: $TypeID, Comment: $Comment) {
          TypeID
          Comment
        }
      }
    `,
    {
      onCompleted: d => {
        setValue(d?.UnitConfigMeta?.Comment || '');
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
    await setUnitConfigMeta({
      variables: { TypeID: config.Type_Specialty, Comment: value },
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
              ? data.UnitConfigMeta?.Comment
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
              {data ? data.UnitConfigMeta?.Comment : config.Comment}
            </div>
          )}
        </td>
      </tr>

      <tr>
        <td>{config.Type_Specialty}</td>
        <td>{config.Value_Specialty}</td>
        <td>{config.Value_Param1}</td>
        <td>{config.Value_Param2}</td>
        <td>{config.Value_Param3}</td>
        <td>{config.Value_Param4}</td>
      </tr>
      {!!config.Command && (
        <tr>
          <td colSpan={6}>{config.Command}</td>
        </tr>
      )}
    </tbody>
  );
};

const UnitSpecialtyTable: React.FC<{ configs: UnitSpeciatyConfig[] }> = ({
  configs,
}) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>类型</th>
          <th>强度</th>
          <th>p1</th>
          <th>p2</th>
          <th>p3</th>
          <th>p4</th>
        </tr>
        <tr>
          <th colSpan={6}>cmd</th>
        </tr>
      </thead>
      {configs.map((config, index) => (
        <UnitSpecialtyRows config={config} key={index} />
      ))}
    </table>
  );
};

export default UnitSpecialtyTable;
