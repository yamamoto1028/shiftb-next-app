// 管理者_記事編集ページ
"use client";
import "../../../globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminUpdateButton from "@/app/admin/_components/AdminUpdateButton";
import AdminDeleteButton from "@/app/admin/_components/AdminDeleteButton";
import AdminPostForm from "@/app/admin/_components/AdminPostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from "uuid"; // 固有IDを生成するライブラリ
import useSWR from "swr";

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
  thumbnailImageUrl: string;
}
interface Post {
  id: string;
  title: string;
  content: string;
  thumbnailImageKey: string;
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
  // const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  // Imageタグのsrcにセットする画像URLを持たせるstate
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string>("");
  const [postCategories, setPostCategories] = useState<OptionType[]>([]);
  const [apiCategories, setApiCategories] = useState<OptionType[]>([]);
  const router = useRouter();
  // エラーメッセージ管理
  const [errMsgTitle, setErrMsgTitle] = useState("");
  const [errMsgContent, setErrMsgContent] = useState("");
  const [errMsgThumbnail, setErrMsgThumbnail] = useState("");
  const { token } = useSupabaseSession();

  // 記事のデータ取得
  const postFetcher = async (): Promise<ApiResponse> => {
    console.log("1:postFetcher開始");
    if (!token) throw new Error("tokenがありません");
    const res = await fetch(`/api/admin/posts/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    if (res.status !== 200) {
      const ErrMsg: { message: string } = await res.json();
      throw new Error(ErrMsg.message);
    }
    const data: ApiResponse = await res.json();
    console.log("2:postFetcher終了");
    return data;
  };
  const postData = useSWR(
    token ? `/api/admin/posts/${id}` : null, //tokenがセットされていたらエンドポイントにfetchとすることでcategoryDataと並列実行
    postFetcher,
    {
      onSuccess: (data) => {
        console.log("3:postDataのuseSWRのonSuccess開始");
        setPost(data.post);
        setTitle(data.post.title);
        setContent(data.post.content);
        setThumbnailImageKey(data.post.thumbnailImageKey);
        setThumbnailImageUrl(data.thumbnailImageUrl);
        const categories = data.post.postCategories;
        setPostCategories(
          categories.map((postCategory) => {
            const {
              category: { id, name },
            } = postCategory;
            console.log("4:postDataのuseSWRのonSuccess終了");
            return { value: id, label: name };
          })
        );
      },
    }
  );
  const postLoading = postData.isLoading;

  // カテゴリーのデータ取得
  const categoryFetcher = async (): Promise<CategoryResponseType> => {
    console.log("5:categoryFetcher開始");
    if (!token) throw new Error("tokenがありません");
    const res = await fetch(`/api/admin/categories`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    if (res.status !== 200) {
      const ErrMsg = await res.json();
      throw new Error(ErrMsg.message);
    }
    const data: CategoryResponseType = await res.json();
    console.log(data);
    console.log("6:categoryFetcher終了");
    return data;
  };
  const categoryData = useSWR(
    token ? `/api/admin/categories` : null,
    categoryFetcher,
    {
      onSuccess: (data) => {
        const { categories } = data;
        const result = categories.map((category) => ({
          value: category.id,
          label: category.name,
        }));
        setApiCategories(result);
      },
    }
  );
  const categoryLoading = categoryData.isLoading;

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
    // setThumbnailUrl(file.name);
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
    if (!thumbnailImageUrl) {
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
      if (!token) return;
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
            Authorization: token,
          },
          body: JSON.stringify({
            title,
            content,
            thumbnailImageKey,
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
    if (!token) return;
    if (confirm(`${title}の記事を削除しますか？`)) {
      setLoading(true);
      try {
        const data = await fetch(`/api/admin/posts/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
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
  if (loading || postLoading || categoryLoading) {
    console.log(
      `loading:${loading}, postLoading:${postLoading}, categoryLoading:${categoryLoading}`
    );
    return <div>読み込み中・・・</div>;
  }
  if (!post) {
    return <div>記事がありません</div>;
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
      <div>
        <AdminUpdateButton onClick={handleUpdate} disabled={sending} />
        <AdminDeleteButton onClick={handleDelete} disabled={sending} />
      </div>
    </AdminPostForm>
  );
}
