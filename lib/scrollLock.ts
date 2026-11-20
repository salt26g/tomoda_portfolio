let isLocked = false;

export function lockScroll(): void {
  if (isLocked) return;
  isLocked = true;

  const root = document.documentElement;
  const body = document.body;

  const scrollbarWidth = window.innerWidth - root.clientWidth;

  if (scrollbarWidth > 0) {
    body.style.paddingRight = `${scrollbarWidth}px`;
    root.style.setProperty("--scrollbar-comp", `${scrollbarWidth}px`);
  }
  body.style.overflow = "hidden";
}

export function unlockScroll(): void {
  isLocked = false;

  const root = document.documentElement;
  const body = document.body;

  body.style.overflow = "";
  body.style.paddingRight = "";
  root.style.removeProperty("--scrollbar-comp");
}
