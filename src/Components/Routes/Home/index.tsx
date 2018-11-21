import * as React from 'react';
import { Layout, Row, Col, Tooltip, Badge } from 'antd';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import moment from 'moment';
import Card from '../../Card';
import Pill from '../../Pill';
import logo from '../../../logo.png';
import payImage from './pay.png';
import styles from './index.module.less';
import { STATIC_URL } from '../../../consts';

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
        {({ loading, error, data }) => (
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
              <p>
                <del>生活所迫只能要饭了</del>, 支付宝
              </p>
              <img src={payImage} alt="支付宝@13021225563" />
            </div>
            {!loading && (
              <div className={styles.postContainer}>
                <img
                  src={`${STATIC_URL}/poster/${
                    data.posters[data.posters.length - 1]
                  }.jpg`}
                />
              </div>
            )}
          </Content>
        )}
      </Query>
    );
  }
}
