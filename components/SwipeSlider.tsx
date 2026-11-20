"use client";

import { useEffect, useRef } from "react";
import Image from "@/components/SkeletonImage";
import styles from "./SwipeSlider.module.css";

const SLIDE_SETTLE_MS = 900;

type SwipeSliderProps = {
  images: string[];
  alt: string;
  activeIndex: number;
  onChange: (index: number) => void;
  fit?: "cover" | "contain";
  background?: string;
};

export default function SwipeSlider({
  images,
  alt,
  activeIndex,
  onChange,
  fit = "cover",
  background = "#eee",
}: SwipeSliderProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const slideTarget = useRef<number | null>(null);
  const slideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const syncFromSlider = () => {
    const el = sliderRef.current;
    if (!el || el.clientWidth === 0) return;
    const last = images.length - 1;
    const index = Math.min(last, Math.max(0, Math.round(el.scrollLeft / el.clientWidth)));
    onChange(index);
  };

  const handleScroll = () => {
    const el = sliderRef.current;
    if (!el || el.clientWidth === 0) return;
    if (slideTarget.current !== null) {
      const index = Math.round(el.scrollLeft / el.clientWidth);
      if (index !== slideTarget.current) return;
      slideTarget.current = null;
      if (slideTimer.current) clearTimeout(slideTimer.current);
    }
    syncFromSlider();
  };

  const handleTouchStart = () => {
    slideTarget.current = null;
    if (slideTimer.current) clearTimeout(slideTimer.current);
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el || el.clientWidth === 0) return;
    const current = Math.round(el.scrollLeft / el.clientWidth);
    if (current === activeIndex) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    slideTarget.current = activeIndex;
    el.scrollTo({
      left: activeIndex * el.clientWidth,
      behavior: reduceMotion ? "auto" : "smooth",
    });

    if (slideTimer.current) clearTimeout(slideTimer.current);
    slideTimer.current = setTimeout(() => {
      slideTarget.current = null;
      syncFromSlider();
    }, SLIDE_SETTLE_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === 0) return;
      slideTarget.current = null;
      el.scrollLeft = activeIndexRef.current * el.clientWidth;
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (slideTimer.current) clearTimeout(slideTimer.current);
    };
  }, []);

  return (
    <div
      ref={sliderRef}
      className={styles.slider}
      style={{ backgroundColor: background }}
      onScroll={handleScroll}
      onTouchStart={handleTouchStart}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${alt}の画像(左右にスワイプで切り替え)`}
    >
      {images.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className={styles.slide}
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} / ${images.length}`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            draggable={false}
            style={{ objectFit: fit }}
          />
        </div>
      ))}
    </div>
  );
}
