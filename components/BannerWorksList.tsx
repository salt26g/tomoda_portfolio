"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import FadeIn from "@/components/FadeIn";
import BannerModal, { bannerImageSrc, type BannerImage } from "@/components/BannerModal";
import WorkBadge from "@/components/WorkBadge";
import styles from "./BannerWorksList.module.css";

// バナーの種類。ボタンの並びも、この順番
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

// バナー1つぶんのデータ
export type BannerItem = {
  id: string; // 重複しない文字列
  category: BannerCategory;
  date: string; // "2026.10.01" の形(絞り込み後の並び順にも使う)
  images: BannerImage[]; // 1〜5枚。最初の1枚が、一覧に出るサムネイル(モーダルでサイズ表記を出す画像は { src, size } の形で書く)
  title?: string; // 画像の説明(省略すると「クーポンバナー」など)
};

// ページ上部の詳細情報(他の詳細ページと同じ項目)
export type BannerListData = {
  tag: string; // 例: "実務制作"
  title: string; // 例: "Softime バナーデザイン一覧"
  clientLabel?: string; // 項目名。省略すると「クライアント」(実務制作は "自社案件")
  client: string;
  role: string;
  tools: string;
  duration: string;
};

// recommend … おすすめ順(bannerData.ts に書いた順番のまま) / new … 新しい順 / old … 古い順
type SortOrder = "recommend" | "new" | "old";

// "2026-10-01" と "2026.10.01" のどちらで書いても同じに扱う
const normalizeDate = (date: string) => date.replace(/-/g, ".");

// 種類を3つとも選んでいるのは「すべて」と同じ意味なので、何も選んでいない(空の配列)ことにする。
// → 3つ目を選んだ瞬間に「すべて」がONに切り替わり、3つはOFFに戻る
function normalizeCategories(list: BannerCategory[]): BannerCategory[] {
  return list.length === CATEGORIES.length ? [] : list;
}

// URLの ?category=coupon,sale を、選択中の種類の配列にする
function parseCategories(value: string | null): BannerCategory[] {
  if (!value) return [];
  const parts = value.split(",");
  return normalizeCategories(
    CATEGORIES.map((c) => c.key).filter((key) => parts.includes(key))
  );
}

// スイッチ式のボタン1つぶん(「すべて」と、各種類のボタンで同じものを使う)。
// ONのときは黒地で白い丸が左に、OFFのときは灰色地で白い丸が右に動く
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
  genre?: string; // 「バナー」など。WORKS一覧のカードと同じ表記(works_data.ts から取得)
}) {
  // 選択中の種類は、URL(?category=...)をそのまま使う。
  // → WORKSのリンクから「クーポンだけ選ばれた状態」で開ける。戻るボタンやURLの共有でも状態が保たれる
  const searchParams = useSearchParams();
  const selected = parseCategories(searchParams.get("category"));
  const selectedKey = selected.join(",");

  const [sortOrder, setSortOrder] = useState<SortOrder>("recommend");
  const [openItem, setOpenItem] = useState<BannerItem | null>(null);

  // 選択する種類を、URLに書き込む(空の配列なら、何も選ばない = 全表示)
  const setCategories = (next: BannerCategory[]) => {
    // ボタンの並び順にそろえてURLに書く(3つとも選んだときは、何も書かない = 「すべて」)
    const ordered = normalizeCategories(
      CATEGORIES.map((c) => c.key).filter((k) => next.includes(k))
    );

    // category 以外のパラメータ(あれば)はそのまま残す。
    // カンマは URLSearchParams に任せると「%2C」に変わって見づらいので、自分で組み立てる
    const params = new URLSearchParams(window.location.search);
    params.delete("category");
    const query = [
      params.toString(),
      ordered.length > 0 ? `category=${ordered.join(",")}` : "",
    ]
      .filter(Boolean)
      .join("&");

    // ページを読み込み直さずに、URLだけ書き換える(useSearchParamsにもすぐ反映される)
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

  // 「すべて」: 選んでいる種類をすべて外して、全表示に戻す
  const clearCategories = () => setCategories([]);

  // 何も選ばれていなければ全表示(WORKSの絞り込みと同じ考え方)
  const visibleItems = useMemo(() => {
    const keys = selectedKey ? selectedKey.split(",") : [];
    const list =
      keys.length === 0
        ? items
        : items.filter((item) => keys.includes(item.category));

    // おすすめ順は、並べ替えずに bannerData.ts に書いた順のまま
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

      <hr className={styles.divider} />

      {/* ------ 種類のボタン・件数・並べ替え ------ */}
      <div className={styles.filterRow}>
        <div
          className={styles.pills}
          role="group"
          aria-label="バナーの種類で絞り込む"
        >
          {/* 「すべて」: 何も選んでいないときだけON。押すと、選んだ種類をすべて外す */}
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
          {/* 件数。絞り込みを変えるたびに数字が変わる */}
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

      {/* ------ バナーの一覧 ------ */}
      {visibleItems.length === 0 ? (
        <p className={styles.empty}>条件に一致するバナーがありません。</p>
      ) : (
        // key を条件ごとに変えると、条件が変わるたびに一覧が作り直され、全カードがもう一度ふわっと表示される
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
                          sizes="(max-width: 600px) 45vw, (max-width: 1024px) 30vw, 300px"
                          style={{ objectFit: "contain" }}
                        />
                      </span>
                      {/* 別サイズがあることを伝えるバッジ(1サイズだけのときは出さない) */}
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

      {/* ------ 全サイズを見るモーダル ------ */}
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
