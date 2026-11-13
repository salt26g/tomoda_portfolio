import type { SignboardItem, SignboardListData } from "@/components/SignboardWorksList";

export const signboardListData: SignboardListData = {
  tag: "フリーランス制作", // 実務制作 / フリーランス制作(WORKS一覧のカードと同じにする)
  title: "吉祥寺 御菓子処 俵屋　手書き看板",
  // clientLabel: "自社案件", // 実務制作のときだけ書く(省略すると「クライアント」と表示される)
  client: "吉祥寺 御菓子処 俵屋様（和菓子屋）",
  role: "デザイン",
  tools: "Photoshop（カンプ作成時）/ ポスカ / 黒板",
  duration: "1枚あたり約15～24時間",
};

export const signboardItems: SignboardItem[] = [
  {
    id: "1-ichigo2",
    title: "いちご大福",
    date: "2026.02.23",
    images: ["/img/gd/gd-ichigo2-1.webp", "/img/gd/gd-ichigo2-2.webp"],
  },
  {
    id: "2-cookie1",
    title: "井の頭の森クッキー",
    date: "2022.04.30",
    images: ["/img/gd/gd-cookie1-1.webp", "/img/gd/gd-cookie1-2.webp"],
  },
  {
    id: "3-wagashi",
    title: "俵最中・甘納豆",
    date: "2026.08.16",
    images: ["/img/gd/gd-wagashi-1.webp", "/img/gd/gd-wagashi-2.webp"],
  },
  {
    id: "4-warabi",
    title: "本わらび餅",
    date: "2016.05.01",
    images: ["/img/gd/gd-warabi-1.webp", "/img/gd/gd-warabi-2.webp"],
  },
  {
    id: "5-ichigo1",
    title: "いちご大福",
    date: "2022.04.30",
    images: ["/img/gd/gd-ichigo1-1.webp", "/img/gd/gd-ichigo1-2.webp"],
  },
  {
    id: "6-kuri",
    title: "秋の栗祭り",
    date: "2016.09.01",
    images: ["/img/gd/gd-kuri-1.webp", "/img/gd/gd-kuri-2.webp"],
  },
  {
    id: "7-cookie2",
    title: "クッキー缶",
    date: "2026.02.23",
    images: ["/img/gd/gd-cookie2-1.webp", "/img/gd/gd-cookie2-2.webp"],
  },
];
