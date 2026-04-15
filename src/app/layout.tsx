import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Noto_Sans_JP } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConciergeChatProvider } from "@/components/chat/concierge-chat-context";
import { ChatContainerLazy } from "@/components/chat/ChatContainerLazy";
import { VisitorJourneyTracker } from "@/components/journey/VisitorJourneyTracker";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
});

/** モバイルの仮想キーボード時のリサイズ方針（fixed オーバーレイと整合しやすくする） */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  title: {
    default: "Axeon | 現場業務を、AIで再設計して実装まで伴走する",
    template: "%s | Axeon",
  },
  description: "ビジネスを再設計するDXツール・AIツールの開発とコンサルティング。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://axeon.example.com"),
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
          <VisitorJourneyTracker />
          <Header />
          {children}
          <Footer />
          <ChatContainerLazy />
        </ConciergeChatProvider>
      </body>
    </html>
  );
}
