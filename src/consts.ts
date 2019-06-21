export const BASE_SERVER_URL = 'https://aigisapi.naberi.us';
// export const BASE_SERVER_URL = 'http://localhost:4000';
export const BASE_GAME_URL = 'http://assets.millennium-war.net';
export const GAME_POSTER_URL = BASE_GAME_URL + '/00/html/image';
export const API_URL = BASE_SERVER_URL + '/graphql';
export const STATIC_URL = BASE_SERVER_URL + '/static';
export const PLAYER_DOT_URL = STATIC_URL + '/playerdot';
export const EMOJI_URL = STATIC_URL + '/cqp';
export const ICO_URL = STATIC_URL + '/ico';
export const ENEMY_DOT_URL = STATIC_URL + '/enemydot';
export const ENEMY_CHANGE_COND: { [k: number]: string } = {
  0: '条件切换',
  1: '阻挡切换',
  2: '死亡切换',
  3: '半血切换',
  4: '一次性攻击切换',
  5: '血量99%切换',
};
