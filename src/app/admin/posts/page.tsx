"use client";
// 管理者_記事一覧ページ
import "../../globals.css";
import Link from "next/link";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { WithPostCategories } from "@/app/_types/types";

export default function ArticleList() {
  const [posts, setPosts] = useState<WithPostCategories[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getArticleData = async () => {
      try {
        setLoading(true);
        const data = await fetch(
          "/api/admin/posts" //←JSON形式のデータ
        );
        const { posts } = await data.json();
        setPosts(posts);
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
    return (
      <div>
        <div>データなし</div>
        <Link
          href="/admin/posts/new"
          className="text-[#000] font-[700] no-underline"
        >
          管理者_記事新規作成ページ
        </Link>
      </div>
    );
  }

  return (
    <>
      <main className="home-container max-w-[800px] mx-auto my-[40px] px-[1rem] overflow-auto">
        {posts.map((post) => (
          <Link
            href={`/admin/posts/${post.id}`}
            key={post.id}
            className="no-underline"
          >
            <article className="border-1 border-[#ccc] p-[1rem] flex-row mb-[2rem] cursor-pointer">
              <div className="post-info flex justify-between">
                <div className="date text-[#888] text-[0.8rem]">
                  {String(post.createdAt)
                    .slice(0, 10)
                    .split("-")
                    .map((n) => Number(n))
                    .join("/")}
                </div>
                <div className="lang-box flex mr-[0.5rem] flex-wrap">
                  {post.postCategories.map((postCategory) => (
                    <div
                      key={postCategory.id}
                      className="lang text-[#06c] text-[0.8rem] border-1 border-[#06c] rounded-[0.2rem] mr-[0.5rem] px-[0.4rem] py-[0.2rem]"
                    >
                      {postCategory.category.name}
                    </div>
                  ))}
                </div>
              </div>
              <p className="article-title text-[1.5rem] text-[#000] mt-[0.5rem] mb-[1rem]">
                {post.title}
              </p>
              <div className="text leading-[1.5] text-[#000] line-clamp-2">
                {parse(post.content)}
              </div>
            </article>
          </Link>
        ))}
        <Link href="/admin/posts/new" className="text-[#000] no-underline">
          管理者_記事新規作成ページ
        </Link>
      </main>
    </>
  );
}
