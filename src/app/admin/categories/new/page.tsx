// カテゴリー新規作成ページ
"use client";
import { AdminHeaderListPageDetails } from "@/app/_components/AdminHeaderListPageDetails";
import "../../../globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminCreateButton from "@/app/_components/AdminCreateButton";
import AdminLabel from "@/app/_components/AdminLabel";
import AdminInput from "@/app/_components/AdminInput";

interface SubmitResData {
  status: string;
  id: number;
  name: string;
}

export default function AddCategoriesPage() {
  const [name, setName] = useState("");
  const [sending, setSending] = useState(false);

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
    <div className="home-container p-4 w-[95%]">
      <div className="px-4">
        <AdminHeaderListPageDetails title="カテゴリー作成" />
        <form method="post">
          <div className="mt-8 flex flex-col">
            <AdminLabel htmlFor="categoryName">カテゴリー名</AdminLabel>
            <AdminInput
              id="categoryName"
              onChange={handleChangeInputCategory}
              value={name}
            />
          </div>
          <AdminCreateButton onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
}
