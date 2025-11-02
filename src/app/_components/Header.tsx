"use client";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <header className="bg-[#263141] font-[700] fixed top-0 w-full">
        <nav className="flex justify-between p-[24px] ">
          <Link href="/" className="text-[#fff] font-[700] no-underline">
            Blog
          </Link>
          <div>
            <Link
              href="/admin/posts"
              className="text-[#fff] font-[700] no-underline mr-[16px]"
            >
              管理画面
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
