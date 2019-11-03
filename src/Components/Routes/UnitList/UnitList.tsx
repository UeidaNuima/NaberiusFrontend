import React, { useState, useEffect } from 'react';
import { Layout, Input, Row, Col, Icon, Select, Drawer } from 'antd';
import { FixedSizeList as List } from 'react-window';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import useRouter from 'use-react-router';
import classNames from 'classnames';
import { useMediaQuery } from 'react-responsive';
import { Card } from './types';
import UnitListCard from './UnitListCard';
import styles from './UnitList.module.less';
import Unit from '../Unit';

const { Content } = Layout;

interface Data {
  cards: Card[];
}

interface Props {
  data?: Data;
  loading: boolean;
}

const UnitList: React.FC<Props> = ({ data, loading }) => {
  const [sorter, setSorter] = useState({ key: 'CardID', order: true });
  const [search, setSearch] = useState({ content: '', type: 'all' });

  // 两个变量react-window用
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [scrolled, setScrolled] = useState(0);

  const { match, history } = useRouter<{ CardID: string }>();
  const { CardID } = match.params;

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  useEffect(() => {
    const main = document.getElementsByTagName('main')[0];
    const handleResize = () => {
      console.log(main.offsetWidth, main.offsetHeight);
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
    const { type, content } = search;
    if (type !== 'all') {
      // card中的数据
      const sourceValue = getParam(card, type);
      let parsedValue: number | string = content;
      if (typeof sourceValue === 'number') {
        parsedValue = Number.parseInt(parsedValue, 10);
      }
      return sourceValue === parsedValue;
    }

    return JSON.stringify(card).includes(content);
  };

  /**
   * 点击搜索按钮的回调
   */
  const handleSetSearch = (content: string, type?: string) => {
    setSearch({
      content,
      type: type || search.type,
    });
  };

  const showUnit = (cardID: number) => {
    history.push({
      pathname: `/unit/${cardID}`,
      state: { modal: true },
    });
  };

  const cards =
    (data &&
      data.cards &&
      data.cards
        .slice()
        .sort(cardSorter)
        .filter(cardFilter)) ||
    [];

  return (
    <Content className={styles.unitListContent}>
      <Input
        placeholder="搜索单位"
        value={search.content}
        onChange={event =>
          setSearch({
            ...search,
            content: event.target.value,
          })
        }
        addonBefore={
          <Select
            value={search.type}
            onChange={(value: string) =>
              setSearch(search => ({ ...search, type: value }))
            }
            style={{ width: 90 }}
          >
            <Select.Option value="all">全部</Select.Option>
            <Select.Option value="Rare">稀有</Select.Option>
            <Select.Option value="Name">名称</Select.Option>
            <Select.Option value="Race">种族</Select.Option>
            <Select.Option value="Assign">出身</Select.Option>
            <Select.Option value="Identity">不死</Select.Option>
            <Select.Option value="Class.ClassInit.Name">职业</Select.Option>
            <Select.Option value="Illust">画师</Select.Option>
          </Select>
        }
      />
      <Row
        className={classNames(styles.sorterBlock, {
          [styles.shadow]: scrolled !== 0,
        })}
      >
        <Col span={1}>{genSorter('#', 'CardID')}</Col>
        <Col span={3}>{genSorter('性别', 'Kind')}</Col>
        <Col span={4}>{genSorter('名称', 'Name')}</Col>
        <Col span={5}>{genSorter('种族', 'Race')}</Col>
        <Col span={5}>{genSorter('职业', 'Class.ClassInit.Name')}</Col>
        <Col span={5}>{genSorter('画师', 'Illust')}</Col>
      </Row>
      <div className={styles.listContainer}>
        {cards && (
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
                  setSearch={handleSetSearch}
                />
              </div>
            )}
          </List>
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

const UnitListWrapper: React.FC = props => {
  return (
    <Query<Data>
      query={gql`
        query {
          cards {
            CardID
            Name
            Rare
            Kind
            Illust
            Race
            Assign
            Identity
            Class {
              ClassInit {
                Name
              }
            }
          }
        }
      `}
    >
      {({ data, loading }) => (
        <UnitList {...props} data={data} loading={loading} />
      )}
    </Query>
  );
};

export default UnitListWrapper;
