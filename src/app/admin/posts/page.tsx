"use client";
// 管理者_記事一覧ページ
import "../../globals.css";
import Link from "next/link";
import { useState } from "react";
import { WithPostCategories } from "@/app/_types/types";
import AdminHeaderListPage from "@/app/admin/_components/AdminHeaderListPage";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import useSWR from "swr";

interface ApiResponse {
  status: string;
  posts: WithPostCategories[];
}
export default function ArticleList() {
  const [posts, setPosts] = useState<WithPostCategories[]>([]);
  const { token } = useSupabaseSession();

  const fetcher = async (): Promise<ApiResponse> => {
    if (!token) throw new Error("tokenがありません");
    const res = await fetch(`/api/admin/posts`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    if (res.status !== 200) {
      const ErrMsg: { message: string } = await res.json();
      throw new Error(ErrMsg.message);
    }
    const data: ApiResponse = await res.json();
    return data;
  };
  const { data, isLoading } = useSWR<ApiResponse>(
    token ? `/api/admin/posts` : null, //tokenがセットされていたらエンドポイントにfetchする
    fetcher,
    {
      onSuccess: (data) => {
        setPosts(data.posts ?? []);
      },
    }
  );
  console.log(data);

  if (isLoading) {
    return <div>読み込み中・・・</div>;
  }

  if (posts.length === 0) {
    return (
      <div>
        <div>記事がありません</div>
        <Link href={`/admin/posts/new`}>
          <button className="bg-blue-500 hover:bg-blue-700 border-[#548bf0] text-white font-black py-2 px-4 rounded">
            新規作成
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <main className="home-container  p-4">
        <AdminHeaderListPage
          title={"記事一覧"}
          href={`/admin/posts/new`}
        ></AdminHeaderListPage>
        <div className="mt-8">
          {posts.map((post) => (
            <Link
              href={`/admin/posts/${post.id}`}
              key={post.id}
              className="no-underline "
            >
              <article className="border-b border-gray-300 p-4 flex-row cursor-pointer hover:bg-gray-100">
                <div className=" text-xl font-bold">{post.title}</div>
                <div className="text-gray-500">
                  {String(post.createdAt)
                    .slice(0, 10)
                    .split("-")
                    .map((n) => Number(n))
                    .join("/")}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
