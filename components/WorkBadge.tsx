import styles from "./WorkBadge.module.css";

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
