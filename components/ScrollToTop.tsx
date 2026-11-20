"use client";

import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    let target: HTMLElement | null = null;
    try {
      const id = decodeURIComponent(window.location.hash.slice(1));
      target = id ? document.getElementById(id) : null;
    } catch {
    }

    if (target) {
      lenis.scrollTo(target, { immediate: true, offset: -40 });
    } else {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}
