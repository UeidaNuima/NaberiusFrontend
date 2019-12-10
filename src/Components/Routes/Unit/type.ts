import gql from 'graphql-tag';

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
export interface Data {
  card: {
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
    Dots: string;
    // Dots: Array<{
    //   Name: string;
    //   Length: number;
    //   Entries: Array<{
    //     Name: string;
    //     Sprites: Array<{
    //       X: number;
    //       Y: number;
    //       Width: number;
    //       Height: number;
    //       OriginX: number;
    //       OriginY: number;
    //     }>;
    //     PatternNo: {
    //       Time: number;
    //       Data: number;
    //     };
    //   }>;
    //   Image: string;
    // }>;
    Classes: ClassData[];
    ImageCG: string[];
    ImageStand: string[];
    Abilities: AbilityData[];
    ClassLV0SkillID: number;
    ClassLV1SkillID: number;
    Skills: SkillWithType[];
  };
}

export const query = gql`
  query($id: Int!) {
    card(CardID: $id) {
      CardID
      _AwakePattern
      HarlemTextR
      HarlemTextA
      Name
      Rare
      Kind
      MaxHPMod
      AtkMod
      DefMod
      CostModValue
      CostDecValue
      MagicResistance
      BonusType
      BonusNum
      BonusType2
      BonusNum2
      BonusType3
      BonusNum3
      RaceName
      AssignName
      IdentityName
      IllustName
      HomeCooking
      SellPrice
      BuildExp
      _TradePoint
      Dots
      # Dots {
      #   Name
      #   Length
      #   Entries {
      #     Name
      #     Sprites {
      #       X
      #       Y
      #       Width
      #       Height
      #       OriginX
      #       OriginY
      #     }
      #     PatternNo {
      #       Time
      #       Data
      #     }
      #   }
      #   Image
      # }
      Classes {
        Type
        ClassID
        Name
        InitHP
        MaxHP
        InitDef
        MaxDef
        InitAtk
        MaxAtk
        AtkArea
        BlockNum
        MaxLevel
        Explanation
        Cost
        Data_ExtraAwakeOrbs {
          Name
        }
        AttackWait
        ClassAbilityConfigs {
          _InvokeType
          _TargetType
          _InfluenceType
          _Param1
          _Param2
          _Param3
          _Param4
          _Command
          _ActivateCommand
          # Description
        }
        ClassAbilityPower1
        BattleStyle {
          Data_ID
          Type_BattleStyle
          _Param_01
          _Param_02
          _Range_01
          _Range_02
          _Range_03
          _Range_04
          _Range_05
        }
      }
      ImageCG
      ImageStand
      Abilities {
        Type
        AbilityID
        Text
        AbilityName
        Configs {
          _InvokeType
          _TargetType
          _InfluenceType
          _Param1
          _Param2
          _Param3
          _Param4
          _Command
          _ActivateCommand
          # Description
        }
      }
      ClassLV0SkillID
      ClassLV1SkillID
      Skills {
        Type
        Skills {
          SkillName
          WaitTime
          ContTimeMax
          PowerMax
          LevelMax
          Text
          Configs {
            Type_Collision
            Type_CollisionState
            Type_ChangeFunction
            Data_Target
            Data_InfluenceType
            Data_MulValue
            Data_MulValue2
            Data_MulValue3
            Data_AddValue
            _HoldRatioUpperLimit
            _Expression
            _ExpressionActivate
            # Description
          }
        }
      }
    }
  }
`;
