export type CreateRangeOptions = {
  /**
   * 最初の値
   * @default 0
   */
  start?: number;

  /**
   * 隣り合う値の差。負の数にすると値が減っていく
   * @default 1
   */
  step?: number;
};
