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
  Select,
} from 'antd';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Card } from './types';
import UnitListCard from '../../UnitListCard';
import './index.less';

const { Content } = Layout;
const { Search } = Input;

interface Data {
  cards: Card[];
}

interface UnitListStates {
  sorter: string;
  order: boolean;
  searchType: string;
  search: string;
  currentPage: number;
}

export default class UnitList extends React.Component<
  RouteComponentProps,
  UnitListStates
> {
  public readonly state: UnitListStates = {
    sorter: 'CardID',
    order: true,
    searchType: 'all',
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
      <div style={{ cursor: 'pointer' }} onClick={() => this.setSorter(sorter)}>
        {title}
        {this.state.sorter === sorter && (
          <Icon type={this.state.order ? 'caret-down' : 'caret-up'} />
        )}
      </div>
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
    const { searchType } = this.state;
    if (searchType !== 'all') {
      const sourceValue = this.getParam(card, searchType);
      let parsedValue: number | string = searchString;
      if (typeof sourceValue === 'number') {
        parsedValue = Number.parseInt(searchString, 10);
      }
      return sourceValue === parsedValue;
    }

    return JSON.stringify(card).includes(this.state.search);
  };

  /**
   * 点击搜索按钮的回调
   */
  public setSearch = (search: string, searchType?: string) => {
    this.setState(state => ({
      search,
      searchType: searchType || state.searchType,
      currentPage: 1,
    }));
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
              Class {
                ClassInit {
                  Name
                }
              }
            }
          }
        `}
      >
        {({ loading, data }) => {
          return (
            <Spin spinning={loading}>
              <Content className="unitListContent">
                <Search
                  placeholder="搜索单位"
                  value={this.state.search}
                  onChange={event => {
                    this.setSearch(event.target.value);
                  }}
                  enterButton
                  addonBefore={
                    <Select
                      value={this.state.searchType}
                      onChange={(value: string) => {
                        console.log(value);
                        this.setState({ searchType: value });
                      }}
                      style={{ width: 90 }}
                    >
                      <Select.Option value="all">全部</Select.Option>
                      <Select.Option value="Rare">稀有</Select.Option>
                      <Select.Option value="Name">名称</Select.Option>
                      <Select.Option value="Race">种族</Select.Option>
                      <Select.Option value="Assign">出身</Select.Option>
                      <Select.Option value="Identity">不死</Select.Option>
                      <Select.Option value="Class.ClassInit.Name">
                        职业
                      </Select.Option>
                      <Select.Option value="Illust">画师</Select.Option>
                    </Select>
                  }
                />
                <Affix>
                  <Row className="sorter-block">
                    <Col span={1}>{this.genSorter('#', 'CardID')}</Col>
                    <Col span={1}>{this.genSorter('性别', 'Kind')}</Col>
                    <Col span={1}>{this.genSorter('稀有', 'Rare')}</Col>
                    <Col span={5}>{this.genSorter('名称', 'Name')}</Col>
                    <Col span={5}>{this.genSorter('种族', 'Race')}</Col>
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
                          setSearch={this.setSearch}
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
              </Content>
            </Spin>
          );
        }}
      </Query>
    );
  }
}
