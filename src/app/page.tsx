"use client";
import "./globals.css";
import Link from "next/link";
import parse from "html-react-parser";
import { WithPostCategories } from "./_types/types";
import { useFetch } from "./_hooks/useFetch";

interface ApiResponse {
  status: string;
  posts: WithPostCategories[];
}

export default function ArticleList() {
  const { data, error } = useFetch<ApiResponse>({
    endPoint: "/api/posts",
  });
  console.log(data);

  if (error) {
    return <div>{error.message}</div>;
  }
  if (!data) {
    return <div>読み込み中・・・</div>;
  }
  if (data.posts.length === 0) {
    return <div>データなし</div>;
  }

  return (
    <>
      <main className="home-container max-w-[800px] mx-auto my-[40px] px-[1rem] overflow-auto">
        {data.posts.map((post) => (
          <Link href={`/details/${post.id}`} key={post.id}>
            <article className="border border-[#ccc] p-[1rem] flex-row mb-[2rem] cursor-pointer">
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
                      className="lang text-[#06c] text-[0.8rem] border border-[#06c] rounded-[0.2rem] mr-[0.5rem] px-[0.4rem] py-[0.2rem]"
                    >
                      {postCategory.category.name}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-[1.5rem] font-bold text-[#000] mt-[0.5rem] mb-[1rem]">
                {post.title}
              </p>
              <div className="text leading-[1.5] text-[#000] line-clamp-2">
                {parse(post.content)}
              </div>
            </article>
          </Link>
        ))}
        <Link href="/admin/posts/new" className="text-[#fff] no-underline">
          管理者_記事新規作成ページ
        </Link>
      </main>
    </>
  );
}
