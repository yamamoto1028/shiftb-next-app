"use client";
import "./globals.css";
import Link from "next/link";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { MicroCmsPost } from "./_types/MicroCmsPost";
// import type { ArticleTypes } from "./_types/types";

export default function ArticleList() {
  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
  // const [posts, setPosts] = useState<ArticleTypes>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getArticleData = async () => {
      try {
        setLoading(true);
        const data = await fetch(
          "https://k3cqma8m0n.microcms.io/api/v1/posts",
          {
            headers: {
              "X-MICROCMS-API-KEY": process.env
                .NEXT_PUBLIC_MICROCMS_API_KEY as string,
            },
          }
        );
        const { contents } = await data.json();
        setPosts(contents);
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

  if (posts.length === 0) {
    return <div>データなし</div>;
  }

  return (
    <>
      <main className="home-container max-w-[800px] mx-auto my-[40px] px-[1rem] overflow-auto">
        {/* 記事の数だけ繰り返し表示 */}
        {posts.map((post) => (
          <Link
            href={`/details/${post.id}`}
            key={post.id}
            className="no-underline"
          >
            <article className="border-1 border-[#ccc] p-[1rem] flex-row mb-[2rem] cursor-pointer">
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
                      key={category.id}
                      className="lang text-[#06c] text-[0.8rem] border-1 border-[#06c] rounded-[0.2rem] mr-[0.5rem] px-[0.4rem] py-[0.2rem]"
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              </div>
              <p className="article-title text-[1.5rem] text-[#000] mt-[0.5rem] mb-[1rem]">
                {post.title}
              </p>
              <div className="text leading-[1.5] text-[#000] line-clamp-2">
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
