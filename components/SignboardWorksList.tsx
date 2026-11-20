"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "@/components/SkeletonImage";
import Breadcrumb from "@/components/Breadcrumb";
import FadeIn from "@/components/FadeIn";
import BannerModal, { bannerImageSrc, type BannerImage } from "@/components/BannerModal";
import WorkBadge from "@/components/WorkBadge";
import styles from "./SignboardWorksList.module.css";

export type SignboardItem = {
  id: string;
  title: string;
  date: string;
  images: BannerImage[];
};

export type SignboardListData = {
  tag: string;
  title: string;
  clientLabel?: string;
  client: string;
  role: string;
  tools: string;
  duration: string;
};

type SortOrder = "recommend" | "new" | "old";

const normalizeDate = (date: string) => date.replace(/-/g, ".");

export default function SignboardWorksList({
  data,
  items,
  genre,
}: {
  data: SignboardListData;
  items: SignboardItem[];
  genre?: string;
}) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("recommend");
  const [openItem, setOpenItem] = useState<SignboardItem | null>(null);

  const visibleItems = useMemo(() => {
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
                    sizes="(max-width: 600px) 45vw, (max-width: 1100px) 30vw, 420px"
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
