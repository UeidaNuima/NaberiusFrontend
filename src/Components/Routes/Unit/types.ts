import gql from 'graphql-tag';
import { Card } from 'interfaces';
import { DotFragment, MissileFragment } from 'fragments';

export interface Data {
  Card: Card;
}

export const query = gql`
  query($id: Int!) {
    Card(CardID: $id) {
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
      ConneName
      NickNames
      Dots {
        ...Dot
      }
      Classes {
        JobChange
        AttackAttribute
        Missile {
          ...missile
        }
        Cards {
          Rare
          CardID
          Name
        }
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
        NickNames
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
        Cards {
          Rare
          CardID
          Name
        }
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
          SkillID
          Cards {
            Rare
            Name
            CardID
          }
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
  ${DotFragment}
  ${MissileFragment}
`;
