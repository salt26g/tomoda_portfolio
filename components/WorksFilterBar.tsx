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
  resultCount: number; // いま表示している作品の件数
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
      {/* ------ 全ての条件を外す ------ */}
      <div className={styles.modeRow}>
        <span className={styles.label}>絞り込む</span>
        <label className={styles.modeOption}>
          {/* タグが1つも選ばれていない間はON。押すと、選択中のタグをすべて外す */}
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

      {/* ------ ジャンル / イメージ / ターゲット / 制作 ------ */}
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

      {/* ------ 並べ替え ------ */}
      <div className={styles.sortRow}>
        {/* 件数。絞り込みを変えるたびに数字が変わる(aria-live で読み上げ機器にも伝える) */}
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
