export type User = {
  id: number;
  email?: string; // 邮箱
  username?: string; // 用户名
  name: string; // 姓名
  avatarUrl?: string; // 头像链接（原始尺寸）
  age?: number; // 年龄
  gender?: string; // 性别 [secrecy, male, female]
  birthday?: string; // 生日
  createdAt: string;
  updatedAt: string;
};
