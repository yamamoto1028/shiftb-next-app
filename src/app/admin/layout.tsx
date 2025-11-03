import type { Metadata } from "next";
import "../globals.css";
import AdminBar from "./_components/AdminBar";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "ここから運営事務局にお問い合わせを送信することができます",
};

export default function InquiryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex w-[100vw] min-h-[100vh]">
        <AdminBar />
        <div className="w-[85%]">{children}</div>
      </div>
    </>
  );
}
