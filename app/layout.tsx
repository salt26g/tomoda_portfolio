import "@fontsource/m-plus-1p";
import type { Metadata } from "next";
import "./globals.css";
import { ReactLenis } from "lenis/react";
import LenisResizeHandler from "@/components/LenisResizeHandler";
import ScrollToTop from "../components/ScrollToTop";
import PageTransition from "@/components/PageTransition";
import PageTopButton from "@/components/PageTopButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://tomoda-portfolio.vercel.app"),

  title: {
    default: "TOMODA'S DESIGN",
    template: "%s｜TOMODA'S DESIGN",
  },

  robots: {
    index: false,
    follow: false,
  },

  alternates: {
    canonical: "https://tomoda-portfolio.vercel.app",
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
  },

  openGraph: {
    locale: "ja_JP",
    siteName: "TOMODA'S DESIGN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`h-full antialiased`} suppressHydrationWarning>
      <ReactLenis
        root
        options={{
          duration: 2.2,
          lerp: 0.04,
          smoothWheel: true,
        }}
      >
      <LenisResizeHandler />
        <body className="min-h-full flex flex-col" suppressHydrationWarning>
            <script
              dangerouslySetInnerHTML={{
                __html:
                  "try{if(sessionStorage.getItem('tomoda-intro-seen')==='1')document.documentElement.setAttribute('data-intro-seen','')}catch(e){}",
              }}
            />
            <ScrollToTop />
            <PageTransition />
            {children}
            <PageTopButton />
        </body>
      </ReactLenis>
    </html>
  );
}
