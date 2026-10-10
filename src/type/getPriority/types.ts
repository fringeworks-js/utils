import type { TypeOfResult } from '@fringeworks/constants';
import type { Kind } from '../getKind';

export type GetPriorityOptions = {
  /**
   * objectの詳細な型を取得するか
   *
   * @default false
   */
  useKind?: boolean;

  /**
   * 優先度のマップ
   *
   * @default { undefined: -2, null: -1 }
   */
  priorityMap?: Partial<Record<Kind | TypeOfResult, number>>;

  /**
   * 優先順位を解決する関数\
   * priorityMapに存在しない型の優先順位を決定するための関数
   *
   * @param data
   * @returns
   */
  getFallbackPriority?: (data: unknown) => number;
};
