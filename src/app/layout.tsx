import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Noto_Sans_JP } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConciergeChatProvider } from "@/components/chat/concierge-chat-context";
import { ChatContainer } from "@/components/chat/ChatContainer";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "rinopro | 現場業務を、AIで再設計して実装まで伴走する",
    template: "%s | rinopro",
  },
  description: "現場業務を、AIで再設計して実装まで伴走する。DXツール・AIツールの開発とコンサルティング。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://rinopro.example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geist.variable} ${notoSansJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-base)] text-[var(--color-text)]">
        <ConciergeChatProvider>
          <Header />
          {children}
          <Footer />
          <ChatContainer />
        </ConciergeChatProvider>
      </body>
    </html>
  );
}
