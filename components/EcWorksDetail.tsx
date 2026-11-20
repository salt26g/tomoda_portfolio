"use client";

import Image from "@/components/SkeletonImage";
import SwipeSlider from "@/components/SwipeSlider";
import Breadcrumb from "@/components/Breadcrumb";
import WorkBadge from "@/components/WorkBadge";
import styles from "./EcWorksDetail.module.css";
import { useState, useEffect, useRef } from "react";

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
  thumbnails: string[];
  secondaryImage?: string;
  relatedDesigns?: {
    image: string;
    title: string;
    url?: string;
  }[];
};

type WorksDetailProps = {
  data: EcWorksData;
  genre?: string;
};

export default function WorksDetail({ data, genre }: WorksDetailProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lenis = useLenis();

  const closeModal = () => {
    if (isClosing) return;

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
    <div>
      <Breadcrumb
        items={[
          { label: "WORKS", href: "/works" },
          { label: data.title },
        ]}
      />

      <div className={styles.contentWrap}>
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

          <SwipeSlider
            images={data.thumbnails}
            alt={data.title}
            activeIndex={activeIndex}
            onChange={setActiveIndex}
          />

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
            <div className={styles.modalScroll} data-lenis-prevent>
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
            </div>

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