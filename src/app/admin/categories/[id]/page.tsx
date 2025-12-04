// カテゴリー編集ページ
"use client";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import AdminCategoryForm from "@/app/admin/_components/AdminCategoryForm";
import AdminDeleteButton from "@/app/admin/_components/AdminDeleteButton";
import AdminUpdateButton from "@/app/admin/_components/AdminUpdateButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import React from "react";

interface ArticleDetailProps {
  params:
    | {
        id: string;
      }
    | Promise<{ id: string }>;
}

interface ApiResponse {
  status: string;
  category: Category;
}
interface Category {
  id: number;
  name: string;
}

export default function EditCategoryPage({ params }: ArticleDetailProps) {
  let actualParams: { id: string };
  actualParams = React.use(params as Promise<{ id: string }>);
  const { id } = actualParams;
  const [category, setCategory] = useState("");
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const { token } = useSupabaseSession();
  const {
    data: categoryData,
    error,
    mutate,
  } = useFetch<ApiResponse>({
    endPoint: `/api/admin/categories/${id}`,
  });
  console.log(categoryData);
  useEffect(() => {
    if (!categoryData) return;
    setCategory(categoryData.category.name); //マウント時とresData更新時にのみAPIから取得したカテゴリー名をセット
  }, [categoryData]);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  // 更新処理
  const handleUpdateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    if (!category) {
      alert(
        "カテゴリー名が入力されていません。削除する場合は削除ボタンを押してください。"
      );
      return;
    }
    if (categoryData?.category.name === category) {
      alert("変更されていません");
      return;
    }
    if (confirm(`更新しますか？`)) {
      try {
        setSending(true);
        await fetch(`/api/admin/categories/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            name: category,
          }),
        });
        await mutate(); //使うならここ？finally↓のrouter.push()で再描画されるから本来は不要そう
        console.log(`データを更新しました`);
      } catch (error) {
        console.log(`データ更新中にエラーが発生しました`, error);
      } finally {
        setSending(false);
        router.push("/admin/categories");
      }
    }
  };

  // 削除処理
  const handleDeleteCategory = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (confirm(`${category}のデータを削除しますか？`)) {
      try {
        setSending(true);
        const data = await fetch(`/api/admin/categories/${id}`, {
          method: "DELETE",
        });
        const res: ApiResponse = await data.json();
        console.log(`データを削除しました`);
        console.log(res);
      } catch (error) {
        console.log(`データ削除中にエラーが発生しました`, error);
      } finally {
        setSending(false);
        router.push("/admin/categories");
      }
    }
  };
  if (error) {
    return <div>{error.message}</div>;
  }
  if (!categoryData) {
    return <div>読み込み中・・・</div>;
  }
  if (sending) {
    return <>送信中・・・</>;
  }
  return (
    <AdminCategoryForm
      title="カテゴリー編集"
      label="カテゴリー名"
      onChange={handleChangeInput}
      value={category}
      disabled={sending}
      className="mt-1 block w-full rounded-md border border-gray-200 p-3"
      onSubmit={handleUpdateCategory}
    >
      <div>
        <AdminUpdateButton disabled={sending} />
        <AdminDeleteButton onClick={handleDeleteCategory} disabled={sending} />
      </div>
    </AdminCategoryForm>
  );
}
