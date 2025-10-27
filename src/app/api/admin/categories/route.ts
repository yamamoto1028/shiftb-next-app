// 管理者_カテゴリー新規作成API
"use server";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Category {
  name: string;
}
export const POST = async (request: NextRequest) => {
  try {
    // クライアントからのリクエストの内容をJSON形式でbodyに格納
    const body = await request.json();
    const { name }: Category = body; //取得したリクエスト内容から項目ごとに取り出す
    const existingCategory = await prisma.category.findFirst({
      //リクエスト内容のnameがすでにテーブルに存在するかチェック
      where: {
        name,
      },
    });
    if (existingCategory) {
      throw new Error(`このカテゴリーはすでに存在しています`);
    }
    const postData = await prisma.category.create({
      //PrismaのCategoryテーブルにCreateメソッドでレコード作成
      data: {
        name, //name:name,の省略記法
      },
    });
    // 返り値は定型で覚える。大体、作成したレコードとステータスを返す。
    return NextResponse.json(
      {
        status: "カテゴリーを作成しました",
        id: postData.id,
        name: postData.name,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ status: error.message }, { status: 400 });
  }
};

// 管理者_カテゴリー一覧取得API
export const GET = async (request: NextRequest) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(categories);

    return NextResponse.json(
      { status: "OK", categories: categories },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};
