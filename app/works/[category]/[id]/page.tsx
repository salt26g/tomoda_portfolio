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

  const genre = findWorkGenre(`/works/${category}/${id}`);

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
    const printData = printWorksData[id];
    if (!printData) notFound();
    content = <LogoWorksDetail data={printData} genre={genre} />;
  } else {
    const ecData = EcworksData[category]?.[id];
    if (!ecData) notFound();
    content = <EcWorksDetail data={ecData} genre={genre} />;
  }

  return (
    <main className={`${styles.main} ${styles.mainResponsive}`}>
      <Navi responsive />
      <TitleH2 responsive />
      <section>{content}</section>
      <Footer />
    </main>
  );
}