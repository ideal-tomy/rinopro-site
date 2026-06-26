import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";
import { Geist } from "next/font/google";
import { Noto_Sans_JP } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ConciergeChatProvider } from "@/components/chat/concierge-chat-context";
import { ChatContainerLazy } from "@/components/chat/ChatContainerLazy";
import { VisitorJourneyTracker } from "@/components/journey/VisitorJourneyTracker";
import { ScrollRestoreOnRoute } from "@/components/navigation/ScrollRestoreOnRoute";
import { SITE_CONCIERGE_ENABLED } from "@/lib/site-features";
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
    default: "AXEON | 現場業務を、AIで再設計して実装まで伴走する",
    template: "%s | AXEON",
  },
  description: "ビジネスを再設計するDXツール・AIツールの開発とコンサルティング。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://AXEON.example.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const shell = (
    <>
      <NextTopLoader
        color="#3b82f6"
        height={3}
        showSpinner={false}
        shadow="0 0 12px color-mix(in_srgb, #3b82f6 35%, transparent)"
      />
      <Suspense fallback={null}>
        <ScrollRestoreOnRoute />
      </Suspense>
      <VisitorJourneyTracker />
      <Header />
      {children}
      <Footer />
    </>
  );

  return (
    <html
      lang="ja"
      className={`${geist.variable} ${notoSansJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-base)] text-[var(--color-text)]">
        {SITE_CONCIERGE_ENABLED ? (
          <ConciergeChatProvider>
            {shell}
            <ChatContainerLazy />
          </ConciergeChatProvider>
        ) : (
          shell
        )}
      </body>
    </html>
  );
}
