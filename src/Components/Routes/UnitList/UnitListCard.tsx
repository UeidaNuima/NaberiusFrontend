import React from 'react';
import { Row, Col, Tag } from 'antd';
import Rarity from '../../Rarity';
import styles from './UnitList.module.less';
import { ICO_URL } from '../../../consts';
import { Card } from './types';
import classNames from 'classnames';

interface UnitListCardProps {
  card: Card;
  showUnit: (cardID: number) => void;
  setFilter: (search: string, searchType: string) => void;
  style?: React.CSSProperties;
}

interface FormFields {
  nickName: string;
  conneName: string;
}

const UnitListCard: React.FC<UnitListCardProps> = ({
  card,
  showUnit,
  setFilter,
  style,
}) => {
  return (
    <div
      style={style}
      className={classNames(styles.listCard, {
        [styles.male]: card.Kind === 1,
        [styles.female]: card.Kind === 0,
      })}
    >
      <Row
        type="flex"
        style={{ alignItems: 'center' }}
        onClick={() => showUnit(card.CardID)}
      >
        <Col md={2} xs={3}>
          {card.CardID}
        </Col>
        <Col md={2} xs={5}>
          <img
            src={`${ICO_URL}/0/${card.CardID}.png`}
            alt={card.CardID.toString()}
            height="48"
          />
        </Col>
        <Col md={4} xs={16}>
          <Rarity rare={card.Rare} />
          <br />
          {card.Name}
        </Col>
        <Col lg={6} xs={0}>
          {card.RaceName && (
            <span
              onClick={e => {
                e.stopPropagation();
                setFilter(card.RaceName, 'RaceName');
              }}
            >
              <Tag>{card.RaceName}</Tag>
            </span>
          )}
          {card.AssignName && (
            <span
              onClick={e => {
                e.stopPropagation();
                setFilter(card.AssignName, 'AssignName');
              }}
            >
              <Tag color="magenta">{card.AssignName}</Tag>
            </span>
          )}
          {card.IdentityName && (
            <span
              onClick={e => {
                e.stopPropagation();
                setFilter(card.IdentityName, 'IdentityName');
              }}
            >
              <Tag color="black">{card.IdentityName}</Tag>
            </span>
          )}
          {card.GenusName && (
            <span
              onClick={e => {
                e.stopPropagation();
                setFilter(card.GenusName, 'GenusName');
              }}
            >
              <Tag color="blue">{card.GenusName}</Tag>
            </span>
          )}
        </Col>
        <Col
          lg={5}
          md={8}
          xs={0}
          className="filter"
          onClick={e => {
            e.stopPropagation();
            setFilter(card.Classes[0].Name, 'Classes.0.Name');
          }}
        >
          {card.Classes[0].Name}
        </Col>
        <Col
          lg={5}
          md={8}
          xs={0}
          className="filter"
          onClick={e => {
            e.stopPropagation();
            setFilter(card.IllustName, 'IllustName');
          }}
        >
          {card.IllustName}
        </Col>
      </Row>
    </div>
  );
};

export default UnitListCard;
