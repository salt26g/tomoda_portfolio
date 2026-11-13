"use client";

import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import LogoSlider, { logoImageSrc, logoImageBadge, type LogoSliderImage } from "@/components/LogoSlider";
import WorkBadge from "@/components/WorkBadge";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import styles from "./LogoWorksDetail.module.css";
import { useState, useEffect, useRef } from "react";
import { useLenis } from "lenis/react";

// 閉じるアニメーションの長さ(ミリ秒)。CSSの .modalOverlayClosing の時間と合わせる
const MODAL_CLOSE_MS = 350;

// 「第一案」「第二案」など、スライダー1つぶんのデータ
export type LogoWorksSection = {
  label: string; // 黒いラベルの文字(例:「第一案」)
  description: string; // ラベルの右に出す1行の説明
  notes?: string[]; // 説明の下に出す箇条書き(省略すると非表示)
  // スライダーに並べる画像。左上にバッジを付けたい画像だけ、{ src: "...", badge: "採用案" } の形で書く
  // (文字は画像ごとに自由。バッジなしの画像は、これまでどおり "..." のままでOK)
  images: LogoSliderImage[];
};

export type LogoWorksData = {
  title: string;
  tag: string;
  date: string;
  clientLabel?: string; // 項目名。省略すると「クライアント」(実務制作は "自社案件" と書く)
  client: string;
  role: string;
  tools: string;
  duration: string;
  request: string;
  url?: string; // 販売ページなどのリンク(省略すると行ごと非表示)
  urlLabel?: string; // 上のリンクの項目名。省略すると「販売ページ」
  model?: string; // モデル(省略すると行ごと非表示)。販売ページの下に出る
  remarks?: string; // ストーリー(省略すると行ごと非表示)
  thumbnails: string[]; // 上の大きいサムネイル用の画像(クリックでメイン画像が切り替わる)
  sections: LogoWorksSection[];
  relatedDesigns?: {
    image: string;
    title: string;
    url?: string;
  }[];
};

// 拡大モーダルに表示する内容
type ModalState = {
  images: string[]; // モーダルのサムネイルに並べる画像
  badges?: (string | undefined)[]; // 各画像の左上に出すバッジの文字(images と同じ順。省略するとバッジなし)
  index: number; // いま大きく表示している画像の番号
  alt: string;
  syncGallery: boolean; // true のとき、モーダルで選んだ画像を上の大きいサムネイルにも反映する
};

