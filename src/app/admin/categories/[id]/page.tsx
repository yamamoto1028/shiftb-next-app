// カテゴリー編集ページ
"use client";
import { useFetch } from "@/app/_hooks/useFetch";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import AdminCategoryForm from "@/app/admin/_components/AdminCategoryForm";
import AdminDeleteButton from "@/app/admin/_components/AdminDeleteButton";
import AdminUpdateButton from "@/app/admin/_components/AdminUpdateButton";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ApiResponse {
  status: string;
  category: Category;
}
interface Category {
  id: number;
  name: string;
}

export default function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [category, setCategory] = useState("");
  const [oldCategory, setOldCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const { token } = useSupabaseSession();

  const { data, isLoading } = useFetch<ApiResponse>({
    endPoint: `/api/admin/categories/${id}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    onSuccess: (data) => {
      setCategory(data.category.name);
      setOldCategory(data.category.name);
    },
  });
  console.log(data);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };
  if (loading) {
    return <div>読み込み中・・・</div>;
  }

  // 更新処理
  const handleUpdateCategory = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!token) return;
    if (!category) {
      alert(
        "カテゴリー名が入力されていません。削除する場合は削除ボタンを押してください。"
      );
      return;
    }
    if (oldCategory === category) {
      alert("変更されていません");
      return;
    }
    if (confirm(`更新しますか？`)) {
      try {
        setSending(true);
        const data = await fetch(`/api/admin/categories/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            name: category,
          }),
        });
        const res = await data.json();
        console.log(`データを更新しました`, res);
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
        setLoading(true);
        const data = await fetch(`/api/admin/categories/${id}`, {
          method: "DELETE",
        });
        const res: ApiResponse = await data.json();
        console.log(`データを削除しました`);
        console.log(res);
      } catch (error) {
        console.log(`データ削除中にエラーが発生しました`, error);
      } finally {
        setLoading(false);
        router.push("/admin/categories");
      }
    }
  };
  if (loading || isLoading) {
    return <>読み込み中・・・</>;
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
    >
      <div>
        <AdminUpdateButton onClick={handleUpdateCategory} disabled={sending} />
        <AdminDeleteButton onClick={handleDeleteCategory} disabled={sending} />
      </div>
    </AdminCategoryForm>
  );
}
