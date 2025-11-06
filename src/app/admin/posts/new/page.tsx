"use client";
import "../../../globals.css";
import { useEffect, useState } from "react";
import AdminCreateButton from "@/app/admin/_components/AdminCreateButton";
import AdminPostForm from "@/app/admin/_components/AdminPostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

interface OptionType {
  value: number;
  label: string;
}
// 管理者_記事新規作成ページ
export default function MakeDetail() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [postCategories, setPostCategories] = useState<OptionType[]>([]); //選択したカテゴリー
  const [apiCategories, setApiCategories] = useState<OptionType[]>([]); //Categoryテーブルに登録されているカテゴリーを取得
  const [sending, setSending] = useState(false); //送信中管理
  const [loading, setLoading] = useState(false); //読み込み中管理
  // エラーメッセージ管理
  const [errMsgTitle, setErrMsgTitle] = useState("");
  const [errMsgContent, setErrMsgContent] = useState("");
  const [errMsgThumbnail, setErrMsgThumbnail] = useState("");

  const { token } = useSupabaseSession();

  useEffect(() => {
    if (!token) return;
    const getCategoryData = async () => {
      try {
        setLoading(true);
        const data = await fetch(
          "/api/admin/categories",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          } //←JSON形式のデータ
        );
        const { categories }: { categories: { id: number; name: string }[] } =
          await data.json();
        setApiCategories(
          categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))
        );
      } catch (error) {
        console.error(`カテゴリーデータ取得中にエラーが発生しました`, error);
      } finally {
        setLoading(false);
      }
    };
    getCategoryData();
  }, []);

  const handleCheckInput = () => {
    let hasError = false;
    let hasErrorTitle = false;
    let hasErrorContent = false;
    let hasErrorThumbnailUrl = false;
    //タイトル欄チェック
    if (!title) {
      hasErrorTitle = true;
      setErrMsgTitle("タイトルは必須です");
    } else if (title.length >= 20) {
      hasErrorTitle = true;
      setErrMsgTitle("タイトルは20文字未満にしてください");
    } else {
      hasErrorTitle = false;
      setErrMsgTitle("");
    }
    // 内容欄チェック
    if (!content) {
      hasErrorContent = true;
      setErrMsgContent("内容は必須です");
    } else if (content.length >= 500) {
      hasErrorContent = true;
      setErrMsgContent("内容は500文字未満にしてください");
    } else {
      hasErrorContent = false;
      setErrMsgContent("");
    }
    // サムネイルURL欄チェック
    if (!thumbnailUrl) {
      hasErrorThumbnailUrl = true;
      setErrMsgThumbnail("画像を指定してください");
    } else {
      hasErrorThumbnailUrl = false;
      setErrMsgThumbnail("");
    }
    if (
      hasErrorTitle === false &&
      hasErrorContent === false &&
      hasErrorThumbnailUrl === false
    ) {
      hasError = false;
    } else {
      hasError = true;
    }
    return hasError;
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  const handleChangeThumbnailUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailUrl(e.target.value);
  };

  const handleClearInput = () => {
    setTitle("");
    setContent("");
    setThumbnailUrl("");
    setPostCategories([]);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      const hasError = handleCheckInput(); //実行の結果を変数に格納することで「handleCheckInput」の実行結果を再利用可能になる。
      if (confirm("送信しますか？")) {
        if (hasError) {
          alert("入力内容に誤りがあります");
          return;
        }
        setSending(true);
        if (!token) return;
        await fetch("/api/admin/posts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            title,
            content,
            thumbnailUrl,
            postCategories,
          }), //送信データをオブジェクト形式で渡す
        });
        alert("送信しました");
        handleClearInput();
        console.log(`データを送信しました / title:${title}`);
      } else {
        return;
      }
    } catch (error) {
      console.log(`送信中にエラーが発生しました`, error);
    } finally {
      setSending(false);
    }
  };
  if (sending) {
    return <div>送信中・・・</div>;
  }
  if (loading) {
    return <div>読み込み中・・・</div>;
  }
  return (
    <>
      <AdminPostForm
        title="記事作成"
        titleValue={title}
        titleOnChange={handleChangeTitle}
        titleDisabled={sending}
        errMsgTitle={errMsgTitle}
        contentValue={content}
        contentOnChange={handleChangeContent}
        contentDisabled={sending}
        errMsgContent={errMsgContent}
        thumbnailUrlValue={thumbnailUrl}
        thumnailUrlOnChange={handleChangeThumbnailUrl}
        thumbnailUrlDisabled={sending}
        errMsgThumbnail={errMsgThumbnail}
        categoryOptions={apiCategories}
        categoryValue={postCategories}
        categoryOnChange={(selected) => {
          setPostCategories(selected as OptionType[]);
        }}
        categoryIsDisabled={sending}
      >
        <AdminCreateButton onClick={handleSubmit} disabled={sending} />
      </AdminPostForm>
    </>
  );
}
