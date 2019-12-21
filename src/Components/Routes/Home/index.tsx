import * as React from 'react';
import { Layout, Row, Col, Tooltip, Badge, Popover } from 'antd';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import moment from 'moment';
import Card from 'Components/Card';
import Pill from 'Components/Pill';
import Poster from 'Components/Poster';
import logo from '../../../logo.png';
import payImage from './pay.png';
import styles from './index.module.less';

const { Content } = Layout;

const status = {
  0: 'success',
  1: 'processing',
  2: 'error',
};

interface Data {
  uploadFiles: Array<{
    UpdateTime: number;
    Name: string;
  }>;
  serverStatus: number;
  posters: string[];
}

export default class Home extends React.Component {
  private filesToPills(files: any[]) {
    return files.map(file => {
      const time = moment(file.UpdateTime);
      const outDated = moment.duration(moment().diff(time)).days() >= 6;
      return (
        <Col key={file.Name} md={12}>
          <Tooltip title={time.format('YYYY-MM-DD HH:mm:ss ddd')}>
            <Pill bordered={!outDated} type={outDated ? 'danger' : 'default'}>
              {file.Name}
              <small className={styles.updateTime}>{time.fromNow()}</small>
            </Pill>
          </Tooltip>
        </Col>
      );
    });
  }
  public render() {
    return (
      <Query<Data>
        query={gql`
          query {
            uploadFiles {
              UpdateTime
              Name
            }
            serverStatus
            posters
          }
        `}
      >
        {({ loading, error, data }) => {
          return (
            <Content className={styles.content}>
              <div className={styles.logoblock}>
                <img alt="logo" src={logo} className={styles.topLogo} />
                <h1>Naberius</h1>
              </div>
              <Card loading={loading}>
                {!loading && data && (
                  <div>
                    <Badge
                      status={(status as any)[data.serverStatus]}
                      text="状态"
                    />
                    <Row>{this.filesToPills(data.uploadFiles)}</Row>
                  </div>
                )}
              </Card>
              <div className={styles.beg}>
                <Popover
                  placement="bottom"
                  content={
                    <img
                      alt="唯一指定邮箱minalinskyx#hotmail.com，您pay吗"
                      src={payImage}
                      width={500}
                    />
                  }
                >
                  <del>我就不要脸了要饭了你打我啊！</del>
                </Popover>
              </div>
              {!loading && data && data.posters.length !== 0 && (
                <Poster
                  posters={data.posters.map((poster: string) =>
                    poster.replace('event', ''),
                  )}
                />
              )}
            </Content>
          );
        }}
      </Query>
    );
  }
}
