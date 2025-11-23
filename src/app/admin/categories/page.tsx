// カテゴリー一覧ページ
"use client";
import "../../globals.css";
import Link from "next/link";
import { Category } from "@prisma/client";
import AdminHeaderListPage from "@/app/admin/_components/AdminHeaderListPage";
import { useFetch } from "@/app/_hooks/useFetch";

interface ApiResponse {
  status: string;
  categories: Category[];
}

export default function CategoryList() {
  const { data, error } = useFetch<ApiResponse>({
    endPoint: `/api/admin/categories`,
  });
  console.log(data);

  if (error) {
    return <div>{error.message}</div>;
  }
  if (!data) {
    return <div>読み込み中・・・</div>;
  }

  if (data.categories.length === 0) {
    return (
      <div>
        <div>データがありません</div>
        <Link href="/admin/categories/new">
          <button className="bg-blue-500 hover:bg-blue-700 border-[#548bf0] text-white font-black py-2 px-4 rounded">
            新規作成
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <main className="home-container p-4 w-[100%]">
        <AdminHeaderListPage
          title={"カテゴリー一覧"}
          href={`/admin/categories/new`}
        ></AdminHeaderListPage>
        <div className="mt-8">
          {data.categories.map((category) => (
            <Link
              href={`/admin/categories/${category.id}`}
              key={category.id}
              className="no-underline"
            >
              <article className="border-b border-gray-300 p-4 hover:bg-gray-100 cursor-pointer font-black">
                <h2 className="text-[#000]">{category.name}</h2>
              </article>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
