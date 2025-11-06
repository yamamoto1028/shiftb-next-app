// カテゴリー新規作成ページ
"use client";
import AdminHeaderListPageDetails from "@/app/admin/_components/AdminHeaderListPageDetails";
import "../../../globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminCreateButton from "@/app/admin/_components/AdminCreateButton";
import AdminLabel from "@/app/admin/_components/AdminLabel";
import AdminInput from "@/app/admin/_components/AdminInput";
import AdminCategoryForm from "@/app/admin/_components/AdminCategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

interface SubmitResData {
  status: string;
  id: number;
  name: string;
}

export default function AddCategoriesPage() {
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);
  const { token } = useSupabaseSession();

  const router = useRouter();
  const handleChangeInputCategory = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setName(e.target.value);
  };

  const handleClearInput = () => {
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!token) return;
    try {
      setSending(true);
      if (!name) {
        alert(`カテゴリー名が入力されていません。`);
        return;
      }
      const data = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, //token(ログインしたユーザしか持っていない情報も一緒に渡す)
        },
        body: JSON.stringify({
          name,
        }), //送信データをオブジェクト形式で渡す
      });
      alert(`新規カテゴリーを作成しました(${name})`);
      console.log(`データを送信しました / ${name}`);
      const res: SubmitResData = await data.json();
      const { id } = res;
      router.push(`/admin/categories/${id}`);

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
    <AdminCategoryForm
      title="カテゴリー作成"
      label="カテゴリー名"
      onChange={handleChangeInputCategory}
      value={name}
      disabled={sending}
    >
      <AdminCreateButton onClick={handleSubmit} />
    </AdminCategoryForm>
  );
}
