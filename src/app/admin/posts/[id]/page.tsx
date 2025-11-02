// 管理者_記事編集ページ
"use client";
import { AdminHeaderListPageDetails } from "@/app/_components/AdminHeaderListPageDetails";
import "../../../globals.css";
import { useEffect, useState } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import AdminErrorMassage from "@/app/_components/AdminErrorMassage";
import AdminLabel from "@/app/_components/AdminLabel";
import AdminInput from "@/app/_components/AdminInput";
import AdminTextarea from "@/app/_components/AdminTextarea";
import AdminUpdateButton from "@/app/_components/AdminUpdateButton";
import AdminDeleteButton from "@/app/_components/AdminDeleteButton";

interface OptionType {
  value: number;
  label: string;
}

// カテゴリー一覧取得のレスポンスの型定義
interface CategoryResponseType {
  categories: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  }[];
}
// Postのレスポンスの型の定義
interface ApiResponse {
  status: string;
  post: Post;
}
interface Post {
  id: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  postCategories: PostCategory[];
}
interface Category {
  id: number;
  name: string;
}

interface PostCategory {
  id: number;
  postId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

export default function ArticleDetail({ params }: { params: { id: string } }) {
  //引数にパラメータのURL取得可能
  const { id } = params;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [postCategories, setPostCategories] = useState<OptionType[]>([]);
  const [apiCategories, setApiCategories] = useState<OptionType[]>([]);
  const router = useRouter();
  // エラーメッセージ管理
  const [isError, setIsError] = useState(false);
  const [errMsgTitle, setErrMsgTitle] = useState("");
  const [errMsgContent, setErrMsgContent] = useState("");
  const [errMsgThumbnail, setErrMsgThumbnail] = useState("");

  useEffect(() => {
    const getArticleDetailData = async () => {
      try {
        setLoading(true);
        // 記事のデータ取得
        const data = await fetch(`/api/admin/posts/${id}`);
        const res: ApiResponse = await data.json();
        if (res) {
          setPost(res.post);
          setTitle(res.post.title);
          setContent(res.post.content);
          setThumbnailUrl(res.post.thumbnailUrl);
          const categories: PostCategory[] = res.post.postCategories;
          setPostCategories(
            categories.map((postCategory) => {
              const {
                category: { id, name },
              } = postCategory;
              return { value: id, label: name };
            })
          );
          console.log(`取得した記事データ：`);
          console.log(res);
        } else {
          throw new Error("記事が見つかりません");
        }
        // カテゴリーのデータ取得
        const categoryData = await fetch(
          "/api/admin/categories" //←JSON形式のデータ
        );
        const { categories }: CategoryResponseType = await categoryData.json();
        console.log(categories);
        const result = categories.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        setApiCategories(result);
      } catch (error) {
        console.log(`記事詳細データ取得中にエラーが発生しました:`, error);
      } finally {
        setLoading(false);
      }
    };
    getArticleDetailData();
  }, [id]);

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleChangeThumbnailUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailUrl(e.target.value);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLButtonElement>) => {
    //記事更新処理
    try {
      e.preventDefault();
      const hasError = handleCheckInput(); //実行の結果を変数に格納することで「handleCheckInput」の実行結果を再利用可能になる。
      setIsError(hasError);
      if (confirm(`記事を更新しますか？`)) {
        if (hasError) {
          alert("入力内容に誤りがあります");
          return;
        }
        setLoading(true);
        const data = await fetch(`/api/admin/posts/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
            thumbnailUrl,
            postCategories,
          }),
        });
        alert(`記事を更新しました`);
        const res: ApiResponse = await data.json();
        console.log(`記事を更新しました`);
        console.log(res);
      }
    } catch (error) {
      console.error("記事更新中にエラーが発生しました:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.FormEvent<HTMLButtonElement>) => {
    //記事削除処理
    e.preventDefault();
    if (confirm(`${title}の記事を削除しますか？`)) {
      setLoading(true);
      try {
        const data = await fetch(`/api/admin/posts/${id}`, {
          method: "DELETE",
        });
        const res: ApiResponse = await data.json();
        alert("記事を削除しました");
        console.log(`記事を削除しました`);
        console.log(res);
      } catch (error) {
        console.error("記事削除中にエラーが発生しました:", error);
      } finally {
        setLoading(false);
        router.push("/admin/posts");
      }
    }
  };
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

  if (loading) {
    return <div>読み込み中・・・</div>;
  }
  if (!post) {
    return <div className="undefinedArticle">記事がありません</div>;
  }
  return (
    <>
      <article className="home-container p-4 w-[95%]">
        <AdminHeaderListPageDetails title="記事編集" />
        <form method="post">
          <div className="mt-4 px-4">
            <div className="flex flex-col">
              <AdminLabel htmlFor="title">タイトル</AdminLabel>
              <AdminInput
                id="title"
                value={title}
                onChange={handleChangeTitle}
              />
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
                onChange={handleChangeContent}
                value={content}
              />
              {errMsgContent ? (
                <AdminErrorMassage>{errMsgContent}</AdminErrorMassage>
              ) : (
                ""
              )}
            </div>
            <div className="flex flex-col">
              <AdminLabel htmlFor="thumbnail">サムネイルURL</AdminLabel>
              <AdminInput
                id="thumbnail"
                value={thumbnailUrl}
                onChange={handleChangeThumbnailUrl}
              />
              {errMsgTitle ? (
                <AdminErrorMassage>{errMsgTitle}</AdminErrorMassage>
              ) : (
                ""
              )}
              {errMsgThumbnail ? (
                <AdminErrorMassage>{errMsgThumbnail}</AdminErrorMassage>
              ) : (
                ""
              )}
            </div>
            <div className="flex flex-col">
              <AdminLabel htmlFor="category">カテゴリー</AdminLabel>
              <Select
                inputId="category"
                options={apiCategories}
                aria-label="カテゴリーを選択"
                value={postCategories}
                onChange={(selected) => {
                  setPostCategories(selected as OptionType[]);
                }}
                isClearable={false} //セレクトボックス最右の×ボタン非表示
                closeMenuOnSelect={false} //選択してもメニューを閉じない
                hideSelectedOptions={false} //選択済みのオプションもメニューに表示
                isMulti
                placeholder="カテゴリーを選択"
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
                    padding: "12px",
                    margin: "2px",
                  }), // Selectコンポーネントは「react-select」が独自のタグのセットを返しているためこの指定で適用される
                  multiValueLabel: () => ({
                    fontSize: "16px",
                    padding: 0,
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
            <div>
              <AdminUpdateButton onClick={handleUpdate} />
              <AdminDeleteButton onClick={handleDelete} />
            </div>
          </div>
        </form>
      </article>
    </>
  );
}
