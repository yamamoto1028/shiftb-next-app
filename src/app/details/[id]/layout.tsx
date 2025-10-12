import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: "記事詳細ページ",
  description: "エンジニアが投稿した記事の詳細ページを表示します",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
