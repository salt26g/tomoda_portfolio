"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { layoutBanners, type BannerSize } from "./bannerLayout";
import styles from "./BannerModal.module.css";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";

// 閉じるアニメーションの長さ(ミリ秒)。CSSの .overlayClosing の時間と合わせる
const MODAL_CLOSE_MS = 350;

// ------ 大きさの設定(ここを変えると、並べ方の余白や基準が変わる) ------
const OVERLAY_PAD = 40; // 画面の端とモーダルの間(CSSの .overlay の padding と同じ値)
const MODAL_PAD = 48; // モーダルの白い枠の内側の余白(CSSの .inner の padding と同じ値)
const MAX_CONTENT_W = 1304; // バナーを並べる部分の最大の幅
const GAP = 56; // バナーどうしの隙間(PC。数字を大きくすると広がる)。上のバナーとサイズ表記の間が、表記とその下のバナーの間(LABEL_GAP)よりはっきり広くなる大きさにしている
const LABEL_GAP = 6; // サイズ表記と、その下のバナーの間(隙間 GAP の中に収まるようにする。GAP を小さくするときは文字の大きさも見直す)
const MIN_SIDE = 64; // これより小さくなるバナーが出るなら、並べるのをやめてスクロール表示にする
const NARROW_MAX = 1024; // この幅以下(タブレット・スマホ)はスクロール表示

// バナー1枚ぶんのデータ。
//   "/img/bn/xxx.webp"                              … 画像だけ(サイズ表記なし)
//   { src: "/img/bn/xxx.webp", size: "600×400" }    … モーダルで、画像の上にサイズ表記を出す(文字は自由)
export type BannerImage = string | { src: string; size?: string };

// 画像のパスを取り出す(文字列でも { src, size } でも使える)
export const bannerImageSrc = (image: BannerImage): string =>
  typeof image === "string" ? image : image.src;

// サイズ表記の文字を取り出す(書いていない画像は undefined)
export const bannerImageSize = (image: BannerImage): string | undefined =>
  typeof image === "string" ? undefined : image.size || undefined;

// 画像の大きさを測れなかったときに使う仮の大きさ
const FALLBACK_SIZE: BannerSize = { w: 600, h: 400 };

// 一度測った画像は覚えておく(同じバナーを開き直したときに、すぐ表示するため)
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
  images: BannerImage[]; // 1〜5枚のバナー(並べる順番もこの順)
  alt: string;
  onClosed: () => void; // 閉じるアニメーションが終わったあとに呼ぶ(親がモーダルを消す)
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

  // アニメーションを見せてから、モーダルを本当に閉じる
  const close = useCallback(() => {
    if (closingRef.current) return; // 連打しても二重に動かさない
    closingRef.current = true;

    // OSで「視差効果を減らす」設定の人は、アニメーションなしで即閉じる
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

  // 画像のパスと、サイズ表記の文字(どちらも images と同じ順)
  const srcs = useMemo(() => images.map(bannerImageSrc), [images]);
  const labels = useMemo(() => images.map(bannerImageSize), [images]);

  // ① 開いたときに、全部のバナーの元の大きさを測る
  useEffect(() => {
    let cancelled = false;
    Promise.all(srcs.map(measure)).then((result) => {
      if (!cancelled) setSizes(result);
    });
    return () => {
      cancelled = true;
    };
  }, [srcs]);

  // ② ウィンドウの大きさが変わったら、並べ直す
  useEffect(() => {
    const onResize = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ③ Escキーで閉じる
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  // ④ モーダルが開いている間は、後ろの画面をスクロールさせない
  useEffect(() => {
    lenis?.stop();
    lockScroll();
    return () => {
      lenis?.start();
      unlockScroll();
    };
  }, [lenis]);

  // ⑤ ページ移動などで消えるとき、残っているタイマーを止める
  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  // 並べ方を決める。
  //   fit   … 全部を、スクロールなしで枠に収める(PC)
  //   stack … 縦に並べて、モーダルの中でスクロールする(スマホ・小さい画面)
  const view = useMemo(() => {
    if (!sizes) return null;

    if (viewport.w > NARROW_MAX) {
      const maxW = Math.min(
        viewport.w - (OVERLAY_PAD + MODAL_PAD) * 2,
        MAX_CONTENT_W
      );
      const maxH = viewport.h - (OVERLAY_PAD + MODAL_PAD) * 2;
      const layout = layoutBanners(sizes, maxW, maxH, GAP);
      // 小さくなりすぎるときは、並べるのをやめてスクロール表示に切り替える
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
      {/* 大きさを測っている間は、少し待ってから小さなくるくるを出す */}
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
            // 計算した位置と大きさのとおりに、バナーを置く
            <div
              className={styles.fitArea}
              style={{ width: view.layout.width, height: view.layout.height }}
            >
              {srcs.map((src, i) => {
                const p = view.layout.items[i];
                return (
                  <Fragment key={`${src}-${i}`}>
                    {/* 元の画像の大きさを測るために読み込んだ画像と同じものを使うので、next/image ではなく img にしている */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`${alt} ${labels[i] ?? `${sizes[i].w}×${sizes[i].h}`}`}
                      className={styles.banner}
                      style={{ left: p.x, top: p.y, width: p.w, height: p.h }}
                      decoding="async"
                    />
                    {/* バナーの上のサイズ表記(書いたバナーだけ)。バナーどうしの隙間(GAP)の中に置くので、並べ方の計算には影響しない */}
                    {labels[i] && (
                      <span
                        className={styles.sizeLabel}
                        style={{
                          left: p.x,
                          top: p.y - LABEL_GAP,
                          maxWidth: p.w + GAP - 8, // となりのバナーの表記とぶつからないように
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
            // data-lenis-prevent: モーダルの中だけは、普通にスクロールできるようにする
            <div className={styles.stackScroll} data-lenis-prevent>
              {srcs.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className={styles.stackItem}
                  style={{ maxWidth: sizes[i].w }} // 元の大きさより大きくしない
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
