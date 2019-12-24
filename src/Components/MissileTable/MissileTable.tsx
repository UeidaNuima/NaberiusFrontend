import React from 'react';
import { Missile } from 'interfaces';
import styles from './MissileTable.module.less';
import MediaContext from 'context/MediaContext';

const MissileTable: React.FC<{
  missile: Missile;
  compact?: boolean;
}> = ({ missile, compact = false }) => {
  const { isTabletOrMobile } = MediaContext.useContainer();
  const isCompact = isTabletOrMobile || compact;
  return (
    <table className={styles.table} style={{ tableLayout: 'fixed' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>点阵</th>
          <th>是否敌人</th>
          <th>速度</th>
          <th>减速时间</th>
          <th>减速比例</th>
          <th>溅射</th>
          {!isCompact && <th>属性</th>}
        </tr>
        {!!(isCompact && missile.Property) && (
          <tr>
            <th colSpan={7}>属性</th>
          </tr>
        )}
      </thead>
      <tbody>
        <tr>
          <td>{missile.MissileID}</td>
          <td>{missile.PatternID.toString(16)}</td>
          <td>{missile.Enemy ? '是' : '否'}</td>
          <td>{missile.Speed}</td>
          <td>{missile.SlowTime}</td>
          <td>{missile.SlowRate}</td>
          <td>{missile.DamageArea}</td>
          {!isCompact && <td>{missile.Property}</td>}
        </tr>
        {!!(missile.Property && isCompact) && (
          <tr>
            <td colSpan={7}>{missile.Property}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default MissileTable;
