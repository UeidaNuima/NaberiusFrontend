export interface Dot {
  Name: string;
  Length: number;
  Entries: Array<{
    Name: string;
    Sprites: Array<{
      X: number;
      Y: number;
      Width: number;
      Height: number;
      OriginX: number;
      OriginY: number;
    }>;
    PatternNo: Array<{
      Time: number;
      Data: number;
    }>;
    Pos?: Array<{
      Time: number;
      Data: {
        X: number;
        Y: number;
        Z: number;
      };
    }>;
    Scale?: Array<{
      Time: number;
      Data: {
        X: number;
        Y: number;
        Z: number;
      };
    }>;
    Alpha?: Array<{
      Time: number;
      Data: number;
    }>;
  }>;
}

export interface Frame {
  Sprite: {
    X: number;
    Y: number;
    Width: number;
    Height: number;
    OriginX: number;
    OriginY: number;
    ParsedX: number;
    ParsedY: number;
  };
  Alpha: number;
  Pos: {
    X: number;
    Y: number;
  };
  Scale: {
    X: number;
    Y: number;
  };
}

export interface AbilityConfig {
  _InvokeType: number;
  _TargetType: number;
  _InfluenceType: number;
  _Param1: number;
  _Param2: number;
  _Param3: number;
  _Param4: number;
  _Command: string;
  _ActivateCommand: string;
  Comment?: string;
}

export interface AbilityData {
  Type: 'Init' | 'Evo';
  AbilityID: number;
  Text: string;
  AbilityName: string;
  Cards: Card[];
  Configs: AbilityConfig[];
}

export interface ClassData {
  JobChange: number;
  Type: 'Init' | 'CC' | 'Evo' | 'Evo2a' | 'Evo2b';
  AttackAttribute: number;
  Missile?: Missile;
  ClassID: number;
  Name: string;
  InitHP: number;
  AttackType: number;
  MaxHP: number;
  InitDef: number;
  MaxDef: number;
  InitAtk: number;
  MaxAtk: number;
  AtkArea: number;
  BlockNum: number;
  MaxLevel: number;
  Explanation: string;
  Cost: number;
  AttackWait: string;
  Data_ExtraAwakeOrbs: ClassData[];
  NickNames: string[];
  ClassAbilityConfigs: AbilityConfig[];
  ClassAbilityPower1: number;
  BattleStyle?: {
    Data_ID: number;
    Type_BattleStyle: number;
    _Param_01: number;
    _Param_02: number;
    _Range_01: number;
    _Range_02: number;
    _Range_03: number;
    _Range_04: number;
    _Range_05: number;
  };
  Cards: Card[];
}

export interface SkillConfig {
  Type_Collision: number;
  Type_CollisionState: number;
  Type_ChangeFunction: number;
  Data_Target: number;
  Data_InfluenceType: number;
  Data_MulValue: number;
  Data_MulValue2: number;
  Data_MulValue3: number;
  Data_AddValue: number;
  _HoldRatioUpperLimit: number;
  _Expression: string;
  _ExpressionActivate: string;
  Comment: string;
}

export interface SkillData {
  SkillName: string;
  WaitTime: number;
  ContTimeMax: number;
  PowerMax: number;
  LevelMax: number;
  Text: string;
  SkillID: number;
  Cards: Card[];
  Configs: SkillConfig[];
}

export interface SkillWithType {
  Type: 'Init' | 'CC' | 'Evo';
  Skills: SkillData[];
}

export interface UnitSpeciatyConfig {
  ID_Card: number;
  Type_Specialty: number;
  Value_Specialty: number;
  Value_Param1: number;
  Value_Param2: number;
  Value_Param3: number;
  Value_Param4: number;
  Command: string;
  Comment: string;
}

export interface Card {
  CardID: number;
  _AwakePattern: number;
  HarlemTextR: string[];
  HarlemTextA: string[];
  Name: number;
  Rare: number;
  Kind: number;
  MaxHPMod: number;
  AtkMod: number;
  DefMod: number;
  CostModValue: number;
  CostDecValue: number;
  MagicResistance: number;
  BonusType: number;
  BonusNum: number;
  BonusType2: number;
  BonusNum2: number;
  BonusType3: number;
  BonusNum3: number;
  RaceName: string;
  AssignName: string;
  IdentityName: string;
  GenusName: string;
  IllustName: string;
  HomeCooking: number;
  SellPrice: number;
  BuildExp: number;
  _TradePoint: number;
  Dots: Dot[];
  Classes: ClassData[];
  ImageCG: string[];
  ImageStand: string[];
  Abilities: AbilityData[];
  ClassLV0SkillID: number;
  ClassLV1SkillID: number;
  Skills: SkillWithType[];
  ConneName: string;
  NickNames: string[];
  SpecialtyConfigs: UnitSpeciatyConfig[];
}

export interface EnemySpecialtyConfig {
  Type_Influence: number;
  Param_1: number;
  Param_2: number;
  Param_3: number;
  Param_4: number;
  _Expression: string;
  _ExtParam: string;
  Comment: string;
}

export interface Missile {
  MissileID: number;
  PatternID: number;
  Enemy: number;
  Speed: number;
  SlowTime: number;
  SlowRate: number;
  DamageArea: number;
  Property: string;
}

export interface Enemy {
  DotRate: number;
  SpecialEffect: number;
  PatternID: number;
  HP: number;
  HP_MAX: number;
  ATTACK_POWER: number;
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
  SpecialtyConfigs: EnemySpecialtyConfig[];
  EnemyElem: {
    _EnemyElementName: string;
  };
  EnemyType: {
    _EnemyTypeName: string;
  };
  Dots: Dot[];
  _Attribute: string;
  Missile?: Missile;
}

export interface MapEntry {
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
}

export interface MapRoute {
  X: number;
  Y: number;
  JumpPoint: number;
  WarpDelay: number;
  WaitTime: number;
  OnEvent?: string;
  RouteID: number;
}

export interface Map {
  Image: string;
  Entries: MapEntry[][];
  Routes: MapRoute[][];
  Locations: Array<
    Array<{
      ObjectID: number;
      X: number;
      Y: number;
      _Command?: string;
    }>
  >;
  Enemies: Enemy[];
}

export interface QuestTermConfig {
  Type_Influence: number;
  Data_Param1: number;
  Data_Param2: number;
  Data_Param3: number;
  Data_Param4: number;
  Data_Expression: string;
  Comment: string;
}

export interface Quest {
  EventArcs: Array<{
    _TalkerName: string;
    _TalkText: string;
  }>;
  HardInfomation: string;
  Name: string;
  Message: string;
  Charisma: number;
  EntryNo: number;
  LocationNo: number;
  Level: number;
  ActionPoint: number;
  Treasure1: number;
  Treasure2: number;
  Treasure3: number;
  Treasure4: number;
  Treasure5: number;
  RankExp: number;
  Gold: number;
  Capacity: number;
  QuestTerms: number;
  _HardCondition: number;
  _HardLevel: number;
  QuestTermConfigs: QuestTermConfig[];
  QuestHardTermConfigs: QuestTermConfig[];
  Mission: {
    MissionID: number;
    Enemies: Enemy[];
    BattleTalkEvents: Array<{
      Message: string;
      Name: string;
      FaceID: number;
      RecordIndex: number;
    }>;
  };
  Map: Map;
}
