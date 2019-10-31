export const MISSION_TYPE: { [k: string]: string } = {
  Assault: '投票讨伐',
  Story: '主线',
  Emergency: '<span style="color: red">紧急<span>',
  Reproduce: '复刻',
  DailyReproduce: '每日复刻',
  Subjugation: '大讨伐',
  DevilAdvent: '魔神',
  Harlem: '交流',
  Daily: '曜日',
  Challenge: '挑战',
  Tutorial: '教程',
  Tower: '英杰之塔',
  Raid: '神兽',
};

export interface QuestData {
  Name: string;
  QuestID: number;
  Charisma: number;
  ActionPoint: number;
}
