// カテゴリー一覧ページ
"use client";
import "../../globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Category } from "@prisma/client";
import { AdminHeaderListPage } from "@/app/_components/AdminHeaderListPage";

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
        <div>データなし</div>
        <Link
          href="/admin/categories/new"
          className="text-[#000] font-[700] no-underline"
        >
          管理者_カテゴリー新規作成ページ
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
