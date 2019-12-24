import React from 'react';
import { ICO_URL, BATTLE_TALK_EVENT_URL } from 'consts';
import { renderDescription } from 'utils';

const TalkRow: React.FC<{
  talk: { Name: string; FaceID: number; Message: string };
  MissionID: number;
  isTabletOrMobile: boolean;
}> = ({ talk, MissionID, isTabletOrMobile }) => {
  return (
    <tr>
      <th>
        {talk.Name}
        <img
          style={{
            display: 'block',
            margin: 'auto',
            width: '100%',
          }}
          alt={talk.FaceID.toString()}
          src={
            talk.FaceID >= 1000
              ? `${ICO_URL}/0/${talk.FaceID - 1000}.png`
              : `${BATTLE_TALK_EVENT_URL}/${MissionID}/${talk.FaceID}.png`
          }
        />
      </th>
      <td colSpan={9}>
        <div
          dangerouslySetInnerHTML={{
            __html: renderDescription(talk.Message),
          }}
          style={{
            margin: 'auto',
            textAlign: 'left',
            maxWidth: '30em',
          }}
        />
      </td>
    </tr>
  );
};

export default TalkRow;
