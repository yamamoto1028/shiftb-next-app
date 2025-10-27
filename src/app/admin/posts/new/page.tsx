"use client";
import "../../../globals.css";
import { useEffect, useState } from "react";
import Select from "react-select";

type OptionType = {
  id: number;
  value: string;
  label: string;
};
// 管理者_記事新規作成ページ
export default function MakeDetail() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [postCategories, setPostCategories] = useState<OptionType[]>([]); //選択したカテゴリー
  const [apiCategories, setApiCategories] = useState<OptionType[]>([]); //Categoryテーブルに登録されているカテゴリーを取得
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCategoryData = async () => {
      try {
        setLoading(true);
        const data = await fetch(
          "/api/admin/categories" //←JSON形式のデータ
        );
        const { categories } = await data.json();
        const result: OptionType[] = categories
          .slice()
          .map((arr: { id: number; name: string }) => ({
            id: arr.id,
            value: arr.name,
            label: arr.name,
          }));
        setApiCategories(result);
      } catch (error) {
        console.error(`カテゴリーデータ取得中にエラーが発生しました`, error);
      } finally {
        setLoading(false);
      }
    };
    getCategoryData();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailUrl(e.target.value);
  };

  const handleClearInput = () => {
    setTitle("");
    setContent("");
    setThumbnailUrl("");
    setPostCategories([]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      if (sending) return;
      e.preventDefault();
      setSending(true);
      // handleCheckInput(); //入力内容チェックしエラーMSGをセット
      // if (handleCheckInput()) {
      //   alert("入力内容に誤りがあります");
      //   return;
      // }
      // 送信処理
      await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    } catch (error) {
      console.log(`送信中にエラーが発生しました`, error);
    } finally {
      setSending(false);
    }
  };
  return (
    <div>
      <form action="/api/admin/posts" method="post" onSubmit={handleSubmit}>
        <div>
          <nav>ナビゲーション</nav>
          <div>
            <div className="container">
              <label htmlFor="title">title</label>
              <input
                id="title"
                type="text"
                onChange={handleTitleChange}
                value={title}
              ></input>
            </div>
          </div>
          <div>
            <div className="container">
              <label htmlFor="content">content</label>
              <input
                id="content"
                type="text"
                onChange={handleContentChange}
                value={content}
              ></input>
            </div>
          </div>
          <div>
            <div className="container">
              <label htmlFor="thumbnailUrl">thumbnailUrl</label>
              <input
                id="thumbnailUrl"
                type="text"
                onChange={handleThumbnailChange}
                value={thumbnailUrl}
              ></input>
            </div>
          </div>
          <div>
            <div className="container">
              <label htmlFor="postCategories">postCategories</label>
              <Select<OptionType, true>
                id="postCategories"
                options={apiCategories}
                value={postCategories}
                onChange={(selected) => {
                  setPostCategories(selected as OptionType[]);
                }}
                isMulti
                placeholder="カテゴリーを選択"
                className="w-[50%]"
              />
            </div>
          </div>
        </div>
        <button type="submit">作成</button>
      </form>
    </div>
  );
}
