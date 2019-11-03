import React from 'react';
import {
  Row,
  Col,
  Icon,
  Input,
  Spin,
  Popover,
  Form,
  Button,
  message,
  Tag,
} from 'antd';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import useForm from 'rc-form-hooks';
import Gender from '../../Gender';
import Rarity from '../../Rarity';
import styles from './UnitList.module.less';
import { ICO_URL } from '../../../consts';

interface UnitListCardProps {
  card: any;
  showUnit: (cardID: number) => void;
  setSearch: (search: string, searchType: string) => void;
  style?: React.CSSProperties;
}

interface FormFields {
  nickName: string;
  conneName: string;
}

const UnitListCard: React.FC<UnitListCardProps> = ({
  card,
  showUnit,
  setSearch,
  style,
}) => {
  return (
    <div style={style} className={styles.listCard}>
      <Row
        type="flex"
        style={{ alignItems: 'center' }}
        onClick={() => showUnit(card.CardID)}
        gutter={8}
      >
        <Col span={1} className={styles.unimportant}>
          {card.CardID}
        </Col>
        <Col span={1}>
          <Gender gender={card.Kind} />
        </Col>
        <Col span={2}>
          <img
            src={`${ICO_URL}/0/${card.CardID}.png`}
            alt={card.CardID}
            height="48"
          />
        </Col>
        <Col span={4}>
          <Rarity rare={card.Rare} />
          <br />
          {card.Name}
        </Col>
        <Col span={5}>
          {card.Race && (
            <span
              onClick={e => {
                e.stopPropagation();
                setSearch(card.Race, 'Race');
              }}
            >
              <Tag>{card.Race}</Tag>
            </span>
          )}
          {card.Assign && (
            <span
              onClick={e => {
                e.stopPropagation();
                setSearch(card.Assign, 'Assign');
              }}
            >
              <Tag color="magenta">{card.Assign}</Tag>
            </span>
          )}
          {card.Identity && (
            <span
              onClick={e => {
                e.stopPropagation();
                setSearch(card.Identity, 'Identity');
              }}
            >
              <Tag color="black">{card.Identity}</Tag>
            </span>
          )}
        </Col>
        <Col
          span={5}
          className="filter"
          onClick={e => {
            e.stopPropagation();
            setSearch(card.Class.ClassInit.Name, 'Class.ClassInit.Name');
          }}
        >
          {card.Class.ClassInit.Name}
        </Col>
        <Col
          span={5}
          className="filter"
          onClick={e => {
            e.stopPropagation();
            setSearch(card.Illust, 'Illust');
          }}
        >
          {card.Illust}
        </Col>
        <Col span={1}>
          <Popover
            trigger="click"
            placement="bottomLeft"
            content={<PopoverContent card={card} />}
          >
            <Icon
              style={{ color: 'black' }}
              onClick={e => e.stopPropagation()}
              type="ellipsis"
            />
          </Popover>
        </Col>
      </Row>
    </div>
  );
};

const PopoverContent: React.FC<{ card: any }> = ({ card }) => {
  const { getFieldDecorator, getFieldsValue } = useForm<FormFields>();
  return (
    <div
      className={`list-card-addon `}
      onClick={e => {
        e.stopPropagation();
      }}
    >
      <Query<any>
        variables={{ id: card.CardID }}
        query={gql`
          query($id: Int!) {
            card(CardID: $id) {
              NickName
              ConneName
            }
          }
        `}
      >
        {({ data, loading: queryLoading }) => (
          <Mutation<
            null,
            {
              CardID: number;
              ConneName: string;
              NickName: string[];
            }
          >
            mutation={gql`
              mutation updateCardMeta(
                $CardID: Int!
                $ConneName: String
                $NickName: [String]
              ) {
                updateCardMeta(
                  CardID: $CardID
                  ConneName: $ConneName
                  NickName: $NickName
                ) {
                  ConneName
                  NickName
                }
              }
            `}
            onCompleted={() => message.success('保存成功')}
          >
            {(updateCardMeta, { loading }) => (
              <Spin spinning={loading || queryLoading}>
                <Form
                  layout="inline"
                  onSubmit={e => {
                    e.preventDefault();
                    console.log('qweqweqwe');
                    const values = getFieldsValue();

                    updateCardMeta({
                      variables: {
                        CardID: card.CardID,
                        ConneName: values.conneName!,
                        NickName: values.nickName!.split(','),
                      },
                    });
                  }}
                >
                  <Form.Item label="昵称">
                    {getFieldDecorator('nickName', {
                      initialValue: data.card ? data.card.NickName : '',
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item label="圆爹名">
                    {getFieldDecorator('conneName', {
                      initialValue: data.card ? data.card.ConneName : '',
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item>
                    <Button htmlType="submit" type="primary">
                      保存
                    </Button>
                  </Form.Item>
                </Form>
              </Spin>
            )}
          </Mutation>
        )}
      </Query>
    </div>
  );
};

export default UnitListCard;
