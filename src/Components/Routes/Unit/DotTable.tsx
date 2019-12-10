import React, { useState } from 'react';
import { Dot } from '../../../interfaces';
import DotAnimation from '../../DotAnimation';
import styles from './Unit.module.less';
import { Data } from './type';
import { Button } from 'antd';
import { PLAYER_DOT_URL } from '../../../consts';

const DotTable: React.FC<{ dot: Dot; card: Data['card'] }> = ({
  dot,
  card,
}) => {
  const [showConfigs, setShowConfigs] = useState(false);
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th colSpan={3}>{dot.Name}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ width: 100 }}>{dot.Length}f</td>
          <td>
            <DotAnimation dot={dot} CardID={card.CardID} />
          </td>
          <td style={{ width: 100 }}>
            <Button
              type="primary"
              size="small"
              onClick={() => setShowConfigs(!showConfigs)}
              icon={showConfigs ? 'up' : 'down'}
            />
          </td>
        </tr>
        {showConfigs && (
          <tr>
            <td colSpan={3}>
              {dot.Entries.map((entry, entryIndex: number) => (
                <div key={entryIndex}>
                  {entry.Sprites.map((sprite, index: number) => {
                    return (
                      <div
                        key={`${entryIndex}-${index}`}
                        style={{
                          display: 'inline-block',
                          width: sprite.Width,
                          height: sprite.Height,
                          backgroundImage: `url("${PLAYER_DOT_URL}/${card.CardID}.png")`,
                          backgroundPositionX: -sprite.X,
                          backgroundPositionY: -sprite.Y,
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DotTable;
