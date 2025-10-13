import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "ここから運営事務局にお問い合わせを送信することができます",
};

export default function InquiryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
