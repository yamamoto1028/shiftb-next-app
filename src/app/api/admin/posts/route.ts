"use server";
// 管理者_記事一覧取得API
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();

// GETという命名にすることで、GETリクエストの時にこの関数が呼ばれる
export const GET = async (request: NextRequest) => {
  // フロントからのリクエストのヘッダーからAuthorizationのtokenを取得
  const token = request.headers.get("Authorization") ?? "";
  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);
  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返却
  if (error) {
    NextResponse.json({ status: error.message }, { status: 400 });
  }
  try {
    // Postの一覧をDBから取得
    const posts = await prisma.post.findMany({
      include: {
        // カテゴリーも含めて取得(中間テーブル経由)
        postCategories: {
          include: {
            category: {
              // カテゴリーのidとnameだけ取得(カテゴリーテーブル)
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      // 作成日時の降順で取得
      orderBy: {
        createdAt: "desc",
      },
    });

    // レスポンスを返す
    return NextResponse.json({ status: "OK", posts: posts }, { status: 200 });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// 管理者_記事新規作成API
// 挿入するレコードの型定義をする
interface CreatePostRequestBody {
  title: string;
  content: string;
  postCategories: {
    id: number;
    value: string;
    label: string;
  }[];
  thumbnailUrl: string;
}
export const POST = async (request: NextRequest) => {
  const body = await request.json();
  const {
    title,
    content,
    postCategories,
    thumbnailUrl,
  }: CreatePostRequestBody = body;
  try {
    const postData = await prisma.post.create({
      data: {
        title,
        content,
        thumbnailUrl,
      },
    });
    // 記事カテゴリーテーブルの中間テーブル(postCategory)にもレコードをcreateする
    // categoriesの数だけレコードを作成
    const postCategory = await prisma.postCategory.createMany({
      data: postCategories.map((category) => ({
        postId: postData.id,
        categoryId: category.id,
      })),
    });

    return NextResponse.json(
      { id: postData.id, category: postCategory, message: "作成しました" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};
