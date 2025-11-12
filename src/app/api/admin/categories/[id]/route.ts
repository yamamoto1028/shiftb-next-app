// 管理者_カテゴリー詳細取得API
"use server";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { supabase } from "@/utils/supabase";

const prisma = new PrismaClient();
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  // フロントからのリクエストのヘッダーからAuthorizationのtokenを取得
  const token = request.headers.get("Authorization") ?? "";
  // supabaseに対してtokenを送る
  const { error } = await supabase.auth.getUser(token);
  // 送ったtokenが正しくない場合、errorが返却されるので、クライアントにもエラーを返却
  if (error) {
    NextResponse.json({ status: error.message }, { status: 400 });
  }
  try {
    const { id } = params;
    const categories = await prisma.category.findUnique({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json(
      { status: "OK", category: categories },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      NextResponse.json({ status: error.message }, { status: 400 });
    }
  }
};

// 管理者_カテゴリー更新API
// 更新するレコードの型定義
interface UDRequestBody {
  name: string;
}
export const PUT = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const body = await request.json();
    const { name }: UDRequestBody = body;

    const updateCategory = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });
    return NextResponse.json({ category: updateCategory }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ status: error.message }, { status: 401 });
    }
  }
};

// 管理者_カテゴリー削除API
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const deleteCategory = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json(
      { status: "OK", category: deleteCategory },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      NextResponse.json({ error }, { status: 400 });
    }
  }
};
