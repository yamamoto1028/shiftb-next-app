// アクセス制限のロジックを一括管理するためのカスタムフック
"use client";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRouteGuard = () => {
  const router = useRouter();
  const { session } = useSupabaseSession();
  useEffect(() => {
    // sessionがundefinedの場合は読み込み中なので何もしない
    if (session === undefined) {
      return;
    }
    const fetcher = async () => {
      if (session === null) {
        router.replace("/login");
      }
    };
    fetcher();
  }, [router, session]);
};
