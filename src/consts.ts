import { DefaultGetter } from './utils';
// export const BASE_SERVER_URL = 'https://aigisapi.naberi.us';
export const BASE_SERVER_URL = 'http://localhost:4000';
export const BASE_GAME_URL = 'http://assets.millennium-war.net';
export const GAME_POSTER_URL = BASE_GAME_URL + '/00/html/image';
export const API_URL = BASE_SERVER_URL + '/graphql';
export const STATIC_URL = BASE_SERVER_URL + '/static';
export const PLAYER_DOT_URL = STATIC_URL + '/playerDot';
export const ENEMY_DOT_URL = STATIC_URL + '/enemyDot';
export const BATTLE_TALK_EVENT_URL = STATIC_URL + '/battleTalkEvent';
export const EMOJI_URL = STATIC_URL + '/cqp';
export const ICO_URL = STATIC_URL + '/ico';
export const BANNER_URL = STATIC_URL + '/banner';
export const ENEMY_CHANGE_COND: { [k: number]: string } = {
  0: '条件切换',
  1: '阻挡切换',
  2: '死亡切换',
  3: '半血切换',
  4: '一次性攻击切换',
  5: '血量99%切换',
};
export const BONUS_TYPE = new DefaultGetter({
  1: 'HP +%d',
  2: '攻击 +%d',
  3: '防御 +%d',
  4: '射程 +%d',
  5: '魔抗 +%d',
  6: '后摇 -%d',
  7: '技能持续 +%d%',
  8: '技能再动 -%d%',
  9: '物理攻击回避 +%d%',
});
