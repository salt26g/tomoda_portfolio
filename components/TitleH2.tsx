import styles from "./TitleH2.module.css";
import { myFont } from "@/fonts";

export default function TitleH2({ responsive = false }: { responsive?: boolean }) {
  return (
    <section
      className={`${styles.header} ${responsive ? styles.responsive : ""} ${myFont.variable}`}
    >
      <h2>WORKS</h2>
    </section>
  );
}