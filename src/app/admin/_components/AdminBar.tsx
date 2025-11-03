"use client";
import AdminLink from "./AdminLink";
import { usePathname } from "next/navigation";

export default function AdminBar() {
  const pathname = usePathname(); //現在のURLに関する情報が入ったlocationオブジェクトを取得
  return (
    <>
      <aside className=" bg-gray-100 top-0 w-[280px]">
        <AdminLink
          title="記事一覧"
          href="/admin/posts"
          isActive={pathname.includes(`/admin/posts`)}
        />
        <AdminLink
          title="カテゴリー一覧"
          href="/admin/categories"
          isActive={pathname.includes(`/admin/categories`)}
        />
      </aside>
    </>
  );
}
