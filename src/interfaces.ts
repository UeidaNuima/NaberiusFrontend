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
