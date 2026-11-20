import { Suspense } from "react";
import type { Metadata } from "next";
import styles from "./Works.module.css";
import Navi from "@/components/Navi";
import TitleH2 from "@/components/TitleH2";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import WorksBrowser from "@/components/WorksBrowser";
import { Worksdata } from "@/data/works_data";

export const metadata: Metadata = {
  title:
    "WORKS｜TOMODA'S DESIGN",

  description:
    "WEBデザイナー兼グラフィックデザイナーのともだちさとのポートフォリオ制作実績一覧。",

  alternates: {
    canonical: "https://tomoda-portfolio.vercel.app",
  },

  openGraph: {
    title:
      "WORKS｜TOMODA'S DESIGN",

    description:
      "WEBデザイナー兼グラフィックデザイナーのともだちさとのポートフォリオ制作実績一覧。",

    url: "https://tomoda-portfolio.vercel.app",
  },
};

type Props = {
  searchParams: Promise<{ genre?: string; production?: string }>;
};

export default async function WORKS({ searchParams }: Props) {
  await searchParams;

  return (
  <main className={`${styles.main} ${styles.mainResponsive}`}>
    <Navi responsive />
    <TitleH2 responsive />
    <Breadcrumb items={[{ label: "WORKS" }]} />
    <section>
      <Suspense fallback={null}>
        <WorksBrowser works={ Worksdata } />
      </Suspense>
    </section>
    <Footer />
  </main>
  );
}