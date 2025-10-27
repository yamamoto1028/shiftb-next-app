// カテゴリー新規作成ページ
"use client";
import "../../../globals.css";
import { useState } from "react";

export default function AddCategoriesPage() {
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);

  const handleChangeInputCategory = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setName(e.target.value);
  };

  const handleClearInput = () => {
    setName("");
  };

  const handleSubmit = async () => {
    try {
      setSending(true);
      if (!name) {
        alert(`カテゴリー名が入力されていません`);
        return;
      }
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
        }), //送信データをオブジェクト形式で渡す
      });
      alert(`新規カテゴリーを作成しました(${name})`);
      console.log(`データを送信しました / ${name}`);
      handleClearInput();
    } catch (error) {
      console.log(`送信中にエラーが発生しました`, error);
    } finally {
      setSending(false);
    }
  };

  if (sending) {
    return <div>送信中・・・</div>;
  }
  return (
    <div>
      <h1>カテゴリー作成</h1>
      <form method="post">
        <label htmlFor="categoryName">カテゴリー名</label>
        <input
          type="text"
          id="categoryName"
          value={name}
          onChange={handleChangeInputCategory}
        />
        <button type="submit" onClick={handleSubmit}>
          新規作成
        </button>
      </form>
    </div>
  );
}
