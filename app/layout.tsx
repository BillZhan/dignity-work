import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "让每一份劳动，都有尊严",
  description:
    "用消费，支持善待劳动者的企业。一个由消费者共同维护的劳动者友好企业目录。",
  openGraph: {
    title: "让每一份劳动，都有尊严",
    description: "用消费，支持善待劳动者的企业。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-ink-50 text-ink-900 antialiased">
        <Header />
        <main className="pb-24 pt-6 sm:pt-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}