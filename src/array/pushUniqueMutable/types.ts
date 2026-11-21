import type { EqualityFunction } from '@fringeworks/types';

// 2つの値が等しいかを判定する関数の型（`pushUniqueMutable` の `isEqual`）。
// 利用者が `@fringeworks/types` を入れずに使えるよう、ここから export する
export type { EqualityFunction } from '@fringeworks/types';

export type PushUniqueMutableOptions<T> = {
  /**
   * SetによるO(1)チェックに切り替える要素数の閾値。
   * デフォルト: 100
   */
  threshold?: number;

  /**
   * 2つの要素が等しいかを判定する関数。指定した場合はthresholdに関わらず線形探索になる。
   * デフォルト: `===`
   */
  isEqual?: EqualityFunction<T>;
};
