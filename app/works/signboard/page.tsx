import styles from "../Works.module.css";
import Navi from "@/components/Navi";
import TitleH2 from "@/components/TitleH2";
import SignboardWorksList from "@/components/SignboardWorksList";
import Footer from "@/components/Footer";
import { signboardListData, signboardItems } from "@/lib/signboardData";
import { findWorkGenre } from "@/lib/workGenre";

// 手書き看板の一覧ページ(/works/signboard)。
// 一覧のカードを押すと、その看板の写真(全体・アップなど)をモーダルで大きく見られる
export default function SignboardWorksPage() {
  return (
    <main className={styles.main}>
      <Navi />
      <TitleH2 />
      <section>
        {/* ジャンル名(「手書き看板」)は、WORKS一覧のカードと同じものを works_data.ts から取る */}
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
