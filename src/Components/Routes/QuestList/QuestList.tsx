import * as React from 'react';
import { Query } from 'react-apollo';
import { Layout, Collapse, Row, Col, Drawer } from 'antd';
import gql from 'graphql-tag';
import _ from 'lodash';
import { MISSION_TYPE } from './types';
import MissionShutter from './MissionShutter';
import './index.less';
import useRouter from 'use-react-router';
import { useMediaQuery } from 'react-responsive';
import Quest from '../Quest';
import Loading from '../../Loading';

const { Content } = Layout;
const Panel = Collapse.Panel;

const QuestList: React.FC = () => {
  const { match, history } = useRouter<{ QuestID: string }>();
  const { QuestID } = match.params;

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  return (
    <Content style={{ padding: 30, position: 'relative' }}>
      <Row className="sorter-block">
        <Col span={2}>#</Col>
        <Col span={2}>魅力</Col>
        <Col span={2}>体力</Col>
        <Col span={18}>名称</Col>
      </Row>
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
            <div
              style={{
                height: 'calc(100% - 35px)',
                overflow: 'auto',
              }}
            >
              <Content className="mission-list-content">
                {!loading ? (
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
                ) : (
                  <Loading />
                )}
              </Content>
            </div>
          );
        }}
      </Query>
      <Drawer
        width={isTabletOrMobile ? '100%' : '80%'}
        visible={!!QuestID}
        destroyOnClose
        onClose={() => history.push('/quest')}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        {QuestID && <Quest />}
      </Drawer>
    </Content>
  );
};

export default QuestList;
