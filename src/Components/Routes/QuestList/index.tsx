import * as React from 'react';
import { Query } from 'react-apollo';
import { Spin, Layout, Collapse, Switch, Row, Col, Affix } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import gql from 'graphql-tag';
import * as _ from 'lodash';
import './index.less';

const { Content } = Layout;
const Panel = Collapse.Panel;

const MISSION_TYPE: { [k: string]: string } = {
  Story: '主线',
  Emergency: '紧急',
  Reproduce: '复刻',
  DailyReproduce: '每日复刻',
  Subjugation: '大讨伐',
  DevilAdvent: '魔神',
  Harlem: '交流',
  Daily: '曜日',
  Challenge: '挑战',
  Tutorial: '教程',
  Raid: '神兽',
};

interface QuestData {
  Name: string;
  QuestID: number;
  Charisma: number;
  ActionPoint: number;
}

interface QuestListState {
  show: string;
}

export default class QuestList extends React.Component<
  RouteComponentProps<any>,
  QuestListState
> {
  public state = {
    show: 'mission',
  };

  public changeShow = (checked: boolean) => {
    let show: string;
    if (checked) {
      show = 'quest';
    } else {
      show = 'mission';
    }
    this.setState({ show });
  };

  public showQuest(questID: number) {
    this.props.history.push(`/quest/${questID}`);
  }

  public render() {
    return (
      <Content className="container">
        <Switch
          checkedChildren="关卡"
          unCheckedChildren="战役"
          onChange={this.changeShow}
        />
        <Affix>
          <Row className="sorter-block">
            <Col span={2}>#</Col>
            <Col span={2}>魅力</Col>
            <Col span={2}>体力</Col>
            <Col span={18}>名称</Col>
          </Row>
        </Affix>
        {this.state.show === 'mission' ? (
          <Query
            query={gql`
              query {
                missions {
                  Name
                  Type
                  MissionID
                }
              }
            `}
          >
            {({ loading, error, data }: any) => {
              return (
                <div>
                  <Spin spinning={loading}>
                    {!error && data.missions && (
                      <Content className="mission-list-content">
                        <Collapse bordered={false}>
                          {_.sortBy(data.missions, ['MissionID']).map(
                            (mission: any) => (
                              <Panel
                                className="mission-panel"
                                key={mission.MissionID}
                                header={
                                  <span>
                                    <strong>{mission.MissionID}</strong>
                                    &nbsp;
                                    {mission.Name}
                                    <span className="mission-type">
                                      {MISSION_TYPE[mission.Type]
                                        ? MISSION_TYPE[mission.Type]
                                        : mission.Type}
                                    </span>
                                  </span>
                                }
                              >
                                <Query<{
                                  mission: {
                                    Quests: QuestData[];
                                  };
                                }>
                                  query={gql`
                                    query($MissionID: Int!) {
                                      mission(MissionID: $MissionID) {
                                        Quests {
                                          Name
                                          QuestID
                                          Charisma
                                          ActionPoint
                                        }
                                      }
                                    }
                                  `}
                                  variables={{ MissionID: mission.MissionID }}
                                >
                                  {({ loading, error, data }) => {
                                    if (loading) {
                                      return <Spin />;
                                    }
                                    if (
                                      data &&
                                      data.mission.Quests.length === 0
                                    ) {
                                      return <div>该战役下没有关卡。</div>;
                                    }
                                    return (
                                      data &&
                                      data.mission.Quests.map((quest: any) => (
                                        <Row
                                          key={quest.QuestID}
                                          className="list-card quest-list"
                                          onClick={this.showQuest.bind(
                                            this,
                                            quest.QuestID,
                                          )}
                                        >
                                          <Col span={2}>{quest.QuestID}</Col>
                                          <Col span={2} className="charisma">
                                            {quest.Charisma}
                                          </Col>
                                          <Col
                                            span={2}
                                            className="action-point"
                                          >
                                            {quest.ActionPoint}
                                          </Col>
                                          <Col className="important" span={18}>
                                            {quest.Name}
                                          </Col>
                                        </Row>
                                      ))
                                    );
                                  }}
                                </Query>
                              </Panel>
                            ),
                          )}
                        </Collapse>
                      </Content>
                    )}
                  </Spin>
                </div>
              );
            }}
          </Query>
        ) : (
          <Query<{
            quests: QuestData[];
          }>
            query={gql`
              query {
                quests {
                  Name
                  QuestID
                  Charisma
                  ActionPoint
                }
              }
            `}
          >
            {({ loading, error, data }) => (
              <Spin spinning={loading}>
                <Content className="quest-list-content">
                  {data &&
                    data.quests &&
                    _.sortBy(data.quests, 'QuestID').map((quest: any) => (
                      <Row
                        key={quest.QuestID}
                        className="list-card quest-list"
                        onClick={this.showQuest.bind(this, quest.QuestID)}
                      >
                        <Col span={2}>{quest.QuestID}</Col>
                        <Col span={2} className="charisma">
                          {quest.Charisma}
                        </Col>
                        <Col span={2} className="action-point">
                          {quest.ActionPoint}
                        </Col>
                        <Col className="important" span={18}>
                          {quest.Name}
                        </Col>
                      </Row>
                    ))}
                </Content>
              </Spin>
            )}
          </Query>
        )}
      </Content>
    );
  }
}
