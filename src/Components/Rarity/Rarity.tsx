import React from 'react';

const Rarity: React.FC<{ rare: number }> = ({ rare }) => {
  switch (rare) {
    case 0:
      return <span style={{ color: 'grey' }}>★</span>;
    case 1:
      return <span style={{ color: 'brown' }}>★★</span>;
    case 2:
      return <span style={{ color: 'silver' }}>★★★</span>;
    case 3:
      return <span style={{ color: 'gold' }}>★★★★</span>;
    case 4:
      return <span>☆☆☆☆☆</span>;
    case 5:
      return <span style={{ color: 'black' }}>★★★★★★</span>;
    case 7:
      return <span style={{ color: 'blue' }}>SAPPHIRE</span>;
    case 10:
      return <span style={{ textShadow: '0 0 1px deepskyblue' }}>☆☆☆☆☆</span>;
    case 11:
      return (
        <span style={{ textShadow: '0 0 1px gold', color: 'black' }}>
          ★★★★★★
        </span>
      );
    default:
      return <span>UNKNOWN</span>;
  }
};

export default Rarity;
