// カテゴリー一覧ページ
"use client";
import "../../globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Category } from "@prisma/client";
import AdminHeaderListPage from "@/app/admin/_components/AdminHeaderListPage";

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCategoryData = async () => {
      try {
        setLoading(true);
        const data = await fetch(
          "/api/admin/categories" //←JSON形式のデータ
        );
        const { categories }: { categories: Category[] } = await data.json();
        setCategories(categories);
      } catch (error) {
        console.error(`カテゴリーデータ取得中にエラーが発生しました`, error);
      } finally {
        setLoading(false);
      }
    };
    getCategoryData();
  }, []);

  if (loading) {
    return <div>読み込み中・・・</div>;
  }

  if (categories.length === 0) {
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
          {categories.map((category) => (
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
