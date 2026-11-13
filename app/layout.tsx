import "@fontsource/m-plus-1p";
import type { Metadata } from "next";
/*import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";*/
import "./globals.css";
import { ReactLenis } from "lenis/react";
import LenisResizeHandler from "@/components/LenisResizeHandler";
import ScrollToTop from "../components/ScrollToTop";
import PageTopButton from "@/components/PageTopButton";

/*const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});*/

export const metadata: Metadata = {
  metadataBase: new URL("https://tenmew.jp"),

  title: {
    default: "TOMODA'S DESIGN",
    template: "%s｜TOMODA'S DESIGN",
  },

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: "https://tenmew.jp",
  },

  icons: {
    icon: [
      {
        url: "/img/basic/favicon.ico",
        sizes: "any",
      },
      {
        url: "/img/basic/favicon.png",
        type: "image/png",
        sizes: "48x48",
      },
    ],
    apple: "/img/basic/apple-touch-icon.png",
  },

  openGraph: {
    locale: "ja_JP",
    siteName: "TOMODA'S DESIGN",
    type: "website",
    images: [
      {
        url: "/img/basic/ogp.jpg",
        width: 1200,
        height: 630,
        alt: "TOMODA'S DESIGN",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`h-full antialiased`}>
      <ReactLenis
        root
        options={{
          duration: 2.2,     // スクロールアニメーションの時間（長いほど余韻が伸びる）
          lerp: 0.04,        // 追従の遅れ度合い（小さいほどドロッとした重い慣性になる）
          smoothWheel: true, // マウスホイールでのスクロールを滑らかにする
        }}
      >
      <LenisResizeHandler />
        <body className="min-h-full flex flex-col" suppressHydrationWarning>
            <ScrollToTop />
            {children}
            <PageTopButton />
        </body>
      </ReactLenis>
    </html>
  );
}
