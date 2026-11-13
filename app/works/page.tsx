import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import styles from "./Works.module.css";
import Navi from "@/components/Navi";
import TitleH2 from "@/components/TitleH2";
import FadeIn from "@/components/FadeIn";
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
    canonical: "https://tenmew.jp",
  },

  openGraph: {
    title:
      "WORKS｜TOMODA'S DESIGN",

    description:
      "WEBデザイナー兼グラフィックデザイナーのともだちさとのポートフォリオ制作実績一覧。",

    url: "https://tenmew.jp",

    images: [
      {
        url: "/img/basic/ogp.webp",
        width: 1200,
        height: 630,
        alt: "WORKS｜TOMODA'S DESIGN",
      },
    ],
  },
};

type Props = {
  searchParams: Promise<{ genre?: string; production?: string }>;
};

// WORKS一覧。左ナビのリンクなどから、絞り込みが選ばれた状態で開ける
//   /works?genre=WEBサイト
//   /works?genre=その他   (バナー・手書き看板・名刺など)
//   /works?genre=ロゴ&production=実務制作
export default async function WORKS({ searchParams }: Props) {
  // 絞り込みの読み取りは画面側(WorksBrowser)でやる。
  // ここで受け取っておくと、ページが毎回サーバーで作られ、最初のHTMLから絞り込みが反映される
  await searchParams;

  return (
  <main className={styles.main}>
    <Navi />
    <TitleH2 />
    <Breadcrumb items={[{ label: "WORKS" }]} />
    <section className={styles.works}>
      <Suspense fallback={null}>
        <WorksBrowser works={ Worksdata } />
      </Suspense>
    </section>
    <Footer />
  </main>
  );
}