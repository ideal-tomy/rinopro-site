import { Roboto_Mono, Shippori_Mincho_B1 } from "next/font/google";

const kaigoDisplay = Shippori_Mincho_B1({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-kaigo-display",
  display: "swap",
});

const kaigoMono = Roboto_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-kaigo-mono",
  display: "swap",
});

export default function KaigoCareDxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${kaigoDisplay.variable} ${kaigoMono.variable}`}>
      {children}
    </div>
  );
}
