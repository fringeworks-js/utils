/**
 * オプション
 */
export type UpdateMutableOptions = {
  /**
   * 値が変わっていないかを判定する関数\
   * 未指定の場合は `Object.is` で比較する（`NaN` 同士は等しく、`+0` と `-0` は異なる）
   */
  isEqual?: (value1: unknown, value2: unknown) => boolean;
};
