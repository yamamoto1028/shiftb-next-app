"use client";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import type { ArticleType } from "../_types/types";

export default function ArticleDetail() {
  const [posts, setPosts] = useState<ArticleType>();
  const { id } = useParams(); //URLのパラメータのIDを取得
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getArticleDetailData = async () => {
      try {
        setLoading(true);
        const data = await fetch(
          `https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`
        );
        const res = await data.json();
        const resResult = await res.post;
        setPosts(resResult);
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
  if (!posts) {
    return <div className="undefinedArticle">記事がありません</div>;
  }
  return (
    <>
      <article className="page-wrapper max-w-[800px] mx-[auto] my-[40px] p-[1rem]">
        <div className="image-container w-768px h-384px">
          <img
            src={posts.thumbnailUrl}
            alt="記事の画像"
            className="article-image w-[100%] h-[100%]"
          />
        </div>
        <div className="post-container p-[1rem]">
          <div className="post-info flex justify-between">
            <div className="post-date text-[#888] text-[0.8rem]">
              {posts.createdAt
                .slice(0, 10)
                .split("-")
                .map((n) => Number(n))
                .join("/")}
            </div>
            <div className="lang-box flex flex-wrap">
              {posts.categories.map((category) => (
                <div className="post-lang text-[#06c] text-[0.8rem] border-1 border-[#06c] rounded-[0.2rem] mr-[0.5rem] px-[0.4rem] py-[0.2rem]">
                  {category}
                </div>
              ))}
            </div>
          </div>
          <h1 className="article-title text-[1.5rem] mt-[0.5rem] mb-[1rem]">
            {posts.title}
          </h1>
          <div className="text leading-[1.5] ">
            {/* contentの中をHTMLとしてレンダリング */}
            {parse(posts.content)}
          </div>
        </div>
      </article>
    </>
  );
}
