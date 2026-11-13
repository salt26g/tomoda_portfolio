"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  FILTER_GROUPS,
  GENRE_PARAM,
  PRODUCTION_PARAM,
  WorkItem,
  WorkTag,
  buildTagsQuery,
  getWorkTags,
  parseTagsFromParams,
} from "@/types/works";
import WorksFilterBar from "./WorksFilterBar";
import WorksGrid from "./WorksGrid";

type SortOrder = "recommend" | "new" | "old";
const STORAGE_KEY = "worksFilter";

// 同時に1つしか選べないタグ(制作の種類)
const EXCLUSIVE_TAGS: string[] = ["実務制作", "フリーランス制作"];

// いまのURLから、選択中のタグを読み取る(クリックした瞬間の最新の状態を知りたいときに使う)
function readTagsFromLocation(): WorkTag[] {
  const params = new URLSearchParams(window.location.search);
  return parseTagsFromParams((name) => params.get(name));
}

// 選択中のタグを、URLに書き込む。
// ページを読み込み直さずに、URLだけ書き換える(useSearchParamsにもすぐ反映される)。
// genre / production 以外のパラメータ(あれば)はそのまま残す
function writeTagsToLocation(tags: WorkTag[]) {
  const params = new URLSearchParams(window.location.search);
  params.delete(GENRE_PARAM);
  params.delete(PRODUCTION_PARAM);
  const query = [params.toString(), buildTagsQuery(tags)].filter(Boolean).join("&");
  window.history.replaceState(
    null,
    "",
    query ? `?${query}` : window.location.pathname
  );
}

export default function WorksBrowser({ works }: { works: WorkItem[] }) {
  // 選択中のタグは、URL(?genre=...&production=...)をそのまま使う。
  // → 左ナビの「WEB」などから「その条件が選ばれた状態」で開ける。
  //   戻るボタンやURLの共有でも状態が保たれる
  const searchParams = useSearchParams();
  const genreParam = searchParams.get(GENRE_PARAM) ?? "";
  const productionParam = searchParams.get(PRODUCTION_PARAM) ?? "";
  const selectedTags = useMemo(
    () =>
      parseTagsFromParams((name) =>
        name === GENRE_PARAM ? genreParam : productionParam
      ),
    [genreParam, productionParam]
  );

  const [sortOrder, setSortOrder] = useState<SortOrder>("recommend");
  const [isRestored, setIsRestored] = useState(false);

  // 初回表示時に、前回の状態を復元する
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sortOrder) setSortOrder(parsed.sortOrder);

        // 前回の絞り込みを戻すのは、URLに絞り込みの指定がないときだけ。
        // 左ナビなどから指定つきで来たときは、そちらを優先する
        const params = new URLSearchParams(window.location.search);
        const hasTagsInUrl = params.has(GENRE_PARAM) || params.has(PRODUCTION_PARAM);
        if (
          !hasTagsInUrl &&
          Array.isArray(parsed.selectedTags) &&
          parsed.selectedTags.length > 0
        ) {
          writeTagsToLocation(parsed.selectedTags);
        }
      }
    } catch {}
    setIsRestored(true);
  }, []);

  // 絞り込みが変わるたびに保存する
  useEffect(() => {
    if (!isRestored) return; // 復元前の初期値で上書きしないため
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ selectedTags, sortOrder })
      );
    } catch {}
  }, [selectedTags, sortOrder, isRestored]);

  const toggleTag = (tag: WorkTag) => {
    // すぐ連続でクリックされても取りこぼさないよう、画面の状態ではなく、いまのURLを元にする
    const prev = readTagsFromLocation();

    // すでに選択中なら、外す
    if (prev.includes(tag)) {
      writeTagsToLocation(prev.filter((t) => t !== tag));
      return;
    }

    // 「制作」のグループは、どちらか1つだけ選べる(ラジオボタン的な動き)。
    // もう片方が選ばれていたら外してから、新しい方を追加する
    if (EXCLUSIVE_TAGS.includes(tag)) {
      writeTagsToLocation([...prev.filter((t) => !EXCLUSIVE_TAGS.includes(t)), tag]);
      return;
    }

    writeTagsToLocation([...prev, tag]);
  };

  // 選択中のタグをすべて外す
  const clearTags = () => writeTagsToLocation([]);

  const filteredWorks = useMemo(() => {
    let result = works;

    // 「制作」のタグ(実務制作 / フリーランス制作)と、それ以外のタグ(ジャンルなど)に分ける
    const productionTags = selectedTags.filter((t) => EXCLUSIVE_TAGS.includes(t));
    const otherTags = selectedTags.filter((t) => !EXCLUSIVE_TAGS.includes(t));

    if (productionTags.length > 0) {
      // 制作タグが選ばれているとき:
      //   制作タグに一致していて、かつ、他のタグは「どれか1つでも」一致していればOK
      //   例)WEBサイト + その他 + 実務制作 → 実務制作の「WEBサイト」と「その他(バナー・手書き看板・名刺など)」の両方が出る
      result = works.filter((work) => {
        const tags = getWorkTags(work);
        return (
          productionTags.every((t) => tags.includes(t)) &&
          (otherTags.length === 0 || otherTags.some((t) => tags.includes(t)))
        );
      });
    } else if (selectedTags.length > 0) {
      // 制作タグがないとき:選んだタグの「どれか1つでも」一致していればOK
      result = works.filter((work) => {
        const tags = getWorkTags(work);
        return selectedTags.some((t) => tags.includes(t));
      });
    }

    return [...result].sort((a, b) => {
      if (sortOrder === "recommend") return a.order - b.order;
      return sortOrder === "new"
        ? b.publishedAt.localeCompare(a.publishedAt)
        : a.publishedAt.localeCompare(b.publishedAt);
    });
  }, [works, selectedTags, sortOrder]);

  return (
    <div>
      <WorksFilterBar
        groups={FILTER_GROUPS}
        selectedTags={selectedTags}
        onToggleTag={toggleTag}
        onClear={clearTags}
        sortOrder={sortOrder}
        onChangeSort={setSortOrder}
        resultCount={filteredWorks.length}
      />
      {/* key を絞り込み条件ごとに変えると、条件が変わるたびに一覧が作り直され、
          全カードがもう一度ふわっと表示される */}
      <WorksGrid
        key={`${selectedTags.join(",")}|${sortOrder}`}
        works={filteredWorks}
      />
    </div>
  );
}
