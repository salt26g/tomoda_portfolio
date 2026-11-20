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

const EXCLUSIVE_TAGS: string[] = ["実務制作", "フリーランス制作"];

function readTagsFromLocation(): WorkTag[] {
  const params = new URLSearchParams(window.location.search);
  return parseTagsFromParams((name) => params.get(name));
}

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

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sortOrder) setSortOrder(parsed.sortOrder);

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

  useEffect(() => {
    if (!isRestored) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ selectedTags, sortOrder })
      );
    } catch {}
  }, [selectedTags, sortOrder, isRestored]);

  const toggleTag = (tag: WorkTag) => {
    const prev = readTagsFromLocation();

    if (prev.includes(tag)) {
      writeTagsToLocation(prev.filter((t) => t !== tag));
      return;
    }

    if (EXCLUSIVE_TAGS.includes(tag)) {
      writeTagsToLocation([...prev.filter((t) => !EXCLUSIVE_TAGS.includes(t)), tag]);
      return;
    }

    writeTagsToLocation([...prev, tag]);
  };

  const clearTags = () => writeTagsToLocation([]);

  const filteredWorks = useMemo(() => {
    let result = works;

    const productionTags = selectedTags.filter((t) => EXCLUSIVE_TAGS.includes(t));
    const otherTags = selectedTags.filter((t) => !EXCLUSIVE_TAGS.includes(t));

    if (productionTags.length > 0) {
      result = works.filter((work) => {
        const tags = getWorkTags(work);
        return (
          productionTags.every((t) => tags.includes(t)) &&
          (otherTags.length === 0 || otherTags.some((t) => tags.includes(t)))
        );
      });
    } else if (selectedTags.length > 0) {
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
      <WorksGrid
        key={`${selectedTags.join(",")}|${sortOrder}`}
        works={filteredWorks}
      />
    </div>
  );
}
