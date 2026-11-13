import Link from "next/link";
import styles from "./WorksGrid.module.css";
import { WorkItem } from "@/types/works";
import FadeIn from "@/components/FadeIn";

// "2026-07-15" → "2026.07.15"
const formatDate = (date: string) => date.replace(/-/g, ".");

// "https://" か "http://" で始まっていれば外部サイト
const isExternal = (url: string) => /^https?:\/\//.test(url);

export default function WorksGrid({ works }: { works: WorkItem[] }) {
  if (works.length === 0) {
    return (
      <FadeIn>
        <p className={styles.empty}>条件に一致する作品がありません。</p>
      </FadeIn>
    );
  }

  return (
    <ul className={styles.grid}>
      {works.map((work) => {
        // カードの中身。サイト内リンクと外部リンクで共通に使う
        const content = (
          <>
            <div className={styles.thumb}>
              {/* 実際の画像コンポーネント(next/imageなど)に差し替えてください */}
              <img src={work.image} alt={work.imageAlt} loading="lazy" />
            </div>
            <time className={styles.date} dateTime={work.publishedAt}>
              {formatDate(work.publishedAt)}
            </time>
            {/* 並びは「[ジャンル] 実務制作」。ジャンルが枠つき、制作の種類は文字だけ */}
            <p className={styles.badge}>
              {work.genres[0] && <span>{work.genres[0]}</span>}
              {work.production === "実務制作" ? "実務制作" : "フリーランス制作"}
            </p>
            <h3 className={styles.title}>{work.title}</h3>
          </>
        );

        return (
          <li key={work.id} className={styles.card}>
            {/* 画面に入ったら、下からふわっと表示する */}
            <FadeIn>
              {isExternal(work.url) ? (
                <a
                  href={work.url}
                  className={styles.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              ) : (
                <Link href={work.url} className={styles.link}>
                  {content}
                </Link>
              )}
            </FadeIn>
          </li>
        );
      })}
    </ul>
  );
}
