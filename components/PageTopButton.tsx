"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import styles from "./PageTopButton.module.css";

// ファーストビュー(画面1枚分)をスクロールするとフェードインし、
// クリックするとなめらかにページの先頭へ戻るボタン。
// ※ ReactLenis の内側に置くこと(useLenis を使うため)
export default function PageTopButton() {
  const lenis = useLenis();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 画面1枚分(ウィンドウの高さ)より下にスクロールしたら表示
    const update = () => setIsVisible(window.scrollY > window.innerHeight);

    update(); // リロード時にページの途中から始まる場合に備えて、最初に1回判定
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const handleClick = () => {
    // OSで「視差効果を減らす」設定の人には、アニメーションなしで戻す
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (lenis) {
      // duration(秒)が長いほどゆっくり戻る
      lenis.scrollTo(0, { duration: 1.6, immediate: reduceMotion });
    } else {
      // Lenisが使えない場合の保険
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  return (
    <button
      type="button"
      className={`${styles.button} ${isVisible ? styles.visible : ""}`}
      onClick={handleClick}
      aria-label="ページの先頭へ戻る"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
    >
      <img src="/img/basic/top_btn.webp" alt="" />
    </button>
  );
}
