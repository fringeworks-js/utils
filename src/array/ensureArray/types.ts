export type EnsureArrayOptions = {
  /**
   * valueが配列の時、そのまま返却するか。
   * デフォルトはfalseで、配列のコピーを返却する。
   * trueの場合、戻り値は`readonly`の配列になる。
   * @default false
   */
  raw?: boolean;
};
