// 管理者_記事編集ページ
"use client";
import "../../../globals.css";
import { useEffect, useState } from "react";
import { Post } from "@prisma/client";
import Select from "react-select";

// この型やないとうまく表示されないです
type OptionType = {
  value: number;
  label: string;
};
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

  useEffect(() => {
    const getArticleDetailData = async () => {
      try {
        setLoading(true);
        // 記事のデータ取得
        const data = await fetch(`/api/admin/posts/${id}`);
        const res = await data.json();
        if (res.post) {
          setPost(res.post);
          setTitle(res.post.title);
          setContent(res.post.content);
          setThumbnailUrl(res.post.thumbnailUrl);
          setPostCategories(res.post.postCategories);
          console.log(`取得した記事データ：`);
          console.log(res.post);
        } else {
          throw new Error("記事が見つかりません");
        }
        // カテゴリーのデータ取得
        const categoryData = await fetch(
          "/api/admin/categories" //←JSON形式のデータ
        );
        // should: カテゴリーデータのレスポンスの型を別途定義するとよいですが一旦ここにベタベタ書きました
        // ここでcategoriesの型を明示しないとanyになって50行目のcategoryの型の推論ができずに型エラーになります
        const { categories }: { categories: { id: number; name: string; createdAt: string; updatedAt: string }[] } = await categoryData.json();
        const result: OptionType[] = categories
          .map((category) => ({
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

  const handleChangeContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handleChangeThumbnailUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThumbnailUrl(e.target.value);
  };

  const handleUpdate = async () => {
    //記事更新処理
    if (confirm(`記事を更新します`)) {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/posts/${id}`, {
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
        console.log(`記事を更新しました`);
      } catch (error) {
        console.error("記事更新中にエラーが発生しました:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    //記事削除処理
    if (confirm(`${title}の記事を削除しますか？`)) {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/posts/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        console.log(`記事を削除しました`);
        console.log(data);
      } catch (error) {
        console.error("記事削除中にエラーが発生しました:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  if (loading) {
    return <div>読み込み中・・・</div>;
  }
  if (!post) {
    return <div className="undefinedArticle">記事がありません</div>;
  }
  return (
    <>
      <article className="page-wrapper max-w-[800px] mx-[auto] my-[40px] p-[1rem]">
        <h1>記事編集</h1>
        <form method="post">
          <div className="article-title text-[1.5rem] mt-[0.5rem] mb-[1rem]">
            <label htmlFor="title">タイトル</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleChangeTitle}
            />
          </div>
          <div className="text leading-[1.5] ">
            <label htmlFor="content">内容</label>
            <input type="text" value={content} onChange={handleChangeContent} />
          </div>
          <div>
            <label htmlFor="thumbnail">サムネイルURL</label>
            <input
              type="text"
              id="thumbnail"
              value={thumbnailUrl}
              onChange={handleChangeThumbnailUrl}
            />
          </div>
          <div className="flex">
            <label htmlFor="category">カテゴリー</label>
            <Select
              id="category"
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
          <div>
            <button onClick={handleUpdate}>更新</button>
            <button onClick={handleDelete}>削除</button>
          </div>
        </form>
      </article>
    </>
  );
}
