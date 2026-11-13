import type { BannerItem, BannerListData } from "@/components/BannerWorksList";

// ------ ページ上部の詳細情報 ------
export const bannerListData: BannerListData = {
  tag: "実務制作",
  title: "Softime バナーデザイン一覧",
  clientLabel: "自社案件", // 実務制作は「自社案件」。フリーランス制作なら省略(「クライアント」と表示される)
  client: "ULIFE株式会社",
  role: "デザイン",
  tools: "Photoshop / illustrator",
  duration: "1枚あたり約1〜3時間",
};

// ------ バナーの一覧 ------
// 1つのバナーに、サイズ違いを1〜5枚まで書けます。
//   id       … 重複しない文字列
//   category … "coupon"(クーポン) / "feature"(特集) / "sale"(セール)
//   date     … "2026.10.01" の形。一覧の新しい順・古い順に使う
//   ※ 一覧の「おすすめ順」(最初に表示される並び)は、下に書いた順番のままになります
//   images   … 画像のパス。最初の1枚が一覧のサムネイルになり、
//              モーダルには書いた順で全部が並ぶ(縦横の大きさは自動で測るので書かなくていい)
//              モーダルで、画像の上にサイズ表記を出したい画像だけ、{ src: "...", size: "600×400" } の形で書く
//              (文字は自由。size を書かない画像には、何も出ない)
//              例) images: [{ src: "/img/bn/1-xxx-1.webp", size: "600×400" }, "/img/bn/1-xxx-2.webp"],
export const bannerItems: BannerItem[] = [
  {
    id: "1-986770_986766",
    category: "coupon",
    date: "2026.09.15",
    images: [{ src: "/img/bn/1-986770_986766-1.webp", size: "480×360px" },{ src: "/img/bn/1-986770_986766-4.webp", size: "880×320px" },{ src: "/img/bn/1-986770_986766-3.webp", size: "400×800px" },{ src: "/img/bn/1-986770_986766-2.webp", size: "1280×200px" }],
  },
  {
    id: "2-987901_980801",
    category: "coupon",
    date: "2026.09.15",
        images: [{ src: "/img/bn/2-987901_980801-1.webp", size: "480×360px" },{ src: "/img/bn/2-987901_980801-4.webp", size: "880×320px" },{ src: "/img/bn/2-987901_980801-3.webp", size: "400×800px" },{ src: "/img/bn/2-987901_980801-2.webp", size: "1280×200px" }],
  },
  {
    id: "3-986743",
    category: "coupon",
    date: "2026.07.15",
    images: [{ src: "/img/bn/3-986743-1.webp", size: "720×480px" },{ src: "/img/bn/3-986743-2.webp", size: "1440×280px" }],
  },
  {
    id: "4-986724",
    category: "coupon",
    date: "2026.07.15",
    images: [{ src: "/img/bn/4-986724-1.webp", size: "720×480px" },{ src: "/img/bn/4-986724-2.webp", size: "1440×280px" }],
  },
  {
    id: "5-986721",
    category: "coupon",
    date: "2026.07.15",
    images: [{ src: "/img/bn/5-986721-1.webp", size: "720×480px" },{ src: "/img/bn/5-986721-2.webp", size: "1440×280px" }],
  },
  {
    id: "6-rug",
    category: "feature",
    date: "2025.10.20",
    images: [{ src: "/img/bn/6-rug-1.webp", size: "971×466px" },{ src: "/img/bn/6-rug-2.webp", size: "1440×280px" }],
  },
  {
    id: "7-blanket",
    category: "feature",
    date: "2025.10.20",
    images: [{ src: "/img/bn/7-blanket-1.webp", size: "971×466px" },{ src: "/img/bn/7-blanket-2.webp", size: "1440×280px" }],
  },
  {
    id: "8-sumcpn",
    category: "coupon",
    date: "2026.07.14",
    images: [{ src: "/img/bn/8-sumcpn-1.webp", size: "720×480px" },{ src: "/img/bn/8-sumcpn-2.webp", size: "1440×280px" }],
  },
  {
    id: "9-newyear",
    category: "sale",
    date: "2025.12.16",
    images: [{ src: "/img/bn/9-newyear-1.webp", size: "1232×600px" },{ src: "/img/bn/9-newyear-2.webp", size: "1080×210px" },{ src: "/img/bn/9-newyear-3.webp", size: "1080×210px" },{ src: "/img/bn/9-newyear-4.webp", size: "480×480px" },{ src: "/img/bn/9-newyear-5.webp", size: "1300×506px" }],
  },
  {
    id: "10-980801",
    category: "coupon",
    date: "2026.09.11",
    images: [{ src: "/img/bn/10-980801-1.webp", size: "720×480px" },{ src: "/img/bn/10-980801-2.webp", size: "1440×280px" },{ src: "/img/bn/10-980801-3.webp", size: "880×320px" }],
  },
  {
    id: "11-987901",
    category: "coupon",
    date: "2026.09.11",
    images: [{ src: "/img/bn/11-987901-1.webp", size: "720×480px" },{ src: "/img/bn/11-987901-2.webp", size: "1440×280px" },{ src: "/img/bn/11-987901-3.webp", size: "880×320px" }],
  },
  {
    id: "12-bf",
    category: "sale",
    date: "2025.11.17",
    images: [{ src: "/img/bn/12-bf-1.webp", size: "1300×510px" },{ src: "/img/bn/12-bf-2.webp", size: "1080×210px" }],
  },
  {
    id: "13-986343",
    category: "coupon",
    date: "2026.07.17",
    images: [{ src: "/img/bn/13-986343-1.webp", size: "720×480px" },{ src: "/img/bn/13-986343-2.webp", size: "1440×280px" }],
  },
  {
    id: "14-986770",
    category: "coupon",
    date: "2026.10.15",
    images: [{ src: "/img/bn/14-986770-1.webp", size: "720×480px" },{ src: "/img/bn/14-986770-2.webp", size: "1440×280px" }],
  },
  {
    id: "15-986766_grn",
    category: "coupon",
    date: "2026.09.03",
    images: [{ src: "/img/bn/15-986766_grn-1.webp", size: "720×480px" },{ src: "/img/bn/15-986766_grn-2.webp", size: "1440×280px" }],
  },
  {
    id: "16-986766_be",
    category: "coupon",
    date: "2026.09.03",
    images: [{ src: "/img/bn/16-986766_be-1.webp", size: "720×480px" },{ src: "/img/bn/16-986766_be-2.webp", size: "1440×280px" },{ src: "/img/bn/16-986766_be-3.webp", size: "880×320px" }],
  },
  {
    id: "17-986500",
    category: "coupon",
    date: "2026.03.13",
    images: [{ src: "/img/bn/17-986500-1.webp", size: "1200×500px" },{ src: "/img/bn/17-986500-2.webp", size: "1440×280px" }],
  },
  {
    id: "18-986505",
    category: "coupon",
    date: "2026.03.13",
    images: [{ src: "/img/bn/18-986505-1.webp", size: "1200×500px" },{ src: "/img/bn/18-986505-2.webp", size: "1440×280px" }],
  },
  {
    id: "19-986502",
    category: "coupon",
    date: "2026.03.13",
    images: [{ src: "/img/bn/19-986502-1.webp", size: "1440×280px" }],
  },
  {
    id: "20-mattress",
    category: "feature",
    date: "2025.10.20",
    images: [{ src: "/img/bn/20-mattress-1.webp", size: "971×466px" },{ src: "/img/bn/20-mattress-2.webp", size: "1440×280px" },{ src: "/img/bn/20-mattress-3.webp", size: "720×480px" },{ src: "/img/bn/20-mattress-4.webp", size: "1440×280px" }],
  },
  {
    id: "21-rugsum",
    category: "feature",
    date: "2026.04.24",
    images: [{ src: "/img/bn/21-rugsum-1.webp", size: "720×480px" },{ src: "/img/bn/21-rugsum-2.webp", size: "1440×280px" }],
  },
  {
    id: "22-bedpad",
    category: "feature",
    date: "2026.04.24",
    images: [{ src: "/img/bn/22-bedpad-1.webp", size: "720×480px" },{ src: "/img/bn/22-bedpad-2.webp", size: "1440×280px" }],
  },
  {
    id: "23-sprsale",
    category: "sale",
    date: "2025.04.10",
    images: [{ src: "/img/bn/23-sprsale-1.webp", size: "1232×480px" },{ src: "/img/bn/23-sprsale-2.webp", size: "1232×240px" },{ src: "/img/bn/23-sprsale-3.webp", size: "1300×506px" }],
  },
  {
    id: "24-sumsale",
    category: "sale",
    date: "2026.07.09",
    images: [{ src: "/img/bn/24-sumsale-1.webp", size: "720×480px" },{ src: "/img/bn/24-sumsale-2.webp", size: "1440×280px" }],
  },
  {
    id: "25-sum",
    category: "feature",
    date: "2026.07.14",
    images: [{ src: "/img/bn/25-sum-1.webp", size: "720×480px" },{ src: "/img/bn/25-sum-2.webp", size: "1440×280px" }],
  },
  {
    id: "26-sumclr",
    category: "sale",
    date: "2025.10.20",
    images: [{ src: "/img/bn/26-sumclr-1.webp", size: "971×466px" },{ src: "/img/bn/26-sumclr-2.webp", size: "1440×280px" }],
  },
  {
    id: "27-hot",
    category: "feature",
    date: "2025.10.20",
    images: [{ src: "/img/bn/27-hot-1.webp", size: "971×466px" },{ src: "/img/bn/27-hot-2.webp", size: "1440×280px" }],
  },
  {
    id: "28-aut",
    category: "feature",
    date: "2026.11.03",
    images: [{ src: "/img/bn/28-aut-1.webp", size: "1600×900px" },{ src: "/img/bn/28-aut-2.webp", size: "1440×280px" },{ src: "/img/bn/28-aut-3.webp", size: "1440×280px" },{ src: "/img/bn/28-aut-4.webp", size: "1440×280px" }],
  },
  {
    id: "29-sheets",
    category: "sale",
    date: "2025.08.24",
    images: [{ src: "/img/bn/29-sheets-1.webp", size: "971×272px" }],
  },
  {
    id: "30-ket",
    category: "sale",
    date: "2025.08.24",
    images: [{ src: "/img/bn/30-ket-1.webp", size: "971×272px" }],
  },
  {
    id: "31-mattress",
    category: "coupon",
    date: "2025.08.24",
    images: [{ src: "/img/bn/31-mattress-1.webp", size: "971×272px" }],
  },
  {
    id: "32-rug",
    category: "coupon",
    date: "2025.08.24",
    images: [{ src: "/img/bn/32-rug-1.webp", size: "971×272px" }],
  },
  {
    id: "33-sumfair",
    category: "coupon",
    date: "2026.07.29",
    images: [{ src: "/img/bn/33-sumfair-1.webp", size: "1440×280px" },{ src: "/img/bn/33-sumfair-2.webp", size: "1440×280px" }],
  },
  {
    id: "34-986113",
    category: "coupon",
    date: "2026.07.14",
    images: [{ src: "/img/bn/34-986113-1.webp", size: "720×480px" },{ src: "/img/bn/34-986113-2.webp", size: "1440×280px" }],
  },
  {
    id: "35-986477",
    category: "coupon",
    date: "2026.07.29",
    images: [{ src: "/img/bn/35-986477-1.webp", size: "1440×280px" }],
  },
  {
    id: "36-986859",
    category: "coupon",
    date: "2026.07.29",
    images: [{ src: "/img/bn/36-986859-1.webp", size: "1440×280px" }],
  },
];
