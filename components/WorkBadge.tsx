import styles from "./WorkBadge.module.css";

// 詳細ページの上に出す「[ジャンル] 実務制作」の表示。
// WORKS一覧のカード(WorksGrid)のバッジと同じ見せ方・同じ並び・同じ寸法と色(WorkBadge.module.css)で、
//   ジャンル(EC商品コンテンツ など)… 枠つき(左)
//   制作の種類(実務制作 / フリーランス制作)… 文字だけ(右)
// ジャンルが分からないとき(genreなし)は、制作の種類だけを出す
export default function WorkBadge({
  production,
  genre,
}: {
  production: string;
  genre?: string;
}) {
  return (
    <div className={styles.badge}>
      {genre && <span className={styles.genre}>{genre}</span>}
      <span className={styles.production}>{production}</span>
    </div>
  );
}
