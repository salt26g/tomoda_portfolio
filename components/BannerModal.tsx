"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { layoutBanners, type BannerSize } from "./bannerLayout";
import styles from "./BannerModal.module.css";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

const MODAL_CLOSE_MS = 350;

const OVERLAY_PAD = 40;
const MODAL_PAD = 48;
const MAX_CONTENT_W = 1304;
const GAP = 56;
const LABEL_GAP = 6;
const MIN_SIDE = 64;
const NARROW_MAX = 1100;

export type BannerImage = string | { src: string; size?: string };

export const bannerImageSrc = (image: BannerImage): string =>
  typeof image === "string" ? image : image.src;

export const bannerImageSize = (image: BannerImage): string | undefined =>
  typeof image === "string" ? undefined : image.size || undefined;

const FALLBACK_SIZE: BannerSize = { w: 600, h: 400 };

const sizeCache = new Map<string, BannerSize>();

function measure(src: string): Promise<BannerSize> {
  const cached = sizeCache.get(src);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const size =
        img.naturalWidth > 0 && img.naturalHeight > 0
          ? { w: img.naturalWidth, h: img.naturalHeight }
          : FALLBACK_SIZE;
      sizeCache.set(src, size);
      resolve(size);
    };
    img.onerror = () => resolve(FALLBACK_SIZE);
    img.src = src;
  });
}

type Props = {
  images: BannerImage[];
  alt: string;
  onClosed: () => void;
};

export default function BannerModal({ images, alt, onClosed }: Props) {
  const [sizes, setSizes] = useState<BannerSize[] | null>(null);
  const [viewport, setViewport] = useState(() =>
    typeof window === "undefined"
      ? { w: 1280, h: 800 }
      : { w: window.innerWidth, h: window.innerHeight }
  );
  const [isClosing, setIsClosing] = useState(false);
  const closingRef = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lenis = useLenis();

  const close = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      onClosed();
      return;
    }

    setIsClosing(true);
    closeTimer.current = setTimeout(onClosed, MODAL_CLOSE_MS);
  }, [onClosed]);

  const srcs = useMemo(() => images.map(bannerImageSrc), [images]);
  const labels = useMemo(() => images.map(bannerImageSize), [images]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(srcs.map(measure)).then((result) => {
      if (!cancelled) setSizes(result);
    });
    return () => {
      cancelled = true;
    };
  }, [srcs]);

  useEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  useEffect(() => {
    lenis?.stop();
    lockScroll();
    return () => {
      lenis?.start();
      unlockScroll();
    };
  }, [lenis]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const view = useMemo(() => {
    if (!sizes) return null;

    if (viewport.w > NARROW_MAX) {
      const maxW = Math.min(
        viewport.w - (OVERLAY_PAD + MODAL_PAD) * 2,
        MAX_CONTENT_W
      );
      const maxH = viewport.h - (OVERLAY_PAD + MODAL_PAD) * 2;
      const layout = layoutBanners(sizes, maxW, maxH, GAP);
      if (layout && layout.minSide >= MIN_SIDE) {
        return { mode: "fit" as const, layout };
      }
    }
    return { mode: "stack" as const };
  }, [sizes, viewport]);

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`}
      onClick={close}
    >
      {!view && <span className={styles.loading} aria-hidden="true" />}

      {view && sizes && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} 全サイズ`}
          className={`${styles.inner} ${
            view.mode === "stack" ? styles.innerStack : ""
          } ${isClosing ? styles.innerClosing : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {view.mode === "fit" ? (
            <div
              className={styles.fitArea}
              style={{ width: view.layout.width, height: view.layout.height }}
            >
              {srcs.map((src, i) => {
                const p = view.layout.items[i];
                return (
                  <Fragment key={`${src}-${i}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${alt} ${labels[i] ?? `${sizes[i].w}×${sizes[i].h}`}`}
                      className={styles.banner}
                      style={{ left: p.x, top: p.y, width: p.w, height: p.h }}
                      decoding="async"
                    />
                    {labels[i] && (
                      <span
                        className={styles.sizeLabel}
                        style={{
                          left: p.x,
                          top: p.y - LABEL_GAP,
                          maxWidth: p.w + GAP - 8,
                        }}
                      >
                        {labels[i]}
                      </span>
                    )}
                  </Fragment>
                );
              })}
            </div>
          ) : (
            <div className={styles.stackScroll} data-lenis-prevent>
              {srcs.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className={styles.stackItem}
                  style={{ maxWidth: sizes[i].w }}
                >
                  {labels[i] && (
                    <span className={styles.stackLabel}>{labels[i]}</span>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${alt} ${labels[i] ?? `${sizes[i].w}×${sizes[i].h}`}`}
                    className={styles.stackImage}
                    style={{ aspectRatio: `${sizes[i].w} / ${sizes[i].h}` }}
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className={styles.closeBtn}
            onClick={close}
            aria-label="閉じる"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
