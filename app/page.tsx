import type { Metadata } from "next";
import type { CSSProperties } from "react";
import styles from "./page.module.css";
import Navi from "@/components/Navi";
import { SkeletonImg } from "@/components/SkeletonImage";
import TopWorks from "@/components/TopWorks";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title:
    "TOMODA'S DESIGN｜ともだちさとのポートフォリオサイト",

  description:
    "WEBデザイナー兼グラフィックデザイナーともだちさとのポートフォリオサイトです。",

  alternates: {
    canonical: "https://tomoda-portfolio.vercel.app",
  },

  openGraph: {
    title:
      "TOMODA'S DESIGN｜ともだちさとのポートフォリオサイト",

    description:
      "WEBデザイナー兼グラフィックデザイナーともだちさとのポートフォリオサイトです。",

    url: "https://tomoda-portfolio.vercel.app",
  },
};

type Work = { src: string; alt: string; width: number; height: number };

const COLUMNS: { direction: "up" | "down"; works: Work[] }[] = [
  {
    direction: "up",
    works: [
      { src: "/img/tmb/ec_987601.webp", alt: "雲ごこちラグマット_商品コンテンツ", width: 800, height: 800 },
      { src: "/img/tmb/gd_ichigo.webp", alt: "いちご大福_ブラックボード", width: 800, height: 1100 },
      { src: "/img/tmb/web_fukano.webp", alt: "深野じゅん_公式サイト", width: 800, height: 600 },
      { src: "/img/tmb/bn_ket.webp", alt: "毛布特集_バナー", width: 800, height: 450 },
      { src: "/img/tmb/logo_yarozu.webp", alt: "酒興 萬_ロゴ", width: 800, height: 800 },
      { src: "/img/tmb/bn_mat.webp", alt: "マットレス_バナー", width: 800, height: 450 },
      { src: "/img/tmb/ec_986119.webp", alt: "Softime 高反発10cm三つ折りマットレス", width: 800, height: 800 },
      { src: "/img/tmb/logo_easy.webp", alt: "イージーバドミントンクラブ_ロゴ", width: 800, height: 800 },
    ],
  },
  {
    direction: "down",
    works: [
      { src: "/img/tmb/web_st_atm_sale.webp", alt: "秋セール_セールページ", width: 800, height: 600 },
      { src: "/img/tmb/bn_986743.webp", alt: "冷感ラグマット_バナー", width: 800, height: 534 },
      { src: "/img/tmb/logo_28bad.webp", alt: "28ばど_ロゴ", width: 800, height: 800 },
      { src: "/img/tmb/print_tenmew_01.webp", alt: "テンミュー_名刺", width: 800, height: 535 },
      { src: "/img/tmb/bn_box.webp", alt: "ボックスシーツ祭_バナー", width: 800, height: 216 },
      { src: "/img/tmb/ec_101-set.webp", alt: "ストレートネック枕_商品コンテンツ", width: 800, height: 800 },
      { src: "/img/tmb/print_101-set_01.webp", alt: "ストレートネック枕_取扱説明書", width: 800, height: 447 },
      { src: "/img/tmb/web_fw_newyear_sale.webp", alt: "年末セール_セールページ", width: 800, height: 600 },
      { src: "/img/tmb/bn_clearance.webp", alt: "クリアランスセール_バナー", width: 800, height: 384 },
      { src: "/img/tmb/print_yogi.webp", alt: "YOGIカフェ_Tシャツ", width: 800, height: 855 },
    ],
  },
  {
    direction: "up",
    works: [
      { src: "/img/tmb/bn_980801.webp", alt: "ラビットファー_バナー", width: 800, height: 533 },
      { src: "/img/tmb/ec_986516.webp", alt: "2枚合わせ掛け布団_商品コンテンツ", width: 800, height: 800 },
      { src: "/img/tmb/web_tenmew.webp", alt: "テンミュー_コーポレートサイト", width: 800, height: 600 },
      { src: "/img/tmb/gd_wagashi.webp", alt: "甘納豆・俵最中_ブラックボード", width: 800, height: 1260 },
      { src: "/img/tmb/web_st_sum_sale.webp", alt: "夏セール_セールページ", width: 800, height: 600 },
      { src: "/img/tmb/bn_winter.webp", alt: "ラグマット・布団_バナー", width: 800, height: 799 },
      { src: "/img/tmb/logo_tenmew.webp", alt: "テンミュー_ロゴ", width: 800, height: 800 },
      { src: "/img/tmb/web_st_atmwtr_feature.webp", alt: "Softime 秋＆冬アイテム特集", width: 800, height: 600 },
    ],
  },
];

const SCROLL_SPEED = 25;
const REF_COLUMN_WIDTH = 345;
const ITEM_GAP = 16;

function loopSeconds(works: Work[]) {
  const height = works.reduce(
    (sum, w) => sum + (REF_COLUMN_WIDTH * w.height) / w.width + ITEM_GAP,
    0,
  );
  return Math.round(height / SCROLL_SPEED);
}

function Column({ works, direction }: { direction: "up" | "down"; works: Work[] }) {
  const style = { "--duration": `${loopSeconds(works)}s` } as CSSProperties;
  return (
    <div className={`${styles.column} ${direction === "up" ? styles.up : styles.down}`}>
      <div className={styles.track} style={style}>
        {[0, 1].map((copy) => (
          <ul key={copy} className={styles.group} aria-hidden={copy === 1 ? true : undefined}>
            {works.map((w) => (
              <li key={w.src} className={styles.item}>
                <SkeletonImg
                  src={w.src}
                  alt={copy === 0 ? w.alt : ""}
                  width={w.width}
                  height={w.height}
                />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

export default async function TOP() {
  return (
    <main className={styles.main}>
      <Navi intro responsive />
      <div className={styles.content}>
        <div className={styles.spHead} aria-hidden="true">
          <svg className={styles.spLogo} viewBox="0 0 1062.32 412.05" xmlns="http://www.w3.org/2000/svg">
            <image href="/img/basic/loading_wh.svg" width="100%" height="100%" />
          </svg>
          <p className={styles.spTag}>
            <span>想いに寄り添い、</span>
            <span>伝わるデザインに。</span>
          </p>
        </div>

        <section className={styles.hero}>
          <div className={styles.columns}>
            {COLUMNS.map((column, i) => (
              <Column key={i} {...column} />
            ))}
          </div>
        </section>

        <TopWorks />

        <div className={styles.lower}>
          <AboutSection />
          <div className={styles.footerWrap}>
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
}
