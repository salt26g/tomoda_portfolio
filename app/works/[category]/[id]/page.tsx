import { notFound } from "next/navigation";
import { EcworksData, webWorksData, logoWorksData, printWorksData } from "@/lib/worksData";
import { findWorkGenre } from "@/lib/workGenre";
import styles from "../../Works.module.css";
import Navi from "@/components/Navi";
import TitleH2 from "@/components/TitleH2";
import EcWorksDetail from "@/components/EcWorksDetail";
import WebWorksDetail from "@/components/WebWorksDetail";
import LogoWorksDetail from "@/components/LogoWorksDetail";
import Footer from "@/components/Footer";

type Props = {
  params: Promise<{ category: string; id: string }>;
};

export default async function WorksDetailPage({ params }: Props) {
  const { category, id } = await params;

  // 「[EC商品コンテンツ] 実務制作」の [ ] の部分。WORKS一覧のカードと同じジャンル名を、
  // このページのURLをもとに works_data.ts から取ってくる
  const genre = findWorkGenre(`/works/${category}/${id}`);

  // カテゴリごとに表示するコンポーネントを切り替える
  let content;

  if (category === "web") {
    const webData = webWorksData[id];
    if (!webData) notFound();
    content = <WebWorksDetail data={webData} genre={genre} />;
  } else if (category === "logo") {
    const logoData = logoWorksData[id];
    if (!logoData) notFound();
    content = <LogoWorksDetail data={logoData} genre={genre} />;
  } else if (category === "print") {
    // 印刷物・グッズ。構成はロゴの詳細ページと同じ
    const printData = printWorksData[id];
    if (!printData) notFound();
    content = <LogoWorksDetail data={printData} genre={genre} />;
  } else {
    const ecData = EcworksData[category]?.[id];
    if (!ecData) notFound();
    content = <EcWorksDetail data={ecData} genre={genre} />;
  }

  return (
    <main className={styles.main}>
      <Navi />
      <TitleH2 />
      <section>{content}</section>
      <Footer />
    </main>
  );
}