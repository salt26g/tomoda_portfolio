"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "@/components/SkeletonImage";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import FadeIn from "@/components/FadeIn";
import BannerModal, { bannerImageSrc, type BannerImage } from "@/components/BannerModal";
import WorkBadge from "@/components/WorkBadge";
import styles from "./BannerWorksList.module.css";

export type BannerCategory = "coupon" | "feature" | "sale";

const CATEGORIES: { key: BannerCategory; label: string }[] = [
  { key: "coupon", label: "クーポン" },
  { key: "feature", label: "特集" },
  { key: "sale", label: "セール" },
];

const CATEGORY_LABEL: Record<BannerCategory, string> = {
  coupon: "クーポン",
  feature: "特集",
  sale: "セール",
};

export type BannerItem = {
  id: string;
  category: BannerCategory;
  date: string;
  images: BannerImage[];
  title?: string;
};

export type BannerListData = {
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

function normalizeCategories(list: BannerCategory[]): BannerCategory[] {
  return list.length === CATEGORIES.length ? [] : list;
}

function parseCategories(value: string | null): BannerCategory[] {
  if (!value) return [];
  const parts = value.split(",");
  return normalizeCategories(
    CATEGORIES.map((c) => c.key).filter((key) => parts.includes(key))
  );
}

function SwitchPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`${styles.pill} ${active ? styles.pillActive : ""}`}
      onClick={onClick}
    >
      <span>{label}</span>
      <span className={styles.knob} aria-hidden="true">
        <svg viewBox="0 0 24 24" className={styles.check}>
          <path
            d="M6 12.5l4 4 8-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}

export default function BannerWorksList({
  data,
  items,
  genre,
}: {
  data: BannerListData;
  items: BannerItem[];
  genre?: string;
}) {
  const searchParams = useSearchParams();
  const selected = parseCategories(searchParams.get("category"));
  const selectedKey = selected.join(",");

  const [sortOrder, setSortOrder] = useState<SortOrder>("recommend");
  const [openItem, setOpenItem] = useState<BannerItem | null>(null);

  const setCategories = (next: BannerCategory[]) => {
    const ordered = normalizeCategories(
      CATEGORIES.map((c) => c.key).filter((k) => next.includes(k))
    );

    const params = new URLSearchParams(window.location.search);
    params.delete("category");
    const query = [
      params.toString(),
      ordered.length > 0 ? `category=${ordered.join(",")}` : "",
    ]
      .filter(Boolean)
      .join("&");

    window.history.replaceState(
      null,
      "",
      query ? `?${query}` : window.location.pathname
    );
  };

  const toggleCategory = (key: BannerCategory) => {
    setCategories(
      selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]
    );
  };

  const clearCategories = () => setCategories([]);

  const visibleItems = useMemo(() => {
    const keys = selectedKey ? selectedKey.split(",") : [];
    const list =
      keys.length === 0
        ? items
        : items.filter((item) => keys.includes(item.category));

    if (sortOrder === "recommend") return list;

    return [...list].sort((a, b) => {
      const da = normalizeDate(a.date);
      const db = normalizeDate(b.date);
      return sortOrder === "new" ? db.localeCompare(da) : da.localeCompare(db);
    });
  }, [items, selectedKey, sortOrder]);

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

      <hr className={styles.divider} />

      <div className={styles.filterRow}>
        <div
          className={styles.pills}
          role="group"
          aria-label="バナーの種類で絞り込む"
        >
          <SwitchPill
            label="すべて"
            active={selected.length === 0}
            onClick={clearCategories}
          />
          {CATEGORIES.map((category) => (
            <SwitchPill
              key={category.key}
              label={category.label}
              active={selected.includes(category.key)}
              onClick={() => toggleCategory(category.key)}
            />
          ))}
        </div>

        <div className={styles.sortArea}>
          <p className={styles.count} aria-live="polite">
            <span className={styles.countNumber}>{visibleItems.length}</span>件
          </p>
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
      </div>

      {visibleItems.length === 0 ? (
        <p className={styles.empty}>条件に一致するバナーがありません。</p>
      ) : (
        <ul key={`${selectedKey}|${sortOrder}`} className={styles.grid}>
          {visibleItems.map((item) => {
            const label = CATEGORY_LABEL[item.category];
            const count = item.images.length;
            return (
              <li key={item.id} className={styles.card}>
                <FadeIn>
                  <button
                    type="button"
                    className={styles.cardBtn}
                    onClick={() => setOpenItem(item)}
                    aria-label={`${label}バナーを開く(${count}サイズ)`}
                  >
                    <span className={styles.thumb}>
                      <span className={styles.thumbInner}>
                        <Image
                          src={bannerImageSrc(item.images[0])}
                          alt={item.title ?? `${label}バナー`}
                          fill
                          sizes="(max-width: 600px) 45vw, (max-width: 1100px) 30vw, 300px"
                          style={{ objectFit: "contain" }}
                        />
                      </span>
                      {count > 1 && (
                        <span className={styles.sizeBadge}>{count}サイズ</span>
                      )}
                    </span>
                    <span className={styles.caption}>
                      <span className={styles.category}>{label}</span>
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
            );
          })}
        </ul>
      )}

      {openItem && (
        <BannerModal
          key={openItem.id}
          images={openItem.images}
          alt={openItem.title ?? `${CATEGORY_LABEL[openItem.category]}バナー`}
          onClosed={handleClosed}
        />
      )}
    </div>
  );
}
