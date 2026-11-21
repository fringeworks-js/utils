import type { EqualityFunction } from '@fringeworks/types';

// 2つの値が等しいかを判定する関数の型（`updateMutable` の `isEqual`）。
// 利用者が `@fringeworks/types` を入れずに使えるよう、ここから export する
export type { EqualityFunction } from '@fringeworks/types';

/**
 * オプション
 */
export type UpdateMutableOptions = {
  /**
   * 値が変わっていないかを判定する関数\
   * 未指定の場合は `Object.is` で比較する（`NaN` 同士は等しく、`+0` と `-0` は異なる）
   */
  isEqual?: EqualityFunction<unknown>;
};
