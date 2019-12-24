import gql from 'graphql-tag';

export const DotFragment = gql`
  fragment Dot on Dot {
    Name
    Length
    Entries {
      Sprites {
        X
        Y
        Width
        Height
        OriginX
        OriginY
      }
      PatternNo {
        Time
        Data
      }
      Pos {
        Time
        Data {
          X
          Y
        }
      }
      Scale {
        Time
        Data {
          X
          Y
        }
      }
      Alpha {
        Time
        Data
      }
    }
  }
`;

export const MissileFragment = gql`
  fragment missile on Missile {
    MissileID
    PatternID
    Enemy
    Speed
    SlowTime
    SlowRate
    DamageArea
    Property
  }
`;

export const EnemyFragment = gql`
  fragment enemy on Enemy {
    HitEffect
    MissileID
    DeadEffect
    SpecialEffect
    PatternID
    Weather
    HP
    HP_MAX
    ATTACK_POWER
    TypeAttack
    ATTACK_RANGE
    ATTACK_SPEED
    ARMOR_DEFENSE
    MAGIC_DEFENSE
    MOVE_SPEED
    SKILL
    SkyFlag
    GainCost
    EffectHeight
    MagicAttack
    AttackWait
    MissileID
    Missile {
      ...missile
    }
    DeadEffect
    Param_ResistanceAssassin
    Param_ChangeParam
    Param_ChangeCondition
    SpecialtyConfigs {
      Type_Influence
      Param_1
      Param_2
      Param_3
      Param_4
      _Expression
      _ExtParam
    }
    EnemyElem {
      _EnemyElementName
    }
    EnemyType {
      _EnemyTypeName
    }
    Dots {
      ...Dot
    }
    _Attribute
  }
  ${MissileFragment}
`;
