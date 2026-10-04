export type { Empty, Falsy, Nullish } from '@fringeworks/types';

export type MaybeMapOptions = {
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
  exclude?: ExcludeValue;
};

export type ExcludeValue = 'undefined' | 'nullish' | 'empty' | 'falsy';

export type Iteratee<V, R> = (value: V, index: number, data: V[]) => R;
