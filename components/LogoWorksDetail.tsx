"use client";

import Link from "next/link";
import Image from "@/components/SkeletonImage";
import Breadcrumb from "@/components/Breadcrumb";
import LogoSlider, { logoImageSrc, logoImageBadge, type LogoSliderImage } from "@/components/LogoSlider";
import SwipeSlider from "@/components/SwipeSlider";
import WorkBadge from "@/components/WorkBadge";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import styles from "./LogoWorksDetail.module.css";
import { useState, useEffect, useRef } from "react";
import { useLenis } from "lenis/react";

const MODAL_CLOSE_MS = 350;

export type LogoWorksSection = {
  label: string;
  description: string;
  notes?: string[];
  images: LogoSliderImage[];
};

export type LogoWorksData = {
  title: string;
  tag: string;
  date: string;
  clientLabel?: string;
  client: string;
  role: string;
  tools: string;
  duration: string;
  request: string;
  url?: string;
  urlLabel?: string;
  model?: string;
  remarks?: string;
  thumbnails: string[];
  sections: LogoWorksSection[];
  relatedDesigns?: {
    image: string;
    title: string;
    url?: string;
  }[];
};

type ModalState = {
  images: string[];
  badges?: (string | undefined)[];
  index: number;
  alt: string;
  syncGallery: boolean;
};

export default function LogoWorksDetail({
  data,
  genre,
}: {
  data: LogoWorksData;
  genre?: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lenis = useLenis();
  const isModalOpen = modal !== null;

  const closeModal = () => {
    if (isClosing) return;

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

  const selectInModal = (index: number) => {
    setModal((prev) => (prev ? { ...prev, index } : prev));
    if (modal?.syncGallery) setActiveIndex(index);
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
              sizes="(max-width: 1100px) 100vw, 420px"
              priority
              style={{ objectFit: "contain" }}
            />
          </button>

          <SwipeSlider
            images={data.thumbnails}
            alt={data.title}
            activeIndex={activeIndex}
            onChange={setActiveIndex}
            fit="contain"
            background="#fff"
          />

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
            <div className={styles.modalScroll} data-lenis-prevent>
              <div className={styles.modalMain}>
                <Image
                  src={modal.images[modal.index]}
                  alt={`${modal.alt} 拡大画像${
                    modal.badges?.[modal.index] ? `(${modal.badges[modal.index]})` : ""
                  }`}
                  fill
                  sizes="(max-width: 1100px) 90vw, 800px"
                  style={{ objectFit: "contain" }}
                />
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
