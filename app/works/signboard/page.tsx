import styles from "../Works.module.css";
import Navi from "@/components/Navi";
import TitleH2 from "@/components/TitleH2";
import SignboardWorksList from "@/components/SignboardWorksList";
import Footer from "@/components/Footer";
import { signboardListData, signboardItems } from "@/lib/signboardData";
import { findWorkGenre } from "@/lib/workGenre";

export default function SignboardWorksPage() {
  return (
    <main className={`${styles.main} ${styles.mainResponsive}`}>
      <Navi responsive />
      <TitleH2 responsive />
      <section>
        <SignboardWorksList
          data={signboardListData}
          items={signboardItems}
          genre={findWorkGenre("/works/signboard")}
        />
      </section>
      <Footer />
    </main>
  );
}
