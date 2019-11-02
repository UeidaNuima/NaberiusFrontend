export interface Enemy {
  SpecialEffect: any;
  PatternID: number;
  Types: any;
  HP: number;
  HP_MAX: number;
  ATTACK_POWER: number;
  ATTACK_TYPE: number;
  ATTACK_RANGE: number;
  ATTACK_SPEED: number;
  ARMOR_DEFENSE: number;
  MAGIC_DEFENSE: number;
  SkyFlag: number;
  GainCost: number;
  EffectHeight: number;
  MagicAttack: number;
  AttackWait: number;
  Param_ResistanceAssassin: number;
  Param_ChangeParam: number;
  Param_ChangeCondition: number;
  TypeAttack: number;
  DotLength: number;
}

export interface Data {
  quest: {
    EventArcs: Array<{
      _TalkerName: string;
      _TalkText: string;
    }>;
    Name: string;
    Message: string;
    Charisma: number;
    EntryNo: number;
    Level: number;
    ActionPoint: number;
    Treasure1: number;
    Treasure2: number;
    Treasure3: number;
    Treasure4: number;
    Treasure5: number;
    RankExp: number;
    Gold: number;
    Mission: {
      Enemies: Enemy[];
      BattleTalks: Array<{
        Message: string;
        Name: string;
        FaceID: number;
        RecordIndex: number;
      }>;
    };
    Map: {
      Image: string;
      Entries: Array<{
        EntryID: number;
        Entries: Array<{
          EnemyID: number;
          Wait: number;
          RouteNo: number;
          Loop: number;
          Level: number;
          PrizeEnemySpawnPercent: number;
          PrizeCardID: number;
          PrizeEnemyDropPercent: number;
          RouteOffset: number;
          IsAppear: number;
          FreeCommand: string;
          EntryCommand: string;
          DeadCommand: string;
        }>;
      }>;
      Routes: Array<{
        RouteID: number;
        Routes: Array<{
          OnEvent: string;
        }>;
      }>;
      Enemies: Enemy[];
    };
  };
  battleTalks: Array<{
    Message: string;
    Name: string;
  }>;
}
