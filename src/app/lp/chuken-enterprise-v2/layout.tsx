import { Fraunces, Noto_Sans_JP } from "next/font/google";

const chukenDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-chuken-display",
  display: "swap",
});

const chukenBody = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-chuken-body",
  display: "swap",
});

export default function ChukenEnterpriseV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${chukenDisplay.variable} ${chukenBody.variable}`}>
      {children}
    </div>
  );
}
