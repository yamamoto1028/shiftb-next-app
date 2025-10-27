"use server";
// 管理者_記事詳細取得API
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    //詳細表示する記事のIDをURLパラメータのIDから取得
    const { id } = params;
    const post = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        // カテゴリーも含めて取得
        postCategories: {
          include: {
            category: {
              // カテゴリーのidとnameだけ取得
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ status: "OK", post: post }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// 管理者_記事削除API
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json(
      { status: "OK", post: deletedPost },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// 管理者_記事更新API
// 更新するレコードの型定義をする
interface UpdatePostRequestBody {
  title: string;
  content: string;
  postCategories: {
    id: number;
    name: string;
  }[];
  thumbnailUrl: string;
}
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      title,
      content,
      thumbnailUrl,
      postCategories,
    }: UpdatePostRequestBody = body;

    const updatedPost = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
        thumbnailUrl,
      },
    });

    // 中間テーブルも更新
    // →既存のレコード削除。新しいレコードをCreate
    await prisma.postCategory.deleteMany({
      where: {
        postId: Number(id),
      },
    });
    await prisma.postCategory.createMany({
      data: postCategories.map((category) => ({
        postId: Number(id),
        categoryId: category.id,
      })),
    });
    return NextResponse.json(
      { status: "OK", post: updatedPost },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
