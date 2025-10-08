"use client";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <header className="bg-[#333] font-[700] sticky top-0">
        <nav className="flex justify-between p-[24px] text-[#fff]">
          <Link href="/">Blog</Link>
          <Link href="/inquiry">お問い合わせ</Link>
        </nav>
      </header>
    </>
  );
}
