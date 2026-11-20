"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import styles from "./PageTopButton.module.css";

export default function PageTopButton() {
  const lenis = useLenis();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const update = () => setIsVisible(window.scrollY > window.innerHeight);

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const handleClick = () => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (lenis) {
      lenis.scrollTo(0, { duration: 1.6, immediate: reduceMotion });
    } else {
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
      <img src="/img/basic/top_btn1.webp" alt="" />
    </button>
  );
}
