/**
 * 文字列が条件に合うかを判定する関数
 */
export type StringPredicate = (value: string) => boolean;

/**
 * 文字列の比べ方\
 * 複数の比べ方を書いた場合は、すべてに合うときに一致する（AND）。
 * 比べ方を1つも書いていない場合は、何にも一致しない
 */
export type StringComparison = {
  /**
   * 指定の文字列を含む（部分一致）
   */
  includes?: string;

  /**
   * 指定の文字列で始まる（前方一致）
   */
  startsWith?: string;

  /**
   * 指定の文字列で終わる（後方一致）
   */
  endsWith?: string;

  /**
   * 正規表現に一致する。文字列は正規表現にして比べる（正規表現として不正な場合は一致しない）
   */
  matches?: string | RegExp;
};

/**
 * 文字列の条件の1つ
 *
 * - string: 完全一致
 * - RegExp: 正規表現に一致する
 * - StringComparison: 部分一致・前方一致・後方一致・正規表現（文字列で書ける）
 * - 関数: 真を返したときに一致する
 */
export type StringConditionItem =
  string | RegExp | StringComparison | StringPredicate;

/**
 * 文字列の条件\
 * 配列は、どれかに合うときに一致する（OR）。空の配列は何にも一致しない
 */
export type StringCondition =
  StringConditionItem | readonly StringConditionItem[];

export type CreateStringMatcherOptions = {
  /**
   * 大文字・小文字を区別しない\
   * 正規表現は `i` フラグを付けて比べる
   * @default false
   */
  ignoreCase?: boolean;

  /**
   * 比べる前に文字列を正規化する関数\
   * 文字列で比べる形（完全一致・includes・startsWith・endsWith）は、判定する値と条件の文字列の両方に、
   * 正規表現は判定する値にだけ使う。関数の条件には正規化する前の値を渡す
   * @example
   * // 全角・半角を区別しない
   * { normalize: (value) => value.normalize('NFKC') }
   */
  normalize?: (value: string) => string;
};
