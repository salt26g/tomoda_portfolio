"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import FadeIn from "@/components/FadeIn";
import BannerModal, { bannerImageSrc, type BannerImage } from "@/components/BannerModal";
import WorkBadge from "@/components/WorkBadge";
import styles from "./SignboardWorksList.module.css";

// 手書き看板1枚ぶんのデータ
export type SignboardItem = {
  id: string; // 重複しない文字列
  title: string; // 看板の名前(一覧のカードの下に出る)
  date: string; // "2026.10.01" の形(新しい順・古い順の並べ替えに使う)
  images: BannerImage[]; // 1〜5枚。最初の1枚が、一覧に出るサムネイル(モーダルには書いた順で全部が並ぶ)
};

// ページ上部の詳細情報(他の詳細ページと同じ項目)
export type SignboardListData = {
  tag: string; // 例: "フリーランス制作"
  title: string; // 例: "吉祥寺 御菓子処 俵屋　手書き看板"
  clientLabel?: string; // 項目名。省略すると「クライアント」(実務制作は "自社案件")
  client: string;
  role: string;
  tools: string;
  duration: string;
};

// recommend … おすすめ順(signboardData.ts に書いた順番のまま) / new … 新しい順 / old … 古い順
type SortOrder = "recommend" | "new" | "old";

// "2026-10-01" と "2026.10.01" のどちらで書いても同じに扱う
const normalizeDate = (date: string) => date.replace(/-/g, ".");

export default function SignboardWorksList({
  data,
  items,
  genre,
}: {
  data: SignboardListData;
  items: SignboardItem[];
  genre?: string; // 「手書き看板」など。WORKS一覧のカードと同じ表記(works_data.ts から取得)
}) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("recommend");
  const [openItem, setOpenItem] = useState<SignboardItem | null>(null);

  const visibleItems = useMemo(() => {
    // おすすめ順は、並べ替えずに signboardData.ts に書いた順のまま
    if (sortOrder === "recommend") return items;

    return [...items].sort((a, b) => {
      const da = normalizeDate(a.date);
      const db = normalizeDate(b.date);
      return sortOrder === "new" ? db.localeCompare(da) : da.localeCompare(db);
    });
  }, [items, sortOrder]);

  const handleClosed = useCallback(() => setOpenItem(null), []);

  return (
    <div>
      <Breadcrumb
        items={[{ label: "WORKS", href: "/works" }, { label: data.title }]}
      />

      {/* ------ 上の詳細情報 ------ */}
      <div className={styles.infoHead}>
        <WorkBadge production={data.tag} genre={genre} />
      </div>
      <h1 className={styles.title}>{data.title}</h1>

      <dl className={styles.detailList}>
        <div className={styles.detailRow}>
          <dt className={styles.dt}>{data.clientLabel ?? "クライアント"}</dt>
          <dd className={styles.dd}>{data.client}</dd>
        </div>
        <div className={styles.detailRow}>
          <dt className={styles.dt}>担当業務</dt>
          <dd className={styles.dd}>{data.role}</dd>
        </div>
        <div className={styles.detailRow}>
          <dt className={styles.dt}>使用ツール</dt>
          <dd className={styles.dd}>{data.tools}</dd>
        </div>
        <div className={styles.detailRow}>
          <dt className={styles.dt}>作業時間</dt>
          <dd className={styles.dd}>{data.duration}</dd>
        </div>
      </dl>

      {/* ------ 並べ替え ------ */}
      <div className={styles.filterRow}>
        <select
          className={styles.sortSelect}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as SortOrder)}
          aria-label="並べ替え"
        >
          <option value="recommend">並べ替え：おすすめ順</option>
          <option value="new">並べ替え：新しい順</option>
          <option value="old">並べ替え：古い順</option>
        </select>
      </div>

      {/* ------ 看板の一覧 ------ */}
      {/* key を並び順ごとに変えると、並べ替えるたびに一覧が作り直され、全カードがもう一度ふわっと表示される */}
      <ul key={sortOrder} className={styles.grid}>
        {visibleItems.map((item) => (
          <li key={item.id} className={styles.card}>
            <FadeIn>
              <button
                type="button"
                className={styles.cardBtn}
                onClick={() => setOpenItem(item)}
                aria-label={`${item.title}を拡大して見る`}
              >
                <span className={styles.thumb}>
                  <Image
                    src={bannerImageSrc(item.images[0])}
                    alt={item.title}
                    fill
                    sizes="(max-width: 600px) 45vw, (max-width: 1024px) 30vw, 420px"
                    style={{ objectFit: "contain" }}
                  />
                </span>
                <span className={styles.caption}>
                  <span className={styles.name}>{item.title}</span>
                  <time
                    className={styles.date}
                    dateTime={normalizeDate(item.date).replace(/\./g, "-")}
                  >
                    {normalizeDate(item.date)}
                  </time>
                </span>
              </button>
            </FadeIn>
          </li>
        ))}
      </ul>

      {/* ------ 写真を大きく見るモーダル(バナーのモーダルと同じもの。サイズ表記は出さない) ------ */}
      {openItem && (
        <BannerModal
          key={openItem.id}
          images={openItem.images}
          alt={openItem.title}
          onClosed={handleClosed}
        />
      )}
    </div>
  );
}
