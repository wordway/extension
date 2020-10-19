export type Word = {
  id: number;
  engine: string;
  word: string;
  tip?: string;
  definitions?: Array<any>;
  ukIpa?: string;
  ukPronunciationUrl?: string;
  usIpa?: string;
  usPronunciationUrl?: string;
  images?: Array<any>;
  phrases?: Array<any>;
  tenses?: Array<any>;
  sentences?: Array<any>;
};
