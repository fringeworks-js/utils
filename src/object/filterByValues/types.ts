export type FilterByValuesOptions = {
  /**
   * 文字列の条件で比較する際に、値と条件を正規化する関数
   * 未指定の場合は正規化せずに比較する
   * @example
   * // 大文字・小文字を区別せずに比較する
   * { normalize: (value) => value.toLowerCase() }
   */
  normalize?: (value: string) => string;
};
