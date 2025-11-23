"use client";
import "../globals.css";
import AdminBar from "./_components/AdminBar";
import { useRouteGuard } from "./_hooks/useRouteGuard";

export default function InquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useRouteGuard(); //追加
  return (
    <>
      <div className="flex w-[100vw] min-h-[100vh]">
        <AdminBar />
        <div className="w-[85%]">{children}</div>
      </div>
    </>
  );
}
