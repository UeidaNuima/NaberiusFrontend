import React from 'react';
import { Enemy } from 'interfaces';
import { ENEMY_DOT_URL } from 'consts';

const PreviewDot: React.FC<{ enemy: Enemy }> = ({ enemy }) => {
  const imgID = (enemy.PatternID >> 8) % 4096;
  const previewSprite = enemy.Dots[0].Entries[0].Sprites[0];
  return (
    <div>
      <div
        style={{
          display: 'inline-block',
          width: previewSprite.Width,
          height: previewSprite.Height,
          backgroundImage: `url("${ENEMY_DOT_URL}/${imgID}/sprite.png")`,
          backgroundPositionX: -previewSprite.X,
          backgroundPositionY: -previewSprite.Y,
          zoom: Math.min(40 / previewSprite.Height, 40 / previewSprite.Width),
          verticalAlign: 'middle',
        }}
      />
    </div>
  );
};

export default PreviewDot;
