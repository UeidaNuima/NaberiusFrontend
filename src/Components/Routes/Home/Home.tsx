import React, { useState, useEffect, useRef } from 'react';
import { Layout, Col, Popover, Calendar, Row, Button } from 'antd';
import gql from 'graphql-tag';
import moment from 'moment';
import Card from 'Components/Card';
import logo from 'logo.png';
import payImage from './pay.png';
import styles from './Home.module.less';
import { useQuery } from '@apollo/react-hooks';
import { BANNER_URL, GAME_POSTER_URL } from 'consts';
import classNames from 'classnames';
import Loading from 'Components/Loading';

const { Content } = Layout;

const Home: React.FC = () => {
  const [date, setDate] = useState<moment.Moment>();
  const [selectedDate, setSelectedDate] = useState<moment.Moment>();
  const { loading, data } = useQuery<{
    UpdateTime: number;
    Posters: string[];
    Banners: string[];
  }>(
    gql`
      query {
        UpdateTime
        Posters
        Banners
      }
    `,
    {
      onCompleted: d => {
        if (d.Posters.length > 0) {
          const posterName = d.Posters[d.Posters.length - 1];
          setDate(moment(posterName.slice(5, 13), 'YYYYMMDD'));
        }
      },
    },
  );

  const posterRef = useRef<HTMLImageElement>(null);
  const [posterLoading, setPosterLoading] = useState(true);

  useEffect(() => {
    if (
      data?.Posters.includes(`event${selectedDate?.format('YYYYMMDD')}.jpg`)
    ) {
      setDate(selectedDate);
    }
  }, [data, selectedDate]);

  useEffect(() => {
    if (date && posterRef.current) {
      posterRef.current.src = `${GAME_POSTER_URL}/event${date.format(
        'YYYYMMDD',
      )}.jpg`;
      setPosterLoading(true);
    }
  }, [date]);

  return (
    <Content className={styles.content + ' container'}>
      <div className={styles.logoblock}>
        <img alt="logo" src={logo} className={styles.topLogo} />
        <h1>Naberius</h1>
      </div>
      <Card loading={loading}>
        {!loading && data && (
          <div>
            更新时间：
            <time>{moment(data.UpdateTime).fromNow()}</time>
          </div>
        )}
      </Card>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card loading={loading} style={{ marginTop: 16 }}>
            <h2>卡池</h2>
            {data &&
              data.Banners.map(bannerName => (
                <img
                  alt={bannerName}
                  key={bannerName}
                  src={`${BANNER_URL}/${bannerName}`}
                  style={{ maxWidth: '100%' }}
                />
              ))}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card loading={loading} style={{ marginTop: 16 }}>
            <h2>海报</h2>
            <Calendar
              value={selectedDate || moment()}
              onChange={value => {
                setSelectedDate(value);
              }}
              fullscreen={false}
              monthFullCellRender={value => {
                const first = data?.Posters.find(p =>
                  p.startsWith(`event${value.format('YYYYMM')}`),
                );
                return (
                  <div className="ant-fullcalendar-month">
                    <div
                      className={classNames('ant-fullcalendar-value', {
                        [styles.calendarMonthDisabled]: !first,
                      })}
                      onClick={() =>
                        first &&
                        setSelectedDate(moment(first.slice(5, 13), 'YYYYMMDD'))
                      }
                    >
                      {value.localeData().monthsShort(value)}
                    </div>
                  </div>
                );
              }}
              disabledDate={value => {
                if (data) {
                  for (const posterName of data.Posters) {
                    if (posterName === `event${value.format('YYYYMMDD')}.jpg`)
                      return false;
                  }
                }
                return true;
              }}
            />
            <Loading spinning={posterLoading}>
              {date && (
                <img
                  ref={posterRef}
                  onLoad={() => setPosterLoading(false)}
                  alt={date.format('YYYY/MM/DD')}
                  style={{ width: '100%' }}
                />
              )}
            </Loading>
          </Card>
        </Col>
      </Row>
      <div className={styles.beg}>
        <Popover
          placement="top"
          trigger="click"
          content={
            <img
              alt="唯一指定邮箱minalinskyx#hotmail.com，您pay吗"
              src={payImage}
              width={500}
            />
          }
        >
          <Button type="primary">
            给魔狗买一杯
            <span role="img" aria-label="coffee">
              ☕️
            </span>
          </Button>
        </Popover>
      </div>
    </Content>
  );
};

export default Home;
