// ------ 作品データに書くジャンル（カードのバッジにも、この名前のまま表示される） ------
export const GENRE_OPTIONS = [
  "WEBサイト",
  "EC商品コンテンツ",
  "ロゴ",
  "バナー",
  "手書き看板",
  "リーフレット",
  "ファブリック",
  "名刺",
] as const;

export const PRODUCTION_OPTIONS = [
  "実務制作",
  "フリーランス制作",
] as const;

export type Genre = (typeof GENRE_OPTIONS)[number];
export type Production = (typeof PRODUCTION_OPTIONS)[number];

// ------ 絞り込みのボタンに出すジャンル（画面のラベルと完全に一致させる） ------
export const FILTER_GENRE_OPTIONS = [
  "WEBサイト",
  "EC商品コンテンツ",
  "ロゴ",
  "その他",
] as const;

export type FilterGenre = (typeof FILTER_GENRE_OPTIONS)[number];

// 作品データのジャンルが、どの絞り込みボタンに入るか。
// 新しいジャンルを足したら、ここにも書く（書き忘れると型エラーで教えてくれる）
export const GENRE_TO_FILTER: Record<Genre, FilterGenre> = {
  "WEBサイト": "WEBサイト",
  "EC商品コンテンツ": "EC商品コンテンツ",
  "ロゴ": "ロゴ",
  "バナー": "その他",
  "手書き看板": "その他",
  "リーフレット": "その他",
  "ファブリック": "その他",
  "名刺": "その他",
};

// 1つの絞り込みタグ。どのグループの値でも同じ形(文字列)で扱う
export type WorkTag = FilterGenre | Production;

// 「いずれかに一致 / すべてに一致 / 全表示」の3モード
export type MatchMode = "or" | "and" | "all";

export interface WorkItem {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  genres: Genre[];
  production: Production;
  publishedAt: string; // "2026-01-20" のような日付文字列（新着順・古い順の並べ替え用）
  order: number; // 手動で決めるおすすめ順位。小さいほど先に表示される（1, 2, 3...）
  url: string; // カードのリンク先。サイト内は "/works/xxx"、外部サイトは "https://..." で指定
}

export type FilterGroupKey = "genres" | "production";

// 絞り込みUIに表示するグループの並び（ジャンルと制作のみ）
export const FILTER_GROUPS: {
  key: FilterGroupKey;
  label: string;
  options: readonly string[];
}[] = [
  { key: "genres", label: "ジャンル", options: FILTER_GENRE_OPTIONS },
  { key: "production", label: "制作", options: PRODUCTION_OPTIONS },
];

// 1つの作品から、絞り込みの照合に使う全タグをフラットな配列にする。
// ジャンルは、絞り込みボタンの名前に置き換える（バナー・手書き看板・名刺など → その他）
export function getWorkTags(work: WorkItem): WorkTag[] {
  const genreTags = work.genres.map((genre) => GENRE_TO_FILTER[genre]);
  const uniqueGenreTags = genreTags.filter((tag, i) => genreTags.indexOf(tag) === i);
  return [...uniqueGenreTags, work.production];
}

// ------ URLでの絞り込みの指定 ------
// 例) /works?genre=WEBサイト,その他&production=実務制作
export const GENRE_PARAM = "genre";
export const PRODUCTION_PARAM = "production";

// URLのパラメータから、選択中のタグの配列を作る。選択肢にない文字は無視する
export function parseTagsFromParams(get: (name: string) => string | null): WorkTag[] {
  const pick = <T extends string>(name: string, options: readonly T[]): T[] => {
    const parts = (get(name) ?? "").split(",");
    return options.filter((option) => parts.includes(option));
  };
  return [
    ...pick(GENRE_PARAM, FILTER_GENRE_OPTIONS),
    ...pick(PRODUCTION_PARAM, PRODUCTION_OPTIONS).slice(0, 1), // 制作はどちらか1つだけ
  ];
}

// 選択中のタグを、URLの「genre=...&production=...」の形にする。
// カンマが「%2C」に変わって見づらくならないよう、自分で組み立てている
export function buildTagsQuery(tags: readonly string[]): string {
  const join = (options: readonly string[]) =>
    options
      .filter((option) => tags.includes(option))
      .map(encodeURIComponent)
      .join(",");
  const genre = join(FILTER_GENRE_OPTIONS);
  const production = join(PRODUCTION_OPTIONS);
  return [
    genre && `${GENRE_PARAM}=${genre}`,
    production && `${PRODUCTION_PARAM}=${production}`,
  ]
    .filter(Boolean)
    .join("&");
}

// 左ナビなどから、ジャンルが選ばれた状態のWORKSへ飛ぶためのリンク
export function worksFilterHref(genres: readonly FilterGenre[]): string {
  return `/works?${buildTagsQuery(genres)}`;
}
