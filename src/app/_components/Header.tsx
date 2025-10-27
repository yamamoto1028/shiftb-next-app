"use client";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <header className="bg-[#333] font-[700] sticky top-0">
        <nav className="flex justify-between p-[24px] ">
          <Link href="/" className="text-[#fff] font-[700] no-underline">
            Blog
          </Link>
          <div>
            <Link
              href="/admin/posts"
              className="text-[#fff] font-[700] no-underline mr-[16px]"
            >
              管理者_記事編集画面
            </Link>
            <Link
              href="/admin/categories"
              className="text-[#fff] font-[700] no-underline mr-[16px]"
            >
              管理者_カテゴリー一覧画面
            </Link>
            <Link href="/inquiry" className="text-[#fff] no-underline">
              お問い合わせ
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
