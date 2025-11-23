"use client";
import parse from "html-react-parser";
import Image from "next/image";
import { WithPostCategories } from "@/app/_types/types";
import { useFetch } from "@/app/_hooks/useFetch";

interface ApiResponse {
  status: string;
  post: WithPostCategories;
}

export default function ArticleDetail({ params }: { params: { id: string } }) {
  //引数にパラメータのURL取得可能
  const { id } = params;
  const { data, error } = useFetch<ApiResponse>({
    endPoint: `/api/posts/${id}`,
  });
  console.log(data);

  if (error) {
    return <div>{error.message}</div>;
  }
  if (!data) {
    return <div>読み込み中・・・</div>;
  }
  return (
    <>
      <article className="page-wrapper max-w-[800px] mx-[auto] my-[40px] p-[1rem]">
        <div className="image-container w-768px h-384px">
          <Image
            src={`https://hyfeaseyueuhknopsqpk.supabase.co/storage/v1/object/public/post_thumbnail/${data.post.thumbnailImageKey}`}
            width={100}
            height={100}
            alt={`${data.post.title}の画像`}
            className="article-image w-[100%] h-[100%]"
          />
        </div>
        <div className="post-container p-[1rem]">
          <div className="post-info flex justify-between">
            <div className="text-[#888] text-[0.8rem]">
              {String(data.post.createdAt)
                .slice(0, 10)
                .split("-")
                .map((n) => Number(n))
                .join("/")}
            </div>
            <div className="lang-box flex flex-wrap">
              {data.post.postCategories.map((postCategory) => (
                <div
                  key={postCategory.id}
                  className="post-lang text-[#06c] text-[0.8rem] border border-[#06c] rounded-[0.2rem] mr-[0.5rem] px-[0.4rem] py-[0.2rem]"
                >
                  {postCategory.category.name}
                </div>
              ))}
            </div>
          </div>
          <h1 className="article-title font-bold text-[1.5rem] mt-[0.5rem] mb-[1rem]">
            {data.post.title}
          </h1>
          <div className="text leading-[1.5] ">
            {/* contentの中をHTMLとしてレンダリング */}
            {data.post.content && parse(data.post.content)}
          </div>
        </div>
      </article>
    </>
  );
}
