import styles from "./TitleH2.module.css";
import { myFont } from "@/fonts";

export default function TitleH2() {
  return (
    <section className={`${styles.header} ${myFont.variable}`}>
      <h2>WORKS</h2>
    </section>
  );
}