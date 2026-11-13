import { Worksdata } from "@/data/works_data";

// 詳細ページのURL(例: "/works/ec/1-986518")から、WORKS一覧のカードに出ているジャンル名
// (例: "EC商品コンテンツ")を調べる。
// → ジャンルは data/works_data.ts に書いたものがそのまま使われるので、詳細ページ側に書き足す必要はない。
//   見つからないときは undefined(その場合、詳細ページには制作の種類だけが出る)
export function findWorkGenre(url: string): string | undefined {
  return Worksdata.find((work) => work.url === url)?.genres[0];
}
