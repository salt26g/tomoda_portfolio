"use client";

import { useId, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import WorkBadge from "@/components/WorkBadge";
import styles from "./WebWorksDetail.module.css";

// images用の画像。文字列だけでもOK、説明文をつけたい時は { src, caption } で書く
export type WebWorksImage = {
  src: string;
  caption?: string; // 画像の上に表示する1行の説明(省略すると非表示)
};

export type WebWorksTab = {
  label: string;
  pc?: string; // PC版の画像(左・幅広)
  sp?: string; // SP版の画像(右・幅狭)
  caption?: string; // pc/sp画像の上に表示する1行の説明(省略すると非表示)
  images?: (string | WebWorksImage)[]; // 「他デザイン提案」「資料」など、PC/SP以外の画像
};

export type WebWorksData = {
  title: string;
  tag: string;
  date: string;
  mainImage: string; // 一番上のモックアップ画像
  clientLabel?: string; // 項目名。省略すると「クライアント」(実務制作は "自社案件" と書く)
  client: string;
  role: string[]; // 担当業務(「 / 」区切りで表示)
  tools: { label: string; items: string[] }[]; // 使用ツール(カテゴリごと)
  duration: string;
  request: string;
  url?: string;
  tabs: WebWorksTab[];
  defaultTab?: number; // 最初に開くタブ(0始まり)。省略時は先頭
  relatedDesigns?: {
    image: string;
    title: string;
    url?: string;
  }[];
};

// 説明文の「：」より前の部分(例:「TOPページA」)を、黒背景・白文字のラベルにして表示する。
// 「：」(全角)か「:」(半角)がない説明文は、そのままの文字で表示する
function renderCaption(text: string) {
  const match = text.match(/^(.+?)[：:][\s\u3000]*(.*)$/);
  if (!match) return text;

  const [, label, body] = match;
  return (
    <>
      <span className={styles.captionLabel}>{label.trim()}</span>
      {body}
    </>
  );
}

// 別のデザイン詳細ページに移動したとき(関連デザインのリンクなど)、
// 前のページで選んでいたタブの番号が残らないよう、ページ(title)ごとに作り直す
export default function WebWorksDetail({
  data,
  genre,
}: {
  data: WebWorksData;
  genre?: string; // 「WEBサイト」など。WORKS一覧のカードと同じ表記(works_data.ts から取得)
}) {
  return <WebWorksDetailInner key={data.title} data={data} genre={genre} />;
}

function WebWorksDetailInner({
  data,
  genre,
}: {
  data: WebWorksData;
  genre?: string;
}) {
  const baseId = useId();
  const [activeTabState, setActiveTab] = useState(data.defaultTab ?? 0);
  // タブの数より大きい番号が残っていても、エラーにならないよう範囲内におさめる
  const activeTab = Math.min(activeTabState, Math.max(data.tabs.length - 1, 0));
  const tab = data.tabs[activeTab];
  // 文字列でも { src, caption } でも同じ形にそろえる
  const images: WebWorksImage[] = (tab.images ?? []).map((img) =>
    typeof img === "string" ? { src: img } : img
  );

  // ← → キーでタブを切り替える
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const last = data.tabs.length - 1;
    const next =
      e.key === "ArrowRight"
        ? activeTab === last ? 0 : activeTab + 1
        : activeTab === 0 ? last : activeTab - 1;
    setActiveTab(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  };

  return (
    <div className={styles.page}>
      <Breadcrumb
        items={[
          { label: "WORKS", href: "/works" },
          { label: data.title },
        ]}
      />

      <div className={styles.infoHead}>
        <WorkBadge production={data.tag} genre={genre} />
        <span className={styles.date}>{data.date}</span>
      </div>

      <h1 className={styles.title}>{data.title}</h1>

      <div className={styles.mainImageWrap}>
        {data.url ? (
          // urlがあれば、画像クリックでサイトを新しいタブで開く
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mainImageLink}
            aria-label={`${data.title}のサイトを開く(新しいタブ)`}
          >
            <Image
              src={data.mainImage}
              alt={data.title}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
              style={{ objectFit: "contain" }}
            />
          </a>
        ) : (
          <Image
            src={data.mainImage}
            alt={data.title}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            priority
            style={{ objectFit: "contain" }}
          />
        )}
      </div>

      <dl className={styles.detailList}>
        <div className={styles.detailRow}>
          <dt className={styles.dt}>{data.clientLabel ?? "クライアント"}</dt>
          <dd className={styles.dd}>{data.client}</dd>
        </div>
        <div className={styles.detailRow}>
          <dt className={styles.dt}>担当業務</dt>
          <dd className={styles.dd}>{data.role.join("  /  ")}</dd>
        </div>

        <div className={styles.detailRow}>
          <dt className={styles.dt}>使用ツール</dt>
          <dd className={styles.dd}>
            {data.tools.map((group) => (
              <div key={group.label} className={styles.toolRow}>
                <span className={styles.toolLabel}>{group.label}</span>
                <span className={styles.toolItems}>
                  {group.items.join("  /  ")}
                </span>
              </div>
            ))}
          </dd>
        </div>

        <div className={styles.detailRow}>
          <dt className={styles.dt}>作業時間</dt>
          <dd className={styles.dd}>{data.duration}</dd>
        </div>
        <div className={styles.detailRow}>
          <dt className={styles.dt}>ご要望</dt>
          <dd className={styles.dd}>{data.request}</dd>
        </div>
        {data.url && (
          <div className={styles.detailRow}>
            <dt className={styles.dt}>URL</dt>
            <dd className={styles.dd}>
              <a href={data.url} target="_blank" rel="noopener noreferrer">
                {data.url}
              </a>
            </dd>
          </div>
        )}
      </dl>

      {/* タブ */}
      <div
        className={styles.tabList}
        role="tablist"
        aria-label="デザインの切り替え"
        onKeyDown={handleKeyDown}
      >
        {data.tabs.map((t, index) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            id={`${baseId}-tab-${index}`}
            aria-selected={index === activeTab}
            aria-controls={`${baseId}-panel`}
            tabIndex={index === activeTab ? 0 : -1}
            className={`${styles.tab} ${
              index === activeTab ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        key={activeTab}
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${activeTab}`}
        className={styles.panel}
      >
        {(tab.pc || tab.sp) && tab.caption && (
          <p className={`${styles.caption} ${styles.deviceCaption}`}>
            {renderCaption(tab.caption)}
          </p>
        )}

        {(tab.pc || tab.sp) && (
          <div className={styles.deviceRow}>
            {tab.pc && (
              <div className={styles.pc}>
                <Image
                  src={tab.pc}
                  alt={`${tab.label} PC版`}
                  // width/heightは縦横比の目安(実際の表示サイズはCSSで決まる)
                  width={1200}
                  height={2400}
                  sizes="(max-width: 1024px) 60vw, 560px"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            )}
            {tab.sp && (
              <div className={styles.sp}>
                <Image
                  src={tab.sp}
                  alt={`${tab.label} SP版`}
                  width={390}
                  height={3400}
                  sizes="(max-width: 1024px) 24vw, 200px"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            )}
          </div>
        )}

        {images.length > 0 && (
          // 1枚なら中央に1枚、2枚以上なら横並び(2列)で表示
          <div
            className={`${styles.extraGrid} ${
              images.length > 1 ? styles.extraGridMulti : ""
            }`}
          >
            {images.map(({ src, caption }, index) => (
              <div key={src} className={styles.extraImage}>
                {caption && (
                  <p className={styles.caption}>{renderCaption(caption)}</p>
                )}
                <Image
                  src={src}
                  alt={`${tab.label} ${index + 1}`}
                  width={1200}
                  height={800}
                  sizes={
                    images.length > 1
                      ? "(max-width: 1024px) 48vw, 420px"
                      : "(max-width: 1024px) 100vw, 800px"
                  }
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {data.relatedDesigns && data.relatedDesigns.length > 0 && (
        <section className={styles.related}>
          <h2 className={styles.relatedTitle}>関連デザイン</h2>
          <ul className={styles.relatedList}>
            {data.relatedDesigns.map((item) => (
              <li key={item.image}>
                <div className={styles.relatedImageWrap}>
                  {item.url ? (
                    <Link href={item.url} className={styles.relatedLink}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="200px"
                        style={{ objectFit: "cover" }}
                      />
                    </Link>
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="200px"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
