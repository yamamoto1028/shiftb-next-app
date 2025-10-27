// カテゴリー編集ページ
"use client";
import { useEffect, useState } from "react";

export default function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getCategoryDetailData = async () => {
      try {
        setLoading(true);
        const data = await fetch(`/api/admin/categories/${id}`);
        const res = await data.json();
        if (res.category) {
          setCategory(res.category.name);
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
  const handleUpdateCategory = async () => {
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
      }
    }
  };

  // 削除処理
  const handleDeleteCategory = async () => {
    if (confirm(`${category}のデータを削除しますか？`)) {
      try {
        setLoading(true);
        const data = await fetch(`/api/admin/categories/${id}`, {
          method: "DELETE",
        });
        const res = data.json();
        console.log(`データを削除しました`);
        console.log(res);
      } catch (error) {
        console.log(`データ削除中にエラーが発生しました`, error);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div>
      <h1>カテゴリー編集</h1>
      <form method="POST">
        <label htmlFor="name">カテゴリー名</label>
        <input
          type="text"
          id="name"
          onChange={handleChangeInput}
          value={category}
        />
        <div>
          <button type="submit" onClick={handleUpdateCategory}>
            更新
          </button>
          <button type="button" onClick={handleDeleteCategory}>
            削除
          </button>
        </div>
      </form>
    </div>
  );
}
