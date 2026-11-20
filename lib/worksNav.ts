import { worksFilterHref } from "@/types/works";

export const WORKS_NAV_LINKS = [
  { label: "WEB", href: worksFilterHref(["WEBサイト"]) },
  { label: "ECsite-LP", href: worksFilterHref(["EC商品コンテンツ"]) },
  { label: "LOGO", href: worksFilterHref(["ロゴ"]) },
  { label: "OTHER", href: worksFilterHref(["その他"]) },
] as const;
