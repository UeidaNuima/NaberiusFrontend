export interface Card {
  CardID: string;
  Name: string;
  Rare: string;
  Kind: string;
  IllustName: string;
  RaceName: string;
  AssignName: string;
  IdentityName: string;
  NickName: string;
  ConneName: string;
  GenusName: string;
  Classes: Array<{
    Name: string;
  }>;
}
