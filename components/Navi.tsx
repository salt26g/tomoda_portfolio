"use client";
import { useEffect, useId, useLayoutEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { WORKS_NAV_LINKS } from "@/lib/worksNav";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import styles from "./Navi.module.css";

const INTRO_SEEN_KEY = "tomoda-intro-seen";

export default function Navi({
  intro = false,
  responsive = false,
}: {
  intro?: boolean;
  responsive?: boolean;
}) {
  const [isDocked, setIsDocked] = useState(!intro);

  const hasMenu = responsive;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const lenis = useLenis();
  const pathname = usePathname();

  const handleAnchorClick = (e: ReactMouseEvent<HTMLElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const href = (e.target as Element).closest("a")?.getAttribute("href");
    if (!href?.startsWith("/#") || pathname !== "/") return;
    const target = document.getElementById(href.slice(2));
    if (!target) return;
    e.preventDefault();
    lenis?.scrollTo(target, { offset: -40 });
  };

  const introMode = useRef<"play" | "skip" | null>(null);
  useLayoutEffect(() => {
    if (!intro) return;

    if (introMode.current === null) {
      let seen = false;
      try {
        seen = sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
        if (!seen) sessionStorage.setItem(INTRO_SEEN_KEY, "1");
      } catch {
      }
      introMode.current = seen ? "skip" : "play";
    }

    if (introMode.current === "skip") {
      document.documentElement.setAttribute("data-intro-seen", "");
      setIsDocked(true);
    }
  }, [intro]);

  useEffect(() => {
    if (!isMenuOpen) return;

    lockScroll();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        burgerRef.current?.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 1101px)");
    const onWide = () => {
      if (wide.matches) setIsMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      wide.removeEventListener("change", onWide);
      unlockScroll();
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!intro || introMode.current === "skip") return;

    const startDock = () => {
      const narrow = window.matchMedia("(max-width: 1100px)").matches;
      setTimeout(() => setIsDocked(true), narrow ? 4800 : 4500);
    };

    if (document.readyState === "complete") {
      startDock();
    } else {
      window.addEventListener("load", startDock);
      return () => window.removeEventListener("load", startDock);
    }
  }, [intro]);

  const docked = isDocked ? styles.docked : "";
  const Logo = intro ? "h1" : "div";

  const navi = (
    <>
      <div className={`${styles.loader} ${docked}`}>
        <div className={intro ? styles.loader_txt : `${styles.loader_txt} ${styles.other}`}>
          <p className={styles.tagline}><span>想いに寄り添い、</span><span>伝わるデザインに。</span></p>
        </div>
      </div>
      <Logo className={styles.logo} aria-label="TOMODA'S DESIGN"><svg className={`${styles.svg} ${docked}`} viewBox="0 0 1062.32 412.05" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        {intro ? (
          <>
            <mask id="txt-mask">
              <g transform="translate(0, 38) scale(1.125)">
                <polyline className={styles.st0} points="0 7.05 72.23 7.05 35.12 1.85 35.12 90.11"/>
                <path className={styles.st0} d="M168.75,5.03s-39.83-.03-39.83,41.43,39.83,41.49,39.83,41.49c0,0,41.65-.79,41.65-41.31S168.43,5.03,168.43,5.03"/>
                <polyline className={styles.st0} points="278.47 93.25 287.96 10.17 291.92 10.17 327.4 76.9 329.51 76.77 366.7 10.17 369.86 10.83 380.55 93.25"/>
                <path className={styles.st0} d="M467.68,5.69s-35.8-.86-37.33,40.62,40.02,41.18,40.02,41.18c0,0,40.24,2.61,40.26-42.33.02-39.98-43.36-39.47-43.36-39.47"/>
                <path className={styles.st0} d="M581.55,3.17l-.47,88.95-9.7-84.58,12.97-.7,21.85.58s39.84-.47,39.84,38.32-38.82,41.07-38.82,41.07l-36.88-.42"/>
                <polyline className={styles.st0} points="701.93 90.11 737.61 6.93 740.4 6.93 776.46 92.12"/>
                <line className={styles.st0} x1="829.73" x2="829.01" y2="30.45"/>
                <path className={styles.st0} d="M941.5,11.98s-8.01-6.55-26.63-6.24c-23.19.38-26.12,9.56-26.75,17.33,1.4,15.41,20.26,19.24,24.71,21.4s26.75,4.33,27.26,23.57c-.89,13.89-13.5,20.41-26.06,20.13-16.08-.11-32.93-9.04-32.93-9.04"/>
                <path className={styles.st0} d="M156.92,206.62v93.24l-8.11-85.67,10.13-.54,28.24.81s34.05.14,34.05,37.83-36.21,40.81-36.21,40.81l-38.97-.27"/>
                <line className={styles.st0} x1="280.94" y1="213.57" x2="346.11" y2="213.57"/>
                <line className={styles.st0} x1="286.59" y1="249.71" x2="339.78" y2="249.52"/>
                <line className={styles.st0} x1="280.26" y1="293.14" x2="342.48" y2="293.14"/>
                <path className={styles.st0} d="M454.2,219.48s-10.89-7.83-29.43-7.69c-21.95.14-25.51,12.67-25.65,16.08.89,15.69,20.46,21.22,23.06,21.92s28.86,5.53,28.47,26.76c-.32,12.73-14.5,17.21-25.87,17.65-17.86.7-31.14-8.66-31.14-8.66"/>
                <line className={styles.st0} x1="521.68" y1="207.7" x2="521.68" y2="296.65"/>
                <path className={styles.st0} d="M668.13,219.88s-9.45-8.08-34.6-8.08c-6.34,0-39.29,4.76-39.29,43.06s39.1,39.4,43.42,39.4c20.83,0,32.22-8.16,32.22-8.16"/>
                <line className={styles.st0} x1="628.03" y1="249.76" x2="676.56" y2="249.52"/>
                <polyline className={styles.st0} points="723.52 296.81 723.52 215.16 725.48 215.16 783.05 292.77 785.01 292.38 785.99 202.98"/>
              </g>
            </mask>
            <image href="/img/basic/loading_wh.svg" width="100%" height="100%" mask="url(#txt-mask)" />
          </>
        ) : (
          <Link href="/"><image href="/img/basic/loading_wh.svg" width="100%" height="100%" /></Link>
        )}
      </svg></Logo>

      <nav className={`${styles.nav} ${docked}`} onClickCapture={handleAnchorClick}>
        <ul className={styles.nav_list}>
          <li>
            <Link href="/works" className={styles.nav_main}>WORKS</Link>
            <ul className={styles.nav_sub}>
              {WORKS_NAV_LINKS.map((link) => (
                <li key={link.label}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </li>
          <li>
            <Link href="/#about" className={styles.nav_main}>ABOUT</Link>
            <ul className={styles.nav_sub}>
              <li><Link href="/#profile">PROFILE</Link></li>
              <li><Link href="/#skill">SKILL</Link></li>
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );

  return (
    <div
      data-navi=""
      className={`${styles.wrap} ${intro ? styles.intro : ""} ${intro && isDocked ? styles.introDone : ""} ${hasMenu ? styles.responsive : ""} ${isMenuOpen ? styles.open : ""}`}
    >
      {hasMenu ? (
        <>
          <button
            ref={burgerRef}
            type="button"
            className={styles.burger}
            aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={isMenuOpen}
            aria-controls={menuId}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className={styles.burgerLine} aria-hidden="true" />
            <span className={styles.burgerLine} aria-hidden="true" />
            <span className={styles.burgerLine} aria-hidden="true" />
          </button>
          <div
            id={menuId}
            className={styles.panel}
            data-lenis-prevent
            onClick={(e) => {
              if ((e.target as Element).closest("a")) {
                setIsMenuOpen(false);
                if (!e.defaultPrevented) lenis?.scrollTo(0, { immediate: true });
              }
            }}
          >
            {navi}
          </div>
        </>
      ) : (
        navi
      )}
    </div>
  );
}
