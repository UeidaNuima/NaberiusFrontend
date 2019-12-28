import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Spin, Input, message } from 'antd';
import styles from './Unit.module.less';

const ConneNameInput: React.FC<{
  ConneName: string;
  CardID: number;
  onCompleted?: () => any;
}> = ({ ConneName, CardID, onCompleted }) => {
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
  const [value, setValue] = useState(ConneName);
  const ref = useRef<Input>(null);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
    }
  }, [editing]);

  const handleSave = async () => {
    await setCardMeta({
      variables: { CardID, ConneName: value },
    });
    message.success('修改成功');
    setEditing(false);
  };

  return editing ? (
    <Spin spinning={setCardMetaLoading}>
      <Input
        ref={ref}
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={handleSave}
        onPressEnter={handleSave}
      />
    </Spin>
  ) : (
    <div onClick={() => setEditing(true)} className={styles.fakeInput}>
      {ConneName}
    </div>
  );
};

export default ConneNameInput;
