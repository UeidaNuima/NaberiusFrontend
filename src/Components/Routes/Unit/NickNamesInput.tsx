import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Spin, Select, message, Tag } from 'antd';
import styles from './Unit.module.less';

const NickNamesInput: React.FC<{
  NickNames: string[];
  CardID: number;
  onCompleted?: () => any;
}> = ({ NickNames, CardID, onCompleted }) => {
  const [setCardMeta, { loading: setCardMetaLoading }] = useMutation<{
    CardMeta: { ConneName?: string; NickNames?: string[] };
  }>(
    gql`
      mutation($CardID: Int!, $ConneName: String, $NickNames: [String!]) {
        CardMeta(
          CardID: $CardID
          ConneName: $ConneName
          NickNames: $NickNames
        ) {
          ConneName
          NickNames
        }
      }
    `,
    { onCompleted },
  );
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(NickNames || []);
  const ref = useRef<Select<string[]>>(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
    }
  }, [editing]);

  const handleSave = async () => {
    await setCardMeta({
      variables: { CardID, NickNames: value },
    });
    message.success('修改成功');
    setEditing(false);
  };

  return editing ? (
    <Spin spinning={setCardMetaLoading}>
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
    <div onClick={() => setEditing(true)} className={styles.fakeInput}>
      {NickNames &&
        NickNames.map((name, index) => <Tag key={index}>{name}</Tag>)}
    </div>
  );
};

export default NickNamesInput;
