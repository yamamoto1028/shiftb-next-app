"use client";
// import "./globals.css";
import Link from "next/link";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import type { ArticleTypes } from "./_types/types";

export default function ArticleList() {
  const [posts, setPosts] = useState<ArticleTypes>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getArticleData = async () => {
      try {
        setLoading(true);
        const data = await fetch(
          "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts"
        );
        const res = await data.json();
        const resResult = res.posts;
        setPosts(resResult);
      } catch (error) {
        console.error(`記事データ取得中にエラーが発生しました`, error);
      } finally {
        setLoading(false);
      }
    };
    getArticleData();
  }, []);

  if (loading) {
    return <div>読み込み中・・・</div>;
  }

  if (!posts) {
    return <div>データなし</div>;
  }

  return (
    <>
      <main className="home-container max-w-[800px] mx-auto my-[40px] px-[1rem] overflow-auto">
        {/* 記事の数だけ繰り返し表示 */}
        {posts.map((post) => (
          <Link href={`/details/${post.id}`} key={post.id}>
            <article
              //追加
              className="border-1 border-[#ccc] p-[1rem] flex-row mb-[2rem] cursor-pointer"
            >
              <div className="post-info flex justify-between">
                <div className="date text-[#888] text-[0.8rem]">
                  {post.createdAt
                    .slice(0, 10)
                    .split("-")
                    .map((n) => Number(n))
                    .join("/")}
                </div>
                <div className="lang-box flex mr-[0.5rem] flex-wrap">
                  {/* 言語の数だけ繰り返し表示 */}
                  {post.categories.map((category) => (
                    <div
                      key={category} //追加
                      className="lang text-[#06c] text-[0.8rem] border-1 border-[#06c] rounded-[0.2rem] mr-[0.5rem] px-[0.4rem] py-[0.2rem]"
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </div>
              <h1 className="article-title text-[1.5rem] mt-[0.5rem] mb-[1rem]">
                {post.title}
              </h1>
              <div className="text leading-[1.5] line-clamp-2">
                {/* contentの中をHTMLとしてレンダリング */}
                {parse(post.content)}
              </div>
            </article>
          </Link>
        ))}
      </main>
    </>
  );
}
