import * as React from 'react';
import { Layout, Row, Col, Tooltip, Badge } from 'antd';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import moment from 'moment';
import Card from '../../Card';
import Pill from '../../Pill';
import logo from '../../../logo.png';
import './index.less';

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
              <small className="updateTime">{time.fromNow()}</small>
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
          }
        `}
      >
        {({ loading, error, data }) => (
          <Content className="content">
            <div className="logoblock">
              <img src={logo} className="topLogo" />
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
          </Content>
        )}
      </Query>
    );
  }
}
