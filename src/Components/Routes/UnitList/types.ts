export interface Card {
  CardID: number;
  Name: string;
  Rare: number;
  Kind: number;
  IllustName: string;
  RaceName: string;
  AssignName: string;
  IdentityName: string;
  NickName: string;
  ConneName: string;
  Classes: Array<{
    Name: string;
  }>;
  // Class: {
  //   ClassInit: {
  //     Name: string;
  //   };
  // };
}
