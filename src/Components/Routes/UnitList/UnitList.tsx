import React, { useState, useEffect } from 'react';
import { Layout, Input, Row, Col, Icon, Drawer, Tag } from 'antd';
import { FixedSizeList as List } from 'react-window';
import gql from 'graphql-tag';
import useRouter from 'use-react-router';
import classNames from 'classnames';
import { useMediaQuery } from 'react-responsive';
import { Card } from './types';
import UnitListCard from './UnitListCard';
import styles from './UnitList.module.less';
import Unit from '../Unit';
import Loading from '../../Loading';
import { useQuery } from '@apollo/react-hooks';

const { Content } = Layout;

interface Data {
  Cards: Card[];
}

interface Props {
  data?: Data;
  loading: boolean;
}

const FILTER_TYPE: { [k: string]: string } = {
  Rare: '稀有',
  RaceName: '种族',
  AssignName: '出身',
  GenusName: '限定',
  IdentityName: '属性',
  IllustName: '画师',
  'Classes.0.Name': '职业',
};

const UnitList: React.FC<Props> = ({ data, loading }) => {
  const [sorter, setSorter] = useState({ key: 'CardID', order: true });
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<
    Array<{ content: string; type: string }>
  >([]);

  // 两个变量react-window用
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [scrolled, setScrolled] = useState(0);

  const { match, history } = useRouter<{ CardID: string }>();
  const { CardID } = match.params;

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 991px)' });

  useEffect(() => {
    const main = document.getElementsByTagName('main')[0];
    const handleResize = () => {
      const width = main.offsetWidth - 60;
      const height = main.offsetHeight - 150;
      setSize({ width, height });
    };
    window.onresize = handleResize;
    handleResize();
    return () => {
      window.onresize = null;
    };
  }, []);

  // 生成表头
  const genSorter = (title: string, key: string) => {
    return (
      <div
        style={{ cursor: 'pointer' }}
        onClick={() =>
          setSorter({ key, order: key === sorter.key ? !sorter.order : true })
        }
      >
        {title}
        {sorter.key === key && (
          <Icon type={sorter.order ? 'caret-down' : 'caret-up'} />
        )}
      </div>
    );
  };

  const getParam = (target: any, keys: string) => {
    keys.split('.').forEach((st: string) => (target = target[st]));
    return target;
  };

  const cardSorter = (cardA: any, cardB: any) => {
    const { key, order } = sorter;
    const paramA = getParam(cardA, key);
    const paramB = getParam(cardB, key);
    if (typeof paramA === 'number') {
      return order ? paramA - paramB : paramB - paramA;
    } else {
      if (paramA > paramB) {
        return order ? 1 : -1;
      } else if (paramA < paramB) {
        return order ? -1 : 1;
      } else {
        return 0;
      }
    }
  };

  const cardFilter = (card: any) => {
    let flag = JSON.stringify(card).includes(search);

    filters.forEach((filter) => {
      const { type, content } = filter;
      const sourceValue = getParam(card, type);
      let parsedValue: number | string = content;
      if (typeof sourceValue === 'number') {
        parsedValue = Number.parseInt(parsedValue, 10);
      }
      flag = flag && sourceValue === parsedValue;
    });
    return flag;
  };

  const handleSetFilter = (content: string, type: string) => {
    const filter = filters.find(
      (f) => f.content === content && f.type === type,
    );
    if (!filter) {
      setFilters((fs) => [...fs, { content, type }]);
    }
  };

  const showUnit = (cardID: number) => {
    history.push({
      pathname: `/unit/${cardID}`,
      state: { modal: true },
    });
  };

  const cards =
    (data &&
      data.Cards &&
      data.Cards.slice().sort(cardSorter).filter(cardFilter)) ||
    [];

  return (
    <Content className={styles.unitListContent}>
      <Input
        placeholder="搜索单位"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className={styles.filterContainer}>
        {filters.map((filter, index) => {
          return (
            <Tag
              key={index + filter.content}
              closable
              onClose={() => {
                const i = filters.findIndex(
                  (f) => f.content === filter.content && f.type === filter.type,
                );
                setFilters([...filters.slice(0, i), ...filters.slice(i + 1)]);
              }}
            >
              {FILTER_TYPE[filter.type]}：{filter.content}
            </Tag>
          );
        })}
      </div>
      <Row
        className={classNames(styles.sorterBlock, {
          [styles.shadow]: scrolled !== 0,
        })}
      >
        <Col md={4} xs={8}>
          {genSorter('#', 'CardID')}
        </Col>
        <Col md={4} xs={16}>
          {genSorter('名称', 'Name')}
        </Col>
        <Col lg={6} xs={0}>
          {genSorter('种族', 'Race')}
        </Col>
        <Col lg={5} md={8} xs={0}>
          {genSorter('职业', 'Class[0].Name')}
        </Col>
        <Col lg={5} md={8} xs={0}>
          {genSorter('画师', 'Illust')}
        </Col>
      </Row>
      <div className={styles.listContainer}>
        {!loading ? (
          <List
            height={size.height}
            itemCount={cards.length}
            itemSize={68}
            width={size.width}
            onScroll={({ scrollOffset }) => setScrolled(scrollOffset)}
          >
            {({ index, style }) => (
              <div key={cards[index].CardID} style={style}>
                <UnitListCard
                  card={cards[index]}
                  showUnit={showUnit}
                  setFilter={handleSetFilter}
                />
              </div>
            )}
          </List>
        ) : (
          <Loading />
        )}
      </div>
      <Drawer
        width={isTabletOrMobile ? '100%' : '80%'}
        visible={!!CardID}
        destroyOnClose
        onClose={() => history.push('/unit')}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        {CardID && <Unit />}
      </Drawer>
    </Content>
  );
};

const UnitListWrapper: React.FC = (props) => {
  const { data, loading } = useQuery(
    gql`
      query {
        Cards {
          CardID
          Name
          Rare
          Kind
          IllustName
          RaceName
          AssignName
          IdentityName
          GenusName
          Classes {
            Name
          }
        }
      }
    `,
  );
  return <UnitList {...props} data={data} loading={loading} />;
};

export default UnitListWrapper;
