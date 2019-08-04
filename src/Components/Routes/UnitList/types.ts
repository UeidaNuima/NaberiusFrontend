export interface Card {
  CardID: number;
  Name: string;
  Rare: number;
  Kind: number;
  Illust: number;
  Race: number;
  Assign: number;
  Identity: number;
  NickName: string;
  ConneName: string;
  Class: {
    ClassInit: {
      Name: string;
    };
  };
}
