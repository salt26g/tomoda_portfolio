"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// ページ(URL)が変わるたびに、Lenisへ「0の位置に戻って」と伝える係。
// 画面には何も表示しないので return null。
export default function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    // immediate: true = アニメーションせず、その場で一気に0へ
    // （ここをアニメーションさせると、次のページがヌルっと上から現れる動きになる）
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}
