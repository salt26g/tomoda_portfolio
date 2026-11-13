"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./LogoSlider.module.css";

// スライダーに並べる画像1枚ぶん。
//   "/img/logo/xxx.webp"                           … 画像だけ(バッジなし)
//   { src: "/img/logo/xxx.webp", badge: "採用案" }  … 画像の左上にバッジを出す(文字は自由。badge を書かなければ出ない)
export type LogoSliderImage = string | { src: string; badge?: string };

// 画像のパスを取り出す(文字列でも { src, badge } でも使える)
export const logoImageSrc = (image: LogoSliderImage): string =>
  typeof image === "string" ? image : image.src;

// バッジの文字を取り出す(バッジなしの画像は undefined)
export const logoImageBadge = (image: LogoSliderImage): string | undefined =>
  typeof image === "string" ? undefined : image.badge;

type LogoSliderProps = {
  images: LogoSliderImage[];
  alt: string; // 画像の説明(例:「第一案」)
  onSelect: (index: number) => void; // 画像をクリックしたとき(拡大表示に使う)
};

// 矢印ボタンを1回押したときに進むカードの枚数
const STEP_CARDS = 2;

export default function LogoSlider({ images, alt, onSelect }: LogoSliderProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef(0); // つまみをつかんだ位置(つまみの左端からの距離)
  const [isDragging, setIsDragging] = useState(false); // インジケーターをドラッグ中
  const [isGrabbing, setIsGrabbing] = useState(false); // 画像の並びをドラッグ中
  const suppressClick = useRef(false); // ドラッグした直後のクリックを無視するための目印
  const rafRef = useRef<number | null>(null); // 滑らせている最中のアニメーション
  const [isGliding, setIsGliding] = useState(false); // 指を離したあと、滑って止まるまでの間
  const [scrollable, setScrollable] = useState(false); // 画像がはみ出して、スクロールできるか
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  // インジケーターのつまみ。スクロールと同時に動かしたいので、Reactの状態ではなく
  // 直接スタイルを書き換えて、遅れなく追従させる
  const thumbRef = useRef<HTMLSpanElement>(null);

  // スクロール位置や画面サイズが変わるたびに、矢印とインジケーターの状態を更新する
  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;

    setScrollable(scrollWidth - clientWidth > 1);
    setCanPrev(scrollLeft > 1);
    setCanNext(scrollLeft < scrollWidth - clientWidth - 1);

    // つまみの幅と位置(どちらも全体に対する%)
    const thumbEl = thumbRef.current;
    if (thumbEl) {
      thumbEl.style.width = `${(clientWidth / scrollWidth) * 100}%`;
      thumbEl.style.left = `${(scrollLeft / scrollWidth) * 100}%`;
    }
  }, []);

  // インジケーターが表示された直後にも、つまみの位置を合わせる
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

  // 矢印ボタン:カード STEP_CARDS 枚ぶん、横にスクロールする
  const scrollByCards = (direction: 1 | -1) => {
    const el = trackRef.current;
    const first = el?.firstElementChild as HTMLElement | null;
    if (!el || !first) return;

    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = (first.offsetWidth + gap) * STEP_CARDS;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  // インジケーターの触れる操作:つまみをドラッグ、または線をクリック/タップで移動
  const moveTo = (clientX: number) => {
    const el = trackRef.current;
    const bar = indicatorRef.current;
    if (!el || !bar) return;

    const rect = bar.getBoundingClientRect();
    // つまみの左端が来る位置(0〜1)を、スクロール位置に直す
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

    // つまみの上を押したときは、押した位置のまま動かす。
    // 線のほかの場所を押したときは、つまみの真ん中がそこに来るように移動する
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

  // 現在の位置から target まで、なめらかに減速しながらスクロールする
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
      const eased = 1 - Math.pow(1 - t, 4); // 最初は速く、だんだんゆっくり止まる
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

  // 画像の並びを、マウスでつかんで横にスライドさせる(スマホなどのタッチ操作は、もともと指で動かせる)
  const handleTrackPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    const el = trackRef.current;
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;
    if (el.scrollWidth - el.clientWidth <= 1) return; // 動かす必要がないときは何もしない

    // 滑っている最中につかんだら、そこで止める(このときのクリックは拡大に使わない)
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
    // 指を離す直前の速さを測るため、動きを少し記録しておく
    let samples: { t: number; x: number }[] = [{ t: performance.now(), x: startX }];

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      // 数pxのブレはクリックとして扱い、それ以上動いたらドラッグとみなす
      if (!dragging && Math.abs(dx) > 5) {
        dragging = true;
        moved = true;
        setIsGrabbing(true);
      }
      if (dragging) {
        el.scrollLeft = startScroll - dx;
        const now = performance.now();
        samples.push({ t: now, x: ev.clientX });
        samples = samples.filter((s) => now - s.t < 100); // 直近0.1秒だけ残す
      }
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      setIsGrabbing(false);

      if (moved) {
        // ドラッグして指を離したときに、画像のクリック(拡大)が動かないようにする
        suppressClick.current = true;
        setTimeout(() => {
          suppressClick.current = false;
        }, 0);
      }
      if (!dragging) return;

      // 離したときの勢い(px/ms)。勢いがあるほど、少し先まで滑ってから止まる
      const first = samples[0];
      const last = samples[samples.length - 1];
      const dt = last.t - first.t;
      const velocity = dt > 0 ? -(last.x - first.x) / dt : 0;

      const max = el.scrollWidth - el.clientWidth;
      const cardW = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 200;
      const reach = Math.max(Math.min(velocity * 250, cardW * 3), -cardW * 3);
      const projected = Math.min(Math.max(el.scrollLeft + reach, 0), max);

      // 滑った先に一番近いカードの位置(か、右端)でぴったり止める
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
            // ドラッグの直後は、クリック扱いにしない
            if (suppressClick.current) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onDragStart={(e) => e.preventDefault()} // 画像そのものが引っぱられないようにする
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
                {/* 左上のバッジ(書いた画像だけ)。画像の上に重ねるだけで、クリックは下の画像に通す */}
                {badge && (
                  <span className={styles.badge} aria-hidden="true">
                    {badge}
                  </span>
                )}
              </li>
            );
          })}
        </ul>

        {/* 画像が全部おさまっているときは、矢印もインジケーターも出さない */}
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
              {/* 画像は左向きなので、右向きのボタンは左右反転して使う */}
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

      {/* インジケーター:灰色の線のうち、濃い部分が「いま見えている範囲」。
          濃い部分をドラッグ、または線をクリック/タップすると、その位置まで移動する */}
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
