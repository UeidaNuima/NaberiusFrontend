import { Quest } from 'interfaces';

export interface Data {
  Quest: Quest;
  QuestEventTexts: Array<{
    Message: string;
    Name: string;
    FaceID: number;
  }>;
}
