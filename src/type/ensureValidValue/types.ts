import type { Kind } from '../getKind';

export type EnsureValidValueOptions<V = unknown> = {
  /**
   * 値として想定している型
   */
  validType?: Kind;

  /**
   * 値がundefinedだった場合に返す値
   */
  undefinedValue?: V;

  /**
   * 値がnullだった場合に返す値
   */
  nullValue?: V;

  /**
   * 型が不正な値や想定外の値だった場合に返す値
   */
  invalidValue?: V;
};
