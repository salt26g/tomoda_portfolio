"use client";

import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "@/components/Breadcrumb";
import WorkBadge from "@/components/WorkBadge";
import styles from "./EcWorksDetail.module.css";
import { useState, useEffect, useRef } from "react";

// 閉じるアニメーションの長さ(ミリ秒)。CSSの .modalOverlayClosing の時間と合わせる
const MODAL_CLOSE_MS = 350;
import { useLenis } from "lenis/react";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

export type EcWorksData = {
  title: string;
  tag: string;
  date: string;
  role: string;
  tools: string;
  duration: string;
  request: string;
  url?: string;
  remarks: string;
  thumbnails: string[]; // サムネイル一覧(クリックでメイン画像が切り替わる)
  secondaryImage?: string; // サムネイル一覧の下に続く2枚目の大画像
  textBlockImage?: string;
  relatedDesigns?: {
    image: string;
    title: string;
    url?: string;
  }[];
};

type WorksDetailProps = {
  data: EcWorksData;
  genre?: string; // 「EC商品コンテンツ」など。WORKS一覧のカードと同じ表記(works_data.ts から取得)
};

export default function WorksDetail({ data, genre }: WorksDetailProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // 閉じるアニメーション中
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lenis = useLenis();

  // アニメーションを見せてから、モーダルを本当に閉じる
  const closeModal = () => {
    if (isClosing) return; // 連打しても二重に動かさない

    // OSで「視差効果を減らす」設定の人は、アニメーションなしで即閉じる
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      setIsModalOpen(false);
      return;
    }

    setIsClosing(true);
    closeTimer.current = setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, MODAL_CLOSE_MS);
  };

  // ページ移動などで消えるとき、残っているタイマーを止める
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

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
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              src={data.thumbnails[activeIndex]}
              alt={data.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </button>

          <ul className={styles.thumbList}>
            {data.thumbnails.map((src, index) => (
              <li key={index}>
                <button
                  type="button"
                  className={`${styles.thumbBtn} ${
                    index === activeIndex ? styles.thumbActive : ""
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <Image
                    src={src}
                    alt={`サムネイル${index + 1}`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </button>
              </li>
            ))}
          </ul>

          {data.secondaryImage && (
            <div className={styles.secondaryImageWrap}>
              <Image
                src={data.secondaryImage}
                alt={data.title}
                width={1200}
                height={800}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          )}
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
                <dt className={styles.dt}>楽天URL</dt>
                <dd className={styles.dd}>
                  <a
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.url}
                  </a>
                </dd>
              </div>
            )}
            <div className={styles.detailRow}>
              <dt className={styles.dt}>備考</dt>
              <dd className={styles.dd}>{data.remarks}</dd>
            </div>
          </dl>
          {data.relatedDesigns && data.relatedDesigns.length > 0 && (
          <>
          <hr className={styles.divider} />

          <h2 className={styles.relatedTitle}>関連デザイン</h2>
          <ul className={styles.relatedList}>
            {data.relatedDesigns.map((item, index) => (
              <li key={index}>
                <div className={styles.relatedImageWrap}>
                  <a
                    href={item.url}
                    rel="noopener noreferrer"
                    className={styles.relatedLink}
                  >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  </a>
                </div>
              </li>
            ))}
          </ul>
          </>
          )}
        </div>
      </div>

      {/* 拡大モーダル */}
      {isModalOpen && (
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
                src={data.thumbnails[activeIndex]}
                alt="拡大画像"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            <ul className={styles.modalThumbGrid}>
              {data.thumbnails.map((src, index) => (
                <li key={index}>
                  <button
                    type="button"
                    className={`${styles.modalThumbBtn} ${
                      index === activeIndex ? styles.modalThumbActive : ""
                    }`}
                    onClick={() => setActiveIndex(index)}
                  >
                    <Image
                      src={src}
                      alt={`サムネイル${index + 1}`}
                      fill
                      style={{ objectFit: "cover" }}
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