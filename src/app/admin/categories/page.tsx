// カテゴリー一覧ページ
"use client";
import "../../globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Category } from "@prisma/client";

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
        const { categories } = await data.json();
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
      <main className="home-container max-w-[800px] mx-auto my-[40px] px-[1rem] overflow-auto">
        {categories.map((category) => (
          <Link
            href={`/admin/categories/${category.id}`}
            key={category.id}
            className="no-underline"
          >
            <article className="border-1 border-[#ccc] p-[1rem] flex-row mb-[2rem] cursor-pointer">
              <div>{category.name}</div>
            </article>
          </Link>
        ))}
        <Link href="/admin/categories/new" className="text-[#000] no-underline">
          管理者_カテゴリー新規作成ページ
        </Link>
      </main>
    </>
  );
}
