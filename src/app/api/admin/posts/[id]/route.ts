"use server";
// 管理者_記事詳細取得API
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export const GET = async (request: NextRequest, context: RouteContext) => {
  // フロントからのリクエストのヘッダーからAuthorizationのtokenを取得
  const token = request.headers.get("Authorization") ?? "";
  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);
  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返却
  if (error) {
    NextResponse.json({ status: error.message }, { status: 400 });
  }
  try {
    //詳細表示する記事のIDをURLパラメータのIDから取得
    const { id } = await context.params;
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

    // サーバー側で画像URLを取得してレスポンスに含める
    const {
      data: { publicUrl: thumbnailImageUrl },
    } = supabase.storage
      .from("post_thumbnail")
      .getPublicUrl(post?.thumbnailImageKey || "");

    return NextResponse.json(
      { status: "OK", post: post, thumbnailImageUrl: thumbnailImageUrl },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// 管理者_記事削除API
export const DELETE = async (request: NextRequest, context: RouteContext) => {
  try {
    const { id } = await context.params;
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
    value: number;
    label: string;
  }[];
  thumbnailImageKey: string;
}
export const PUT = async (request: NextRequest, context: RouteContext) => {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const {
      title,
      content,
      thumbnailImageKey,
      postCategories,
    }: UpdatePostRequestBody = body;

    const updatedPost = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
        thumbnailImageKey,
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
        categoryId: category.value,
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
