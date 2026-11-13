import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";
import Navi from "@/components/Navi";
import FadeIn from "@/components/FadeIn";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title:
    "TOMODA'S DESIGN｜ともだちさとのポートフォイオサイト",

  description:
    "WEBデザイナー兼グラフィックデザイナーともだちさとのポートフォリオサイトです。",

  alternates: {
    canonical: "https://tenmew.jp",
  },

  openGraph: {
    title:
      "TOMODA'S DESIGN｜ともだちさとのポートフォイオサイト",

    description:
      "WEBデザイナー兼グラフィックデザイナーともだちさとのポートフォリオサイトです。",

    url: "https://tenmew.jp",

    images: [
      {
        url: "/img/basic/ogp.webp",
        width: 1200,
        height: 630,
        alt: "TOMODA'S DESIGN",
      },
    ],
  },
};

export default async function TOP() {
  return (
  <main className={styles.main}>
    <Navi intro />
    <section className={styles.top}>
        <ul className={`${styles.creative} ${styles.pc}`}>
          <li><FadeIn><Link href="/works/ec/2-987601">
            <img src="/img/tmb/ec_987601.webp" alt="雲ごこちラグマット_商品コンテンツ" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>EC商品コンテンツ</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>Softime<br/>雲ごこちラグマット</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="#">
            <img src="/img/tmb/gd_ichigo.webp" alt="いちご大福_ブラックボード" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>手書きブラックボード</span>
              <span className={styles.client}>フリーランス制作</span>
              <span className={styles.text}>吉祥寺 御菓子処 俵屋<br/>いちご大福</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="/works/web/3-fukano">
            <img src="/img/tmb/web_fukano.webp" alt="深野じゅん_公式サイト" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>WEBサイト</span>
              <span className={styles.client}>フリーランス制作</span>
              <span className={styles.text}>自民党 深野じゅん公式サイト<br/>（閉鎖）</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="#">
            <img src="/img/tmb/bn_ket.webp" alt="毛布特集_バナー" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>バナー</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>Softime<br/>毛布特集バナー</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="/works/logo/2-yorozu">
            <img src="/img/tmb/logo_yarozu.webp" alt="酒興 萬_ロゴ" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>ロゴ</span>
              <span className={styles.client}>フリーランス制作</span>
              <span className={styles.text}>居酒屋<br/>酒興 萬-YOROZU-<br/>（閉店）</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="#">
            <img src="/img/tmb/bn_mat.webp" alt="マットレス_バナー" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>バナー</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>Softime<br/>マットレス特集バナー</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="/works/ec/5-986119">
            <img src="/img/tmb/ec_986119.webp" alt="Softime 高反発10cm三つ折りマットレス" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>EC商品コンテンツ</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>Softime<br/>高反発10cm三つ折りマットレス</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="/works/logo/4-easy">
            <img src="/img/tmb/logo_easy.webp" alt="イージーバドミントンクラブ_ロゴ" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>ロゴ</span>
              <span className={styles.client}>フリーランス制作</span>
              <span className={styles.text}>東京都バドミントンクラブ<br/>イージーバドミントンクラブ</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="/works/web/2-atmsale">
            <img src="/img/tmb/web_st_atm_sale.webp" alt="秋セール_セールページ" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>SALEページ</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>Softime<br/>大売り出しSALEページ</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="#">
            <img src="/img/tmb/bn_986743.webp" alt="冷感ラグマット_バナー" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>バナー</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>Softime<br/>冷感ラグマットクーポンバナー</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="/works/logo/1-28bad">
            <img src="/img/tmb/logo_28bad.webp" alt="28ばど_ロゴ" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>ロゴ</span>
              <span className={styles.client}>フリーランス制作</span>
              <span className={styles.text}>足立区バドミントンクラブ<br/>28ばど（つばばど）</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="#">
            <img src="/img/tmb/print_tenmew_01.webp" alt="テンミュー_名刺" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>名刺</span>
              <span className={styles.client}>フリーランス制作</span>
              <span className={styles.text}>株式会社テンミュー 名刺</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="#">
            <img src="/img/tmb/bn_box.webp" alt="ボックスシーツ祭_バナー" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>バナー</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>Softime ボックスシーツ祭バナー</span>
              {/*<span className={styles.btn}>詳しく見る</span>*/}
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="/works/ec/4-101-set">
            <img src="/img/tmb/ec_101-set.webp" alt="ストレートネック枕_商品コンテンツ" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>EC商品コンテンツ</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>fuwawa<br/>ストレートネック対策枕</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="#">
            <img src="/img/tmb/print_101-set_01.webp" alt="ストレートネック枕_取扱説明書" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>A5二つ折りパンフレット</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>fuwawa<br/>ストレートネック対策枕 取扱説明書</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="/works/web/7-newyear">
            <img src="/img/tmb/web_fw_newyear_sale.webp" alt="年末セール_セールページ" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>SALEページ</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>fuwawa<br/>歳末サンクスフェアページ</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="#">
            <img src="/img/tmb/bn_clearance.webp" alt="クリアランスセール_バナー" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>バナー</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>Softime<br/>サマークリアランスセールバナー</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="#">
            <img src="/img/tmb/print_yogi.webp" alt="YOGIカフェ_Tシャツ" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>Tシャツ/トートバッグ</span>
              <span className={styles.client}>フリーランス制作</span>
              <span className={styles.text}>YOGIカフェ<br/>オリジナルグッズ</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="#">
            <img src="/img/tmb/bn_980801.webp" alt="ラビットファー_バナー" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>バナー</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>Softime ラビットファー調<br/>敷きパッドクーポンバナー</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="/works/ec/3-986516">
            <img src="/img/tmb/ec_986516.webp" alt="2枚合わせ掛け布団_商品コンテンツ" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>EC商品コンテンツ</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>Softime<br/>2枚合わせ掛け布団</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="/works/web/1-tenmew">
            <img src="/img/tmb/web_tenmew.webp" alt="テンミュー_コーポレートサイト" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>WEBサイト</span>
              <span className={styles.client}>フリーランス制作</span>
              <span className={styles.text}>株式会社テンミュー<br/>コーポレートサイト</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="#">
            <img src="/img/tmb/gd_wagashi.webp" alt="甘納豆・俵最中_ブラックボード" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>手書きブラックボード</span>
              <span className={styles.client}>フリーランス制作</span>
              <span className={styles.text}>吉祥寺 御菓子処 俵屋<br/>俵屋の和菓子</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="works/web/5-smrsale">
            <img src="/img/tmb/web_st_sum_sale.webp" alt="夏セール_セールページ" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>SALEページ</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>Softime<br/>夏の感謝祭ページ</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="#">
            <img src="/img/tmb/bn_winter.webp" alt="ラグマット・布団_バナー" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>バナー</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>Softime<br/>ラグマット/布団クーポンTDAバナー</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="/works/logo/3-tenmew">
            <img src="/img/tmb/logo_tenmew.webp" alt="テンミュー_ロゴ" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>ロゴ</span>
              <span className={styles.client}>フリーランス制作</span>
              <span className={styles.text}>株式会社テンミュー<br/>企業ロゴ</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
          <li><FadeIn><Link href="/works/web/4-atmwtr">
            <img src="/img/tmb/web_st_atmwtr_feature.webp" alt="Softime 秋＆冬アイテム特集" />
            <p><span className={styles.exp}>
              <span className={styles.genre}>特集ページ</span>
              <span className={styles.client}>実務制作</span>
              <span className={styles.text}>Softime<br/>秋＆冬アイテム特集</span>
              <span className={styles.btn}>詳しく見る</span>
            </span></p>
          </Link></FadeIn></li>
        </ul>
        <div className={styles.btn}><Link href="/works">制作実績をもっと見る</Link></div>
    </section>
    <Footer />
  </main>
  );
}