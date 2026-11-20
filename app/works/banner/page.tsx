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

export default async function BannerWorksPage({ searchParams }: Props) {
  await searchParams;

  return (
    <main className={`${styles.main} ${styles.mainResponsive}`}>
      <Navi responsive />
      <TitleH2 responsive />
      <section>
        <Suspense fallback={null}>
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
