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
    <Row
      style={style}
      className="list-card"
      onClick={() => showUnit(card.CardID)}
    >
      <Col span={1}>{card.CardID}</Col>
      <Col span={1}>
        <span className={`gender gender-${card.Kind}`} />
      </Col>
      <Col span={1}>
        <span
          className={`rarity-circle rarity-circle-${card.Rare} filter`}
          onClick={e => {
            e.stopPropagation();
            setSearch(card.Rare, 'Rare');
          }}
        />
      </Col>
      <Col span={5} className="important">
        {card.Name}
      </Col>
      <Col span={5} className="filter">
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
            <Tag color="yellow">{card.Assign}</Tag>
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
