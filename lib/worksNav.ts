import { worksFilterHref } from "@/types/works";

// 左ナビの「WORKS」の下に並ぶ4つのリンク。
// それぞれ、WORKSページの絞り込み(ジャンル)が選ばれた状態で開く。
// このリストは、全ページ共通のナビ(components/Navi.tsx)が使う。
//   label … ナビに表示する文字
//   href  … worksFilterHref([...]) の中に、選んでおきたいジャンルを書く
//           (WORKSの絞り込みボタンの文字と同じもの。書き間違えると型エラーで教えてくれる)
export const WORKS_NAV_LINKS = [
  { label: "WEB", href: worksFilterHref(["WEBサイト"]) },
  { label: "ECsite-LP", href: worksFilterHref(["EC商品コンテンツ"]) },
  { label: "LOGO", href: worksFilterHref(["ロゴ"]) },
  { label: "OTHER", href: worksFilterHref(["その他"]) }, // その他 = バナー・手書き看板・名刺など
] as const;
