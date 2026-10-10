/**
 * 静的パターン
 */
export type MaybeReplaceStaticPattern = string | RegExp;

/**
 * 動的パターン
 */
export type MaybeReplaceDynamicPattern = (
  options?: MaybeReplaceOptions,
) => MaybeReplaceStaticPattern;

/**
 * 静的・動的パターン
 */
export type MaybeReplacePattern =
  | MaybeReplaceStaticPattern
  | MaybeReplaceDynamicPattern;

/**
 * パターンを動的に作成する関数の引数に渡すオプション
 */
export type MaybeReplaceOptions = { [key: string]: unknown };
