export type CompactMapOptions = {
  /**
   * 戻り値から除外するcallbackの値
   *
   * - 'undefined': undefinedは除外
   * - 'nullish': undefined、nullは除外
   * - 'empty': undefined、null、空文字は除外
   * - 'falsy': undefined、null、空文字、false、0、-0、0n、NaNは除外
   *
   * @default 'undefined'
   */
  exclude?: CompactMapExclude;
};

export type CompactMapExclude = 'undefined' | 'nullish' | 'empty' | 'falsy';

// 要素と添字を受け取る関数の型（`compactMap` の `callback`）。
// 利用者が `@fringeworks/types` を入れずに使えるよう、ここから export する
export type { IndexedIteratee } from '@fringeworks/types';
