"use client";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import Image from "next/image";
import { WithPostCategories } from "@/app/_types/types";

export default function ArticleDetail({ params }: { params: { id: string } }) {
  //引数にパラメータのURL取得可能
  const [post, setPost] = useState<WithPostCategories | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = params;
  useEffect(() => {
    const getArticleDetailData = async () => {
      try {
        setLoading(true);
        const data = await fetch(`/api/posts/${id}`);
        const res = await data.json();
        if (res.post) {
          setPost(res.post);
        } else {
          throw new Error("記事が見つかりません");
        }
      } catch (error) {
        console.error(`記事詳細データ取得中にエラーが発生しました:`, error);
      } finally {
        setLoading(false);
      }
    };
    getArticleDetailData();
  }, [id]);

  if (loading) {
    return <div>読み込み中・・・</div>;
  }
  if (!post) {
    return <div className="undefinedArticle">記事がありません</div>;
  }
  return (
    <>
      <article className="page-wrapper max-w-[800px] mx-[auto] my-[40px] p-[1rem]">
        <div className="image-container w-768px h-384px">
          <Image
            src={post.thumbnailUrl}
            width={100}
            height={100}
            alt={`${post.title}の画像`}
            className="article-image w-[100%] h-[100%]"
          />
        </div>
        <div className="post-container p-[1rem]">
          <div className="post-info flex justify-between">
            <div className="post-date text-[#888] text-[0.8rem]">
              {String(post.createdAt)
                .slice(0, 10)
                .split("-")
                .map((n) => Number(n))
                .join("/")}
            </div>
            <div className="lang-box flex flex-wrap">
              {post.postCategories.map((postCategory) => (
                <div
                  key={postCategory.id}
                  className="post-lang text-[#06c] text-[0.8rem] border-1 border-[#06c] rounded-[0.2rem] mr-[0.5rem] px-[0.4rem] py-[0.2rem]"
                >
                  {postCategory.category.name}
                </div>
              ))}
            </div>
          </div>
          <h1 className="article-title text-[1.5rem] mt-[0.5rem] mb-[1rem]">
            {post.title}
          </h1>
          <div className="text leading-[1.5] ">
            {/* contentの中をHTMLとしてレンダリング */}
            {post.content && parse(post.content)}
          </div>
        </div>
      </article>
    </>
  );
}
