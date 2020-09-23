import { Word } from './Word';

export type Wordbook = {
  id: number;
  userId: number; // 用户Id
  slug?: string; // 缩略名
  coverUrl?: string; // 封面图片链接（原始尺寸）
  backgroundUrl?: string; // 背景图片链接（原始尺寸）
  title?: string; // 标题
  summary?: string; // 摘要
  tags?: any; // 标签
  visibility?: string; // 可见性 [public, private]
  difficultyLevel?: string; //难度等级
  author?: string; // 作者
  authorEmail?: string; // 作者邮箱
  authorLink?: string; // 作者链接
  wordCount?: number; // 单词数
  learnerCount?: number; // 学习人数
  favoriteCount?: number; // 收藏人数
  words?: Array<Word>;
  createdAt: string;
  updatedAt: string;
};
