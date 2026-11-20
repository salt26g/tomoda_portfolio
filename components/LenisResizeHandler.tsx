"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

export default function LenisResizeHandler() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const resizeObserver = new ResizeObserver(() => {
      lenis.resize();
    });

    resizeObserver.observe(document.body);

    return () => resizeObserver.disconnect();
  }, [lenis]);

  return null;
}