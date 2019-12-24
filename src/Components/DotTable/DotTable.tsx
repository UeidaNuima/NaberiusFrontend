import React, { useState } from 'react';
import { Dot } from 'interfaces';
import DotAnimation from 'Components/DotAnimation';
import styles from './DotTable.module.less';
import { Button } from 'antd';
import { PLAYER_DOT_URL, ENEMY_DOT_URL } from 'consts';

const DotTable: React.FC<{
  dot: Dot;
  CardID: number;
  type: 'Player' | 'Enemy';
}> = ({ dot, CardID, type }) => {
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
            <DotAnimation type={type} dot={dot} CardID={CardID} />
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
              {dot.Entries.map((entry, entryIndex) => (
                <div key={entryIndex}>
                  {entry.Sprites.map((sprite, index) => {
                    return (
                      <div
                        key={`${entryIndex}-${index}`}
                        style={{
                          display: 'inline-block',
                          width: sprite.Width,
                          height: sprite.Height,
                          backgroundImage: `url("${
                            type === 'Player' ? PLAYER_DOT_URL : ENEMY_DOT_URL
                          }/${CardID}/sprite.png")`,
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
