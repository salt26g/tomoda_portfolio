"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "@/components/SkeletonImage";
import styles from "./LogoSlider.module.css";

export type LogoSliderImage = string | { src: string; badge?: string };

export const logoImageSrc = (image: LogoSliderImage): string =>
  typeof image === "string" ? image : image.src;

export const logoImageBadge = (image: LogoSliderImage): string | undefined =>
  typeof image === "string" ? undefined : image.badge;

type LogoSliderProps = {
  images: LogoSliderImage[];
  alt: string;
  onSelect: (index: number) => void;
};

const STEP_CARDS = 2;

export default function LogoSlider({ images, alt, onSelect }: LogoSliderProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const suppressClick = useRef(false);
  const rafRef = useRef<number | null>(null);
  const [isGliding, setIsGliding] = useState(false);
  const [scrollable, setScrollable] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const thumbRef = useRef<HTMLSpanElement>(null);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;

    setScrollable(scrollWidth - clientWidth > 1);
    setCanPrev(scrollLeft > 1);
    setCanNext(scrollLeft < scrollWidth - clientWidth - 1);

    const thumbEl = thumbRef.current;
    if (thumbEl) {
      thumbEl.style.width = `${(clientWidth / scrollWidth) * 100}%`;
      thumbEl.style.left = `${(scrollLeft / scrollWidth) * 100}%`;
    }
  }, []);

  useLayoutEffect(() => {
    update();
  }, [scrollable, update]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [update, images.length]);

  const scrollByCards = (direction: 1 | -1) => {
    const el = trackRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;

    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = (first.offsetWidth + gap) * STEP_CARDS;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  const moveTo = (clientX: number) => {
    const el = trackRef.current;
    const bar = indicatorRef.current;
    if (!el || !bar) return;

    const rect = bar.getBoundingClientRect();
    const ratio = (clientX - dragOffset.current - rect.left) / rect.width;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollLeft = Math.min(Math.max(ratio * el.scrollWidth, 0), max);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const bar = indicatorRef.current;
    const el = trackRef.current;
    if (!bar || !el) return;

    const barRect = bar.getBoundingClientRect();
    const thumbLeft = barRect.left + (el.scrollLeft / el.scrollWidth) * barRect.width;
    const thumbWidth = (el.clientWidth / el.scrollWidth) * barRect.width;
    const onThumb = e.clientX >= thumbLeft && e.clientX <= thumbLeft + thumbWidth;

    dragOffset.current = onThumb ? e.clientX - thumbLeft : thumbWidth / 2;

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    moveTo(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) moveTo(e.clientX);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);
  };

  const glideTo = (target: number, duration: number) => {
    const el = trackRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const from = el.scrollLeft;
    const distance = target - from;
    if (Math.abs(distance) < 1) {
      setIsGliding(false);
      return;
    }

    const start = performance.now();
    setIsGliding(true);

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.scrollLeft = from + distance * eased;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
        setIsGliding(false);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const handleTrackPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    const el = trackRef.current;
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;
    if (el.scrollWidth - el.clientWidth <= 1) return;

    let moved = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      setIsGliding(false);
      moved = true;
    }

    const startX = e.clientX;
    const startScroll = el.scrollLeft;
    let dragging = false;
    let samples: { t: number; x: number }[] = [{ t: performance.now(), x: startX }];

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      if (!dragging && Math.abs(dx) > 5) {
        dragging = true;
        moved = true;
        setIsGrabbing(true);
      }
      if (dragging) {
        el.scrollLeft = startScroll - dx;
        const now = performance.now();
        samples.push({ t: now, x: ev.clientX });
        samples = samples.filter((s) => now - s.t < 100);
      }
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      setIsGrabbing(false);

      if (moved) {
        suppressClick.current = true;
        setTimeout(() => {
          suppressClick.current = false;
        }, 0);
      }
      if (!dragging) return;

      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = last.t - first.t;
      const velocity = dt > 0 ? -(last.x - first.x) / dt : 0;

      const max = el.scrollWidth - el.clientWidth;
      const cardW = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 200;
      const reach = Math.max(Math.min(velocity * 250, cardW * 3), -cardW * 3);
      const projected = Math.min(Math.max(el.scrollLeft + reach, 0), max);

      const positions = Array.from(el.children).map((c) =>
        Math.min((c as HTMLElement).offsetLeft, max)
      );
      positions.push(max);
      const target = positions.reduce((best, pos) =>
        Math.abs(pos - projected) < Math.abs(best - projected) ? pos : best
      );

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduceMotion) {
        el.scrollLeft = target;
        return;
      }
      const duration = Math.min(Math.max(450 + Math.abs(target - el.scrollLeft) * 0.6, 500), 1000);
      glideTo(target, duration);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  return (
    <div className={styles.slider}>
      <div className={styles.viewport}>
        <ul
          ref={trackRef}
          className={`${styles.track} ${
            isDragging || isGrabbing || isGliding ? styles.trackDragging : ""
          } ${isGrabbing ? styles.trackGrabbing : ""}`}
          onPointerDown={handleTrackPointerDown}
          onClickCapture={(e) => {
            if (suppressClick.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onDragStart={(e) => e.preventDefault()}
        >
          {images.map((image, index) => {
            const src = logoImageSrc(image);
            const badge = logoImageBadge(image);
            return (
              <li key={`${src}-${index}`} className={styles.item}>
                <button
                  type="button"
                  className={styles.card}
                  onClick={() => onSelect(index)}
                  aria-label={`${alt} ${index + 1}枚目${badge ? `(${badge})` : ""}を拡大する`}
                >
                  <Image
                    src={src}
                    alt={`${alt} ${index + 1}`}
                    fill
                    sizes="(max-width: 600px) 60vw, 260px"
                    draggable={false}
                    style={{ objectFit: "contain" }}
                  />
                </button>
                {badge && (
                  <span className={styles.badge} aria-hidden="true">
                    {badge}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {scrollable && (
          <>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowPrev}`}
              onClick={() => scrollByCards(-1)}
              disabled={!canPrev}
              aria-label="前の画像へ"
            >
              <Image
                src="/img/basic/nav_btn.webp"
                alt=""
                width={71}
                height={71}
                className={styles.arrowImage}
              />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowNext}`}
              onClick={() => scrollByCards(1)}
              disabled={!canNext}
              aria-label="次の画像へ"
            >
              <Image
                src="/img/basic/nav_btn.webp"
                alt=""
                width={71}
                height={71}
                className={`${styles.arrowImage} ${styles.arrowImageFlip}`}
              />
            </button>
          </>
        )}
      </div>

      {scrollable && (
        <div
          ref={indicatorRef}
          className={`${styles.indicator} ${
            isDragging ? styles.indicatorDragging : ""
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          aria-hidden="true"
        >
          <span className={styles.indicatorBar}>
            <span ref={thumbRef} className={styles.indicatorThumb} />
          </span>
        </div>
      )}
    </div>
  );
}
