// Post型のリレーションまで定義した型を作る
// Post → PostCategory → Category
import { Prisma } from "@prisma/client";

export type WithPostCategories = Prisma.PostGetPayload<{
  include: {
    postCategories: {
      include: { category: true };
    };
  };
}>;
