"use client";
import "../../../globals.css";
import { useState } from "react";
import AdminCreateButton from "@/app/admin/_components/AdminCreateButton";
import AdminPostForm from "@/app/admin/_components/AdminPostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid"; // 固有IDを生成するライブラリ
import useSWR from "swr";
import { useFetch } from "@/app/_hooks/useFetch";
import { Category } from "@prisma/client";

interface OptionType {
  value: number;
  label: string;
}
// 管理者_記事新規作成ページ
export default function MakeDetail() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postCategories, setPostCategories] = useState<OptionType[]>([]); //選択したカテゴリー
  const [apiCategories, setApiCategories] = useState<OptionType[]>([]); //Categoryテーブルに登録されているカテゴリーを取得
  const [sending, setSending] = useState(false); //送信中管理
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null
  );
  // エラーメッセージ管理
  const [errMsgTitle, setErrMsgTitle] = useState("");
  const [errMsgContent, setErrMsgContent] = useState("");
  const [errMsgThumbnail, setErrMsgThumbnail] = useState("");
  const { token } = useSupabaseSession();

  const categoryData = useFetch<{ categories: Category[] }>({
    endPoint: `/api/admin/categories`,
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    onSuccess: (data) => {
      console.log("3:dataのuseSWRのonSuccess開始");
      const categories: Category[] = data.categories;
      setApiCategories(
        categories.map((category) => ({
          value: category.id,
          label: category.name,
        }))
      );
    },
  });
  const categoryLoading = categoryData.isLoading;
  const categoryDataValue = categoryData.data;
  console.log(categoryDataValue);

  const imageUrlFetcher = async () => {
    const {
      data: { publicUrl },
    } = await supabase.storage
      .from("post_thumbnail")
      .getPublicUrl(thumbnailImageKey);
    setThumbnailImageUrl(publicUrl);
    return publicUrl;
  };
  const imageUrlData = useSWR(thumbnailImageKey, imageUrlFetcher, {
    onSuccess: (data) => {
      setThumbnailImageUrl(data);
    },
  });
  const imageLoading = imageUrlData.isLoading;
  const imageDataValue = imageUrlData.data;
  console.log(imageDataValue);

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
    if (!thumbnailImageUrl) {
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
  const handleChangeThumbnailUrl = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    if (!e.target.files || e.target.files.length === 0) {
      return; //画像が選択されていない場合はreturn
    }
    const file = e.target.files[0]; // 選択された画像を取得
    const filePath = `private/${uuidv4()}`; //ファイルパスを指定
    // Supabaseに画像をアップロード
    const { data, error } = await supabase.storage
      .from("post_thumbnail") //バケット名を指定
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });
    // アップロードに失敗したらエラー出して終了
    if (error) {
      alert(error.message);
      return;
    }
    // data.pathに、画像固有のkeyが入っているので、thumbnailImageKeyに格納する
    setThumbnailImageKey(data.path);
  };

  const handleClearInput = () => {
    setTitle("");
    setContent("");
    setThumbnailImageUrl(null);
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
            postCategories,
            thumbnailImageKey,
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
  if (categoryLoading || imageLoading) {
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
        thumbnailUrlValue={thumbnailImageUrl}
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
