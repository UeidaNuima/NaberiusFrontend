import * as React from 'react';
import { Query } from 'react-apollo';
import { Spin, Layout, Collapse, Row, Col, Affix } from 'antd';
import gql from 'graphql-tag';
import _ from 'lodash';
import { MISSION_TYPE } from './types';
import MissionShutter from './MissionShutter';
import './index.less';

const { Content } = Layout;
const Panel = Collapse.Panel;

const QuestList: React.FC = () => {
  return (
    <Content className="container">
      <Affix>
        <Row className="sorter-block">
          <Col span={2}>#</Col>
          <Col span={2}>魅力</Col>
          <Col span={2}>体力</Col>
          <Col span={18}>名称</Col>
        </Row>
      </Affix>
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
                    <Collapse bordered={false} accordion>
                      {Object.entries(_.groupBy(data.missions, 'Type')).map(
                        ([missionType, missions]) => (
                          <Panel
                            header={
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: MISSION_TYPE[missionType]
                                    ? MISSION_TYPE[missionType]
                                    : missionType,
                                }}
                              />
                            }
                            key={missionType}
                          >
                            <Collapse bordered={false}>
                              {missions.map((mission: any) => (
                                <Panel
                                  className="mission-panel"
                                  key={mission.MissionID}
                                  header={
                                    <span>
                                      <strong>{mission.MissionID}</strong>
                                      &nbsp;
                                      {mission.Name}
                                    </span>
                                  }
                                >
                                  <MissionShutter mission={mission} />
                                </Panel>
                              ))}
                            </Collapse>
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
    </Content>
  );
};

export default QuestList;
