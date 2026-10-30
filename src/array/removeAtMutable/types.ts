export type RemoveAtMutableOptions = {
  /**
   * 削除する要素の数。小数は切り捨て、0以下・NaNの場合は何も削除しない。
   * 配列の末尾を超える分は無視する
   * @default 1
   */
  count?: number;
};
