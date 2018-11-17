import * as React from 'react';
import { Spin, Layout, Col, Row, Pagination, Popover, Input, Tag } from 'antd';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import classNames from 'classnames';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import DescriptionInput from '../../DescriptionInput';
import SkillInfluenceTable from '../../SkillInfluenceTable';
import styles from './index.module.less';

const { Content, Sider } = Layout;
const { Search } = Input;

interface SkillListStates {
  currentPage: number;
  search: string;
  IDFilter: number[];
}

class SkillList extends React.Component<any, SkillListStates> {
  public state = {
    currentPage: 1,
    search: '',
    IDFilter: [],
  };
  public handleIDFilterChange = (newFilter: number[]) => {
    this.setState({ IDFilter: newFilter, currentPage: 1 });
  };
  public setSearch = (search: string) => {
    this.setState({ search, currentPage: 1 });
  };
  public skillFilter = (skill: any) => {
    if (this.state.IDFilter.length > 0) {
      for (const ID of this.state.IDFilter) {
        const index = skill.InfluenceConfig.findIndex(
          (config: any) => config.Data_InfluenceType === ID,
        );
        if (index === -1) {
          return false;
        }
      }
    }
    if (
      this.state.search &&
      !JSON.stringify(skill).includes(this.state.search)
    ) {
      return false;
    }
    return true;
  };
  private findIDindex(ID: number) {
    return this.state.IDFilter.findIndex(fiteredID => fiteredID === ID);
  }
  private handleToggleFilter(ID: number) {
    const index = this.findIDindex(ID);
    const { IDFilter } = this.state;
    if (index > -1) {
      this.setState({
        IDFilter: [...IDFilter.slice(0, index), ...IDFilter.slice(index + 1)],
      });
    } else {
      this.setState({ IDFilter: [...IDFilter, ID] });
    }
  }
  public render() {
    return (
      <Query
        query={gql`
          query {
            skills {
              SkillName
              WaitTime
              ContTimeMax
              PowerMax
              LevelMax
              Text
              InfluenceConfig {
                Description
                Type_Collision
                Type_CollisionState
                Type_ChangeFunction
                Data_Target
                Data_InfluenceType
                Data_MulValue
                Data_MulValue2
                Data_MulValue3
                Data_AddValue
                _HoldRatioUpperLimit
                _Expression
                _ExpressionActivate
              }
              CardHave {
                CardID
                Name
              }
            }
            skillInfluenceMetas {
              ID
              Description
            }
          }
        `}
      >
        {({ loading, error, data }) => {
          let maxInfluenceID = 1;
          if (data.skills) {
            data.skills.forEach((skill: any) => {
              skill.InfluenceConfig.forEach((config: any) => {
                if (config.Data_InfluenceType > maxInfluenceID) {
                  maxInfluenceID = config.Data_InfluenceType;
                }
              });
            });
          }
          return (
            <>
              <Sider className={styles.sider}>
                <Spin spinning={loading}>
                  {data.skillInfluenceMetas &&
                    Array.apply(null, { length: maxInfluenceID }).map(
                      (dummy: any, index: number) => {
                        const influence: any = _.find(
                          data.skillInfluenceMetas,
                          { ID: index + 1 },
                        );

                        return (
                          <DescriptionInput
                            key={index + 1}
                            ID={index + 1}
                            config={influence}
                            mutationFunction="updateSkillInfluenceMeta"
                            active={this.findIDindex(index + 1) > -1}
                            onToggleFilter={() =>
                              this.handleToggleFilter(index + 1)
                            }
                          />
                        );
                      },
                    )}
                </Spin>
              </Sider>
              <Content
                className={classNames(['container', styles.skillListContainer])}
              >
                <Spin spinning={loading}>
                  <div className={styles.tagBar}>
                    {this.state.IDFilter.map(filter => (
                      <Tag
                        color="blue"
                        key={filter}
                        closable
                        onClose={this.handleToggleFilter.bind(this, filter)}
                      >
                        {filter}
                      </Tag>
                    ))}
                  </div>
                  <Search
                    placeholder="搜索单位"
                    value={this.state.search}
                    onChange={event => {
                      this.setSearch(event.target.value);
                    }}
                    enterButton
                  />
                  <Row className="sorter-block">
                    <Col span={4}>技能名</Col>
                    <Col span={8}>效果</Col>
                    <Col span={3}>持续</Col>
                    <Col span={3}>再动</Col>
                    <Col span={3}>技能等级</Col>
                    <Col span={3}>&lt;POW_I&gt;</Col>
                  </Row>
                  {data.skills &&
                    data.skills
                      .filter(this.skillFilter)
                      .slice(
                        50 * (this.state.currentPage - 1),
                        50 * this.state.currentPage,
                      )
                      .map((skill: any, index: number) => (
                        <Popover
                          key={index}
                          content={<SkillInfluenceTable skill={skill} />}
                        >
                          <Row
                            className="list-card"
                            style={{ cursor: 'default' }}
                          >
                            <Col className="important" span={4}>
                              {skill.SkillName}
                            </Col>
                            <Col className="important" span={8}>
                              {skill.Text}
                            </Col>
                            <Col span={3}>{skill.ContTimeMax}</Col>
                            <Col span={3}>{skill.WaitTime}</Col>
                            <Col span={3}>{skill.LevelMax}</Col>
                            <Col span={3}>{skill.PowerMax}</Col>
                            <Col span={24}>
                              {skill.CardHave.map((card: any) => (
                                <React.Fragment key={card.CardID}>
                                  <Link to={`/unit/${card.CardID}`}>
                                    {card.Name}
                                  </Link>
                                  &nbsp;
                                </React.Fragment>
                              ))}
                            </Col>
                          </Row>
                        </Popover>
                      ))}
                  {data.skills && (
                    <Pagination
                      defaultCurrent={1}
                      defaultPageSize={50}
                      current={this.state.currentPage}
                      onChange={page => this.setState({ currentPage: page })}
                      total={data.skills.filter(this.skillFilter).length}
                    />
                  )}
                </Spin>
              </Content>
            </>
          );
        }}
      </Query>
    );
  }
}

export default SkillList;
