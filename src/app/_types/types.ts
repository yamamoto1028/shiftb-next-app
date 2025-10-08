export type ArticleType = {
  id: number;
  title: string;
  thumbnailUrl: string;
  createdAt: string;
  categories: string[];
  content: string;
};

export type ArticleTypes = ArticleType[];
