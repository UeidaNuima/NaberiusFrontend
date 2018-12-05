import * as React from 'react';
import { Layout, Row, Col, Spin, Pagination, Input, Affix } from 'antd';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import ClassListCard from '../../ClassListCard';

const { Content } = Layout;
const { Search } = Input;

interface ClassListStates {
  currentPage: number;
  search: string;
}

export default class ClassList extends React.Component<any, ClassListStates> {
  public state = {
    currentPage: 1,
    search: '',
  };
  public classes: any[] = [];

  public setSearch(value: string) {
    this.setState({ search: value, currentPage: 1 });
  }

  public classFilter = (unitClass: any) => {
    return JSON.stringify(unitClass).includes(this.state.search);
  };

  public onHashChange = (e: Event) => {
    e.preventDefault();
    const hash = window.location.hash.slice(1);
    const classID = Number.parseInt(hash, 10);
    const index = _.findIndex(this.classes, ['ClassID', classID]);
    if (index >= 0) {
      this.setState({ currentPage: Math.floor(index / 50) + 1 }, () => {
        const element = document.getElementById(classID.toString());
        if (element) {
          window.scrollTo(0, element.offsetTop);
          element.style.backgroundColor = '#ff0';
          setTimeout(() => {
            element.style.backgroundColor = '#fff';
          }, 500);
        }
      });
    }
  };

  public componentDidMount() {
    window.addEventListener('hashchange', this.onHashChange, false);
  }

  public componentWillUnmount() {
    window.removeEventListener('hashchange', this.onHashChange, false);
  }

  public shouldComponentUpdate(nextProps: any, nextState: ClassListStates) {
    if (nextState.currentPage === this.state.currentPage) {
      return false;
    }
    return true;
  }

  public render() {
    return (
      <Query
        onCompleted={() => {
          this.onHashChange(new Event('dummy'));
        }}
        query={gql`
          query {
            classes {
              ClassID
              Name
              Explanation
              JobChange
              JobChangeMaterial1
              JobChangeMaterial2
              JobChangeMaterial3
              Data_ExtraAwakeOrb1
              Data_ExtraAwakeOrb2
              AwakeType1
              AwakeType2
              NickName
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          if (data.classes) {
            this.classes = data.classes.slice();
            this.classes.forEach((unitClass: any) => {
              if (unitClass.JobChange) {
                const index = _.findIndex(this.classes, [
                  'ClassID',
                  unitClass.JobChange,
                ]);
                if (index !== 0) {
                  this.classes[index] = {
                    ...this.classes[index],
                    notBase: true,
                  };
                }
              } else if (unitClass.AwakeType1) {
                const index1 = _.findIndex(this.classes, [
                  'ClassID',
                  unitClass.AwakeType1,
                ]);
                if (index1 !== 0) {
                  this.classes[index1] = {
                    ...this.classes[index1],
                    notBase: true,
                  };
                }
                const index2 = _.findIndex(this.classes, [
                  'ClassID',
                  unitClass.AwakeType2,
                ]);
                if (index2 !== 0) {
                  this.classes[index2] = {
                    ...this.classes[index2],
                    notBase: true,
                  };
                }
              }
            });
          }

          return (
            <Content className="container">
              <Spin spinning={loading}>
                <Search
                  placeholder="搜索职业"
                  value={this.state.search}
                  onChange={event => {
                    this.setSearch(event.target.value);
                  }}
                  enterButton
                />
                <Affix>
                  <Row className="sorter-block">
                    <Col span={2}>#</Col>
                    <Col span={3}>职业</Col>
                    <Col span={3}>转职目标</Col>
                    <Col span={6}>转职素材</Col>
                    <Col span={5}>珠子</Col>
                    <Col span={5}>二觉目标</Col>
                  </Row>
                </Affix>
                {data.classes &&
                  this.classes
                    .filter(this.classFilter)
                    .slice(
                      50 * (this.state.currentPage - 1),
                      50 * this.state.currentPage,
                    )
                    .map((unitClass: any) => {
                      return (
                        <ClassListCard
                          class={unitClass}
                          classes={this.classes}
                          key={unitClass.ClassID}
                          onHashChange={this.onHashChange}
                        />
                      );
                    })}
                {data.classes && (
                  <Pagination
                    defaultCurrent={1}
                    defaultPageSize={50}
                    current={this.state.currentPage}
                    onChange={page => this.setState({ currentPage: page })}
                    total={data.classes.filter(this.classFilter).length}
                  />
                )}
              </Spin>
            </Content>
          );
        }}
      </Query>
    );
  }
}
