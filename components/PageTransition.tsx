"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const LEAVE_MS = 300;
const ENTER_MS = 800;
const GIVE_UP_MS = 5000;

export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const prevPath = useRef(pathname);
  const pushTimer = useRef<number | undefined>(undefined);
  const giveUpTimer = useRef<number | undefined>(undefined);
  const enterTimer = useRef<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;

    const root = document.documentElement;
    window.clearTimeout(giveUpTimer.current);
    root.classList.remove("pt-leave");
    root.classList.add("pt-enter");
    window.clearTimeout(enterTimer.current);
    enterTimer.current = window.setTimeout(() => root.classList.remove("pt-enter"), ENTER_MS);
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (reduced.matches) return;

      const anchor = (e.target as Element | null)?.closest?.("a[href]");
      if (!anchor) return;
      const target = anchor.getAttribute("target");
      if ((target && target !== "_self") || anchor.hasAttribute("download")) return;
      if (anchor.hasAttribute("data-no-page-transition")) return;

      let url: URL;
      try {
        url = new URL(anchor.getAttribute("href") ?? "", window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      e.preventDefault();
      e.stopPropagation();

      root.classList.remove("pt-enter");
      root.classList.add("pt-leave");

      window.clearTimeout(pushTimer.current);
      window.clearTimeout(giveUpTimer.current);
      const to = url.pathname + url.search + url.hash;
      pushTimer.current = window.setTimeout(() => router.push(to), LEAVE_MS);
      giveUpTimer.current = window.setTimeout(() => root.classList.remove("pt-leave"), GIVE_UP_MS);
    };

    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("click", onClick, true);
      window.clearTimeout(pushTimer.current);
      window.clearTimeout(giveUpTimer.current);
      window.clearTimeout(enterTimer.current);
    };
  }, [router]);

  return null;
}
