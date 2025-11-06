"use client";
import { supabase } from "@/utils/supabase";
import { useSupabaseSession } from "../_hooks/useSupabaseSession";
import Link from "next/link";

export default function Header() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  const { session, isLoading } = useSupabaseSession();
  return (
    <>
      <header className="bg-gray-800 text-[#fff] font-[700] fixed top-0 w-full">
        <nav className="flex justify-between p-[24px] ">
          <Link href="/" className=" font-[700] no-underline">
            Blog
          </Link>
          {!isLoading && (
            <div>
              {session ? (
                <>
                  <Link
                    href="/admin/posts"
                    className=" font-[700] no-underline mr-[16px]"
                  >
                    管理画面
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="font-[700] no-underline mr-[16px]"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/inquiry"
                    className="font-[700] no-underline mr-[16px]"
                  >
                    お問い合わせ
                  </Link>
                  <Link
                    href="/login"
                    className="font-[700] no-underline mr-[16px]"
                  >
                    ログイン
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
