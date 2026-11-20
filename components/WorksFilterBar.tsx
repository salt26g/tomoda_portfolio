"use client";

import styles from "./WorksFilterBar.module.css";
import { FilterGroupKey, WorkTag } from "@/types/works";

type SortOrder = "recommend" | "new" | "old";

type Props = {
  groups: { key: FilterGroupKey; label: string; options: readonly string[] }[];
  selectedTags: WorkTag[];
  onToggleTag: (tag: WorkTag) => void;
  onClear: () => void;
  sortOrder: SortOrder;
  onChangeSort: (order: SortOrder) => void;
  resultCount: number;
};

export default function WorksFilterBar({
  groups,
  selectedTags,
  onToggleTag,
  onClear,
  sortOrder,
  onChangeSort,
  resultCount,
}: Props) {
  return (
    <div className={styles.bar}>
      <div className={styles.modeRow}>
        <span className={styles.label}>絞り込む</span>
        <label className={styles.modeOption}>
          <input
            type="radio"
            name="work-clear"
            className={styles.modeInput}
            checked={selectedTags.length === 0}
            onChange={onClear}
          />
          <span className={styles.modeBox} aria-hidden="true" />
          全ての条件を外す（全表示）
        </label>
      </div>

      {groups.map((group) => (
        <div key={group.key} className={styles.groupRow}>
          <span className={styles.label}>{group.label}</span>
          <div className={styles.pills}>
            {group.options.map((option) => {
              const active = selectedTags.includes(option as WorkTag);
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  className={`${styles.pill} ${active ? styles.pillActive : ""}`}
                  onClick={() => onToggleTag(option as WorkTag)}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className={styles.sortRow}>
        <p className={styles.count} aria-live="polite">
          <span className={styles.countNumber}>{resultCount}</span>件
        </p>
        <select
          className={styles.sortSelect}
          value={sortOrder}
          onChange={(e) => onChangeSort(e.target.value as SortOrder)}
        >
          <option value="recommend">並べ替え：おすすめ順</option>
          <option value="new">並べ替え：新しい順</option>
          <option value="old">並べ替え：古い順</option>
        </select>
      </div>
    </div>
  );
}
