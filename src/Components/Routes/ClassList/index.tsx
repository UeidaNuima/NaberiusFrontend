import * as React from 'react';
import {
  Layout,
  Row,
  Col,
  Spin,
  Pagination,
  Input,
  Affix,
  Popover,
  Alert,
} from 'antd';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import _ from 'lodash';
import ClassListCard from '../../ClassListCard';
import AbilityConfigTable from '../../AbilityConfigTable';

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

  public render() {
    return (
      <Query
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
              ClassAbilityConfig1 {
                _InvokeType
                _TargetType
                _InfluenceType
                _Param1
                _Param2
                _Param3
                _Param4
                _Command
                _ActivateCommand
              }
              ClassAbilityPower1
            }
            abilityConfigMetas {
              ID
              Description
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
              <Alert
                message="由于职业的被动信息和角色的被动一样（via轴），请去被动页面修改被动描述。"
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
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
                        <Popover
                          content={
                            <div>
                              <div className="ant-table ant-table-bordered ant-table-middle">
                                <div className="ant-table-content">
                                  <div className="ant-table-body">
                                    <table>
                                      <thead className="ant-table-thead">
                                        <tr>
                                          <th>职业名</th>
                                          <th>职业描述</th>
                                          <th>被动强度</th>
                                        </tr>
                                      </thead>
                                      <tbody className="ant-table-tbody">
                                        <tr>
                                          <td>{unitClass.Name}</td>
                                          <td>{unitClass.Explanation}</td>
                                          <td>
                                            {unitClass.ClassAbilityPower1}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              {unitClass.ClassAbilityConfig1.length > 0 && (
                                <AbilityConfigTable
                                  style={{ marginTop: 8 }}
                                  configs={unitClass.ClassAbilityConfig1}
                                  configMetas={data.abilityConfigMetas}
                                />
                              )}
                            </div>
                          }
                          key={unitClass.ClassID}
                        >
                          <ClassListCard
                            class={unitClass}
                            classes={this.classes}
                          />
                        </Popover>
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
