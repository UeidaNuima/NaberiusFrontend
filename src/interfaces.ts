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

export interface ClassData {
  Type: 'Init' | 'CC' | 'Evo' | 'Evo2a' | 'Evo2b';
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
  ClassAbilityConfigs: Array<{
    _InvokeType: number;
    _TargetType: number;
    _InfluenceType: number;
    _Param1: number;
    _Param2: number;
    _Param3: number;
    _Param4: number;
    _Command: string;
    _ActivateCommand: string;
    // Description: string;
  }>;
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
}

export interface SkillData {
  SkillName: string;
  WaitTime: number;
  ContTimeMax: number;
  PowerMax: number;
  LevelMax: number;
  Text: string;
  Configs: Array<{
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
    // Description: string;
  }>;
}

export interface SkillWithType {
  Type: 'Init' | 'CC' | 'Evo';
  Skills: SkillData[];
}

export interface AbilityData {
  Type: 'Init' | 'Evo';
  AbilityID: number;
  Text: string;
  AbilityName: string;
  Configs: Array<{
    _InvokeType: number;
    _TargetType: number;
    _InfluenceType: number;
    _Param1: number;
    _Param2: number;
    _Param3: number;
    _Param4: number;
    _Command: string;
    _ActivateCommand: string;
    // Description: string;
  }>;
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
  RaceName: number;
  AssignName: number;
  IdentityName: number;
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
}

export interface SpecialtyConfig {
  Type_Influence: number;
  Param_1: number;
  Param_2: number;
  Param_3: number;
  Param_4: number;
  _Expression: string;
  _ExtParam: string;
}

export interface Enemy {
  SpecialEffect: any;
  PatternID: number;
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
  SpecialtyConfigs: SpecialtyConfig[];
  EnemyElem: {
    _EnemyElementName: string;
  };
  EnemyType: {
    _EnemyTypeName: string;
  };
  Dots: Dot[];
  _Attribute: string;
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

export interface Map {
  Image: string;
  Entries: MapEntry[][];
  Routes: Array<
    Array<{
      X: number;
      Y: number;
      JumpPoint: number;
      WarpDelay: number;
      WaitTime: number;
      OnEvent?: string;
    }>
  >;
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
}

export interface Quest {
  EventArcs: Array<{
    _TalkerName: string;
    _TalkText: string;
  }>;
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
