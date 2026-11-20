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

export const FILTER_GENRE_OPTIONS = [
  "WEBサイト",
  "EC商品コンテンツ",
  "ロゴ",
  "その他",
] as const;

export type FilterGenre = (typeof FILTER_GENRE_OPTIONS)[number];

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

export type WorkTag = FilterGenre | Production;

export interface WorkItem {
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  genres: Genre[];
  production: Production;
  publishedAt: string;
  order: number;
  url: string;
}

export type FilterGroupKey = "genres" | "production";

export const FILTER_GROUPS: {
  key: FilterGroupKey;
  label: string;
  options: readonly string[];
}[] = [
  { key: "genres", label: "ジャンル", options: FILTER_GENRE_OPTIONS },
  { key: "production", label: "制作", options: PRODUCTION_OPTIONS },
];

export function getWorkTags(work: WorkItem): WorkTag[] {
  const genreTags = work.genres.map((genre) => GENRE_TO_FILTER[genre]);
  const uniqueGenreTags = genreTags.filter((tag, i) => genreTags.indexOf(tag) === i);
  return [...uniqueGenreTags, work.production];
}

export const GENRE_PARAM = "genre";
export const PRODUCTION_PARAM = "production";

export function parseTagsFromParams(get: (name: string) => string | null): WorkTag[] {
  const pick = <T extends string>(name: string, options: readonly T[]): T[] => {
    const parts = (get(name) ?? "").split(",");
    return options.filter((option) => parts.includes(option));
  };
  return [
    ...pick(GENRE_PARAM, FILTER_GENRE_OPTIONS),
    ...pick(PRODUCTION_PARAM, PRODUCTION_OPTIONS).slice(0, 1),
  ];
}

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

export function worksFilterHref(genres: readonly FilterGenre[]): string {
  return `/works?${buildTagsQuery(genres)}`;
}
