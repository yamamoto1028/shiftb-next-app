"use client";
import { AdminHeaderListPageDetails } from "@/app/_components/AdminHeaderListPageDetails";
import "../../../globals.css";
import { useEffect, useState } from "react";
import Select from "react-select";
import AdminLabel from "@/app/_components/AdminLabel";
import AdminInput from "@/app/_components/AdminInput";
import AdminCreateButton from "@/app/_components/AdminCreateButton";
import AdminErrorMassage from "@/app/_components/AdminErrorMassage";
import AdminTextarea from "@/app/_components/AdminTextarea";

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
  const [isError, setIsError] = useState(false);
  const [errMsgTitle, setErrMsgTitle] = useState("");
  const [errMsgContent, setErrMsgContent] = useState("");
  const [errMsgThumbnail, setErrMsgThumbnail] = useState("");

  useEffect(() => {
    const getCategoryData = async () => {
      try {
        setLoading(true);
        const data = await fetch(
          "/api/admin/categories" //←JSON形式のデータ
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

    //タイトル欄チェック
    if (!title) {
      hasError = true;
      setErrMsgTitle("タイトルは必須です");
    } else if (title.length >= 20) {
      hasError = true;
      setErrMsgTitle("タイトルは20文字未満にしてください");
    } else {
      hasError = false;
      setErrMsgTitle("");
    }

    // 内容欄チェック
    if (!content) {
      hasError = true;
      setErrMsgContent("内容は必須です");
    } else if (content.length >= 500) {
      hasError = true;
      setErrMsgContent("内容は500文字未満にしてください");
    } else {
      hasError = false;
      setErrMsgContent("");
    }

    // サムネイルURL欄チェック
    if (!thumbnailUrl) {
      hasError = true;
      setErrMsgThumbnail("画像を指定してください");
    } else {
      hasError = false;
      setErrMsgThumbnail("");
    }
    setIsError(hasError);
    return hasError;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      setSending(true);
      const hasError = handleCheckInput(); //実行の結果を変数に格納することで「handleCheckInput」の実行結果を再利用可能になる。
      setIsError(hasError);

      if (confirm("送信しますか？")) {
        if (hasError) {
          alert("入力内容に誤りがあります");
          return;
        }
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
      } else {
        return;
      }
    } catch (error) {
      console.log(`送信中にエラーが発生しました`, error);
    } finally {
      setSending(false);
    }
  };
  if (loading) {
    return <div>読み込み中・・・</div>;
  }
  if (sending) {
    return <div>送信中・・・</div>;
  }
  return (
    <div className="home-container p-4 w-[95%]">
      <form action="/api/admin/posts" method="post">
        <div className="px-4">
          <AdminHeaderListPageDetails title="記事作成" />
          <div className="flex flex-col mt-3">
            <AdminLabel htmlFor="title">タイトル</AdminLabel>
            <AdminInput id="title" onChange={handleTitleChange} value={title} />
            {errMsgTitle ? (
              <AdminErrorMassage>{errMsgTitle}</AdminErrorMassage>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col">
            <AdminLabel htmlFor="content">内容</AdminLabel>
            <AdminTextarea
              id="content"
              onChange={handleContentChange}
              value={content}
            />
            {errMsgContent ? (
              <AdminErrorMassage>{errMsgContent}</AdminErrorMassage>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col">
            <AdminLabel htmlFor="thumbnailUrl">サムネイルURL</AdminLabel>
            <AdminInput
              id="thumbnailUrl"
              onChange={handleThumbnailChange}
              value={thumbnailUrl}
            />
            {errMsgThumbnail ? (
              <AdminErrorMassage>{errMsgThumbnail}</AdminErrorMassage>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-col">
            <AdminLabel htmlFor="postCategories">カテゴリー</AdminLabel>
            <Select<OptionType, true>
              inputId="postCategories"
              aria-label="カテゴリーを選択"
              options={apiCategories}
              value={postCategories}
              onChange={(selected) => {
                setPostCategories(selected as OptionType[]);
              }}
              isClearable={false} //セレクトボックス最右の×ボタン非表示
              closeMenuOnSelect={false} //選択してもメニューを閉じない
              hideSelectedOptions={false} //選択済みのオプションもメニューに表示
              isMulti
              placeholder="カテゴリーを選択"
              classNames={{
                control: () =>
                  "min-h-[70px] mt-1 p-[10px] block w-full rounded-md", // Selectコンポーネントは「react-select」が独自のタグのセットを返しているためTailwindならこの指定で適用される
              }}
              styles={{
                control: (base) => ({
                  //「base」はデフォルトのスタイル設定で、スプレット構文で適用する。指定は任意。
                  ...base,
                  minHeight: "70px",
                  height: "70px",
                }),
                multiValue: () => ({
                  backgroundColor: "#dbeafe",
                  borderRadius: "25px",
                  padding: "10px",
                  margin: "2px",
                }), // Selectコンポーネントは「react-select」が独自のタグのセットを返しているためこの指定で適用される
                multiValueLabel: () => ({
                  fontSize: "16px",
                  // padding: 0,
                }),
                option: (base, { isSelected }) => ({
                  // ドロップダウンメニュー内の各項目のスタイル設定→「option:」で指定できる(isSelectedは選択されているかの真偽値が入ってる)
                  ...base,
                  // "$:transition": { backgroundColor: "3s" },
                  backgroundColor: isSelected //三項演算子でスタイル指定/背景色
                    ? "#818cf8"
                    : base.backgroundColor,
                  color: isSelected ? "#fff" : base.color, //文字色
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: isSelected ? "#818cf8" : "#e0e7ff",
                    transition: "background-color 0.5s ease", // ホバー時だけアニメーション
                  },
                }),
              }}
              components={{
                IndicatorSeparator: () => null, // 右側にあるセパレーターを非表示
                MultiValueRemove: () => null, // 選択済みカテゴリー個別の×ボタンを非表示
              }}
            />
          </div>
          <AdminCreateButton onClick={handleSubmit} />
        </div>
      </form>
    </div>
  );
}
