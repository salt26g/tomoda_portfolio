"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FadeIn.module.css";

type FadeInProps = {
  children: React.ReactNode;
  className?: string;
};

export default function FadeIn({ children, className = "" }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsShow(true);
          observer.unobserve(entry.target); // 一度表示されたら監視をやめる
        }
      });
    });

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.fadeIn} ${isShow ? styles.isShow : ""} ${className}`}
    >
      {children}
    </div>
  );
}