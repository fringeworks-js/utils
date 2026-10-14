import type { Kind } from '../getKind';

export type GetPriorityOptions = {
  /**
   * 型種別（`getKind` の結果）ごとの優先度。\
   * 既定値の `{ undefined: -2, null: -1 }` とマージする
   */
  priorityMap?: Partial<Record<Kind, number>>;

  /**
   * `priorityMap` に無い型種別の優先度を決める関数
   *
   * @param data 値
   * @returns 優先度
   * @default () => 0
   */
  getFallbackPriority?: (data: unknown) => number;
};
