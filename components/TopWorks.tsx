import Link from "next/link";
import styles from "./TopWorks.module.css";
import FadeIn from "@/components/FadeIn";
import { SkeletonImg } from "@/components/SkeletonImage";
import { myFont } from "@/fonts";
import { WORKS_NAV_LINKS } from "@/lib/worksNav";

const CATEGORIES = [
  { en: "WEB", ja: ["WEBサイト"], img: "/img/top/cir_web.webp", alt: "WEBサイトの制作実績" },
  { en: "ECsite-LP", ja: ["EC商品コンテンツ"], img: "/img/top/cir_ec.webp", alt: "EC商品コンテンツの制作実績" },
  { en: "LOGO", ja: ["ロゴ"], img: "/img/top/cir_logo.webp", alt: "ロゴの制作実績" },
  { en: "OTHER", ja: ["手書き看板・DTP", "ファブリック等"], img: "/img/top/cir_other.webp", alt: "手書き看板・DTP・ファブリックなどの制作実績" },
] as const;

const hrefOf = (en: string) => WORKS_NAV_LINKS.find((link) => link.label === en)?.href ?? "/works";

export default function TopWorks() {
  return (
    <section id="works" className={`${styles.works} ${myFont.variable}`}>
      <h2 className={styles.title}>WORKS</h2>
      <ul className={styles.list}>
        {CATEGORIES.map((c) => (
          <li key={c.en}>
            <FadeIn>
              <Link href={hrefOf(c.en)} className={styles.link}>
                <span className={styles.circle}>
                  <SkeletonImg src={c.img} alt={c.alt} width={295} height={295} loading="lazy" />
                </span>
                <span className={styles.en}>{c.en}</span>
                <span className={styles.ja}>
                  {c.ja.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              </Link>
            </FadeIn>
          </li>
        ))}
      </ul>
      <div className={styles.more}>
        <FadeIn>
          <Link href="/works" className={styles.moreLink}>
            制作実績を全て見る
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
