import * as React from 'react';
import { Layout, Row, Col, Tooltip, Badge, Popover } from 'antd';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import moment from 'moment';
import Card from '../../Card';
import Pill from '../../Pill';
import Poster from '../../Poster';
import logo from '../../../logo.png';
import payImage from './pay.png';
import styles from './index.module.less';

const { Content } = Layout;

const status = {
  0: 'success',
  1: 'processing',
  2: 'error',
};

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
      <Query
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
                <img src={logo} className={styles.topLogo} />
                <h1>Naberius</h1>
              </div>
              <Card loading={loading}>
                {!loading && (
                  <div>
                    <Badge status={status[data.serverStatus]} text="状态" />
                    <Row>{this.filesToPills(data.uploadFiles)}</Row>
                  </div>
                )}
              </Card>
              <div className={styles.beg}>
                <Popover
                  placement="bottom"
                  content={<img src={payImage} width={500} />}
                >
                  <del>我就不要脸了要饭了你打我啊！</del>
                </Popover>
              </div>
              {!loading && data.posters.length !== 0 && (
                <Poster posters={data.posters} />
              )}
            </Content>
          );
        }}
      </Query>
    );
  }
}
