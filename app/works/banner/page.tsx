import { Suspense } from "react";
import styles from "../Works.module.css";
import Navi from "@/components/Navi";
import TitleH2 from "@/components/TitleH2";
import BannerWorksList from "@/components/BannerWorksList";
import Footer from "@/components/Footer";
import { bannerListData, bannerItems } from "@/lib/bannerData";
import { findWorkGenre } from "@/lib/workGenre";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

// バナー一覧ページ(/works/banner)。
// WORKSの3つのリンクから、それぞれ種類が選ばれた状態で開く
//   /works/banner?category=coupon   (クーポン)
//   /works/banner?category=feature  (特集)
//   /works/banner?category=sale     (セール)
export default async function BannerWorksPage({ searchParams }: Props) {
  // 選択状態の読み取りは画面側(BannerWorksList)でやる。
  // ここで受け取っておくと、ページが毎回サーバーで作られ、最初のHTMLから選択状態が反映される
  await searchParams;

  return (
    <main className={styles.main}>
      <Navi />
      <TitleH2 />
      <section>
        <Suspense fallback={null}>
          {/* ジャンル名(「バナー」)は、WORKS一覧のカードと同じものを works_data.ts から取る */}
          <BannerWorksList
            data={bannerListData}
            items={bannerItems}
            genre={findWorkGenre("/works/banner")}
          />
        </Suspense>
      </section>
      <Footer />
    </main>
  );
}
