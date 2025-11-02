// カテゴリー編集ページ
"use client";
import AdminDeleteButton from "@/app/_components/AdminDeleteButton";
import { AdminHeaderListPageDetails } from "@/app/_components/AdminHeaderListPageDetails";
import AdminInput from "@/app/_components/AdminInput";
import AdminLabel from "@/app/_components/AdminLabel";
import AdminUpdateButton from "@/app/_components/AdminUpdateButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const router = useRouter();
  useEffect(() => {
    const getCategoryDetailData = async () => {
      try {
        setLoading(true);
        const data = await fetch(`/api/admin/categories/${id}`);
        const res: ApiResponse = await data.json();
        if (res.category) {
          setCategory(res.category.name);
          setOldCategory(res.category.name);
        }
      } catch (error) {
        console.log(`データ取得中にエラーが発生しました`, error);
      } finally {
        setLoading(false);
      }
    };
    getCategoryDetailData();
  }, []);
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
        setLoading(true);
        const data = await fetch(`/api/admin/categories/${id}`, {
          method: "PUT",
          headers: {
            "contents-Type": "application/json",
          },
          body: JSON.stringify({
            name: category,
          }),
        });
        console.log(`データを更新しました`, data.json());
      } catch (error) {
        console.log(`データ更新中にエラーが発生しました`, error);
      } finally {
        setLoading(false);
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
  return (
    <div className="home-container p-4 px-[1rem] w-[95%]">
      <div className="px-4">
        <AdminHeaderListPageDetails title="カテゴリー編集" />
        <form method="POST" className="mt-3">
          <div className="flex flex-col">
            <AdminLabel htmlFor="name">カテゴリー名</AdminLabel>
            <AdminInput
              id="text"
              onChange={handleChangeInput}
              value={category}
            />
          </div>
          <div>
            <AdminUpdateButton onClick={handleUpdateCategory} />
            <AdminDeleteButton onClick={handleDeleteCategory} />
          </div>
        </form>
      </div>
    </div>
  );
}
