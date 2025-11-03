// 管理者_記事編集ページ
"use client";
import "../../../globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminUpdateButton from "@/app/admin/_components/AdminUpdateButton";
import AdminDeleteButton from "@/app/admin/_components/AdminDeleteButton";
import AdminPostForm from "@/app/admin/_components/AdminPostForm";

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
  const [sending, setSending] = useState(false);
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

  const handleCheckInput = () => {
    let hasError = false; //全体のエラーフラグ
    let hasErrorTitle = false; //タイトルのエラーフラグ
    let hasErrorContent = false; //内容のエラーフラグ
    let hasErrorThumbnailUrl = false; //サムネイルのエラーフラグ
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
      //3つのチェックのうち、ひとつでもエラーがあればエラーフラグtrueをセット
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
  const handleUpdate = async (e: React.FormEvent<HTMLButtonElement>) => {
    //記事更新処理
    try {
      e.preventDefault();
      const hasError = handleCheckInput(); //実行の結果を変数に格納することで「handleCheckInput」の実行結果を再利用可能になる。
      if (confirm(`記事を更新しますか？`)) {
        if (hasError) {
          alert("入力内容に誤りがあります");
          return;
        }
        setSending(true);
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
      console.log("記事更新中にエラーが発生しました:", error);
    } finally {
      setSending(false);
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

  if (sending) {
    return <div>送信中・・・</div>;
  }
  if (loading) {
    return <div>読み込み中・・・</div>;
  }
  if (!post) {
    return <div className="undefinedArticle">記事がありません</div>;
  }
  return (
    <AdminPostForm
      title="記事編集"
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
      <div>
        <AdminUpdateButton onClick={handleUpdate} disabled={sending} />
        <AdminDeleteButton onClick={handleDelete} disabled={sending} />
      </div>
    </AdminPostForm>
  );
}
