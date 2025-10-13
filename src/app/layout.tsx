import type { Metadata } from "next";
import "./globals.css";
import Header from "./_components/Header";

export const metadata: Metadata = {
  title: "投稿記事一覧",
  description: "エンジニアが投稿した記事の一覧",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