export default function LogoWorksDetail({
  data,
  genre,
}: {
  data: LogoWorksData;
  genre?: string; // 「ロゴ」など。WORKS一覧のカードと同じ表記(works_data.ts から取得)
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [isClosing, setIsClosing] = useState(false); // 閉じるアニメーション中
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lenis = useLenis();
  const isModalOpen = modal !== null;

  // アニメーションを見せてから、モーダルを本当に閉じる
  const closeModal = () => {
    if (isClosing) return; // 連打しても二重に動かさない

    // OSで「視差効果を減らす」設定の人は、アニメーションなしで即閉じる
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      setModal(null);
      return;
    }

    setIsClosing(true);
    closeTimer.current = setTimeout(() => {
      setModal(null);
      setIsClosing(false);
    }, MODAL_CLOSE_MS);
  };

  // モーダルの中でサムネイルを選んだとき
  const selectInModal = (index: number) => {
    setModal((prev) => (prev ? { ...prev, index } : prev));
    if (modal?.syncGallery) setActiveIndex(index);
  };

  // ページ移動などで消えるとき、残っているタイマーを止める
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // モーダルが開いている間は、後ろの画面をスクロールさせない
  useEffect(() => {
    if (isModalOpen) {
      lenis?.stop();
      lockScroll();
    } else {
      lenis?.start();
      unlockScroll();
    }

    return () => {
      lenis?.start();
      unlockScroll();
    };
  }, [isModalOpen, lenis]);

  return (
    <div className={styles.page}>
      <Breadcrumb
        items={[
          { label: "WORKS", href: "/works" },
          { label: data.title },
        ]}
      />

      <div className={styles.contentWrap}>
        {/* 左カラム:ギャラリー */}
        <div className={styles.gallery}>
          <button
            type="button"
            className={styles.mainImageWrap}
            onClick={() =>
              setModal({
                images: data.thumbnails,
                index: activeIndex,
                alt: data.title,
                syncGallery: true,
              })
            }
            aria-label="画像を拡大する"
          >
            <Image
              src={data.thumbnails[activeIndex]}
              alt={data.title}
              fill
              sizes="(max-width: 1024px) 100vw, 420px"
              priority
              style={{ objectFit: "contain" }}
            />
          </button>

          <ul className={styles.thumbList}>
            {data.thumbnails.map((src, index) => (
              <li key={`${src}-${index}`}>
                <button
                  type="button"
                  className={`${styles.thumbBtn} ${
                    index === activeIndex ? styles.thumbActive : ""
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`サムネイル${index + 1}を表示する`}
                >
                  <Image
                    src={src}
                    alt={`サムネイル${index + 1}`}
                    fill
                    sizes="60px"
                    style={{ objectFit: "contain" }}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* 右カラム:詳細情報 */}
        <div className={styles.infoCol}>
          <div className={styles.infoHead}>
            <WorkBadge production={data.tag} genre={genre} />
            <span className={styles.date}>{data.date}</span>
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
            <div className={styles.detailRow}>
              <dt className={styles.dt}>ご要望</dt>
              <dd className={styles.dd}>{data.request}</dd>
            </div>
            {data.url && (
              <div className={styles.detailRow}>
                <dt className={styles.dt}>{data.urlLabel ?? "販売ページ"}</dt>
                <dd className={styles.dd}>
                  <a href={data.url} target="_blank" rel="noopener noreferrer">
                    {data.url}
                  </a>
                </dd>
              </div>
            )}
            {data.model && (
              <div className={styles.detailRow}>
                <dt className={styles.dt}>モデル</dt>
                <dd className={`${styles.dd} ${styles.ddKeepWords}`}>{data.model}</dd>
              </div>
            )}
            {data.remarks && (
              <div className={styles.detailRow}>
                <dt className={styles.dt}>ストーリー</dt>
                <dd className={styles.dd}>{data.remarks}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* 第一案・第二案…のスライダー */}
      {data.sections.map((section) => (
        <section key={section.label} className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>{section.label}</span>
            <p className={styles.sectionDesc}>{section.description}</p>
          </div>

          {section.notes && section.notes.length > 0 && (
            <ul className={styles.notes}>
              {section.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}

          <LogoSlider
            images={section.images}
            alt={section.label}
            onSelect={(index) =>
              setModal({
                images: section.images.map(logoImageSrc),
                badges: section.images.map(logoImageBadge),
                index,
                alt: section.label,
                syncGallery: false,
              })
            }
          />
        </section>
      ))}

      {/* 関連デザイン(WEBデザイン詳細ページと同じ。データがなければ枠ごと非表示) */}
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

      {/* 拡大モーダル */}
      {modal && (
        <div
          className={`${styles.modalOverlay} ${
            isClosing ? styles.modalOverlayClosing : ""
          }`}
          onClick={closeModal}
        >
          <div
            className={`${styles.modalInner} ${
              isClosing ? styles.modalInnerClosing : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalMain}>
              <Image
                src={modal.images[modal.index]}
                alt={`${modal.alt} 拡大画像${
                  modal.badges?.[modal.index] ? `(${modal.badges[modal.index]})` : ""
                }`}
                fill
                sizes="(max-width: 1024px) 90vw, 800px"
                style={{ objectFit: "contain" }}
              />
              {/* スライダーと同じ、画像の左上のバッジ(いま大きく表示している画像のぶんだけ出す) */}
              {modal.badges?.[modal.index] && (
                <span className={styles.modalBadge} aria-hidden="true">
                  {modal.badges[modal.index]}
                </span>
              )}
            </div>

            <ul className={styles.modalThumbGrid}>
              {modal.images.map((src, index) => (
                <li key={`${src}-${index}`}>
                  <button
                    type="button"
                    className={`${styles.modalThumbBtn} ${
                      index === modal.index ? styles.modalThumbActive : ""
                    }`}
                    onClick={() => selectInModal(index)}
                    aria-label={`${index + 1}枚目を表示する`}
                  >
                    <Image
                      src={src}
                      alt={`サムネイル${index + 1}`}
                      fill
                      sizes="120px"
                      style={{ objectFit: "contain" }}
                    />
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={styles.closeBtn}
              onClick={closeModal}
              aria-label="閉じる"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
