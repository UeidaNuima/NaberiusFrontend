import React from 'react';
import _ from 'lodash';
import { RouteComponentProps } from 'react-router-dom';
import {
  Layout,
  Input,
  Row,
  Col,
  Spin,
  Icon,
  Affix,
  Pagination,
  Button,
} from 'antd';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import UnitListCard from '../../UnitListCard';
import './index.less';

const { Content } = Layout;
const { Search } = Input;

interface Data {
  cards: Array<{
    CardID: number;
    Name: string;
    Rare: number;
    Kind: number;
    Illust: number;
    Race: number;
    Assign: number;
    Identity: number;
    NickName: string;
    ConneName: string;
    Class: {
      ClassInit: {
        Name: string;
      };
    };
  }>;
}

interface UnitListStates {
  sorter: string;
  order: boolean;
  search: string;
  currentPage: number;
}

export default class UnitList extends React.Component<
  RouteComponentProps<any>,
  UnitListStates
> {
  public state = {
    sorter: 'CardID',
    order: true,
    search: '',
    currentPage: 1,
  };

  public shouldComponentUpdate(
    nextProps: RouteComponentProps<any>,
    nextStates: UnitListStates,
  ) {
    return !_.isEqual(nextStates, this.state);
  }
  public setSorter = (sorter: string) => {
    if (sorter === this.state.sorter) {
      this.setState({ order: !this.state.order });
    } else {
      this.setState({
        sorter,
        order: true,
      });
    }
  };
  public genSorter = (title: string, sorter: string) => {
    return (
      <Button type="link" onClick={() => this.setSorter(sorter)}>
        {title}{' '}
        {this.state.sorter === sorter && (
          <Icon type={this.state.order ? 'caret-down' : 'caret-up'} />
        )}
      </Button>
    );
  };

  public getParam = (target: any, keys: any) => {
    keys.split('.').forEach((st: string) => (target = target[st]));
    return target;
  };

  public cardSorter = (cardA: any, cardB: any) => {
    const { sorter, order } = this.state;
    const paramA = this.getParam(cardA, sorter);
    const paramB = this.getParam(cardB, sorter);
    if (typeof paramA === 'number') {
      return order ? paramA - paramB : paramB - paramA;
    } else {
      if (paramA > paramB) {
        return order ? 1 : -1;
      } else if (paramA < paramB) {
        return order ? -1 : 1;
      } else {
        return 0;
      }
    }
  };

  public cardFilter = (card: any) => {
    const searchString = this.state.search;
    if (searchString.includes(':')) {
      const [key, value] = searchString.split(':');
      let parsedValue: number | string = value;
      let param: string;
      switch (key) {
        case '稀有':
          param = 'Rare';
          break;
        case '名称':
          param = 'Name';
          break;
        case '种族':
          param = 'Race';
          break;
        case '出身':
          param = 'Assign';
          break;
        case '不死':
          param = 'Identity';
          break;
        case '职业':
          param = 'Class.ClassInit.Name';
          break;
        case '画师':
          param = 'Illust';
          break;
        default:
          param = '';
      }
      const sourceValue = this.getParam(card, param);
      if (typeof sourceValue === 'number') {
        parsedValue = Number.parseInt(value, 10);
      }
      return sourceValue === parsedValue;
    }
    return JSON.stringify(card).includes(this.state.search);
  };

  /**
   * 点击搜索按钮的回调
   */
  public setSearch = (search: string) => {
    this.setState({ search, currentPage: 1 });
  };

  public setTextSearcher = (search: string, event: Event) => {
    event.stopPropagation();
    this.setSearch(search);
  };

  public showUnit = (cardID: number) => {
    this.props.history.push({
      pathname: `/unit/${cardID}`,
      state: { modal: true },
    });
  };

  public render() {
    return (
      <Query<Data>
        query={gql`
          query {
            cards {
              CardID
              Name
              Rare
              Kind
              Illust
              Race
              Assign
              Identity
              NickName
              ConneName
              Class {
                ClassInit {
                  Name
                }
              }
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          return (
            <div>
              <Spin spinning={loading}>
                <Content className="unitListContent">
                  <Search
                    placeholder="搜索单位"
                    value={this.state.search}
                    onChange={event => {
                      this.setSearch(event.target.value);
                    }}
                    enterButton
                  />
                  <div>
                    <Affix>
                      <Row className="sorter-block">
                        <Col span={2}>{this.genSorter('#', 'CardID')}</Col>
                        <Col span={2}>{this.genSorter('性别', 'Kind')}</Col>
                        <Col span={2}>{this.genSorter('稀有', 'Rare')}</Col>
                        <Col span={5}>{this.genSorter('名称', 'Name')}</Col>
                        <Col span={3}>{this.genSorter('种族', 'Race')}</Col>
                        <Col span={5}>
                          {this.genSorter('职业', 'Class.ClassInit.Name')}
                        </Col>
                        <Col span={5}>{this.genSorter('画师', 'Illust')}</Col>
                      </Row>
                    </Affix>
                    {data && data.cards && (
                      <Pagination
                        defaultCurrent={1}
                        defaultPageSize={50}
                        onChange={page => this.setState({ currentPage: page })}
                        total={data.cards.filter(this.cardFilter).length}
                        style={{ marginBottom: 16 }}
                      />
                    )}
                    {data &&
                      data.cards &&
                      data.cards
                        .slice()
                        .sort(this.cardSorter)
                        .filter(this.cardFilter)
                        .slice(
                          50 * (this.state.currentPage - 1),
                          50 * this.state.currentPage,
                        )
                        .map((card: any) => {
                          return (
                            <UnitListCard
                              key={card.CardID}
                              card={card}
                              showUnit={this.showUnit}
                              setTextSearcher={this.setTextSearcher}
                            />
                          );
                        })}
                    {data && data.cards && (
                      <Pagination
                        defaultCurrent={1}
                        defaultPageSize={50}
                        onChange={page => this.setState({ currentPage: page })}
                        total={data.cards.filter(this.cardFilter).length}
                      />
                    )}
                  </div>
                </Content>
              </Spin>
            </div>
          );
        }}
      </Query>
    );
  }
}
